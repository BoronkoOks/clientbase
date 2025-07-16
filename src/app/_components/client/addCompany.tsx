"use client"

import { useState } from "react"
import GroupDiv from "~/app/ui/groupDiv"
import {PlusIcon} from "@heroicons/react/16/solid"
import { updateButtonStyle } from "~/styles/daisystyles"
import { api } from "~/trpc/react"
import { Company } from "@prisma/client"
import TINField from "./tinField"
import EmailInput from "../_common/emailInput"
import { checkTINDuplicates, checkEmailuplicates } from "~/app/api/action/company"

export default function AddCompany() {
    const [company, setCompany] = useState<Company>({
        id: "",
        companyname: "",
        TIN: "",
        email: ""
    })

    const [errMessage, setErrMessage] = useState<string>("")

    const inputClassStyle = "input input-bordered"

    const addCompanyMutation = api.company.createCompany.useMutation()
    const utils = api.useUtils()


    function Add () {
        addCompanyMutation.mutate(
            {
                companyname: company.companyname,
                TIN: company.TIN,
                email: company.email
            },
            {
                onSuccess: (data) => {
                    if (data.resultMessage == "Успешно") {
                        utils.company.getCompanyList.invalidate()
                        setErrMessage("")

                        setCompany({
                            id: "",
                            companyname: "",
                            TIN: "",
                            email: ""
                        })
                    }
                    else {
                        setErrMessage(data.resultMessage)
                    }
                }
            }
        )
    }


    async function handleAdd () {
        if (company.companyname.trim() == "" || company.TIN.length == 0 || company.email.length == 0) {
            setErrMessage("Необходимо заполнить все поля")
        }
        else {
            if (company.TIN.length < 12) {
                setErrMessage("ИНН должен состоять из 12 цифр")
            }
            else {
                const TINexisits = await checkTINDuplicates(company.TIN)

                if (TINexisits) {
                    setErrMessage("Клиент с таким ИНН уже существует")
                }
                else {
                    const emailExists = await checkEmailuplicates(company.email)

                    if (emailExists) {
                        setErrMessage("Клиент с таким email уже существует")
                    }
                    else {
                        Add()
                    }
                }
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
                            maxLength={100}
                            value = {company.companyname}
                            onChange={(e)=> setCompany({...company, companyname: e.target.value})}
                        />
                    </div>
                    <div>
                        <TINField
                            tin = {company.TIN}
                            onChange = {val => setCompany({...company, TIN: val})}
                        />
                    </div>
                    <div>
                        <EmailInput
                            email = {company.email}
                            onChange = {val => setCompany({...company, email: val})}
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