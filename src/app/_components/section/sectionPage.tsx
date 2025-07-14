"use client"

import { useEffect, useContext} from 'react'
import { api } from "~/trpc/react"
import Cookies from 'js-cookie'
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import SearchInput from '~/app/ui/searchInput'
import SectionTable from './sectionTable'
import AddSection from './addSection'
import { sessionCookieName } from '../../api/context/contextVariables'

export default function SectionPage () {
    const searchParams = useSearchParams()
    const pathname = usePathname()
    const { replace } = useRouter()
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
        return <div>Загрузка...</div>
    }


    return (
        <table>
            <tbody>
                <tr>
                    <td className = "align-top">
                        <label className = "mt-2 mr-4 font-bold inline-block align-middle">Подразделения</label>
                    </td>
                </tr>
                <tr>
                    <td className = "pt-4 align-top">
                        <SearchInput placeholder="Поиск по названию" />
                        <SectionTable edit = {userData == "ADMIN"} />
                    </td>
                    {
                        userData == "ADMIN" &&
                        <td className = "pt-4 pl-20 align-top"><AddSection /></td>
                    }
                </tr>
            </tbody>
        </table>
    )
}
