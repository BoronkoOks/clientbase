"use client"

import { useEffect, useContext} from 'react'
import { api } from "~/trpc/react"
import Cookies from 'js-cookie'
import UserTable from "~/app/_components/user/userTable"
import { useRouter } from "next/navigation"
import SearchInput from '~/app/ui/searchInput'
import Link from "next/link"
import { sessionCookieName } from '../../api/context/contextVariables'

export default function UserPage () {
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
                        <label className = "mt-2 mr-4 font-bold inline-block align-middle">Сотрудники</label>
                        <Link href = "/user/new"
                            className = "btn bg-blue-400 border-2 border-blue-600 mt-3 hover:text-gray-50 hover:bg-blue-600">
                                Добавить
                        </Link>
                    </td>
                </tr>
                <tr>
                    <td className = "pt-4">
                        <SearchInput placeholder="Поиск по фамилии, email или телефону" />
                        <UserTable/>
                    </td>
                </tr>
            </tbody>
        </table>
    )
}
