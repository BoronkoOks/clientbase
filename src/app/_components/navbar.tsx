"use client"

import Link from "next/link"
import React from "react"
import { usePathname } from 'next/navigation'
import { api } from "~/trpc/react"
import Cookies from 'js-cookie'


export function Navbar () {

    const mainColor = "blue"

    const navbarButton = "btn bg-" + mainColor + "-400 border-1 rounded-none border-" + mainColor + "-600 hover:text-gray-50 hover:bg-" + mainColor + "-600"
    const emptyPage = "btn bg-gray-500 border-1 text-gray-300 rounded-none border-gray-600"
    const currentPageButton = "btn bg-gray-100 border-2 rounded-none border-" + mainColor + "-600 border-b-0 hover:text-gray-50 hover:bg-" + mainColor + "-600"

    const [currentPage, setCurrentPage] = React.useState(usePathname())

    const {data: role, isLoading} = api.user.getRole.useQuery({token: Cookies.get("session-token") ?? ""})


    if (isLoading) {
        return <>Загрузка...</>
    }


    return (
        <div className = "navbar bg-gray-100">
            <Link href = "/" onClick={()=> setCurrentPage("/")}
                className = {currentPage == "/" ? currentPageButton : navbarButton}>
                Главная
            </Link>

            {
                role != "GUEST" &&
                <Link href = "/myprofile" onClick={()=> setCurrentPage("/myprofile")}
                    className = {currentPage == "/myprofile" ? currentPageButton : navbarButton}>
                        Мой профиль
                </Link>
            }
            
            {
                role == "ADMIN" &&
                <Link href = "/user" onClick={()=> setCurrentPage("/user")}
                    className = {currentPage == "/user" ? currentPageButton : navbarButton}>
                        Сотрудники
                </Link>
            }   

            {
                role != "GUEST" &&
                <Link href = "/section" onClick={()=> setCurrentPage("/section")}
                    className = {currentPage == "/section" ? currentPageButton : navbarButton}>
                        Отделы
                </Link>
            }

            {
                role != "GUEST" &&
                <Link href = "/client" onClick={()=> setCurrentPage("/client")}
                    className = {currentPage == "/client" ? currentPageButton : navbarButton}>
                        Клиенты
                </Link>
            }
        </div>
    )
}