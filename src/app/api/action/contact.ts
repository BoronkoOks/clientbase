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


