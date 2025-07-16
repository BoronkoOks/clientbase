import { Contact } from "@prisma/client"
import PhoneInput from "../_common/phoneInput"

export default function ContactForm (
    {contact, contactChange} : {contact: Contact, contactChange: (c: Contact) => void}
) {
    const inputClassStyle = "input input-bordered"

    return (
        <>
            <div>
                <label>Фамилия</label>
                <input
                    type="text"
                    required
                    className= {inputClassStyle + " mt-1 mb-2"}
                    value = {contact.surname}
                    onChange={(e)=> contactChange({...contact, surname: e.target.value})}
                />
            </div>
            <div>
                <label>Имя</label>
                <input
                    type="text"
                    required
                    className= {inputClassStyle + " mt-1 mb-2"}
                    value = {contact.name}
                    onChange={(e)=> contactChange({...contact, name: e.target.value})}
                />
            </div>
            <div className = "mt-2">
                <label>Отчество</label>
                <input
                    type="text"
                    required
                    className= {inputClassStyle + " mt-1 mb-2"}
                    value = {contact.fathername}
                    onChange={(e)=> contactChange({...contact, fathername: e.target.value})}
                />
            </div>
            <PhoneInput
                phone = {contact.phone}
                onChange = {val => contactChange({...contact, phone: val})}
            />
        </>
    )
}