"use client"

import { useEffect, useContext, useState} from 'react'
import { api } from "~/trpc/react"
import Cookies from 'js-cookie'
import { sessionCookieName } from '../../api/context/contextVariables'
import { updateButtonStyle } from '~/styles/daisystyles'
import { Contact } from '@prisma/client'
import { useRouter, useSearchParams } from "next/navigation"
import {checkPhoneDuplicates} from "~/app/api/action/contact"
import ContactForm from './contactForm'

export default function NewContactPage (
{ companyname } : {companyname: string}
)
{
    const searchParams = useSearchParams()
    const companyId = searchParams.get("company") || ""

    const [contact, setContact] = useState<Contact>({
        id: "",
        surname: "",
        name: "",
        fathername: "",
        phone: "",
        companyID: companyId
    })

    const [errMessage, setErrMessage] = useState<string>("")
    const router = useRouter()

    const cookieName = useContext(sessionCookieName)

    const { data: userData, isLoading } = api.user.getRole.useQuery({token: Cookies.get(cookieName) ?? ""})

    const createContactMutation = api.contact.createContact.useMutation()
    const utils = api.useUtils()


    useEffect(() => {
        if (!isLoading) {
            if (!userData) {
                router.push('/')
            }
        }
    }, [isLoading, userData, router])


    function Add() {
        createContactMutation.mutate(
            {
                surname: contact.surname,
                name: contact.name,
                fathername: contact.fathername,
                phone: contact.phone,
                companyId: contact.companyID
            },
            {
                onSuccess: () => {
                    setErrMessage("")
                    utils.company.getContactList.invalidate()
                    router.push("/company/"+companyId)
                },
                onError: (error) => {
                    setErrMessage(JSON.stringify(error))
                }
            }
        )
    }



    async function handleAdd () {
        if (contact.surname.trim() == "" || contact.name.trim() == "" || contact.fathername.trim() == ""
            || contact.phone.length < 15)
        {
            setErrMessage("Все поля должны быть заполнены")
        }
        else {
            const phoneExists = await checkPhoneDuplicates(contact.phone, contact.companyID)

            if (phoneExists) {
                setErrMessage("Контакт с таким телефоном уже существует")
            }
            else {
                Add()
            }
        }
    }


    if (companyname == "") {
        return <div>Клиент не найден</div>
    }

    
    if (isLoading) {
        return <div>загрузка...</div>
    }

    if (userData != "ADMIN") {
        return <div>403 Forbidden</div>
    }

    


    return (
        <table>
            <tbody>
                <tr>
                    <td className = "pb-4">
                        <div>
                            <label className = "mt-2 mr-4 font-bold inline-block align-middle">Новый контакт для "{companyname}"</label>
                            <button type="submit" className={updateButtonStyle + " inline-block"}
                                onClick={() => handleAdd()}>
                                    Добавить
                            </button>
                            {
                                errMessage != "" &&
                                <label className = "mt-3 ml-4 inline-block align-middle text-red-700">{errMessage}</label>
                            }
                        </div>
                    </td>
                </tr>
                <tr>
                    <td>
                        <ContactForm
                            contact = {contact}
                            contactChange = {setContact}
                        />
                    </td>
                </tr>
            </tbody>
        </table>
    )
}