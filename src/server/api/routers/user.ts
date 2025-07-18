import { z } from "zod"
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc"
import { Role } from "@prisma/client"
import { hashPassword } from "../pass"

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
                password: z.string()
            })
        )
        .mutation(async ({ ctx, input }) => {
            const hashedPassword = await hashPassword(input.password)

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
                    password: hashedPassword
                }
            })

            return user
        }),


    getUserList: publicProcedure // получить список пользователей
        .input(
            z.object({
                query: z.string(),
                page: z.number(),
                size: z.number()
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
                },
                orderBy: [
                    {surname: "asc"},
                    {name: "asc"},
                    {fathername: "asc"}
                ],
                skip: (input.page - 1) * input.size,
                take: input.size,
                include: {
                    section: true
                }
            })

            const count = await ctx.db.user.count({
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

            const pages = Math.ceil(Number(count) / input.size)

            const userData = {users: users, pages: pages}

            return userData
        }),

    getById: publicProcedure // поиск пользователя по id
        .input(
            z.object({
                id: z.string()
            })
        )
        .query(async ({ ctx, input }) => {
            const user = await ctx.db.user.findFirst({
                where: {
                    id: input.id
                }
            })

            return user
        }),


    createUser: publicProcedure // добавление пользователя
        .input(
            z.object({
                surname: z.string(),
                name: z.string(),
                fathername: z.string(),
                email: z.string(),
                phone: z.string(),
                role: z.string(),
                sectionId: z.string(),
                password: z.string()
            })
        )
        .mutation(async ({ ctx, input }) => {
            const hashedPassword = await hashPassword(input.password)
            
            const user = await ctx.db.user.create({
                data: {
                    surname: input.surname,
                    name: input.name,
                    fathername: input.fathername,
                    email: input.email,
                    phone: input.phone,
                    role: input.role as Role,
                    sectionId: input.sectionId,
                    password: hashedPassword
                }
            })

            return user
        }),


    deleteUser: publicProcedure // добавление пользователя
        .input(
            z.object({
                id: z.string()
            })
        )
        .mutation(async ({ ctx, input }) => {
            const user = await ctx.db.user.delete({
                where: { id: input.id }
            })

            return user
        }),
})