"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvoiceRepository = void 0;
const common_1 = require("../utils/common");
const fs_1 = __importDefault(require("fs"));
class InvoiceRepository {
    constructor(db) {
        if (!db) {
            console.log("DB IN INVOICE REPOSITORY IS INVALID, PROCESS EXIT...");
            process.exit(1);
        }
        this.db = db;
    }
    InsertInvoice(newInvoiceData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let insertInvoiceSql = `
            INSERT INTO invoices (date, customer_name, salesperson_name`;
                const values = [
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
                const result = yield this.db.query(insertInvoiceSql, values);
                return result.rows;
            }
            catch (error) {
                (0, common_1.catchLogger)(this.InsertInvoice, error);
                throw error;
            }
        });
    }
    SelectAllInvoices(limit, page) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const offset = (page - 1) * limit;
                const selectAllInvoiceSql = fs_1.default.readFileSync('./src/domain/select_all_invoice.sql', 'utf8');
                const result = yield this.db.query(selectAllInvoiceSql, [limit, offset]);
                return result.rows;
            }
            catch (error) {
                (0, common_1.catchLogger)(this.InsertInvoice, error);
                throw error;
            }
        });
    }
    generateSummarySql(interval) {
        let sqlQuery;
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
    SelectInvoiceRevenue(interval) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const selectSummarySql = this.generateSummarySql(interval);
                const result = yield this.db.query(selectSummarySql);
                return result.rows;
            }
            catch (error) {
                (0, common_1.catchLogger)(this.InsertInvoice, error);
                throw error;
            }
        });
    }
}
exports.InvoiceRepository = InvoiceRepository;
