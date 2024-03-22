SELECT 
    i.id AS invoice_id,
    i.date,
    i.customer_name,
    i.salesperson_name,
    i.notes,
    i.products,
    string_agg(p.name, ', ') AS product_names,
    SUM(p.price) AS total_price,
    COUNT(*) OVER () AS total_count
FROM 
    invoices i
LEFT JOIN 
    products p ON p.id = ANY(string_to_array(replace(replace(i.products, '[',''), ']',''), ',', '')::int[])
GROUP BY 
    i.id, i.date, i.customer_name, i.salesperson_name, i.notes, i.products
LIMIT $1
OFFSET $2;