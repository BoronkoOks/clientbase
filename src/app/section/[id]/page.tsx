import React from "react"
import SectionInfoPage from "~/app/_components/section/sectionInfoPage";
import { db } from "~/server/db";

export default async function Page (props: { params: Promise<{ id?: string; }> }) {
    const params = await props.params
    const id = params.id ?? ""

    const sectionName = await db.section.findFirst({
        where: {
            id: id
        }
    }) ?? {id: id, name: "-"}

    return (
        <table>
            <tbody>
                <tr>
                    <td className = "align-top pl-4 pt-4">
                        <SectionInfoPage id = {id} sectionName = {sectionName.name}/>
                    </td>
                </tr>
            </tbody>
        </table>
    )
}
