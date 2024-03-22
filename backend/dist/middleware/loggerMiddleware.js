"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loggerMiddleware = void 0;
// Middleware to log time, request body, and response body
const loggerMiddleware = () => {
    const requestLogger = (request, _reply, done) => {
        const startTime = new Date();
        console.log('-------- Request Start --------');
        console.log(`Date and time: ${startTime.toUTCString()}`);
        request.log.info({ time: startTime, method: request.raw.method, url: request.raw.url, requestBody: request.body });
        done();
    };
    const responseLogger = (_request, reply, payload, done) => {
        const endTime = new Date();
        reply.log.info({ time: endTime, responseStatusCode: reply.statusCode, responseBody: payload });
        console.log('-------- Request End --------');
        done();
    };
    return {
        requestLogger,
        responseLogger
    };
};
exports.loggerMiddleware = loggerMiddleware;
