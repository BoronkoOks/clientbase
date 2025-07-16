import React from "react"

export default async function Page (
    props: { params: Promise<{ id?: string; }>, searchParams: Promise<{ company?: string;}>}

) {
    const params = await props.params
    const id = params.id ?? ""
    const company = (await props.searchParams).company ?? ""

    return (
        <table>
            <tbody>
                <tr>
                    <td className = "align-top pl-4 pt-4">
                        {id} {company}
                    </td>
                </tr>
            </tbody>
        </table>
    )
}
