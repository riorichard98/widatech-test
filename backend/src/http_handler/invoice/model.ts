import { ValidRequestBody } from "../../utils/bodyValidator"

export const VALID_MAKE_INVOICE_REQUEST_BODY:ValidRequestBody = {
    customer_name: 'string',
    salesperson_name: 'string',
    products: 'number[]'
}