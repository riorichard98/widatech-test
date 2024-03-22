import { ValidRequestBody } from "../../utils/bodyValidator"

// model here is used for every request body modeling ,, before the request is proceed we must model the body first

export const VALID_PRODUCT_REQUEST_BODY:ValidRequestBody = {
    ids:'string[]'
}