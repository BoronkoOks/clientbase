"use client"

import { useEffect, useState, useContext} from 'react'
import { api } from "~/trpc/react"
import Cookies from 'js-cookie'
import { useRouter } from "next/navigation"
import { sessionCookieName } from '../../api/context/contextVariables'
import SectionUserTable from './usersRelated/sectionUserTable'
import SearchInput from '~/app/ui/searchInput'
import { deleteButtonStyle, updateButtonStyle } from '~/styles/daisystyles'
import { checkEditedSectionDuplicates, numberOfUsers } from '~/app/api/action/section'
import { error } from 'console'

export default function SectionInfoPage (
    {id, sectionName} : {id: string, sectionName: string}
)
{
    const router = useRouter()
    const inputClassStyle = "input input-bordered"

    const cookieName = useContext(sessionCookieName)
    const token = Cookies.get(cookieName)

    const [name, setName] = useState<string>(sectionName)
    const [errMessage, setErrMessage] = useState<string>("")

    const updateSectionMutation = api.section.changeName.useMutation()
    const deleteSectionMutation = api.section.deleteSection.useMutation()
    const utils = api.useUtils()

    const { data: userData, isLoading } = api.user.getRole.useQuery({token: token ?? ""})


    useEffect(() => {
        if (!isLoading) {
            if (!userData || !token) {
                router.push('/signin')
            }
        }
    }, [isLoading, userData, router])


    function Save() {
        updateSectionMutation.mutate(
            {
                id: id,
                name: name
            },
            {
                onSuccess: (data) => {
                    if (data.resultMessage == "Название обновлено") {
                        utils.section.getSectionList.invalidate()
                        setErrMessage("")
                    }
                    else {
                        setErrMessage(data.resultMessage)
                    }
                },
                onError: (error) => {
                    setErrMessage(JSON.stringify(error))
                }
            }
        )
    }

    function Delete() {
        deleteSectionMutation.mutate(
            {
                id: id
            },
            {
                onSuccess: (data) => {
                    if (data.resultMessage == "Подразделение удалено") {
                        setErrMessage("")
                        utils.section.getSectionList.invalidate()
                        router.push('/section')
                    }
                    else {
                        setErrMessage(data.resultMessage)
                    }
                },
                onError: (error) => {
                    setErrMessage(JSON.stringify(error))
                }
            }
        )
    }


    async function handleSave () {
        if (name.trim() == "") {
            setErrMessage("Имя должно быть заполнено")
        }
        else {
            const nameDuplicates = await checkEditedSectionDuplicates(name, id)

            if (nameDuplicates) {
                setErrMessage("Названия подразделений не должны повторяться")
            }
            else {
                Save()
            }
        }
    }


    async function handleDelete () {
        const users = await numberOfUsers(id)

        if (users > 0) {
            setErrMessage("Нельзя удалить подразделение, в котором есть сотрудники")
        }
        else {
            Delete()
        }
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