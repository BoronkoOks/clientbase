import { Contact } from "@prisma/client"
import PhoneInput from "~/app/_components/_common/fields/phoneInput"
import PersonalData from "~/app/_components/_common/groupedFields/personalData"
import GroupDiv from "~/app/ui/groupDiv"


export default function ContactForm (
    {contact, contactChange} : {contact: Contact, contactChange: (c: Contact) => void}
) {
    return (
        <table>
            <tbody>
                <tr>
                    <td>
                        <PersonalData
                            surname = {contact.surname}
                            name = {contact.name}
                            fathername = {contact.fathername}
                            surnameChange={val => contactChange({...contact, surname: val})}
                            nameChange={val => contactChange({...contact, name: val})}
                            fathernameChange={val => contactChange({...contact, fathername: val})}
                        />
                    </td>
                    <td className = "pl-6 align-top">
                        <GroupDiv>
                            <div className='mb-2'>
                                <p className="mb-4"><b>Телефон*</b></p>
                                <PhoneInput
                                    phone = {contact.phone}
                                    onChange = {val => contactChange({...contact, phone: val})}
                                />
                            </div>
                        </GroupDiv>
                    </td>
                </tr>
            </tbody>
        </table>
    )
}