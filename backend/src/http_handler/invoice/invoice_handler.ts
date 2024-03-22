import { FastifyRequest, FastifyReply } from 'fastify';
import Container from '../../container';
import { DefaultResponse } from '../../pkg/response/response';
import { MakeInvoiceReq } from '../../usecase/invoice';
import { validateRequestBody, RequestBody } from '../../utils/bodyValidator';

import {
    VALID_MAKE_INVOICE_REQUEST_BODY
} from './model'

interface FastifyHttpHandler {
    (request: FastifyRequest, reply: FastifyReply): Promise<void>;
}

interface InvoiceHandler {
    makeInvoiceHandler: FastifyHttpHandler;
    getAllInvoiceProductHandler: FastifyHttpHandler;
    getInvoiceSummary: FastifyHttpHandler;
}

interface QueryParameters {
    page?: string;
    limit?: string;
    interval?: string;
    // Add other query parameters here if needed
}

export default function (container: Container): InvoiceHandler {
    /**
    * fastify handler functions for invoices are listed and declared below
    */

    const invoiceService = container.invoiceService
    async function makeInvoiceHandler(request: FastifyRequest, reply: FastifyReply): Promise<void> {
        // validate the request body first before proceed
        const invalidKeys = validateRequestBody(request.body as RequestBody, VALID_MAKE_INVOICE_REQUEST_BODY)
        if (invalidKeys.length > 0) {
            reply.send(invalidKeys)
            return
        }
        const requestBody = request.body as MakeInvoiceReq;
        try {
            const response: DefaultResponse = await invoiceService.MakeInvoice(requestBody)
            reply.send(response);
        } catch (error) {
            console.error(error);
            throw (error);
        }
    }

    async function getAllInvoiceProductHandler(request: FastifyRequest, reply: FastifyReply): Promise<void> {
        // Get query parameters from request
        const queryParameters = request.query as QueryParameters;
        const page = queryParameters.page as string;
        const limit = queryParameters.limit as string;
        try {
            const response: DefaultResponse = await invoiceService.GetAllInvoiceProduct(page,limit)
            reply.send(response);
        } catch (error) {
            console.error(error);
            throw (error);
        }
    }

    async function getInvoiceSummary(request: FastifyRequest, reply: FastifyReply): Promise<void> {
        const queryParameters = request.query as QueryParameters;
        const interval = queryParameters.interval as string
        try {
            const response: DefaultResponse = await invoiceService.GetInvoiceSummary(interval)
            reply.send(response);
        } catch (error) {
            console.error(error);
            throw (error);
        }
    }

    return {
        makeInvoiceHandler,
        getAllInvoiceProductHandler,
        getInvoiceSummary
    }
}