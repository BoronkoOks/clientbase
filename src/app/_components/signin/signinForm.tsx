"use client"

import { useState, useContext } from "react"
import { api } from "~/trpc/react"
import {updateButtonStyle} from "~/styles/daisystyles"
import Cookies from 'js-cookie'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import GroupDiv from "~/app/ui/groupDiv"
import { sessionCookieName } from "../../api/context/contextVariables"

export default function SigninForm () {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [errMessage, setErrMessage] = useState("")

    const cookieName = useContext(sessionCookieName)

    const tryAuthMutation = api.session.tryAuth.useMutation()

    const router = useRouter()
    const { data: sessionData, isLoading } = api.session.checkActiveSession.useQuery({
        token: Cookies.get(cookieName) ?? ""})

    useEffect(() => {
        if (sessionData) {
            router.push('/')
        }
    }, [isLoading, sessionData, router]);


    const inputClassStyle = "input border-2 boder-dashed"



    const handleLogin = () => {
        if (email.trim() == "" || password.trim() == "") {
            setErrMessage("Необходимо заполнить поля")
        }
        else {
            tryAuthMutation.mutate({
                    email: email,
                    password: password
                },
                {
                    onSuccess: (data) => {
                        if (data.includes("Ошибка")) {
                            setErrMessage(data)
                        }
                        else {
                            setErrMessage("")

                            Cookies.set(cookieName, data?.toString() ?? "", {
                                expires: 0.5, // Печенька будет действительна 12 часов
                                path: '/'
                            })
                        
                            router.push('/')
                        }
                    },
                    onError: (error) => {
                        setErrMessage(JSON.stringify(error))
                    }
                }
            )
        }
    }

  const divField = "flex align-middle"

    return (
        <GroupDiv>
            <div className="ml-2 my-2 w-80">
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
            {
                errMessage != "" &&
                <label className = "mt-2 ml-2 inline-block align-middle text-red-700">{errMessage}</label>
            }
        </GroupDiv>
    )
}
