import { z } from "zod"
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc"
import { Section, User } from "@prisma/client"

type res = { section: Section | null, resultMessage: string }


export const sectionRouter = createTRPCRouter({
    getSectionList: publicProcedure // получить список подразделений
        .input(
            z.object({
                query: z.string(),
                page: z.number().optional(),
                size: z.number().optional()
            })
        )
        .query(async ({ ctx, input }) => {
            const page = input.page ?? 1
            const size = input.size ?? 0

            let sections: Section[] = []
            let pages = 0

            if (size > 0) {
                sections = await ctx.db.section.findMany({
                    include: {
                        _count: {
                            select: {
                                users: true
                            }
                        }
                    },
                    where: {
                        name: { startsWith: input.query, mode: "insensitive"}
                    },
                    orderBy: {
                        name: "asc"
                    },
                    skip: (page - 1) * size,
                    take: size
                })

                const count = await ctx.db.section.count({
                    where: {
                        name: { startsWith: input.query}
                    }
                })

                pages = Math.ceil(Number(count) / size)
            }
            else {
                sections = await ctx.db.section.findMany({
                    where: {
                        name: { startsWith: input.query}
                    },
                    orderBy: {
                        name: "asc"
                    }
                })
            }
            
            const sectionData = {sections: sections, pages: pages}

            return sectionData
        }),


    createSection: publicProcedure // добавить подразделение
        .input(
            z.object({
                name: z.string()
            })
        )
        .mutation(async ({ ctx, input }) => {
            const section = await ctx.db.section.create({
                data: input
            })

            return section
        }),

    getUserList: publicProcedure // список сотрудников подразделения
        .input(
            z.object({
                sectionId: z.string(),
                query: z.string(),
                page: z.number().optional(),
                size: z.number().optional()
            })
        )
        .query(async ({ ctx, input }) => {
            const page = input.page ?? 1
            const size = input.size ?? 0

            let users: User[] = []
            let pages = 0

            if (size > 0) {
                users = await ctx.db.user.findMany({
                    where: {
                        AND: [
                            {
                                sectionId: input.sectionId
                            },
                            {
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
                        ]
                    },
                    orderBy: [
                        {surname: "asc"},
                        {name: "asc"},
                        {fathername: "asc"}
                    ],
                    skip: (page - 1) * size,
                    take: size
                })

                const count = await ctx.db.user.count({
                    where: {
                        sectionId: input.sectionId
                    }
                })

                pages = Math.ceil(Number(count) / size)
            }
            else {
                users = await ctx.db.user.findMany({
                    where: {
                        AND: [
                            {
                                sectionId: input.sectionId
                            },
                            {
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
                        ]
                    },
                    orderBy: [
                        {surname: "asc"},
                        {name: "asc"},
                        {fathername: "asc"}
                    ]
                })
            }
            
            const sectionData = {users: users, pages: pages}

            return sectionData
        }),

    changeName: publicProcedure
        .input(
            z.object({
                id: z.string(),
                name: z.string()
            })
        )
        .mutation(async ({ ctx, input }) => {
            let result: res

            if (input.name.trim() != "") {
                const sameName = await ctx.db.section.findFirst({
                    where: {
                        AND: [
                            {id: input.id},
                            {name: input.name}
                        ]
                    }
                })

                if (!sameName) { // Название новое
                    const duplicates = await ctx.db.section.findFirst({
                            where: {
                                AND: [
                                    {name: input.name},
                                    {
                                        NOT: {
                                            id: input.id
                                        }
                                    }
                                ]
                            }
                        }) ? true : false

                    if (!duplicates) { // Название не дублирует уже существующее
                        const section = await ctx.db.section.update({
                            where: { 
                                id: input.id
                            },
                            data: {
                                name: input.name
                            }
                        })

                        result = {section: section, resultMessage: "Название обновлено"}
                    }
                    else { // Найден отдел с таким же названием
                        result = {section: null, resultMessage: "Названия подразделений не могут повторяться"}
                    }
                }
                else { // Название старое - обновлять нечего
                    result = {section: sameName, resultMessage: "Название не изменилось"}
                }
            }
            else {
                result = {section: null, resultMessage: "Название не может быть пустым"}
            }
            

            return result
        }),

    deleteSection: publicProcedure
        .input(
            z.object({
                id: z.string()
            })
        )
        .mutation(async ({ ctx, input }) => {
            const users = await ctx.db.user.count({
                where: {
                    sectionId: input.id
                }
            })


            let result: res

            if (users == 0) {
                const section = await ctx.db.section.findFirst({
                    where: { 
                        id: input.id
                    }
                })

                if (section) {
                    await ctx.db.section.delete({
                        where: { 
                            id: input.id
                        }
                    })
                    
                    result = {section: section, resultMessage: "Подразделение удалено"}
                }
                else {
                    result = {section: null, resultMessage: "Подразделение не найдено"}
                }
            }
            else {
                result = {section: null, resultMessage: "Невозможно удалить подразделение, в котором есть сотрудники"}
            }
            

            return result
        }),
})