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
