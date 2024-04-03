import {FastifyInstance} from "fastify";
import {ZodTypeProvider} from "fastify-type-provider-zod";
import {z} from "zod";
import {prisma} from "../lib/prisma";
import url from 'node:url';
import {BadRequest} from "./_errors/bad-request";

//buscar a credencial unica
export async function getAttendeeBadge(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>().get('/attendees/:attendeeId/badge', {
        schema: {
            summary: 'Get an attendee badge',
            tags: ['attendees'],
            params: z.object({
                // de string para numero
                attendeeId: z.coerce.number().int(),

            }),
            response: {
                200: z.object({
                    badge: z.object({
                        name: z.string(),
                        email: z.string().email(),
                        eventTitle: z.string(),
                        checkInURL: z.string().url(),
                    })
                })
            },
        }
    }, async (request, reply) => {

        const { attendeeId } = request.params

        const attendee = await prisma.attendee.findUnique({
            select: {
                name: true,
                email: true,
                event: {
                    select: {
                        title: true,
                    }
                }
            },
            where: {
                id: attendeeId,
            }
        })

        if (attendee === null) {
            throw new BadRequest('Attendee not found.')
        }

        const baseURRL = `${request.protocol}://${request.hostname}`

        const chekInURL = new URL(`/attendees/${attendeeId}/check-in`, baseURRL)

        return reply.send({
            badge: {
                name: attendee.name,
                email: attendee.email,
                eventTitle: attendee.event.title,
                checkInURL: chekInURL.toString(),
            }
        })

    })
}