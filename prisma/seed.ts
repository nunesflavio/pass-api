import {prisma} from "../src/lib/prisma";

async  function seed() {

    await prisma.event.create({
        data: {
            id: 'ca82bf8c-176e-4c21-a532-495f725dbc53',
            title: 'Unite Talk Winter',
            slug: 'unite-talk-winter',
            details: 'Um evento p devs loucos por codigo',
            maximumAttendees: 90,
        }
    })

}

seed().then(() => {
        console.log('seed')
        prisma.$disconnect()
})
