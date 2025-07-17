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

    createContact: publicProcedure // Добавить контакт клиенту
        .input(
            z.object({
                surname: z.string(),
                name: z.string(),
                fathername: z.string(),
                phone: z.string(),
                companyId: z.string()
            })
        )
        .mutation(async ({ ctx, input }) => {
            const contact = await ctx.db.contact.create({
                data: {
                    surname: input.surname,
                    name: input.name,
                    fathername: input.fathername,
                    phone: input.phone,
                    companyID: input.companyId
                }
            })

            return contact
        }),

    updateContact: publicProcedure // Добавить контакт клиенту
        .input(
            z.object({
                id: z.string(),
                surname: z.string(),
                name: z.string(),
                fathername: z.string(),
                phone: z.string(),
                companyId: z.string()
            })
        )
        .mutation(async ({ ctx, input }) => {
            const contact = await ctx.db.contact.update({
                where: {
                    id: input.id
                },
                data: {
                    surname: input.surname,
                    name: input.name,
                    fathername: input.fathername,
                    phone: input.phone,
                    companyID: input.companyId
                }
            })

            return contact
        }),

})