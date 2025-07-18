"use client"

import {useEffect, useState} from "react"
import { User } from "@prisma/client"
import { api } from "~/trpc/react"
import { ProfileInfo } from "./profileInfo"


export function UserInfo ({id} : {id: string}) {

    const {data: userData, isLoading} = api.user.getById.useQuery({id: id})

    const [user, setUser] = useState<User|null>()


    useEffect (() => {
        if (!isLoading) {
            setUser(userData)
        }
    }, [isLoading, userData])


    if (isLoading) {
        return <>Загрузка...</>
    }


    if (!user) {
        return <>Загрузка....</>
    }


    return (
        <ProfileInfo userdata={user} editSection = {true} pageName = "Сотрудник"/>
    )
}