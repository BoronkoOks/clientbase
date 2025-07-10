import React from "react"
import { db } from "~/server/db"
import { getRole } from "~/app/api/auth/check"
// import { UserInfo, UserInfoMODE } from "~/app/_components/user/userInfo"

export default async function Page (props: { params: Promise<{ id: string }> }) {

    return (
        <table>
            <tbody>
                <tr>
                    <td className = "align-top pl-4 pt-4">
                        {/* <UserPage /> */}WIP
                    </td>
                </tr>
            </tbody>
        </table>
    )
}
