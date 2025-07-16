import React from "react"
import { db } from "~/server/db"
import CompanyInfoPage from "~/app/_components/company/companyInfoPage"
import { Company } from "@prisma/client";

export default async function Page (props: { params: Promise<{ id?: string; }> }) {
    const params = await props.params
    const id = params.id ?? ""

    const companyInf = await db.company.findFirst({
        where: {
            id: id
        }
    }) 
    ??
    {
        id: "",
        companyname: "",
        TIN: "",
        email: ""
    }
    
    

    return (
        <table>
            <tbody>
                <tr>
                    <td className = "align-top pl-4 pt-4">
                        <CompanyInfoPage companyInf = {companyInf} />
                    </td>
                </tr>
            </tbody>
        </table>
    )
}
