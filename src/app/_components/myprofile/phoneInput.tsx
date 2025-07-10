"use client"

import { ChangeEvent } from "react"
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

    function handleChange(e: ChangeEvent<HTMLInputElement>) {
        const newValue = e.target.value

        let value = "+"

        for (let i = 1; i < newValue.length; i++) {
            if (i >= 16) {
                break
            }

            const valLen = value.length

            if (valLen == 2 || valLen == 6 || valLen == 10 || valLen == 13) {
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
        onChange={e => handleChange(e)}
        className = {className}
        placeholder = "+9-999-999-99-99"
    />
  )
}

