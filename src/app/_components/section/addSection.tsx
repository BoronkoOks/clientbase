"use client"

import { useState, useContext } from "react"
import GroupDiv from "~/app/ui/groupDiv"
import {PlusIcon} from "@heroicons/react/16/solid"
import {checkSectionDuplicates} from "~/app/api/action/section"
import { api } from "~/trpc/react"
import { regularButtonStyleCtx, inputClassStyleCtx } from "~/app/ui/styles"
import ErrLabel from "../_common/errLabel"
import DropDown from "../_common/dropDown"


export default function AddSection() {
    const [section, setSection] = useState<string>("")
    const [errMessage, setErrMessage] = useState<string>("")

    const inputClassStyle = useContext(inputClassStyleCtx)
    const addButtonClass = useContext(regularButtonStyleCtx)

    const addSectionMutation = api.section.createSection.useMutation()
    const utils = api.useUtils()


    function Add() {
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
                onError(error) {
                    setErrMessage(JSON.stringify(error))
                },
            }
        )
    }


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
                Add()
            }
        }
    }


    return (
        <DropDown
            headerElements = {
                <>
                    <PlusIcon className = "w-5" />
                    <label>Добавить</label>
                </>
            }
            hiddenElements = {
                <>
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
                        errMessage != "" && <ErrLabel message = {errMessage} className = "ml-0"/>
                    }
                    <div className = "mb-1">
                        <button className={addButtonClass + " w-full"} onClick={handleAdd}>
                            Добавить
                        </button>
                    </div>
                </>
            }
        />
    )
}