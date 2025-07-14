import React from "react"
import SectionInfoPage from "~/app/_components/section/sectionInfo";

export default async function Page (props: { params: Promise<{ id?: string; }> }) {
    const params = await props.params
    const id = params.id ?? ""

    return (
        <table>
            <tbody>
                <tr>
                    <td className = "align-top pl-4 pt-4">
                        <SectionInfoPage id = {id}/>
                    </td>
                </tr>
            </tbody>
        </table>
    )
}
