"use client"

import React, { useEffect, useState } from "react"
import { SigninLink } from "./signlink"
import { SignoutButton } from "./signoutButton"
import Cookies from 'js-cookie'
import { useRouter } from 'next/navigation'
import { api } from "~/trpc/react"


export default function HomePage () {
    const router = useRouter()

    let token = Cookies.get("session-token")

    const { data: userdata, isLoading } = api.user.getMyProfile.useQuery({token: token ?? ""})

    
    if (isLoading) {
        return <div>Загрузка...</div>
    }

    return (
        <div className = "pl-4 pt-4">
            {!token ? <SigninLink />
            :
            <>
                <p>Здравствуйте, {userdata?.name ?? ""}!</p>
                <SignoutButton />
            </>
            }
        </div>
    )
}
