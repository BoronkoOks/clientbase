"use client"

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api } from "~/trpc/react"

export default function Page () {
    const router = useRouter();
    const { data: sessionData, isLoading } = api.session.checkActiveSession.useQuery({});

    useEffect(() => {
        if (!isLoading && sessionData === false) {
            router.push('/signin');
        }
    }, [isLoading, sessionData, router]);

    if (isLoading) {
        return <div>Загрузка...</div>; // Можно добавить индикатор загрузки
    }

    return (
        <div>
            {/* Ваш контент для авторизованных пользователей */}
            <h1>Добро пожаловать!</h1>
        </div>
    );
};


