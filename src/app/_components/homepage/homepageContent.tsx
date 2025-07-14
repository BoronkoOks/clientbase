"use client"

import React, { useEffect, useState, useContext } from "react"
import { SigninLink } from "./signlink"
import { SignoutButton } from "./signoutButton"
import Cookies from 'js-cookie'
import { api } from "~/trpc/react"
import {sessionCookieName} from "~/app/api/context/contextVariables"


export default function HomePage () {
    const cookieName = useContext(sessionCookieName)
    let token = Cookies.get(cookieName)

    const { data: userdata, isLoading } = api.user.getMyProfile.useQuery({token: token ?? ""})

    if (isLoading) {
        return <div>Загрузка...</div>
    }

    return (
        <div className = "pl-4 pt-4">
            {(!token || !userdata) ? <SigninLink />
            :
            <>
                <p>Здравствуйте, {userdata.name ?? ""}!</p>
                <SignoutButton />
            </>
            }
        </div>
    )
}
