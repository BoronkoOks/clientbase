import PhoneInput from "./phoneInput"
import SectionSelect from "./sectionSelect"
import GroupDiv from "~/app/ui/groupDiv"
import { useContext } from "react"
import {inputClassStyleCtx} from "~/app/ui/styles"


export default function ContactInfo (
    {email, phone, sectionId, edit = false, emailChange, phoneChange, sectionChange} :
    {
        email: string,
        phone: string,
        sectionId: string,
        edit: boolean,
        emailChange: (val: string) => void,
        phoneChange: (val: string) => void,
        sectionChange: (val: string) => void
    }
)
{
    const inputClassStyle = useContext(inputClassStyleCtx)

    return (
        <GroupDiv>
            <p className="mb-4"><b>Контактная информация*</b></p>
            <div>
                <label className = "mt-2 mr-2">Email</label>
                <input
                    type="email"
                    required
                    className= {inputClassStyle + " mt-1 mb-2"}
                    value = {email}
                    onChange={(e)=> emailChange(e.target.value)}
                />
            </div>
            <div>
                <label className = "mt-2 mr-2">Телефон</label>
                <PhoneInput
                    phone = {phone}
                    onChange={phoneChange}
                    className={inputClassStyle + " mt-1 mb-2"}
                />
            </div>
            <div  className = "mt-4">
                <SectionSelect
                    value = {sectionId}
                    onChange={sectionChange}
                    edit = {edit}
                />
            </div>
        </GroupDiv>
    )
}