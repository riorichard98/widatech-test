import styles from './style.module.css';
import { useRouter } from 'next/router';
import { useGlobalState, PageType } from '@/providers/store';

export default function SideBar() {
    const { state: content } = useGlobalState<string>('content');
    const router = useRouter();
    function PageNavigation(page: PageType, event: React.MouseEvent<HTMLDivElement, MouseEvent>): void {
        event.preventDefault()
        const pagePaths = new Map<PageType, string>([
            ["MAKE_INVOICE_PAGE", "/create-invoice"],
            ["LIST_INVOICE_PAGE", "/invoices"],
            ["REVENUE_PAGE", "/summary"]
        ]);
        const path = pagePaths.get(page) as string
        // Check if the destination path is different from the current path
        if (router.pathname !== path) {
            router.push(path);
        }
    }
    return (
        <div className={styles.sidebar}>
            <div className={styles.title} >Wida-Dashboard</div>
            <div
                className={styles.option}
                style={content === 'MAKE_INVOICE_PAGE' ? { backgroundColor: '#b2beb5' } : {}}
                onClick={(e) => PageNavigation('MAKE_INVOICE_PAGE', e)}>
                Create Invoice
            </div>
            <div
                className={styles.option}
                style={content === 'LIST_INVOICE_PAGE' ? { backgroundColor: '#b2beb5' } : {}}
                onClick={(e) => PageNavigation('LIST_INVOICE_PAGE', e)}>
                Invoice list
            </div>
            <div
                className={styles.option}
                style={content === 'REVENUE_PAGE' ? { backgroundColor: '#b2beb5' } : {}}
                onClick={(e) => PageNavigation('REVENUE_PAGE', e)}>
                Revenue Summary
            </div>
        </div>
    )
}