"use client"

import { useEffect, useContext } from 'react'
import { useRouter, useSearchParams } from "next/navigation"
import { api } from "~/trpc/react"
import { sessionCookieName } from '~/app/api/context/contextVariables'
import Cookies from 'js-cookie'
import { getCompanyList } from '~/app/api/action/company'
import { downloadExcel } from "react-export-table-to-excel"
import SearchInput from '~/app/ui/searchInput'
import CompanyTable from '~/app/_components/company/companyTable'
import AddCompany from '~/app/_components/company/addCompany'
import { tdPageStyleCtx, labelInlineBlockStyleCtx } from '../ui/styles'
import { Err_403 } from '~/app/_components/_common/errorMessages'


export default function Page () {
    const router = useRouter()
    const cookieName = useContext(sessionCookieName)
    const token = Cookies.get(cookieName)

    const searcParams = useSearchParams()
    const query = searcParams.get("query") ?? ""

    const {data: userRole, isLoading} = api.user.getRole.useQuery({token: token ?? ""})

    const excelButtonStyle = "btn bg-green-400 border-2 border-green-600 mt-3 hover:text-gray-50 hover:bg-green-600"
    const tdPageClass = useContext(tdPageStyleCtx)
    const lobalHeaderClass = useContext(labelInlineBlockStyleCtx)


    useEffect(() => {
        if (!isLoading && userRole == "GUEST") {
            router.push('/signin');
        }
    }, [isLoading, userRole, router])


    const forbiddenSubstr = ["\\", "/", ":", "\*", "?", "\"", "'", "<", ">", "|"]
     
    
    async function handleExportToExcel () {
        const companies = await getCompanyList(query)

        if (companies.length > 0) {
            let body: (string | number)[][] = []

            companies.forEach((c, i )=> {
                body.push([i+1, c.companyname, c.TIN, c.email])
            })
            
            const headers = ["№", "Название", "ИНН", "Email"]

            let filename = "Список клиентов" 
            let sheetName = "Список клиентов" 
            
            if (query != "") {
                let allowedQuery = query

                forbiddenSubstr.forEach(s => {
                    allowedQuery = allowedQuery.replace(s, "")
                })

                filename += " (фильтр " + allowedQuery + ")"
                sheetName += " (фильтр " + allowedQuery + ")"
            }

            downloadExcel(
                {
                    fileName: filename,
                    sheet: "sheetName",
                    tablePayload: {
                        header: headers,
                        body: body
                    }
                }
            )
        }
    }


    if (isLoading || !userRole) {
        return <div>Загрузка...</div>
    }

    if (userRole == "GUEST") {
        return <Err_403 />
    }


    return (
        <table>
            <tbody>
                <tr>
                    <td className = {tdPageClass}>
                        <label className = {lobalHeaderClass}>Клиенты</label>
                        <button className={excelButtonStyle + " inline-block"} onClick = {handleExportToExcel}>
                            Экспорт в Excel
                        </button>
                    </td>
                </tr>
                <tr>
                    <td className = "pt-4 pl-4 align-top">
                        <SearchInput placeholder="Поиск по названию, ИНН или email" />
                        <CompanyTable edit = {userRole == "ADMIN"} />
                    </td>
                    {
                        userRole == "ADMIN" &&
                        <td className = "pt-4 pl-20 align-top"><AddCompany /></td>
                    }
                </tr>
            </tbody>
        </table>
    )
}
