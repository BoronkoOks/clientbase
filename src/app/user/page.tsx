"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { api } from "~/trpc/react"
import Cookies from 'js-cookie'

export default function Page () {
    const router = useRouter();
    const { data: sessionData, isLoading } = api.session.checkActiveSession.useQuery({token: Cookies.get("session-token") ?? ""})

    useEffect(() => {
        if (!isLoading && sessionData === false) {
            router.push('/signin');
        }
    }, [isLoading, sessionData, router]);

    if (isLoading) {
        return <div>Загрузка...</div>
    }

    return (
        <div>
            <h1>Добро пожаловать!</h1>
        </div>
    );
};


