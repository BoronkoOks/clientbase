"use client"

import React, { useContext } from "react"
import { SigninLink } from "./signlink"
import { SignoutButton } from "./signoutButton"
import Cookies from 'js-cookie'
import { api } from "~/trpc/react"
import {sessionCookieName} from "~/app/api/context/contextVariables"
import { tdPageStyleCtx } from "~/app/ui/styles"


export default function HomePage () {
    const cookieName = useContext(sessionCookieName)
    const token = Cookies.get(cookieName)
    const tdPageClass = useContext(tdPageStyleCtx)

    const { data: userdata, isLoading } = api.user.getMyProfile.useQuery({token: token ?? ""})


    if (isLoading) {
        return <div>Загрузка...</div>
    }

    return (
        <div className = {tdPageClass}>
            {
                (!token || !userdata) ?
                <SigninLink />
                :
                <>
                    <p>Здравствуйте, {userdata.name ?? ""}!</p>
                    <SignoutButton />
                </>
            }
        </div>
    )
}
