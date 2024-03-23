"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const bodyValidator_1 = require("../../utils/bodyValidator");
const model_1 = require("./model");
function default_1(container) {
    /**
     * fastify handler functions for products are listed and declared below
     */
    const productService = container.productService;
    function getProductsHandler(request, reply) {
        return __awaiter(this, void 0, void 0, function* () {
            // validate the request body first before proceed
            const invalidKeys = (0, bodyValidator_1.validateRequestBody)(request.body, model_1.VALID_PRODUCT_REQUEST_BODY);
            if (invalidKeys.length > 0) {
                reply.send(invalidKeys);
                return;
            }
            const requestBody = request.body;
            try {
                const response = yield productService.GetProducts(requestBody);
                reply.send(response);
            }
            catch (error) {
                console.error(error);
                throw (error);
            }
        });
    }
    return {
        getProductsHandler,
    };
}
exports.default = default_1;
