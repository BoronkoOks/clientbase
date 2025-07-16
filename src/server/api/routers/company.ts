import { z } from "zod"
import { createTRPCRouter, publicProcedure } from "../trpc"
import { Company } from '@prisma/client'

type res = { company: Company | null, resultMessage: string }


export const companyRouter = createTRPCRouter({
    getCompanyList: publicProcedure // получить список компаний
        .input(
            z.object({
                query: z.string(),
                page: z.number(),
                size: z.number()
            })
        )
        .query(async ({ ctx, input }) => {
            const companies = await ctx.db.company.findMany({
                where: {
                    OR: [
                        {
                            companyname: {
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
                            TIN: {
                                startsWith: input.query,
                                mode: "insensitive"
                            }
                        }
                    ]
                },
                orderBy: {
                    companyname: "asc"
                },
                skip: (input.page - 1) * input.size,
                take: input.size
            })

            const count = await ctx.db.company.count({
                where: {
                    OR: [
                        {
                            companyname: {
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
                            TIN: {
                                startsWith: input.query,
                                mode: "insensitive"
                            }
                        }
                    ]
                }
            })

            const pages = Math.ceil(Number(count) / input.size)

            const companyData = {companies: companies, pages: pages}

            return companyData
        }),

    createCompany: publicProcedure
        .input(
            z.object({
                companyname: z.string(),
                TIN: z.string(),
                email: z.string()
            })
        )
        .mutation(async ({ ctx, input }) => {
            let result: res

            if (input.companyname.trim() != "" && input.TIN.length == 12 && input.email.length > 0) {
                const TINexists = await ctx.db.company.findFirst({ // Проверить ИНН
                    where: {
                        TIN: input.TIN
                    }
                })

                if (!TINexists) { // ИНН не повторяется
                    const emailExists = await ctx.db.company.findFirst({ // Проверить email
                        where: {
                            email: input.email
                        }
                    })

                    if (!emailExists) { // Такого email ещё нет
                        const company = await ctx.db.company.create({
                            data: input
                        })

                        result = {company: company, resultMessage: "Успешно"}
                    }
                    else {
                        result = {company: null, resultMessage: "email клиентов не могут повторяться"}
                    }
                }
                else {
                    result = {company: null, resultMessage: "ИНН клиентов не могут повторяться"}
                }
            }
            else {
                result = {company: null, resultMessage: "Все поля должны быть заполнены"}
            }

            return result
        }),

})