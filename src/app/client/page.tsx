"use client"

import { useEffect, useContext } from 'react'
import { useRouter } from 'next/navigation'
import { api } from "~/trpc/react"
import { sessionCookieName } from '../api/context/contextVariables'
import Cookies from 'js-cookie'
import ClientPage from '../_components/client/clientPage'


export default function Page () {
    const router = useRouter()
    const cookieName = useContext(sessionCookieName)
    const token = Cookies.get(cookieName)

    const {data: userdata, isLoading} = api.user.getMyProfile.useQuery({token: token ?? ""})

    useEffect(() => {
        if (!isLoading && !userdata) {
            router.push('/signin');
        }
    }, [isLoading, userdata, router]);

    if (isLoading) {
        return <div>Загрузка...</div>
    }

    return (
        <table>
            <tbody>
                <tr>
                    <td className = "align-top pl-4 pt-4">
                        <ClientPage />
                    </td>
                </tr>
            </tbody>
        </table>
    )
}


