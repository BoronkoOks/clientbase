"use client"

import { useRouter } from "next/navigation"
import Cookies from "js-cookie"
import {useContext, useEffect, useState} from "react"
import { sessionCookieName } from "~/app/api/context/contextVariables"
import { api } from "~/trpc/react"
import {tdPageStyleCtx} from "~/app/ui/styles"
import SectionInfo from "~/app/_components/section/sectionInfo"
import { Err_403 } from "~/app/_components/_common/errorMessages"


export default function Page (props: { params: Promise<{ id?: string; }> }) {
    const [id, setId] = useState<string>("")
    
    const router = useRouter()
    
    const cookieName = useContext(sessionCookieName)
    const token = Cookies.get(cookieName) ?? ""
    
    const tdPageStyle = useContext(tdPageStyleCtx)

    const { data: userRole, isLoading } = api.user.getRole.useQuery({token: token})


    useEffect(() => {
        if (!isLoading && userRole == "GUEST") {
            router.push('/signin')
        }
    }, [isLoading, userRole, router])


    useEffect(() => {
        async function ReadId() {
            const params = await props.params

            setId(params.id ?? "")
        }

        ReadId()
    })


    if (isLoading || !userRole) {
        return <div>загрузка...</div>
    }
    
    if (userRole != "ADMIN") {
        return <Err_403 />
    }
    

    return (
        <table>
            <tbody>
                <tr>
                    <td className = {tdPageStyle}>
                    {
                        id != "" && <SectionInfo id = {id} />
                    }
                    </td>
                </tr>
            </tbody>
        </table>
    )
}
