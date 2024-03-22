export interface ResponseData {
    items: any[],
    total: number
}
export interface DefaultResponse {
    status: string;
    message: string;
    data: any;
}

export function createResponse(status: string, message: string, data: any): DefaultResponse {
    return {
        status,
        message,
        data
    }
}

export function serverErrorResponse(): DefaultResponse {
    return {
        status: "0500",
        message: "internal server error",
        data: null
    }
}

export function invalidRequestResponse(): DefaultResponse{
    return{
        status:"0400",
        message:"invalid request body",
        data:null
    }
}