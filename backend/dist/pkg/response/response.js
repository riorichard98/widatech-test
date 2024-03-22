"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.invalidRequestResponse = exports.serverErrorResponse = exports.createResponse = void 0;
function createResponse(status, message, data) {
    return {
        status,
        message,
        data
    };
}
exports.createResponse = createResponse;
function serverErrorResponse() {
    return {
        status: "0500",
        message: "internal server error",
        data: null
    };
}
exports.serverErrorResponse = serverErrorResponse;
function invalidRequestResponse() {
    return {
        status: "0400",
        message: "invalid request body",
        data: null
    };
}
exports.invalidRequestResponse = invalidRequestResponse;
