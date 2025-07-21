"use client"

import { useEffect, useContext, useState} from 'react'
import { api } from "~/trpc/react"
import Cookies from 'js-cookie'
import { sessionCookieName } from '~/app/api/context/contextVariables'
import { Contact } from '@prisma/client'
import { useRouter, useSearchParams, useParams } from "next/navigation"
import {checkEditedPhoneDuplicates, loadContactData} from "~/app/api/action/contact"
import ContactForm from './contactForm'
import { Err_403, Err_404 } from '~/app/_components/_common/errorMessages'
import { regularButtonStyleCtx, labelInlineBlockStyleCtx } from '~/app/ui/styles'
import ErrLabel from '~/app/_components/_common/errLabel'


export default function EditContactPage (
    { companyname } : { companyname: string}
)
{
    const searchParams = useSearchParams()
    const companyId = searchParams.get("company") || ""
    const params = useParams()
    const id = String(params.id) ?? ""

    const [contact, setContact] = useState<Contact>({
        id: id,
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

    const updateContactMutation = api.contact.updateContact.useMutation()
    const utils = api.useUtils()

    const updateButtonClass = useContext(regularButtonStyleCtx)
    const labelHeaderClass = useContext(labelInlineBlockStyleCtx)


    useEffect(() => {
        async function LoadContactData() {
            const contactData = await loadContactData(id)

            if (contactData) {
                setContact(contactData)
            }
            else {
                setErrMessage("Контакт не найден")
            }
        }

        LoadContactData()
    }, [])


    useEffect(() => {
        if (!isLoading) {
            if (!userData) {
                router.push('/signin')
            }
        }
    }, [isLoading, userData, router])


    function Save() {
        updateContactMutation.mutate(
            {
                id: contact.id,
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
                },
                onError: (error) => {
                    setErrMessage(JSON.stringify(error))
                }
            }
        )
    }


    async function handleSave() {
        if (errMessage != "Контакт не найден") {
            if (contact.surname.trim() == "" || contact.name.trim() == "" || contact.fathername.trim() == ""
                || contact.phone.length < 15)
            {
                setErrMessage("Все поля должны быть заполнены")
            }
            else {
                const phoneExists = await checkEditedPhoneDuplicates(contact.phone, contact.companyID, contact.id)

                if (phoneExists) {
                    setErrMessage("Контакт с таким телефоном уже существует")
                }
                else {
                    Save()
                }
            }
        }
    }


    if (errMessage == "Контакт не найден") {
        return <Err_404 message = "Контакт не найден" />
    }

    if (isLoading) {
        return <div>загрузка...</div>
    }

    if (userData != "ADMIN") {
        return <Err_403 />
    }

    
    return (
        <table>
            <tbody>
                <tr>
                    <td className = "pb-4">
                        <div>
                            <label className = {labelHeaderClass}>Редактирование контакта для "{companyname}"</label>
                            <button type="submit" className={updateButtonClass + " inline-block"}
                                onClick={() => handleSave()}>
                                    Сохранить
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