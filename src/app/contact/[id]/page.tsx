"use client"

import EditContactPage from "~/app/_components/contact/editContactPage"
import NewContactPage from "~/app/_components/contact/newContactPage"
import { useRouter } from "next/navigation"
import Cookies from "js-cookie"
import {useContext, useEffect, useState} from "react"
import { sessionCookieName } from "~/app/api/context/contextVariables"
import { tdPageStyleCtx } from "~/app/ui/styles"
import { api } from "~/trpc/react"
import { Err_403, Err_404 } from "~/app/_components/_common/errorMessages"
import { getCompanyById } from "~/app/api/action/company"


export default function Page (
    props: { params: Promise<{ id?: string; }>, searchParams: Promise<{ company?: string;}>}

)
{
    const [id, setId] = useState<string>("")
    const [companyname, setCompanyname] = useState<string>("")
    const [loadingParams, setLoadingParams] = useState<boolean>(true)
        
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
            const id_ = params.id ?? ""

            const searchParams = await props.searchParams
            const companyId = searchParams.company ?? ""

            if (companyId != "") {
                const company_ = await getCompanyById(companyId)

                if (company_) {
                    setCompanyname(company_.companyname)
                }
            }

            setId(id_)

            setLoadingParams(false)
        }

        ReadId()
    })


    if (isLoading || loadingParams) {
        return <div>загрузка...</div>
    }

    if (userRole != "ADMIN") {
        return <Err_403 />
    }

    if (!companyname) {
        return <Err_404 message = "Клиент не найден" />
    }


    return (
        <table>
            <tbody>
                <tr>
                    <td className = {tdPageStyle}>
                        {
                            id == "new" ? <NewContactPage companyname = {companyname}/> 
                            :
                            <EditContactPage companyname = {companyname} />
                        }
                    </td>
                </tr>
            </tbody>
        </table>
    )
}
