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

    let userdata = null

    if (token) {
        userdata = api.user.getMyProfile.useQuery({token: token ?? ""})
    }

    useEffect(() => {
        if (Cookies.get("session-token")) {
            token = Cookies.get("session-token")
        }
    }, [router]);


    return (
        <div className = "pl-4 pt-4">
            {!token ? <SigninLink />
            :
            <>
                <p>Здравствуйте, {userdata?.data?.name ?? ""}!</p>
                <SignoutButton />
            </>
            }
        </div>
    )
}
