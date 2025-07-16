export default function EmailInput (
    {email, onChange} : {email: string, onChange: (val: string) => void}
)
{
    const inputClassStyle = "input input-bordered"


    const forbiddenSym = new Set([" ", "!", "\"", "#", "№", "$", ";", "%", ":", "'",
                                    "^", "&", "?", "*", "(", ")", "=", "`", "~", "\\",
                                    "|", "/", ",", "[", "]", "{", "}"])

    function handleChange (newValue: string) {
        let value = ""    

        for (let i = 0; i < newValue.length; i++) {
            let currSym = newValue[i] ?? ""

            if (newValue[i] == "@" && value.includes("@")) { // проверить запрещённые символы
                continue
            }
            else {
                if (!forbiddenSym.has(currSym)) { // убедиться, что @ в адресе будет только одна
                    value += newValue[i]
                }
            }
        }

        onChange(value)
    }

    return (
        <>
            <label>Email</label>
            <input
                type="text"
                className= {inputClassStyle + " mt-1 mb-2"}
                maxLength={200}
                value = {email}
                onChange={(e)=> handleChange(e.target.value)}
            />
        </>
    )
}