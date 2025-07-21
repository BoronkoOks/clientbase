"use client"

import { useState, useContext } from "react"
import {PlusIcon} from "@heroicons/react/16/solid"
import { api } from "~/trpc/react"
import { Company } from "@prisma/client"
import { checkTINDuplicates, checkEmailuplicates } from "~/app/api/action/company"
import CompanyInfo from "./companyInfo"
import { regularButtonStyleCtx } from "~/app/ui/styles"
import DropDown from "~/app/_components/_common/dropDown"
import ErrLabel from "~/app/_components/_common/errLabel"


export default function AddCompany() {
    const [company, setCompany] = useState<Company>({
        id: "",
        companyname: "",
        TIN: "",
        email: ""
    })

    const [errMessage, setErrMessage] = useState<string>("")

    const addButtonClass = useContext(regularButtonStyleCtx)

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
        <DropDown
            headerElements={
                <>
                    <PlusIcon className = "w-5" />
                    <label>Добавить</label>
                </>
            }
            hiddenElements={
                <>
                    <CompanyInfo
                        company = {company}
                        companyChange = {setCompany}
                    />
                    {
                        errMessage != "" && <ErrLabel message = {errMessage} />
                    }
                    {
                        company.id == "" &&
                        <div className = "mb-1">
                            <button className={addButtonClass + " w-full"} onClick={handleAdd}>
                                Добавить
                            </button>
                        </div>
                    }
                </>
            }
        />
    )
}