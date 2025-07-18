"use client"

import { useEffect, useContext} from 'react'
import Cookies from 'js-cookie'
import { useRouter } from 'next/navigation'
import { api } from "~/trpc/react"
import { sessionCookieName } from '~/app/api/context/contextVariables'
import { labelInlineBlockStyleCtx, tdPageStyleCtx } from '~/app/ui/styles'
import SearchInput from '~/app/ui/searchInput'
import SectionTable from '~/app/_components/section/sectionTable'
import AddSection from '~/app/_components/section/addSection'


export default function Page () {
    const router = useRouter()
    const cookieName = useContext(sessionCookieName)
    const token = Cookies.get(cookieName)

    const tdPageClass = useContext(tdPageStyleCtx)
    const labelHeaderStyle = useContext(labelInlineBlockStyleCtx)

    const {data: userRole, isLoading} = api.user.getRole.useQuery({token: token ?? ""})


    useEffect(() => {
        if (!isLoading && userRole == "GUEST") {
            router.push('/signin')
        }
    }, [isLoading, userRole, router])


    if (isLoading) {
        return <div>Загрузка...</div>
    }


    return (
        <table>
            <tbody>
                <tr>
                    <td className = {tdPageClass}>
                        <label className = {labelHeaderStyle}>Подразделения</label>
                    </td>
                </tr>
                <tr>
                    <td className = "pt-4 pl-4 align-top">
                        <SearchInput placeholder = "Поиск по названию" />
                        <SectionTable edit = {userRole == "ADMIN"} />
                    </td>
                    {
                        userRole == "ADMIN" &&
                        <td className = "pt-4 pl-20 align-top"><AddSection /></td>
                    }
                </tr>
            </tbody>
        </table>
    )
}
