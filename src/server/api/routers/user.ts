import { z } from "zod"
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc"
import { Role } from "@prisma/client"

export const userRouter = createTRPCRouter({
    getMyProfile: publicProcedure // вывод информации от текущем пользователе
        .input(
            z.object({
                token: z.string()
            })
        )
        .query(async ({ ctx, input }) => {
            const session = await ctx.db.session.findFirst({
                where: {
                    sessionToken: input.token
                },
                include: {
                    user: true
                }
            })

            return session?.user ?? null
        }),

    getRole: publicProcedure // получение роли пользователя
        .input(
            z.object({
                token: z.string()
            })
        )
        .query(async ({ ctx, input }) => {
            const session = await ctx.db.session.findFirst({
                where: {
                    sessionToken: input.token
                },
                include: {
                    user: true
                }
            })

            return session?.user.role.toString() ?? "GUEST"
        }),


    updateUser: publicProcedure // вывод информации от текущем пользователе
        .input(
            z.object({
                id: z.string(),
                surname: z.string(),
                name: z.string(),
                fathername: z.string(),
                email: z.string(),
                phone: z.string(),
                role: z.string(),
                sectionId: z.string(),
                password: z.string().nullable()
            })
        )
        .mutation(async ({ ctx, input }) => {
            const user = await ctx.db.user.update({
                where: {
                    id: input.id
                },
                data: {
                    surname: input.surname,
                    name: input.name,
                    fathername: input.fathername,
                    email: input.email,
                    phone: input.phone,
                    role: input.role as Role,
                    sectionId: input.sectionId,
                    password: input.password
                }
            })

            return user
        }),


    getUserList: protectedProcedure // получить список пользователей
        .input(
            z.object({
                query: z.string()
            })
        )
        .query(async ({ ctx, input }) => {
            const users = await ctx.db.user.findMany({
                where: {
                    OR: [
                        {
                            surname: {
                                startsWith: input.query,
                                mode: "insensitive"
                            }
                        },
                        {
                            email: {
                                startsWith: input.query,
                                mode: "insensitive"
                            }
                        },
                        {
                            phone: {
                                startsWith: input.query,
                                mode: "insensitive"
                            }
                        }
                    ]
                }
            })

            return users ?? []
        }),
})