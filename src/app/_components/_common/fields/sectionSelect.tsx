"use client"

import { useState, useEffect } from "react"
import { Section } from "@prisma/client"
import {getSectionById, getSectionList} from "~/app/api/action/section"


export default function SectionSelect (
{ value, onChange, edit = false} :
{
    value: string,
    onChange: (val: string) => void,
    edit: boolean}
)
{
    const [sections, setSections] = useState<Section[]>([])


    useEffect(() => {
        async function getSections () {
            if (edit) {
                const sectionsList = await getSectionList()

                setSections(sectionsList)
            }
            else {
                const section = await getSectionById(value)

                if (section) {
                    setSections([section])
                }
            }
        }

        getSections()
    }, [])


    return (
        <div>
            <label>Подразделение: </label>
            {
                edit ?
                <>
                    <br/>
                    <select
                        value = {value}
                        onChange={e => onChange(e.target.value)}
                        className="mt-1 px-1 py-2"
                    >
                        {
                            value == "" &&
                            <option key = "" value = "">[не выбрано]</option>
                        }
                        {
                            sections.map(s => 
                                <option key = {s.id} value={s.id}>
                                    {s.name}
                                </option>
                            )
                        }
                    </select>
                </>
                :
                <label>
                    {sections.find(s => s.id == value)?.name ?? "..."}
                </label>
            }
        </div>
    )
}