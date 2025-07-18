"use server"

import { db } from "~/server/db"


export async function checkEmailDuplicates (email: string) {
    const result = await db.user.findFirst({
        where: {email: email}}) ? true : false

    return result
}


export async function checkPhoneDuplicates (phone: string, id: string = "") {
    const result = await db.user.findFirst({where: {phone: phone}}) ? true : false

    return result
}


export async function checkEditedEmailDuplicates (email: string, id: string) {
    const result = await db.user.findFirst({
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


export async function checkEditedPhoneDuplicates (phone: string, id: string) {
    const result = await db.user.findFirst({
        where: {
            AND: [
                {phone: phone},
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


export async function getUserId (token: string) {
    const session = await db.session.findFirst({
        where: {
            sessionToken: token
        }
    })

    return session?.userId ?? ""
}


export async function getUserRole (token: string) {
    const session = await db.session.findFirst({
        where: {
            sessionToken: token
        },
        include: {
            user: true
        }
    })

    return session?.user.role.toString() ?? ""
}

