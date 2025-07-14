import { z } from "zod"
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc"
import { generateToken, setCookie } from "~/lib/utils"

export const sessionRouter = createTRPCRouter({
    tryAuth: publicProcedure // попытка войти
        .input(
            z.object({
                email: z.string(),
                password: z.string()
            })
        )
        .mutation(async ({ ctx, input }) => {
            const user = await ctx.db.user.findUnique({
                where: {
                    email: input.email
                }
            })

            if (user) {
                if (user.password == input.password) {
                    const sessionToken = generateToken({email: user.email}, "5min")

                    await ctx.db.session.deleteMany({
                        where: {
                            userId : user.id
                        }
                    })

                    await ctx.db.session.create({
                        data: {
                            sessionToken: sessionToken,
                            userId: user.id
                        }
                    })

                    return sessionToken
                }
                else {
                    return "Ошибка: неправильный пароль"
                }
            }
            else {
                return "Ошибка: пользователь не найден"
            }
        }),
    
    checkActiveSession: publicProcedure // проверка наличия сессии
        .input(
            z.object({
                token: z.string()
            })
        )
        .query(async ({ ctx, input }) => {
            const session = await ctx.db.session.findFirst({
                where: {
                    sessionToken: input.token
                }
            })

            if (!session)
            {
                return false
            }
            else {
                return true
            }
        }),

    endSession: publicProcedure // удалить сессию из БД
        .input(
            z.object({
                token: z.string()
            })
        )
        .mutation(async ({ ctx, input }) => {
            const session = await ctx.db.session.delete({
                where: {
                    sessionToken: input.token
                }
            })

            return session
        }),
})