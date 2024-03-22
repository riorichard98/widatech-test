import { ProductRepository as ProductRepo } from "../domain/product_repo";

import { DefaultResponse, createResponse, serverErrorResponse} from '../pkg/response/response'
import { responseCode } from '../pkg/response/responeCode'
import { catchLogger } from "../utils/common";

export interface GetProductsReq {
    ids: string[]
}

export default class ProductService {
    private productRepo: ProductRepo

    constructor(productRepo: ProductRepo) {
        this.productRepo = productRepo
    }

    async GetProducts(requestData: GetProductsReq): Promise<DefaultResponse> {
        try {
            const Product = this.productRepo
            const products = await Product.SelectProductsByIds(requestData.ids)
            let resp: DefaultResponse = createResponse(responseCode.SUCCESS, "success", products)
            return resp
        } catch (error) {
            catchLogger(this.GetProducts, error)
            return serverErrorResponse()
        }
    }
}