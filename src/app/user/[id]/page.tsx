import React from "react"
import NewUserPage from "~/app/_components/user/newUserPage";
import UserInfoPage from "~/app/_components/user/userInfoPage"

export default async function Page (props: { params: Promise<{ id?: string; }> }) {
    const params = await props.params
    const id = params.id ?? ""

    return (
        <table>
            <tbody>
                <tr>
                    <td className = "align-top pl-4 pt-4">
                        {
                        id != "new" ? <UserInfoPage id = {id}/>
                        :
                        <NewUserPage />
                        }
                    </td>
                </tr>
            </tbody>
        </table>
    )
}
