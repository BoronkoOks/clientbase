import { z } from "zod"
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc"

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