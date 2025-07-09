import { $Enums } from "@prisma/client"
import { auth } from "~/server/auth"
import { db } from "~/server/db"
import Cookies from 'js-cookie';




export async function checkSession() {
    return Cookies.get("session-token")
}


export async function getRole() {
    const role = (await auth())?.user.role ?? "GUEST"

    return role.toString()
}

export async function isAdmin() {
    const session = await auth()

    if (!session) {
        return false
    }

    if (session.user.role !== $Enums.Role.ADMIN)
        return false
    return true
}


export async function isAdminOrSelectedTeacher(teacherId: string) {
    const session = await auth()

    if (!session){
        return false
    }

    if (session.user.role !== $Enums.Role.ADMIN){
        const teacher = await db.teacher.findFirst({
            where: {
                userId: session.user.id
            }
        })

        if (!teacher || teacher.id != teacherId) {
            return false
        }
    }
    
    return true
}