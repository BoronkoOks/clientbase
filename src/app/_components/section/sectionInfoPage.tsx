"use client"

import { useEffect, useState, useContext} from 'react'
import { api } from "~/trpc/react"
import Cookies from 'js-cookie'
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { sessionCookieName } from '../../api/context/contextVariables'
import SectionUserTable from './usersRelated/sectionUserTable'
import SearchInput from '~/app/ui/searchInput'
import { deleteButtonStyle, updateButtonStyle } from '~/styles/daisystyles'
import { checkEditedSectionDuplicates } from '~/app/api/action/section'

export default function SectionInfoPage ({id, sectionName} : {id: string, sectionName: string}) {
    const searchParams = useSearchParams()
    const pathname = usePathname()
    const router = useRouter()
    const inputClassStyle = "input input-bordered"

    const cookieName = useContext(sessionCookieName)
    const token = Cookies.get(cookieName)

    const [name, setName] = useState<string>(sectionName)
    const [errMessage, setErrMessage] = useState<string>("")


    const { data: userData, isLoading } = api.user.getRole.useQuery({token: token ?? ""})

    useEffect(() => {
        if (!isLoading) {
            if (!userData || !token) {
                router.push('/signin')
            }
        }
    }, [isLoading, userData, router])


    async function handleSave () {
        if (name.trim() == "") {
            setErrMessage("Имя должно быть заполнено")
        }
        else {
            const nameDuplicates = await checkEditedSectionDuplicates(name, id)

            if (nameDuplicates) {
                setErrMessage("Названия отделов не должны повторяться")
            }
            else {
                setErrMessage("")
            }
            
        }
    }

    function handleDelete () {

    }

    
    if (isLoading) {
        return <div>загрузка...</div>
    }
    
    if (userData != "ADMIN" && userData != "SOTR") {
        return <div>403 Forbidden</div>
    }


    return (
        <table>
            <tbody>
                <tr>
                    <td className = "align-top" colSpan={2}>
                        <div>
                            <label className = "mt-2 mr-4 font-bold inline-block align-middle">
                                Подразделение
                            </label>
                            <button type="submit" className={updateButtonStyle + " inline-block"}
                                onClick={() => handleSave()}>
                                    Обновить
                            </button>
                            <button type="submit" className={deleteButtonStyle + " mt-3 ml-4 inline-block"}
                                onClick={() => handleDelete()}>
                                    Удалить
                            </button>
                            {
                                errMessage != "" &&
                                <label className = "mt-2 ml-6 inline-block align-middle text-red-700">{errMessage}</label>
                            }
                        </div>
                    </td>
                </tr>
                <tr>
                    <td className = "align-top pt-4">
                        <p className = "mr-2 pb-4">Название</p>
                        <input
                            type="text"
                            required
                            className= {inputClassStyle + " mt-1 mb-2"}
                            value = {name}
                            onChange={(e)=> setName(e.target.value)}
                        />
                    </td>
                    <td className = "align-top pt-6 pl-16">
                        <p className = "pb-4">Сотрудники</p>
                        <SearchInput placeholder = "Поиск по фамилии, email или телефону" />
                        <SectionUserTable sectionId = {id} />
                    </td>
                </tr>
            </tbody>
        </table>
    )
}