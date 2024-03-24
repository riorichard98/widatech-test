import styles from './style.module.css';
import React from 'react';

interface InvoiceSummary {
    day?: string;
    week_start?: string;
    month_start?: string;
    revenue: number;
}

function RevenueBarChart({ data }: { data: InvoiceSummary[] }) {
    // Find the maximum revenue to scale the bars
    const maxRevenue = Math.max(...data.map(item => item.revenue));

    return (
        <div className={styles.chart_container}>
            <div className={styles.chart}>
                {data.map((item, index) => (
                    <div
                        key={index}
                        className={styles.bar}
                        style={{ height: `${(item.revenue / maxRevenue) * 100}%` }}
                        title={`Revenue: $${item.revenue}`}
                    />
                ))}
            </div>
            <div className={styles.date_labels}>
                {data.map((item, index) => (
                    <span key={index}>{item.day && new Date(item.day).toLocaleDateString('en-US')}</span>
                ))}
            </div>
            <div className={styles.week_start_labels}>
                {data.map((item, index) => (
                    <span key={index}>{item.week_start && new Date(item.week_start).toLocaleDateString('en-US')}</span>
                ))}
            </div>
            <div className={styles.month_start_labels}>
                {data.map((item, index) => (
                    <span key={index}>{item.month_start && new Date(item.month_start).toLocaleDateString('en-US')}</span>
                ))}
            </div>
        </div>
    );
};

export default RevenueBarChart;
