"use client"

import React, { useContext, useEffect } from "react"
import { PencilSquareIcon } from "@heroicons/react/24/outline"
import Link from "next/link"
import { api } from "~/trpc/react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import Pagination from "~/app/ui/pagination"
import {tdStyleCtx, tableStyleCtx} from "~/app/ui/styles"


export default function UserTable()
{
  const searchParams = useSearchParams()
  const query = searchParams.get("query") || "";
  const page = Number(searchParams.get("page")) || 1
  const pathname = usePathname()
  const { replace } = useRouter()
  
  const size = 10
  const startNumber = (page - 1) * size + 1

  const tdStyle = useContext(tdStyleCtx)
  const tableClass = useContext(tableStyleCtx)

  const {data: usersData, isLoading} = api.user.getUserList.useQuery({
    query: query, page: page, size: size})

  const totalPages = usersData ? (usersData.pages > 0 ? usersData.pages : 1) : 1


  useEffect (() => {
    if (!isLoading) {
      if (totalPages < page) {
        const params = new URLSearchParams(searchParams)
        params.set("page", totalPages.toString())
        replace(`${pathname}?${params.toString()}`)
      }
    }
  }, [usersData, isLoading])


  if (isLoading) {
    return <>загрузка...</>
  }


  return (
    <div>
      <table className = {tableClass}>
        <thead>
          <tr>
            <th className={tdStyle}>№</th>
            <th className={tdStyle}>Сотрудник</th>
            <th className={tdStyle}>Отдел</th>
            <th className={tdStyle}>Роль</th>
            <th className={tdStyle}>Email</th>
            <th className={tdStyle}>Телефон</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {usersData?.users.map((u, i) => (
            <tr key={u.id}>
              <td className={tdStyle + " align-items-end"}><p>{startNumber + i}</p></td>
              <td className={tdStyle}>{u.surname + " " + u.name.substring(0,1) + ". " + u.fathername.substring(0,1) + "."}</td>
              <td className={tdStyle}>{u.section?.name}</td>
              <td className={tdStyle}>{u.role}</td>
              <td className={tdStyle}>{u.email}</td>
              <td className={tdStyle}>{u.phone}</td>
              <td className={tdStyle + " border-none"}>
                <Link href={`/user/${u.id}`}>
                  <PencilSquareIcon className="w-4" />
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Pagination totalPages={totalPages} />
    </div>
  )
}
