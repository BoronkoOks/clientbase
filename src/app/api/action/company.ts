"use server"

import { db } from "~/server/db"


export async function checkTINDuplicates (TIN: string) {
    const result = await db.company.findFirst({
        where: {TIN: TIN}}) ? true : false

    return result
}

export async function checkEmailuplicates (email: string) {
    const result = await db.company.findFirst({
        where: {email: email}}) ? true : false

    return result
}


export async function checkEditedTINDuplicates (TIN: string, id: string) {
    const result = await db.company.findFirst({
        where: {
            AND: [
                {TIN: TIN},
                {
                    NOT: {
                        id: id
                    }
                }
            ]
        }
    }) ? true : false

    return result
}


export async function checkEditedEmailDuplicates (email: string, id: string) {
    const result = await db.company.findFirst({
        where: {
            AND: [
                {email: email},
                {
                    NOT: {
                        id: id
                    }
                }
            ]
        }
    }) ? true : false

    return result
}


export async function getCompanyList (query: string = "") {
    const companies = await db.company.findMany({
        where: {
            OR: [
                {
                    companyname: {
                        startsWith: query,
                        mode: "insensitive"
                    }
                },
                {
                    email: {
                        startsWith: query,
                        mode: "insensitive"
                    }
                },
                {
                    TIN: {
                        startsWith: query,
                        mode: "insensitive"
                    }
                }
            ]
        },
        orderBy: {
            companyname: "asc"
        }
    })

    return companies
}
