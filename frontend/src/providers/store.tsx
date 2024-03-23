// Import necessary modules and types from React and Redux
import React, { ReactNode } from 'react';
import { createStore, combineReducers, Store } from 'redux';
import { Provider, useSelector, useDispatch } from 'react-redux';

// Define the shape of the alert state
export interface AlertState {
    show: boolean;   // Indicates whether the alert is currently displayed
    message: string; // The message to be displayed in the alert
}

export interface Invoice {
    invoice_id: number;
    date: string;
    customer_name: string;
    salesperson_name: string;
    notes: string;
    products: string;
    product_names: string;
    total_price: number;
    total_count: string;
}

export interface Product {
    id: number;
    name: string;
    picture_url: string;
    stock: number;
    price: number;
}

// Define action types
const SHOW_ALERT = 'SHOW_ALERT';
const HIDE_ALERT = 'HIDE_ALERT';

// Define action creators
export const showAlert = (message: string) => ({ type: SHOW_ALERT, payload: message });
export const hideAlert = () => ({ type: HIDE_ALERT });

// Define the reducer for managing the alert state
const alertReducer = (state: AlertState = { show: false, message: '' }, action: any) => {
    switch (action.type) {
        case SHOW_ALERT:
            return { show: true, message: action.payload };
        case HIDE_ALERT:
            return { show: false, message: '' };
        default:
            return state;
    }
};

// Define action creators for content state
export type PageType = "MAKE_INVOICE_PAGE" | "LIST_INVOICE_PAGE" | "REVENUE_PAGE"
export const changeContent = (contentName: PageType) => ({
    type: 'CHANGE_CONTENT',
    payload: contentName
});

// contentReducer
const contentReducer = (state: string = "", action: any) => {
    switch (action.type) {
        case 'CHANGE_CONTENT':
            return action.payload;
        default:
            return state;
    }
};

// action creators for invoices
export const updateInvoice = (invoices: Invoice[]) => ({
    type: 'UPDATE_INVOICES',
    payload: invoices
});

// invoiceReducer
const invoiceReducer = (state: Invoice[] = [], action: any) => {
    switch (action.type) {
        case 'UPDATE_INVOICES':
            if (Array.isArray(action.payload)) {
                return action.payload;
            } else {
                console.error('Invalid payload for updating invoices:', action.payload);
                return state;
            }
        default:
            return state;
    }
}

// action creators for products
export const updateProduct = (products: Product[]) => ({
    type: 'UPDATE_PRODUCT',
    payload: products
});

// invoiceReducer
const productReducer = (state: Product[] = [], action: any) => {
    switch (action.type) {
        case 'UPDATE_PRODUCT':
            if (Array.isArray(action.payload)) {
                return action.payload;
            } else {
                console.error('Invalid payload for updating products:', action.payload);
                return state;
            }
        default:
            return state;
    }
}

// Combine reducers
const rootReducer = combineReducers({
    alert: alertReducer,
    content: contentReducer,
    invoice: invoiceReducer,
    product: productReducer
    // Add other reducers here if needed
});

// Create the Redux store
export const store: Store = createStore(rootReducer);

// Define the global state provider component using React Redux Provider
export const GlobalStateProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    return <Provider store={store}>{children}</Provider>;
};

// Define a generic hook to access and dispatch actions for a named slice of the global state
// the purpose is the returned state will only rerender the needed page only
type ValidState = "alert" | "content" | "invoice" | "product"
type ValidType = AlertState | string | Invoice[] | Product[]
export const useGlobalState = <T = ValidType>(stateName: ValidState) => {
    const dispatch = useDispatch();
    const state = useSelector((globalState: any) => globalState[stateName] as T);

    return { state, dispatch };
};
