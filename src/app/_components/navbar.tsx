"use client"

import Link from "next/link"
import React from "react"
import { usePathname } from 'next/navigation'

export function Navbar (
    {role} : {role: string}
) {
    const navbarButton = "btn bg-green-400 border-1 rounded-none border-green-600 hover:text-gray-50 hover:bg-green-600"
    const emptyPage = "btn bg-gray-500 border-1 text-gray-300 rounded-none border-gray-600"
    const currentPageButton = "btn bg-gray-100 border-2 rounded-none border-green-700 border-b-0 hover:text-gray-50 hover:bg-green-600"

    const [currentPage, setCurrentPage] = React.useState(usePathname())

    return (
        <div className = "navbar bg-gray-100">
            <Link href = "/" onClick={()=> setCurrentPage("/")}
                className = {currentPage == "/" ? currentPageButton : navbarButton}>
                Главная
            </Link>
        </div>
    )
}