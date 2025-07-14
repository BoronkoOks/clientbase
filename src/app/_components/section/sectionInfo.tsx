"use client"

import { useEffect, useState, useContext} from 'react'
import { api } from "~/trpc/react"
import Cookies from 'js-cookie'
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { sessionCookieName } from '../../api/context/contextVariables'

export default function SectionInfoPage ({id} : {id: string}) {
    const searchParams = useSearchParams()
    const pathname = usePathname()
    const router = useRouter()

    const cookieName = useContext(sessionCookieName)
    const token = Cookies.get(cookieName)


    const { data: userData, isLoading } = api.user.getRole.useQuery({token: token ?? ""})

    useEffect(() => {
        if (!isLoading) {
            if (!userData || !token) {
                router.push('/signin')
            }
        }
    }, [isLoading, userData, router])

    
    if (isLoading) {
        return <div>загрузка...</div>
    }
    
    if (userData != "ADMIN" && userData != "SOTR") {
        return <div>403 Forbidden</div>
    }


    return (
        <table>
            <tbody>
                <tr>
                    <td className = "align-top">
                        <label className = "mt-2 mr-4 font-bold inline-block align-middle">Подразделение</label>
                    </td>
                </tr>
            </tbody>
        </table>
    )
}