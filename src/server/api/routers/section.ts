import { z } from "zod"
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc"
import { Section } from "@prisma/client"

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
        })
})