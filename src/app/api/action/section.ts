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


export async function numberOfUsers (sectionId: string) {
    const result = await db.user.count({
        where: {
            sectionId: sectionId
        }
    })

    return result
}

export async function getSectionList() {
    const sections = await db.section.findMany({
        orderBy: {
            name: "asc"
        }
    })

    return sections
}

export async function getSectionById(id: string) {
    const section = await db.section.findFirst({
        where: {
            id: id
        }
    })

    return section
}
