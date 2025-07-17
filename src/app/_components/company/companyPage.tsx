"use client"

import { useEffect, useContext} from 'react'
import { api } from "~/trpc/react"
import Cookies from 'js-cookie'
import { useRouter, useSearchParams } from "next/navigation"
import SearchInput from '~/app/ui/searchInput'
import { sessionCookieName } from '../../api/context/contextVariables'
import CompanyTable from './companyTable'
import AddClient from './addCompany'
import { downloadExcel } from "react-export-table-to-excel"
import {getCompanyList} from "~/app/api/action/company"

export default function CompanyPage () {
    const router = useRouter()
    const cookieName = useContext(sessionCookieName)

    const searcParams = useSearchParams()
    const query = searcParams.get("query") ?? ""

    const excelButtonStyle = "btn bg-green-400 border-2 border-green-600 mt-3 hover:text-gray-50 hover:bg-green-600"

    const { data: userData, isLoading } = api.user.getRole.useQuery({token: Cookies.get(cookieName) ?? ""})

    useEffect(() => {
        if (!isLoading) {
            if (!userData) {
                router.push('/signin')
            }
        }
    }, [isLoading, router])


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

    
    if (isLoading) {
        return <div>Загрузка...</div>
    }


    return (
        <table>
            <tbody>
                <tr>
                    <td className = "align-top">
                        <label className = "mt-2 mr-4 font-bold inline-block align-middle">Клиенты</label>
                        <button type="submit" className={excelButtonStyle + " inline-block"}
                            onClick = {handleExportToExcel}>
                                Экспорт в Excel
                        </button>
                    </td>
                </tr>
                <tr>
                    <td className = "pt-4 align-top">
                        <SearchInput placeholder="Поиск по названию, ИНН или email" />
                        <CompanyTable edit = {userData == "ADMIN"} />
                    </td>
                    {
                        userData == "ADMIN" &&
                        <td className = "pt-4 pl-20 align-top"><AddClient /></td>
                    }
                </tr>
            </tbody>
        </table>
    )
}
