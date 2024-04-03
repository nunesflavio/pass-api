import {FastifyInstance} from "fastify";
import {ZodTypeProvider} from "fastify-type-provider-zod";
import {z} from "zod";
import {prisma} from "../lib/prisma";
import {BadRequest} from "./_errors/bad-request";

export async function checkIn(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>().get('/attendees/:attendeeId/check-in', {
        schema: {
            summary: 'Checke-in an attendee',
            tags: ['check-ins'],
            params: z.object({
                attendeeId: z.coerce.number().int()
            }),
            response: {
                201: z.null(),
            }
        }
    }, async (request, reply) => {

        // @ts-ignore
        const { attendeeId } = request.params

        const attendeeCheckIn = await prisma.checkIn.findUnique({
            where: {
                attendeeId,
            }
        })

        if (attendeeCheckIn !== null) {
            throw new BadRequest('Attendee already checked in')
        }

        await prisma.checkIn.create({
            data: {
                attendeeId,
            }
        })

        return reply.status(201).send()
    })
}