"use client"

import { useEffect, useState, useContext} from 'react'
import { api } from "~/trpc/react"
import { useRouter } from "next/navigation"
import SectionUserTable from './usersRelated/sectionUserTable'
import SearchInput from '~/app/ui/searchInput'
import { checkEditedSectionDuplicates, getSectionById, numberOfUsers } from '~/app/api/action/section'
import { inputClassStyleCtx, regularButtonStyleCtx, labelInlineBlockStyleCtx } from '~/app/ui/styles'
import { Err_404 } from '~/app/_components/_common/errorMessages'
import DeleteButton from "~/app/_components/_common/deleteButton"
import ErrLabel from "~/app/_components/_common/errLabel"
import DropDown from "../_common/dropDown"
import { ArrowLongDownIcon } from '@heroicons/react/24/outline'
import GroupDiv from '~/app/ui/groupDiv'


export default function SectionInfo ({id} : {id: string}){
    const router = useRouter()

    const inputClassStyle = useContext(inputClassStyleCtx)
    const updateStyle = useContext(regularButtonStyleCtx)
    const labelHeaderClass = useContext(labelInlineBlockStyleCtx)

    const [name, setName] = useState<string>("")
    const [errMessage, setErrMessage] = useState<string>("")
    const [isLoading, setIsLoading] = useState<boolean>(true)

    const updateSectionMutation = api.section.changeName.useMutation()
    const deleteSectionMutation = api.section.deleteSection.useMutation()
    const utils = api.useUtils()


    useEffect(() => {
        async function GetSectionName() {
            const section = await getSectionById(id)

            if (section) {
                setName(section.name)
            }
            else {
                setErrMessage("Подразделение не найдено")
            }

            setIsLoading(false)
        }
        
        GetSectionName()
    }, [])


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
    
    if (errMessage == "Подразделение не найдено") {
        return <Err_404 message = {errMessage} />
    }


    return (
        <table>
            <tbody>
                <tr>
                    <td className = "align-top">
                        <div>
                            <label className = {labelHeaderClass}>
                                Подразделение
                            </label>
                            <button type="submit" className={updateStyle + " inline-block"} onClick={() => handleSave()}>
                                Обновить
                            </button>
                            <DeleteButton
                                onClick = {handleDelete}
                                className = "mt-3 ml-4 inline-block"
                            />
                        </div>
                    </td>
                    <td>
                        {
                            errMessage != "" && <ErrLabel message = {errMessage} className="ml-4" />
                        }
                    </td>
                </tr>
                <tr>
                    <td className = "align-top pt-4">
                        <GroupDiv>
                            <p className = "mr-2 pb-4">Название</p>
                            <input
                                type="text"
                                required
                                className= {inputClassStyle + " mt-1 mb-2"}
                                value = {name}
                                onChange={(e)=> setName(e.target.value)}
                            />
                        </GroupDiv>
                    </td>
                    <td className = "align-top pt-4 pl-6">
                        <DropDown
                            headerElements={
                                <>
                                    <label>Сотрудники</label>
                                    <ArrowLongDownIcon className = "w-6" />
                                </>
                            }
                            hiddenElements={
                                <>
                                    <SearchInput placeholder = "Поиск по фамилии, email или телефону" />
                                    <SectionUserTable sectionId = {id} />
                                </>
                            }
                        />
                    </td>
                </tr>
            </tbody>
        </table>
    )
}