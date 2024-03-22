import { FastifyRequest, FastifyReply } from 'fastify';
import Container from '../../container';
import { DefaultResponse  } from '../../pkg/response/response';
import { GetProductsReq } from '../../usecase/product';
import { validateRequestBody , RequestBody } from '../../utils/bodyValidator';

import {
    VALID_PRODUCT_REQUEST_BODY
} from './model'

interface FastifyHttpHandler {
    (request: FastifyRequest, reply: FastifyReply): Promise<void>;
}

interface ProductHandler {
    getProductsHandler: FastifyHttpHandler;
}

export default function (container: Container): ProductHandler {

    /**
     * fastify handler functions for products are listed and declared below
     */
    const productService = container.productService
    async function getProductsHandler(request: FastifyRequest, reply: FastifyReply): Promise<void> {

        // validate the request body first before proceed
        const invalidKeys = validateRequestBody(request.body as RequestBody,VALID_PRODUCT_REQUEST_BODY)
        if (invalidKeys.length > 0) {
            reply.send(invalidKeys)
            return
        }
        const requestBody = request.body as GetProductsReq;
        try {
            const response: DefaultResponse = await productService.GetProducts(requestBody)
            reply.send(response);
        } catch (error) {
            console.error(error);
            throw (error);
        }
    }

    return {
        getProductsHandler,
    }
}