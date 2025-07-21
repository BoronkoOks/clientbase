"use client"

import { api } from "~/trpc/react"
import Cookies from 'js-cookie'
import { useContext, useState } from "react"
import { sessionCookieName } from "~/app/api/context/contextVariables"
import {regularButtonStyleCtx} from "~/app/ui/styles"
import ErrLabel from "../_common/errLabel"


export function SignoutButton() {
  const [errMessage, setErrMessage] = useState<string>("")

  const cookieName = useContext(sessionCookieName)
  const buttonStyle = useContext(regularButtonStyleCtx)

  const endSessionMutation = api.session.endSession.useMutation()


  function handleSignout () {
    let token = Cookies.get(cookieName)

    endSessionMutation.mutate(
      {
        token: token ?? ""
      },
      {
        onSuccess: () => {
          Cookies.remove(cookieName)
          setErrMessage("")
          window.location.reload()
        },
        onError: (error) => {
          setErrMessage(JSON.stringify(error))
        }
      }
    )
  }

  
  return (
    <>
      <button className = {buttonStyle} onClick={handleSignout}>
        Выйти
      </button>
      {
        errMessage != "" && <ErrLabel message = {errMessage} className="ml-4" />
      }
    </>
  )
}