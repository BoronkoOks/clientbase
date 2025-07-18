"use client"

import Link from "next/link"
import { useContext } from "react"
import {regularButtonStyleCtx} from "~/app/ui/styles"


export function SigninLink() {
  const buttonStyle = useContext(regularButtonStyleCtx)

  return (
    <Link href = "/signin" className = {buttonStyle}>
      Войти
    </Link>
  )
}