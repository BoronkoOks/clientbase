"use client"

import { api } from "~/trpc/react"
import Cookies from 'js-cookie'
import { useRouter } from 'next/navigation'


export function SignoutButton() {

  function handleSignout () {
    Cookies.remove("session-token")
  }

  return (
    <button className = "btn bg-blue-400 border-2 border-blue-600 mt-3 hover:text-gray-50 hover:bg-blue-600"
      onClick={handleSignout}
    >
      Выйти
    </button>
  )
}