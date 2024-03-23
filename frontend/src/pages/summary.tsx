import { useEffect } from 'react';
import { useGlobalState, PageType, changeContent } from '@/providers/store';

export default function () {
    const {  dispatch } = useGlobalState<PageType>('content');
    useEffect(() => {
        dispatch(changeContent('REVENUE_PAGE'));
    }, []);
    return (
        <div>summary</div>
    )
}