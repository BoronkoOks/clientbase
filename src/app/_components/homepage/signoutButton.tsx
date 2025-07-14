"use client"

import { api } from "~/trpc/react"
import Cookies from 'js-cookie'
import { useContext, useState } from "react"
import { sessionCookieName } from "../../api/context/contextVariables"


export function SignoutButton() {
  const [errMessage, setErrMessage] = useState<string>("")
  const cookieName = useContext(sessionCookieName)

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
      <button className = "btn bg-blue-400 border-2 border-blue-600 mt-3 hover:text-gray-50 hover:bg-blue-600"
        onClick={handleSignout}
      >
        Выйти
      </button>
      {
          errMessage != "" &&
          <label className = "mt-2 ml-6 inline-block align-middle text-red-700">{errMessage}</label>
      }
    </>
  )
}