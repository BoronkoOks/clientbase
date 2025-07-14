import UserPage from "~/app/_components/user/userPage"

export default async function Home(props: {searchParams: Promise<{ query?: string; page?: string }>})
{
    return (
        <table>
            <tbody>
                <tr>
                    <td className = "align-top pl-4 pt-4">
                        <UserPage />
                    </td>
                </tr>
            </tbody>
        </table>
    )
}


