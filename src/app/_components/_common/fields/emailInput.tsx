import { useContext } from "react"
import { inputClassStyleCtx } from "~/app/ui/styles"

export default function EmailInput (
    {email, onChange} : {email: string, onChange: (val: string) => void}
)
{
    const inputClassStyle = useContext(inputClassStyleCtx)

    const forbiddenSym = new Set([" ", "!", "\"", "#", "№", "$", ";", "%", ":", "'",
                                    "^", "&", "?", "*", "(", ")", "=", "`", "~", "\\",
                                    "|", "/", ",", "[", "]", "{", "}"])

    function handleChange (newValue: string) {
        let value = ""    

        for (let i = 0; i < newValue.length; i++) {
            let currSym = newValue[i] ?? ""

            if (newValue[i] == "@" && value.includes("@")) { // убедиться, что @ в адресе будет только одна
                continue
            }
            else {
                if (!forbiddenSym.has(currSym)) { // проверить запрещённые символы
                    value += newValue[i]
                }
            }
        }

        onChange(value)
    }

    
    return (
        <div>
            <label>Email</label>
            <input
                type="text"
                className= {inputClassStyle + " mt-1 mb-2"}
                maxLength={200}
                value = {email}
                onChange={(e)=> handleChange(e.target.value)}
            />
        </div>
    )
}