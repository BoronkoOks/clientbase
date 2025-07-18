import PhoneInput from "~/app/_components/_common/fields/phoneInput"
import SectionSelect from "~/app/_components/_common/fields/sectionSelect"
import EmailInput from "~/app/_components/_common/fields/emailInput"
import GroupDiv from "~/app/ui/groupDiv"
import { Role, User } from "@prisma/client"
import Cookies from "js-cookie"
import { sessionCookieName } from "~/app/api/context/contextVariables"
import { useContext, useEffect, useState } from "react"
import { getUserId } from "~/app/api/action/user"


export default function ContactInfo (
    {user, setUser, edit = false}: {user: User, setUser: (u: User) => void, edit: boolean}
)
{
    const [currentUserId, setCurrentUserId] = useState<string>(user.id)
    const cookieName = useContext(sessionCookieName)
    const token = Cookies.get(cookieName)


    useEffect(() => {
        async function getMyId () {
            const id = await getUserId(token ?? "")

            setCurrentUserId(id)
        }

        getMyId()
    }, [])


    return (
        <GroupDiv>
            <p className="mb-4"><b>Контактная информация*</b></p>
            <div>
                <EmailInput
                    email = {user.email}
                    onChange = {val => setUser({...user, email: val})}
                />
            </div>
            <div>
                <label className = "mt-2 mr-2">Телефон</label>
                <PhoneInput
                    phone = {user.phone}
                    onChange = {val => setUser({...user, phone: val})}
                />
            </div>
            <div  className = "mt-4">
                <SectionSelect
                    value = {user.sectionId}
                    onChange = {val => setUser({...user, sectionId: val})}
                    edit = {edit}
                />
            </div>
            {
                edit && 
                <div  className = "mt-3 flex">
                    <label className = "mr-2 mb-1">Роль:</label><br/>
                    {
                        currentUserId != user.id
                        ?
                        <select value = {user.role}
                            onChange = {e => setUser({...user, role: e.target.value as Role})}
                        >
                            <option key = "SOTR" value = "SOTR">SOTR</option>
                            <option key = "ADMIN" value = "ADMIN">ADMIN</option>
                        </select>
                        :
                        <label>{user.role}</label>
                    }
                </div>
            }
        </GroupDiv>
    )
}