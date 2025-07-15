"use client"

import React, { useEffect } from "react"
import { PencilSquareIcon } from "@heroicons/react/24/outline"
import Link from "next/link"
import { api } from "~/trpc/react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import Pagination from "~/app/ui/pagination"


export default function SectionUserTable({sectionId} : {sectionId: string})
{
  const searchParams = useSearchParams()
  const query = searchParams.get("query") || "";
  const page = Number(searchParams.get("page")) || 1
  const pathname = usePathname()
  const { replace } = useRouter()
  
  const startNumber = (page - 1) * 10 + 1

  const tdStyle = "px-2 border border-black border-solid"

  const {data: usersData, isLoading} = api.section.getUserList.useQuery({
    sectionId: sectionId, query: query, page: page, size: 10})

  const totalPages = usersData ? (usersData.pages > 0 ? usersData.pages : 1) : 1


  useEffect (() => {
    if (totalPages < page) {
      const params = new URLSearchParams(searchParams)
      params.set("page", totalPages.toString())
      replace(`${pathname}?${params.toString()}`)
    }
  }, [usersData, isLoading])


  if (isLoading) {
    return <>загрузка...</>
  }


  return (
    <div>
      <table className = "box-border my-4 border-collapse border-1 border-black">
        <thead>
          <tr>
            <th className={tdStyle}>№</th>
            <th className={tdStyle}>Сотрудник</th>
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
