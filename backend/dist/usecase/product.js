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
const response_1 = require("../pkg/response/response");
const responeCode_1 = require("../pkg/response/responeCode");
const common_1 = require("../utils/common");
class ProductService {
    constructor(productRepo) {
        this.productRepo = productRepo;
    }
    GetProducts(requestData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const Product = this.productRepo;
                const products = Product.SelectProductsByIds(requestData.ids);
                let resp = (0, response_1.createResponse)(responeCode_1.responseCode.SUCCESS, "success", products);
                return resp;
            }
            catch (error) {
                (0, common_1.catchLogger)(this.GetProducts, error);
                return (0, response_1.serverErrorResponse)();
            }
        });
    }
}
exports.default = ProductService;
