"use client"

import { useEffect, useContext } from 'react'
import Cookies from 'js-cookie'
import { useRouter } from 'next/navigation'
import { api } from "~/trpc/react"
import { ProfileInfo } from '~/app/_components/user/profileInfo'
import { sessionCookieName } from '~/app/api/context/contextVariables'
import { tdPageStyleCtx } from '~/app/ui/styles'


export default function Page () {
    const router = useRouter()
    const cookieName = useContext(sessionCookieName)
    const token = Cookies.get(cookieName)
    const tdPageClass = useContext(tdPageStyleCtx)

    const {data: userdata, isLoading} = api.user.getMyProfile.useQuery({token: token ?? ""})


    useEffect(() => {
        if (!isLoading && !userdata) {
            router.push('/signin')
        }
    }, [isLoading, userdata, router])


    if (isLoading) {
        return <div>Загрузка...</div>
    }


    return (
        <table>
            <tbody>
                <tr>
                    <td className = {tdPageClass}>
                        {
                            userdata ?
                            <ProfileInfo
                                userdata = {userdata}
                                editSection = {userdata.role == "ADMIN"}
                                pageName = "Профиль"
                            />
                            :
                            <>Загрузка...</>
                        }
                    </td>
                </tr>
            </tbody>
        </table>
    )
}
