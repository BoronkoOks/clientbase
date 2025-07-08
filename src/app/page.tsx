import { auth } from "~/server/auth"
import React from "react"
import Link from "next/link"
import { updateButtonStyle } from "~/styles/daisystyles"
import { db } from "~/server/db"


export default async function Home() {
  const session = await auth()
  let user

  if (session) {
    user = await db.user.findUnique({where: {id: session.user.id}}) || null
  }

  return (
    <div className = "pl-4 pt-4">
      <p>Homepage</p>
    </div>
  )
}
