import { InvoiceRepository as InvoiceRepo, Invoice } from "../domain/invoice_repo";

import { DefaultResponse, createResponse, serverErrorResponse, ResponseData } from '../pkg/response/response'
import { responseCode } from '../pkg/response/responeCode'
import { catchLogger } from "../utils/common";

export interface MakeInvoiceReq {
    customer_name: string;
    salesperson_name: string;
    notes: string | null; // Notes can be nullable
    products: number[]; // Assuming products is an array of Product objects
}

export default class InvoiceService {
    private invoiceRepo: InvoiceRepo

    constructor(invoiceRepo: InvoiceRepo) {
        this.invoiceRepo = invoiceRepo
    }

    async MakeInvoice(requestData: MakeInvoiceReq): Promise<DefaultResponse> {
        try {
            const Invoice = this.invoiceRepo
            let resp: DefaultResponse = createResponse(responseCode.SUCCESS, "success", null)
            const newInvoiceData: Invoice = {
                date: new Date(),
                customer_name: requestData.customer_name,
                salesperson_name: requestData.salesperson_name,
                notes: requestData.notes,
                products: "[" + requestData.products.join(",") + "]"
            }
            await Invoice.InsertInvoice(newInvoiceData)
            return resp
        } catch (error) {
            catchLogger(this.MakeInvoice, error)
            return serverErrorResponse()
        }
    }

    async GetAllInvoiceProduct(page: string, limit: string): Promise<DefaultResponse> {
        try {
            let pageNumber = Number(page);
            let limitNumber = Number(limit);

            // Check if pageNumber and limitNumber are valid numbers and greater than 0
            if (isNaN(pageNumber) || pageNumber < 1) {
                pageNumber = 1
            }

            if (isNaN(limitNumber) || limitNumber < 1) {
                limitNumber = 1
            }
            const Invoice = this.invoiceRepo
            const data: ResponseData = {
                items: [],
                total: 0
            }
            const invoices = await Invoice.SelectAllInvoices(limitNumber, pageNumber)
            if (invoices.length > 0) {
                data.total = invoices[0].total_count
                data.items = invoices
            }
            let resp: DefaultResponse = createResponse(responseCode.SUCCESS, "success", data)
            return resp
        } catch (error) {
            catchLogger(this.GetAllInvoiceProduct, error)
            return serverErrorResponse()
        }
    }

    async GetInvoiceSummary(interval: string): Promise<DefaultResponse> {
        try {
            // Validate the interval variable , is it including one of these "daily", "weekly", "monthly"
            if (!["daily", "weekly", "monthly"].includes(interval)) {
                interval = "daily"
            }
            const Invoice = this.invoiceRepo
            const summary = await Invoice.SelectInvoiceRevenue(interval)
            let resp: DefaultResponse = createResponse(responseCode.SUCCESS, "success", summary)
            return resp
        } catch (error) {
            catchLogger(this.GetInvoiceSummary, error)
            return serverErrorResponse()
        }
    }
}

