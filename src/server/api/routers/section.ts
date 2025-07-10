import { z } from "zod"
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc"

export const sectionRouter = createTRPCRouter({
    getSectionList: publicProcedure // получить список подразделений
        .input(
            z.object({
                query: z.string()
            })
        )
        .query(async ({ ctx, input }) => {
            const sections = await ctx.db.section.findMany({
                where: {
                    name: { startsWith: input.query}
                },
                orderBy: {
                    name: "asc"
                }
            })

            return sections ?? []
        }),
})