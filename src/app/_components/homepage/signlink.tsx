"use client"

import Link from "next/link"

export function SigninLink() {
  return (
    <Link href = "/signin" className = "btn bg-blue-400 border-2 border-blue-600 mt-3 hover:text-gray-50 hover:bg-blue-600">
      Войти
    </Link>
  )
}