"use client"

import { useEffect, useState, useContext } from "react"
import { PencilSquareIcon, MinusIcon } from "@heroicons/react/24/outline"
import Link from "next/link"
import { api } from "~/trpc/react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import Pagination from "~/app/ui/pagination"
import { Contact } from "@prisma/client"
import { tdStyleCtx, tableStyleCtx } from "~/app/ui/styles"


export default function ContactsTable(
  { companyId, edit = false} : {companyId: string, edit: boolean}
)
{
  const searchParams = useSearchParams()
  const query = searchParams.get("query") || ""
  const page = Number(searchParams.get("page")) || 1
  const pathname = usePathname()
  const { replace } = useRouter()

  const [contacts, setContacts] = useState<Contact[]>([])
  const [confirmDelete, setConfirmDelete] = useState<string>("")

  const deleteContactMutation = api.contact.deleteContact.useMutation()
  const utils = api.useUtils()

  const size = 8
  const startNumber = (page - 1) * size + 1

  const tdStyle = useContext(tdStyleCtx)
  const tableStyle = useContext(tableStyleCtx)

  const {data: contactsData, isLoading} = api.company.getContactList.useQuery({
    companyId: companyId, query: query, page: page, size: size})

  const totalPages = contactsData ? (contactsData.pages > 0 ? contactsData.pages : 1) : 1


  useEffect (() => {
    if (!isLoading) {
      if (totalPages < page) {
        const params = new URLSearchParams(searchParams)
        params.set("page", totalPages.toString())
        replace(`${pathname}?${params.toString()}`)
      }
    }

    if (contactsData) {
      setContacts(contactsData.contacts)
    }
  }, [contactsData, isLoading])


  function Delete() {
    deleteContactMutation.mutate(
      {
        id: confirmDelete
      },
      {
        onSuccess: () => {
          utils.company.getContactList.invalidate()
        }
      }
    )
  }

  
  function handleDelete (id: string) {
    if (id != confirmDelete) {
      setConfirmDelete(id)
    }
    else {
      Delete()
    }
  }


  if (isLoading) {
    return <>загрузка...</>
  }


  return (
    <div>
      <table className = {tableStyle}>
        <thead>
          <tr>
            <th className={tdStyle}>№</th>
            <th className={tdStyle}>ФИО</th>
            <th className={tdStyle}>Телефон</th>
            {
              edit && 
              <>
                <th></th>
                <th></th>
                <th></th>
              </>
            }
          </tr>
        </thead>
        <tbody>
          {contacts.map((c, i) => (
            <tr key={c.id}>
              <td className={tdStyle + " align-items-end"}><p>{startNumber + i}</p></td>
              <td className={tdStyle}>
                {c.surname + " " + c.name + " " + c.fathername}
                </td>
              <td className={tdStyle}>{c.phone}</td>
              {
                edit &&
                <>
                  <td className={tdStyle + " border-none"}>
                    <Link href={`/contact/${c.id}?company=${companyId}`}>
                      <PencilSquareIcon className="w-4" />
                    </Link>
                  </td>
                  <td className={tdStyle + " border-none"}>
                      <button onClick={() => handleDelete(c.id)}>
                        <MinusIcon className="w-4" />
                      </button>
                  </td>
                  {
                    confirmDelete == c.id && 
                    <td className={tdStyle + " border-none"}>
                      Нажмите ещё раз, чтобы удалить
                    </td>
                  }
                </>
              }
            </tr>
          ))}
        </tbody>
      </table>
      <Pagination totalPages={totalPages} />
    </div>
  )
}
