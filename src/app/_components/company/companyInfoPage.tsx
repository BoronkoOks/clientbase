"use client"

import { useEffect, useState, useContext} from 'react'
import { api } from "~/trpc/react"
import Cookies from 'js-cookie'
import { useRouter } from "next/navigation"
import { sessionCookieName } from '../../api/context/contextVariables'
import SearchInput from '~/app/ui/searchInput'
import { deleteButtonStyle, updateButtonStyle } from '~/styles/daisystyles'
import CompanyInfo from './companyInfo'
import { Company, Contact } from '@prisma/client'
import GroupDiv from '~/app/ui/groupDiv'
import { checkEditedEmailDuplicates, checkEditedTINDuplicates } from '~/app/api/action/company'
import ContactsTable from './contactsRelated/contactsTable'
import ContactForm from './contactsRelated/contactForm'
import Link from 'next/link'

export default function CompanyInfoPage (
    {companyInf} : {companyInf: Company}
)
{
    const router = useRouter()

    const cookieName = useContext(sessionCookieName)
    const token = Cookies.get(cookieName)

    const [company, setCompany] = useState<Company>(companyInf)
    const [errMessage, setErrMessage] = useState<string>("")

    const updateCompanyMutation = api.company.updateCompany.useMutation()
    const deleteCompanyMutation = api.company.deleteCompany.useMutation()
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
        updateCompanyMutation.mutate(
            {
                id: company.id,
                companyname: company.companyname,
                TIN: company.TIN,
                email: company.email
            },
            {
                onSuccess: (data) => {
                    if (data.resultMessage == "Успешно") {
                        utils.company.getCompanyList.invalidate()
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
        deleteCompanyMutation.mutate(
            {
                id: company.id
            },
            {
                onSuccess: (data) => {
                    if (data.resultMessage == "Успешно") {
                        setErrMessage("Клиент удалён")
                        utils.company.getCompanyList.invalidate()
                        router.push('/company')
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
        if (company.companyname.trim() == "" || company.TIN.length == 0 || company.email.length == 0) {
            setErrMessage("Необходимо заполнить все поля")
        }
        else {
            if (company.TIN.length < 12) {
                setErrMessage("ИНН должен состоять из 12 цифр")
            }
            else {
                const TINduplicates= await checkEditedTINDuplicates(company.TIN, company.id)

                if (TINduplicates) {
                    setErrMessage("ИНН клиентов не должны повторяться")
                }
                else {
                    const emailDuplicates = await checkEditedEmailDuplicates(company.email, company.id)

                    if (emailDuplicates) {
                        setErrMessage("email клиентов не должны повторяться")
                    }
                    else {
                        Save()
                    }
                }
            }
        }
    }


    async function handleDelete () {
        if (errMessage != "Точно удалить?") {
            setErrMessage("Точно удалить?")
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
                                Компания
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
                        <GroupDiv>
                            <CompanyInfo
                                company = {company}
                                companyChange = {setCompany}
                            />
                        </GroupDiv>
                    </td>
                    <td className = "align-top pl-14">
                        <div className = "mb-4">
                            <label className = "mt-2 mr-4 inline-block align-middle">Контакты</label>
                            <Link href = {"/contact/new?company="+company.id}
                                className = "btn bg-blue-400 border-2 border-blue-600 mt-3 hover:text-gray-50 hover:bg-blue-600">
                                    Добавить
                            </Link>
                        </div>
                        <SearchInput placeholder = "Поиск по фамилии или телефону" />
                        <ContactsTable companyId = {company.id} edit = {userData == "ADMIN"} />
                    </td>
                </tr>
            </tbody>
        </table>
    )
}