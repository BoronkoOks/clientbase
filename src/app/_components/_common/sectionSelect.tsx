"use client"

import { api } from "~/trpc/react"


export default function SectionSelect (
    {value, onChange, edit = false} : {value: string, onChange: (val: string) => void, edit: boolean})
{
    const {data: sectionsData, isLoading} = api.section.getSectionList.useQuery({query: ""})


    return (
        <>
            <label>Подразделение: </label>
            {
                isLoading ? <>(загрузка...)</>
                :
                <>
                    {
                        edit ?
                        <>
                            <br/>
                            <select
                                value = {value}
                                onChange={e => onChange(e.target.value)}
                                className="mt-2 p-1"
                            >
                                {
                                    value == "" &&
                                    <option key = "" value = "">[не выбрано]</option>
                                }
                                {
                                    sectionsData?.sections.map(s => 
                                        <option key = {s.id} value={s.id}>
                                            {s.name}
                                        </option>
                                    )
                                }
                            </select>
                        </>
                        :
                        <label>{sectionsData && <>{sectionsData.sections.find(s => s.id == value)?.name}</>}</label>
                    }
                </>
            }
            
        </>
    )
}