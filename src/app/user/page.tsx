"use client"

import { useEffect, useContext} from 'react'
import { api } from "~/trpc/react"
import Cookies from 'js-cookie'
import UserTable from "~/app/_components/user/userTable"
import { useRouter } from "next/navigation"
import SearchInput from '~/app/ui/searchInput'
import Link from "next/link"
import { sessionCookieName } from '~/app/api/context/contextVariables'
import { labelInlineBlockStyleCtx, tdPageStyleCtx } from "~/app/ui/styles"
import { regularButtonStyleCtx } from '~/app/ui/styles'
import {Err_403} from "~/app/_components/_common/errorMessages"


export default function Page()
{
    const router = useRouter()
    const cookieName = useContext(sessionCookieName)

    const buttonClass = useContext(regularButtonStyleCtx)
    const tdPageClass = useContext(tdPageStyleCtx)

    const { data: userRole, isLoading } = api.user.getRole.useQuery({token: Cookies.get(cookieName) ?? ""})

    const labelHeaderStyle = useContext(labelInlineBlockStyleCtx)

    useEffect(() => {
        if (!isLoading) {
            if (!userRole) {
                router.push('/signin')
            }
        }
    }, [isLoading, userRole, router])

    
    if (isLoading) {
        return <div>Загрузка...</div>
    }

    if (userRole != "ADMIN") {
        return <Err_403 />
    }


    return (
        <table>
            <tbody>
                <tr>
                    <td className = {tdPageClass}>
                        <label className = {labelHeaderStyle}>Сотрудники</label>
                        <Link href = "/user/new" className = {buttonClass}>
                            Добавить
                        </Link>
                    </td>
                </tr>
                <tr>
                    <td className = {tdPageClass}>
                        <SearchInput placeholder="Поиск по фамилии, email или телефону" />
                        <UserTable/>
                    </td>
                </tr>
            </tbody>
        </table>
    )
}
