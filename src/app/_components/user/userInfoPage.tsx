"use client"

import { useEffect, useState} from 'react'
import { api } from "~/trpc/react"
import Cookies from 'js-cookie'
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { UserInfo } from './userInfo'

export default function UserInfoPage ({id} : {id: string}) {
    const searchParams = useSearchParams()
    const pathname = usePathname()
    const { replace } = useRouter()
    const router = useRouter()


    const { data: userData, isLoading } = api.user.getRole.useQuery({token: Cookies.get("session-token") ?? ""})

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
                        <UserInfo id = {id} />
                    </td>
                </tr>
            </tbody>
        </table>
    )
}