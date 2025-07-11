"use client"

import { useState } from "react"


export default function PhoneInput ({phone, onChange, className = ""}:
    {
        phone: string,
        onChange: (e:any) => void,
        className?: string
    }
)
{
    const [phoneValue, setPhoneValue] = useState<string>(phone)

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

        setPhoneValue(value)
        onChange(value)
    }


  return (
    <input
        value = {phoneValue}
        onChange={e => handleChange(e.target.value)}
        className = {className}
        placeholder = "9-999-999-99-99"
    />
  )
}

