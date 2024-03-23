import React from 'react';
import styles from './style.module.css';
import { Invoice } from '@/providers/store';

interface InvoiceProps {
    invoice: Invoice;
}

export default function Invoice({ invoice }: InvoiceProps) {
    // Function to format date in MM/DD/YYYY format
    const formatDate = (dateString: string): string => {
        const date = new Date(dateString);
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${month}/${day}/${year}`;
    };

    return (
        <div className={styles.invoicecard}>
            <div className={styles.header}>
                <h2>Invoice</h2>
                <p>Date: {formatDate(invoice.date)}</p>
            </div>
            <div className={styles.info}>
                <p>Customer: {invoice.customer_name}</p>
                <p>Salesperson: {invoice.salesperson_name}</p>
                <p>Products: {invoice.product_names}</p>
            </div>
            <div className={styles.details}>
                <p>Notes: {invoice.notes}</p>
                <p>Total Price: ${invoice.total_price.toFixed(2)}</p>
            </div>
        </div>
    );
}