import { Pool, QueryResult } from 'pg';
import { catchLogger } from '../utils/common';
import fs from 'fs'

export interface Invoice {
    id?: number;
    date: Date; // Assuming dates are represented as strings in the format "YYYY-MM-DD"
    customer_name: string;
    salesperson_name: string;
    notes: string | null; // Notes can be nullable
    products: string | null; // Assuming products is an array of Product objects
}

interface InvoiceProduct {
    invoice_id: number;
    date: Date;
    customer_name: string;
    salesperson_name: string;
    notes: string | null;
    products: string;
    product_names: string;
    total_price: number;
    total_count: number;
}

interface InvoicesSummary {
    day?: string;
    week_start?: string;
    month_start?: string;
    revenue: number;
}


export class InvoiceRepository {
    private db: Pool;

    constructor(db: Pool) {
        if (!db) {
            console.log("DB IN INVOICE REPOSITORY IS INVALID, PROCESS EXIT...")
            process.exit(1)
        }
        this.db = db;
    }

    async InsertInvoice(newInvoiceData: Invoice): Promise<Invoice[]> {
        try {
            let insertInvoiceSql = `
            INSERT INTO invoices (date, customer_name, salesperson_name`;
            const values: any[] = [
                newInvoiceData.date,
                newInvoiceData.customer_name,
                newInvoiceData.salesperson_name
            ];

            // Conditionally add notes to the SQL query
            if (newInvoiceData.notes) {
                insertInvoiceSql += ', notes';
                values.push(newInvoiceData.notes);
            }

            // Conditionally add products to the SQL query
            if (newInvoiceData.products) {
                insertInvoiceSql += ', products';
                values.push(newInvoiceData.products);
            }

            insertInvoiceSql += `)
            VALUES ($1, $2, $3`;

            // Add placeholders for notes and products if they exist
            if (newInvoiceData.notes) {
                insertInvoiceSql += ', $4';
            }
            if (newInvoiceData.products) {
                insertInvoiceSql += `, ${newInvoiceData.notes !== null ? '$5' : '$4'}`;
            }

            insertInvoiceSql += ');';

            const result: QueryResult = await this.db.query(insertInvoiceSql, values);
            return result.rows as Invoice[];
        } catch (error) {
            catchLogger(this.InsertInvoice, error);
            throw error;
        }
    }

    async SelectAllInvoices(limit:number,page:number): Promise<InvoiceProduct[]>  {
        try {
            const offset = (page - 1) * limit
            const selectAllInvoiceSql = fs.readFileSync('./src/domain/select_all_invoice.sql', 'utf8');
            const result: QueryResult = await this.db.query(selectAllInvoiceSql,[limit,offset]);
            return result.rows as InvoiceProduct[];
        } catch (error) {
            catchLogger(this.InsertInvoice, error);
            throw error;
        }
    }

    private generateSummarySql(interval: string): string {
        let sqlQuery: string;

        switch (interval) {
            case 'daily':
                sqlQuery = `
                    SELECT DATE(date) AS day, SUM(p.price) AS revenue
                    FROM invoices i
                    JOIN products p ON p.id = ANY(string_to_array(replace(replace(i.products, '[',''), ']',''), ',', '')::int[])
                    GROUP BY DATE(date)
                    ORDER BY DATE(date);
                `;
                break;
            case 'weekly':
                sqlQuery = `
                    SELECT DATE_TRUNC('week', date) AS week_start, SUM(p.price) AS revenue
                    FROM invoices i
                    JOIN products p ON p.id = ANY(string_to_array(replace(replace(i.products, '[',''), ']',''), ',', '')::int[])
                    GROUP BY DATE_TRUNC('week', date)
                    ORDER BY DATE_TRUNC('week', date);
                `;
                break;
            case 'monthly':
                sqlQuery = `
                    SELECT DATE_TRUNC('month', date) AS month_start, SUM(p.price) AS revenue
                    FROM invoices i
                    JOIN products p ON p.id = ANY(string_to_array(replace(replace(i.products, '[',''), ']',''), ',', '')::int[])
                    GROUP BY DATE_TRUNC('month', date)
                    ORDER BY DATE_TRUNC('month', date);
                `;
                break;
            default:
                throw new Error('Invalid interval provided. Please provide "daily", "weekly", or "monthly".');
        }

        return sqlQuery;
    }

    async SelectInvoiceRevenue(interval:string): Promise<InvoicesSummary[]> {
        try {
            const selectSummarySql = this.generateSummarySql(interval)
            const result: QueryResult = await this.db.query(selectSummarySql);
            return result.rows as InvoicesSummary[];
        } catch (error) {
            catchLogger(this.InsertInvoice, error);
            throw error;
        }
    }
}
