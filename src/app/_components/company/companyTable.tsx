"use client"

import React, { useEffect } from "react"
import { PencilSquareIcon } from "@heroicons/react/24/outline"
import Link from "next/link"
import { api } from "~/trpc/react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import Pagination from "~/app/ui/pagination"


export default function CompanyTable({edit = false} : {edit: boolean})
{
  const searchParams = useSearchParams()
  const query = searchParams.get("query") || "";
  const page = Number(searchParams.get("page")) || 1
  const pathname = usePathname()
  const { replace } = useRouter()
  
  const startNumber = (page - 1) * 10 + 1

  const tdStyle = "px-2 border border-black border-solid"

  const {data: companiesData, isLoading} = api.company.getCompanyList.useQuery({
    query: query, page: page, size: 10})

  const totalPages = companiesData ? (companiesData.pages > 0 ? companiesData.pages : 1) : 1


  useEffect (() => {
    if (totalPages < page) {
      const params = new URLSearchParams(searchParams)
      params.set("page", totalPages.toString())
      replace(`${pathname}?${params.toString()}`)
    }
  }, [companiesData, isLoading])


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
            <th className={tdStyle}>ИНН</th>
            <th className={tdStyle}>Email</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {companiesData?.companies.map((c, i) => (
            <tr key={c.id}>
              <td className={tdStyle + " align-items-end"}><p>{startNumber + i}</p></td>
              <td className={tdStyle}>{c.companyname}</td>
              <td className={tdStyle}>{c.TIN}</td>
              <td className={tdStyle}>{c.email}</td>
              <td className={tdStyle + " border-none"}>
                <Link href={`/company/${c.id}`}>
                {
                  edit ? <PencilSquareIcon className="w-4" />
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
