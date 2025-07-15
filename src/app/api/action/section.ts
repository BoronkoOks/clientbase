"use server"

import { db } from "~/server/db"


export async function checkSectionDuplicates (name: string) {
    const result = await db.section.findFirst({
        where: {name: name}}) ? true : false

    return result
}


export async function checkEditedSectionDuplicates (name: string, id: string) {
    const result = await db.section.findFirst({
        where: {
            AND: [
                {name: name},
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