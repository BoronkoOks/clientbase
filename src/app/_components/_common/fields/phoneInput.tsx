"use client"

import { useContext } from "react"
import { inputClassStyleCtx } from "~/app/ui/styles"


export default function PhoneInput (
    {phone, onChange} : {phone: string, onChange: (e: any) => void}
)
{
    const inputClass = useContext(inputClassStyleCtx)


    function handleChange(newValue: string) {
        let value = ""

        for (let i = 0; i < newValue.length; i++) {
            if (i >= 15) {
                break
            }

            const valLen = value.length

            if (valLen == 1 || valLen == 5 || valLen == 9 || valLen == 12) {
                if (newValue[i] != "-") {
                    value += "-"
                }
            }
            else {
                if (newValue[i] == "-") {
                    continue
                }
            }

            if (Number(newValue[i]) || newValue[i] == "0") {
                value += newValue[i]
            }
        }

        onChange(value)
    }


  return (
    <input
        value = {phone}
        onChange={e => handleChange(e.target.value)}
        className = {inputClass + " mt-1 mb-1"}
        placeholder = "9-999-999-99-99"
    />
  )
}
