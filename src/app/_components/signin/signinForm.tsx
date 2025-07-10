"use client"

import { useState } from "react"
import { api } from "~/trpc/react"
import {updateButtonStyle} from "~/styles/daisystyles"
import Cookies from 'js-cookie'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function SigninForm () {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const router = useRouter()
    const { data: sessionData, isLoading } = api.session.checkActiveSession.useQuery({
        token: Cookies.get("session-token") ?? ""})

    useEffect(() => {
        if (sessionData && email.length == 0) {
            router.push('/')
        }
    }, [isLoading, sessionData, router]);

    

    const inputClassStyle = "input border-2 boder-dashed"

    const [result, setResult] = useState<string|null>("")

    const tryAuthMutation = api.session.tryAuth.useMutation()

    const handleLogin = () => {
        tryAuthMutation.mutate({
                email: email,
                password: password
            },
            {
                onSuccess: (data) => {
                    setResult(data?.toString() ?? null)

                    Cookies.set('session-token', data?.toString() ?? "", { 
                    expires: 1, // Печенька будет действительна 1 день
                    path: '/' // Доступность для всего приложения
                });
                
                    router.push('/');
                },
                onError: (error) => {
                    setResult(JSON.stringify(error))
                }
            }
        )
    }

  const divField = "flex align-middle"

    return (
        <div className="ml-2 mb-2 w-80">
            <div className = {divField + " ml-1 mb-1"}>
                <label><b>Email</b></label>
            </div>
                <div className = {divField}>
                    <input
                        type="email"
                        required
                        className= {inputClassStyle + " mb-2"}
                        value = {email}
                        onChange={(e)=> setEmail(e.target.value)}
                    />
                </div>
                <div className = {divField + " ml-1 mb-1"}>
                    <label><b>Пароль</b></label>
                </div>
                <div className = {divField}>
                    <input
                        type="password"
                        required
                        className= {inputClassStyle}
                        value = {password}
                        onChange={(e)=> setPassword(e.target.value)}
                    />
                </div>
            <div className = "mb-1 flex items-center w-full">
                <button className={updateButtonStyle + " w-full"} onClick={handleLogin}
                >
                    Войти
                </button>
            </div>
        </div>
    )
}
