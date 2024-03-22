CREATE TABLE invoices (
    id SERIAL PRIMARY KEY,
    date DATE NOT NULL,
    customer_name VARCHAR(255) NOT NULL,
    salesperson_name VARCHAR(255) NOT NULL,
    notes TEXT,
    products TEXT
);

CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    picture_url VARCHAR(255),
    stock INT NOT NULL,
    price FLOAT NOT NULL
);

INSERT INTO products (name, picture_url, stock, price) VALUES
('Product 1', 'https://cdn.4imprint.com/qtz/homepage/categories/images21/drinkware0222.jpg', 50, 10.99),
('Product 2', 'https://cdn.4imprint.com/qtz/homepage/categories/images21/drinkware0222.jpg', 30, 15.49),
('Product 3', 'https://cdn.4imprint.com/qtz/homepage/categories/images21/drinkware0222.jpg', 20, 20.99),
('Product 4', 'https://cdn.4imprint.com/qtz/homepage/categories/images21/drinkware0222.jpg', 40, 12.99),
('Product 5', 'https://cdn.4imprint.com/qtz/homepage/categories/images21/drinkware0222.jpg', 60, 9.99),
('Product 6', 'https://cdn.4imprint.com/qtz/homepage/categories/images21/drinkware0222.jpg', 25, 18.99),
('Product 7', 'https://cdn.4imprint.com/qtz/homepage/categories/images21/drinkware0222.jpg', 35, 14.99),
('Product 8', 'https://cdn.4imprint.com/qtz/homepage/categories/images21/drinkware0222.jpg', 45, 11.99),
('Product 9', 'https://cdn.4imprint.com/qtz/homepage/categories/images21/drinkware0222.jpg', 55, 16.99),
('Product 10', 'https://cdn.4imprint.com/qtz/homepage/categories/images21/drinkware0222.jpg', 70, 8.99);
