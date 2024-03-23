import styles from "@/styles/create-invoice.module.css";
import { useEffect, useRef } from 'react';
import { useGlobalState, PageType, changeContent, Product, updateProduct, showAlert, hideAlert } from '@/providers/store';
import internalRequest from "@/utils/internalRequest";

function generateRandomArray(): string[] {
    const length = Math.floor(Math.random() * 10) + 1; // Random length between 1 and 10
    const randomArray: string[] = [];

    for (let i = 0; i < length; i++) {
        const randomNumber = Math.floor(Math.random() * 10) + 1; // Random number between 1 and 10
        randomArray.push(randomNumber.toString());
    }

    return randomArray;
}

export default function () {
    const { dispatch } = useGlobalState<PageType>('content');
    const { state: products } = useGlobalState<Product[]>("product");
    const customerNameRef = useRef<HTMLInputElement>(null);
    const salesPersonNameRef = useRef<HTMLInputElement>(null);
    const notesRef = useRef<HTMLTextAreaElement>(null);
    const productsRef = useRef<HTMLTableElement>(null);

    // Function to extract IDs from table rows
    function getProductIds(): number[] {
        const ids: number[] = [];
        if (productsRef.current) {
            // Iterate through each row in the table
            productsRef.current.querySelectorAll('tbody tr').forEach(row => {
                const id = parseInt(row.getAttribute('data-id') || '');
                if (!isNaN(id)) {
                    ids.push(id);
                }
            });
        }
        return ids;
    };

    async function createInvoice(event: React.MouseEvent<HTMLFormElement, MouseEvent>) {
        try {
            event.preventDefault()

            const cust_name = customerNameRef.current?.value
            const sales_name = salesPersonNameRef.current?.value
            const notes = notesRef.current?.value
            const product_ids = getProductIds()
            const response = await internalRequest('/api/invoices', 'POST', {
                "customer_name": cust_name,
                "salesperson_name": sales_name,
                "notes": notes,
                "products": product_ids
            });
            const [status, data] = response;
            if (status === 200) {
                dispatch(showAlert("success create invoice"));
                setTimeout(() => {
                    dispatch(hideAlert());
                }, 500);
            } else {
                console.error('Failed to fetch invoices:', data);
            }
        } catch (error) {
            console.error('Error auto complete product:', error);
        }
    }

    useEffect(() => {
        dispatch(changeContent('MAKE_INVOICE_PAGE'));
    }, []);

    async function AutoCompleteProduct(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
        try {
            event.preventDefault()
            const randomArray = generateRandomArray()
            const response = await internalRequest('/api/products', 'POST', { "ids": randomArray });
            const [status, data] = response;
            if (status === 200) {
                dispatch(updateProduct(data.data));
            } else {
                console.error('Failed to fetch invoices:', data);
            }
        } catch (error) {
            console.error('Error auto complete product:', error);
        }
    }
    return (
        (
            <form className={styles.form} onSubmit={createInvoice}>
                <div className={styles.title}>
                    <h4>Please create new Invoice here !</h4>
                </div>
                <div className={styles.customersalesinput}>
                    <div className={styles.inputform}>
                        <label>
                            Customer Name:
                        </label>
                        <input type="text" name="customer_name" ref={customerNameRef} />

                    </div>
                    <div className={styles.inputform}>
                        <label>
                            Salesperson Name:
                        </label>
                        <input type="text" name="salesperson_name" ref={salesPersonNameRef} />
                    </div>
                </div>
                <div className={styles.inputform}>
                    <label>
                        Notes:
                    </label>
                    <textarea name="notes" ref={notesRef}></textarea>
                </div>
                <div className={styles.inputform}>
                    <div className={styles.autocomplete}>
                        <div>
                            <label>
                                Products:
                            </label>
                        </div>
                        <button onClick={AutoCompleteProduct}>AutoComplete!</button>
                    </div>
                    <table ref={productsRef}>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Price</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map(product => (
                                <tr key={product.id} data-id={product.id}>
                                    <td>{product.name}</td>
                                    <td>${product.price}</td>
                                </tr>
                            ))}
                            <tr>
                                <td>Total</td>
                                <td>${products.reduce((total, product) => total + product.price, 0)}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div className={styles.inputform}>
                    <input type="submit" value="Create Invoice" />
                </div>
            </form>
        )

    )
}