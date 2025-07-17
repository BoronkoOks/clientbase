import { Contact } from "@prisma/client"
import PhoneInput from "../_common/phoneInput"
import PersonalData from "../_common/personalData"
import GroupDiv from "~/app/ui/groupDiv"
import { useContext } from "react"
import { inputClassStyleCtx } from "~/app/ui/styles"

export default function ContactForm (
    {contact, contactChange} : {contact: Contact, contactChange: (c: Contact) => void}
) {
    const inputClassStyle = useContext(inputClassStyleCtx)

    return (
        <table>
            <tbody>
                <tr>
                    <td>
                        <div className='max-w-80'>
                            <PersonalData
                                surname = {contact.surname}
                                name = {contact.name}
                                fathername = {contact.fathername}
                                surnameChange={val => contactChange({...contact, surname: val})}
                                nameChange={val => contactChange({...contact, name: val})}
                                fathernameChange={val => contactChange({...contact, fathername: val})}
                            />
                        </div>
                    </td>
                    <td className = "pl-6 align-top">
                        <GroupDiv>
                            <div className='mb-2'>
                                <p className="mb-4"><b>Телефон*</b></p>
                                <PhoneInput
                                    phone = {contact.phone}
                                    onChange = {val => contactChange({...contact, phone: val})}
                                    className = {inputClassStyle}
                                />
                            </div>
                        </GroupDiv>
                    </td>
                    <td></td>
                </tr>
            </tbody>
        </table>
    )
}