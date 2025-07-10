"use client"

import { useEffect, useState} from 'react'
import { api } from "~/trpc/react"
import Cookies from 'js-cookie'
import UserTable from "~/app/_components/user/userTable"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import SearchInput from '~/app/ui/searchInput'

export default function UserPage () {
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
        return <div></div>
    }

    if (userData != "ADMIN") {
        return <div>403 Forbidden</div>
    }


    return (
        <table>
            <tbody>
                <tr>
                    <td>
                        <label className = "font-bold">Сотрудники</label>
                    </td>
                </tr>
                <tr>
                    <td className = "pt-4">
                        <SearchInput placeholder="Поиск по фамилии или email" />
                        <UserTable/>
                    </td>
                </tr>
            </tbody>
        </table>
    )
}
