"use client"

import { useEffect, useContext, useState} from 'react'
import { api } from "~/trpc/react"
import Cookies from 'js-cookie'
import { sessionCookieName } from '~/app/api/context/contextVariables'
import { Contact } from '@prisma/client'
import { useRouter, useSearchParams } from "next/navigation"
import {checkPhoneDuplicates} from "~/app/api/action/contact"
import ContactForm from './contactForm'
import { regularButtonStyleCtx, labelInlineBlockStyleCtx } from '~/app/ui/styles'
import { Err_403 } from '~/app/_components/_common/errorMessages'
import ErrLabel from '~/app/_components/_common/errLabel'


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

    const { data: userRole, isLoading } = api.user.getRole.useQuery({token: Cookies.get(cookieName) ?? ""})

    const createContactMutation = api.contact.createContact.useMutation()
    const utils = api.useUtils()

    const updateButtonClass = useContext(regularButtonStyleCtx)
    const labedHeaderClass = useContext(labelInlineBlockStyleCtx)


    useEffect(() => {
        if (!isLoading) {
            if (!userRole) {
                router.push('/signin')
            }
        }
    }, [isLoading, userRole, router])


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

    
    if (isLoading) {
        return <div>загрузка...</div>
    }

    if (userRole != "ADMIN") {
        return <Err_403 />
    }

    
    return (
        <table>
            <tbody>
                <tr>
                    <td className = "pb-4">
                        <div>
                            <label className = {labedHeaderClass}>Новый контакт для "{companyname}"</label>
                            <button type="submit" className = {updateButtonClass + " inline-block"}
                                onClick={() => handleAdd()}>
                                    Добавить
                            </button>
                            {
                                errMessage != "" && <ErrLabel message = {errMessage} className = "ml-4" />
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