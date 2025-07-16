import { z } from "zod"
import { createTRPCRouter, publicProcedure } from "../trpc"
import { Contact } from '@prisma/client'

type res = { company: Contact | null, resultMessage: string }


export const contactRouter = createTRPCRouter({
    deleteContact: publicProcedure // удалить контактное лицо
        .input(
            z.object({
                id: z.string()
            })
        )
        .mutation(async ({ ctx, input }) => {
            const contact = await ctx.db.contact.delete({
                where: {
                    id: input.id
                }
            })

            return contact
        }),

})