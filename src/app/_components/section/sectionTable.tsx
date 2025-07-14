"use client"

import React, { useEffect } from "react"
import { PencilSquareIcon } from "@heroicons/react/24/outline"
import Link from "next/link"
import { api } from "~/trpc/react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import Pagination from "~/app/ui/pagination"


export default function SectionTable(
  {edit = false} : {edit: boolean}
)
{
  const searchParams = useSearchParams()
  const query = searchParams.get("query") || "";
  const page = Number(searchParams.get("page")) || 1
  const pathname = usePathname()
  const { replace } = useRouter()
  
  const startNumber = (page - 1) * 10 + 1

  const tdStyle = "px-2 border border-black border-solid"

  const {data: sectionsData, isLoading} = api.section.getSectionList.useQuery({
    query: query, page: page, size: 10})

  const totalPages = sectionsData ? (sectionsData.pages > 0 ? sectionsData.pages : 1) : 1


  useEffect (() => {
    if (totalPages < page) {
      const params = new URLSearchParams(searchParams)
      params.set("page", totalPages.toString())
      replace(`${pathname}?${params.toString()}`)
    }
  }, [sectionsData, isLoading])


  if (isLoading) {
    return <>загрузка...</>
  }


  return (
    <div>
      <table className = "box-border my-4 border-collapse border-1 border-black">
        <thead>
          <tr>
            <th className={tdStyle}>№</th>
            <th className={tdStyle}>Название</th>
            <th className={tdStyle}>Сотрудников</th>
            {
              edit && <th></th>
            }
          </tr>
        </thead>
        <tbody>
          {sectionsData?.sections.map((s, i) => (
            <tr key={s.id}>
              <td className={tdStyle + " align-items-end"}><p>{startNumber + i}</p></td>
              <td className={tdStyle}>{s.name}</td>
              <td className={tdStyle + " text-center"}>{JSON.stringify(s["_count"].users)}</td>
              <td className={tdStyle + " border-none"}>
                <Link href={`/section/${s.id}`}>
                {
                  edit ?
                  <PencilSquareIcon className="w-4" />
                  :
                  "<-"
                }
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
