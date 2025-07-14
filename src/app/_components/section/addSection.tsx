"use client"

import { useState } from "react"
import GroupDiv from "~/app/ui/groupDiv"
import {PlusIcon} from "@heroicons/react/16/solid"
import { updateButtonStyle } from "~/styles/daisystyles"
import {checkSectionDuplicates} from "~/app/api/action/section"
import { api } from "~/trpc/react"

export default function AddSection() {
    const [section, setSection] = useState<string>("")
    const [errMessage, setErrMessage] = useState<string>("")

    const inputClassStyle = "input input-bordered"

    const addSectionMutation = api.section.createSection.useMutation()
    const utils = api.useUtils()

    async function handleAdd () {
        if (section.trim() == "") {
            setErrMessage("Укажите название")
        }
        else {
            const sectionExists = await checkSectionDuplicates(section)

            if (sectionExists) {
                setErrMessage("Подразделение уже существует")
            }
            else {
                addSectionMutation.mutate(
                    {
                        name: section
                    },
                    {
                        onSuccess: () => {
                            utils.section.getSectionList.invalidate()
                            setErrMessage("")
                            setSection("")
                        },
                        onError(error, variables, context) {
                            setErrMessage(JSON.stringify(error))
                        },
                    }
                )
            }
        }
    }


    return (
        <GroupDiv>
            <details className = "collapse" tabIndex={0}>
                <summary className = "collapse-title">
                    <div className = "flex -ml-2">
                        <PlusIcon className = "w-5" />
                        <label>Добавить</label>
                    </div>
                </summary>
                <div className = "mb-2 mx-2 overscroll-x-contain">
                    <div>
                        <label>Название</label>
                        <input
                            type="text"
                            required
                            className= {inputClassStyle + " mt-1 mb-2"}
                            value = {section}
                            onChange={(e)=> setSection(e.target.value)}
                        />
                    </div>
                    {
                        errMessage != "" &&
                        <label className = "mt-2 inline-block align-middle text-red-700">{errMessage}</label>
                    }
                    <div className = "mb-1">
                        <button className={updateButtonStyle + " w-full"} onClick={handleAdd}>
                            Добавить
                        </button>
                    </div>
                </div>
            </details>
        </GroupDiv>
    )
}