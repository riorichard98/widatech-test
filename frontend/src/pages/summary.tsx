import { useEffect } from 'react';
import { useGlobalState, PageType, changeContent } from '@/providers/store';
import RevenueBarChart from '@/components/chart/chart';
const data = [
    {
        "month_start": "2023-12-01T00:00:00.000Z",
        "revenue": 189
    },
    {
        "month_start": "2024-01-01T00:00:00.000Z",
        "revenue": 492
    },
    {
        "month_start": "2024-02-01T00:00:00.000Z",
        "revenue": 172
    },
    {
        "month_start": "2024-03-01T00:00:00.000Z",
        "revenue": 828
    }
]

export default function () {
    const {  dispatch } = useGlobalState<PageType>('content');
    useEffect(() => {
        dispatch(changeContent('REVENUE_PAGE'));
    }, []);
    return (
        <div><RevenueBarChart data={data}/></div>
    )
}