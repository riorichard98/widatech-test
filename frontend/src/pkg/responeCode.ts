interface ResponseCode {
    SUCCESS : string;
    BAD_REQUEST: string;
    INVALID_AUTH: string;
    NOT_FOUND: string;
}

export const responseCode: ResponseCode = {
    SUCCESS:"0000",
    BAD_REQUEST:"0400",
    INVALID_AUTH:"0401",
    NOT_FOUND:"0404",
}