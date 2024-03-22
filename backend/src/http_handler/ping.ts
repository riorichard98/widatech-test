import { FastifyRequest, FastifyReply } from 'fastify';

export default function(_request: FastifyRequest, reply: FastifyReply): void {
    reply.send("service up and running....")
}