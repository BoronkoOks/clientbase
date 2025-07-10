"use client"

import { useEffect } from 'react'
import Cookies from 'js-cookie'
import { useRouter } from 'next/navigation'
import { api } from "~/trpc/react"
import { ProfileInfo } from '../_components/myprofile/profileInfo'

export default function Page () {
    const router = useRouter()
    const token = Cookies.get("session-token")

    // const { data: sessionData, isLoading } = api.session.checkActiveSession.useQuery({token: token ?? ""})

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
                        {userdata && <ProfileInfo userdata = {userdata} />}
                    </td>
                </tr>
            </tbody>
        </table>
    );
};


