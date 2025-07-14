"use client"

import { useEffect, useContext} from 'react'
import { api } from "~/trpc/react"
import Cookies from 'js-cookie'
import { useRouter } from "next/navigation"
import { AddUser } from './addUser'
import { sessionCookieName } from '../../api/context/contextVariables'

export default function NewUserPage () {
    const router = useRouter()

    const cookieName = useContext(sessionCookieName)

    const { data: userData, isLoading } = api.user.getRole.useQuery({token: Cookies.get(cookieName) ?? ""})

    useEffect(() => {
        if (!isLoading) {
            if (!userData) {
                router.push('/')
            }
        }
    }, [isLoading, userData, router])

    
    if (isLoading) {
        return <div>загрузка...</div>
    }

    if (userData != "ADMIN") {
        return <div>403 Forbidden</div>
    }


    return (
        <table>
            <tbody>
                <tr>
                    <td>
                        <AddUser/>
                    </td>
                </tr>
            </tbody>
        </table>
    )
}