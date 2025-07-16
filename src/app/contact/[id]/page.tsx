import React from "react"
import NewContactPage from "~/app/_components/contact/newContactPage";
import { db } from "~/server/db";

export default async function Page (
    props: { params: Promise<{ id?: string; }>, searchParams: Promise<{ company?: string;}>}

) {
    const params = await props.params
    const id = params.id ?? ""
    const companyId = (await props.searchParams).company ?? ""

    const company = await db.company.findFirst({
        where: {
            id: companyId
        }
    })

    return (
        <table>
            <tbody>
                <tr>
                    <td className = "align-top pl-4 pt-4">
                        {
                            id == "new" ? <NewContactPage companyname = {company?.companyname ?? ""}/> 
                            :
                            <>{id} {company?.companyname}</>
                        }
                    </td>
                </tr>
            </tbody>
        </table>
    )
}
