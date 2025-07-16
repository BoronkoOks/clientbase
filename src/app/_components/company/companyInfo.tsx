import { Company } from "@prisma/client"
import TINField from "./tinField"
import EmailInput from "../_common/emailInput"

export default function CompanyInfo (
    {company, companyChange} :
    {
        company: Company,
        companyChange: (c: Company) => void
    }
)
{
    const inputClassStyle = "input input-bordered"

    return (
        <>
            <div>
                <label>Название</label>
                <input
                    type="text"
                    required
                    className= {inputClassStyle + " mt-1 mb-2"}
                    maxLength={100}
                    value = {company.companyname}
                    onChange={(e)=> companyChange({...company, companyname: e.target.value})}
                />
            </div>
            <div>
                <TINField
                    tin = {company.TIN}
                    onChange = {val => companyChange({...company, TIN: val})}
                />
            </div>
            <div>
                <EmailInput
                    email = {company.email}
                    onChange = {val => companyChange({...company, email: val})}
                />
            </div>
        </>
    )
}