"use client"

import { useEffect, useContext} from 'react'
import { api } from "~/trpc/react"
import Cookies from 'js-cookie'
import { useRouter } from "next/navigation"
import SearchInput from '~/app/ui/searchInput'
import { sessionCookieName } from '../../api/context/contextVariables'
import CompanyTable from './companyTable'
import AddClient from './addCompany'

export default function CompanyPage () {
    const router = useRouter()

    const cookieName = useContext(sessionCookieName)

    const { data: userData, isLoading } = api.user.getRole.useQuery({token: Cookies.get(cookieName) ?? ""})

    useEffect(() => {
        if (!isLoading) {
            if (!userData) {
                router.push('/signin')
            }
        }
    }, [isLoading, userData, router])

    
    if (isLoading) {
        return <div>Загрузка...</div>
    }


    return (
        <table>
            <tbody>
                <tr>
                    <td className = "align-top">
                        <label className = "mt-2 mr-4 font-bold inline-block align-middle">Клиенты</label>
                    </td>
                </tr>
                <tr>
                    <td className = "pt-4 align-top">
                        <SearchInput placeholder="Поиск по названию, ИНН или email" />
                        <CompanyTable edit = {userData == "ADMIN"} />
                    </td>
                    {
                        userData == "ADMIN" &&
                        <td className = "pt-4 pl-20 align-top"><AddClient /></td>
                    }
                </tr>
            </tbody>
        </table>
    )
}
