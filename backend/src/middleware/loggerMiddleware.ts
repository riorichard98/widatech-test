import { FastifyRequest, FastifyReply, HookHandlerDoneFunction } from 'fastify';

interface Logger {
    requestLogger: (request: FastifyRequest, _reply: FastifyReply, done: HookHandlerDoneFunction) => void;
    responseLogger: (request: FastifyRequest, reply: FastifyReply, payload: unknown, done: HookHandlerDoneFunction) => void;
}

// Middleware to log time, request body, and response body
export const loggerMiddleware = (): Logger => {
    const requestLogger = (request: FastifyRequest, _reply: FastifyReply, done: HookHandlerDoneFunction): void => {
        const startTime = new Date();
        console.log('-------- Request Start --------');
        console.log(`Date and time: ${startTime.toUTCString()}`)
        request.log.info({ time: startTime, method: request.raw.method, url: request.raw.url, requestBody: request.body });
        done();
    };

    const responseLogger = (_request: FastifyRequest, reply: FastifyReply, payload: any, done: HookHandlerDoneFunction): void => {
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
