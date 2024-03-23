import InvoiceCard from "@/components/invoice/invoice"
import { useEffect , useState} from 'react';
import { useGlobalState, PageType, changeContent, Invoice, updateInvoice } from '@/providers/store';
import internalRequest from "@/utils/internalRequest";

export default function () {
    const { dispatch } = useGlobalState<PageType>('content');
    const { state: invoices } = useGlobalState<Invoice[]>("invoice");
    const [ page,setPage] = useState(2);
    const [showButton,setShow] = useState(true);
    useEffect(() => {
        async function fetchInvoices() {
            try {
                const response = await internalRequest('/api/invoices?limit=4&page=1', 'GET');
                const [status, data] = response;
                if (status === 200) {
                    dispatch(updateInvoice(data.data.items)); // Dispatch action to update invoices in Redux store
                } else {
                    console.error('Failed to fetch invoices:', data);
                }
            } catch (error) {
                console.error('Error fetching invoices:', error);
            }
        }

        fetchInvoices();
        dispatch(changeContent('LIST_INVOICE_PAGE'));
    }, []);
    async function loadMoreInvoices(event: React.MouseEvent<HTMLButtonElement, MouseEvent>){
        try {
            event.preventDefault()
            const response = await internalRequest('/api/invoices?limit=4&page='+page, 'GET');
            const [status, data] = response;
                if (status === 200) {
                    dispatch(updateInvoice([...invoices,...data.data.items])); // Dispatch action to update invoices in Redux store
                    setPage(prevPage => prevPage + 1); // Use functional update to ensure correct value of page
                    if (data.data.items.length === 0){
                        setShow(false)
                    }
                } else {
                    console.error('Failed to fetch invoices:', data);
                }
        } catch (error) {
            console.error('Error load more invoices:', error);
        }
    }
    return (
        <div>
            {
                invoices.map((invoice,i) =>
                    <InvoiceCard key={i} invoice={invoice} />
                )
            }
            {showButton?<button onClick={loadMoreInvoices}>Load More</button>:"There is no more to show"}
        </div>
    )
}