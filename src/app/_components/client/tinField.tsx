export default function TINField (
    {tin, onChange} : {tin: string, onChange: (val: string) => void}
)
{
    const inputClassStyle = "input input-bordered"

    function handleChange (newValue: string) {
        let value = ""

        for (let i = 0; i < newValue.length; i++) {
            if (i >= 12) {
                break
            }

            if (Number(newValue[i]) || newValue[i] == "0") {
                value += newValue[i]
            }
        }

        onChange(value)
    }

    return (
        <>
            <label>ИНН</label>
            <input
                type="text"
                className= {inputClassStyle + " mt-1 mb-2"}
                value = {tin}
                onChange={(e)=> handleChange(e.target.value)}
            />
        </>
    )
}