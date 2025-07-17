"use server"

import { db } from "~/server/db"


export async function checkPhoneDuplicates (phone: string, companyId: string) {
    const result = await db.contact.findFirst({
        where: {
            AND: [
                {phone: phone},
                {companyID: companyId}
            ]
        } 
    }) ? true : false

    return result
}


export async function checkEditedPhoneDuplicates (phone: string, companyId: string, id: string) {
    const result = await db.contact.findFirst({
        where: {
            AND: [
                {phone: phone},
                {companyID: companyId},
                {
                    NOT: {id: id}
                }
            ]
        } 
    }) ? true : false

    return result
}


export async function loadContactData (id: string) {
    const contact = await db.contact.findFirst({
        where: {
            id: id
        }
    })

    return contact
}


