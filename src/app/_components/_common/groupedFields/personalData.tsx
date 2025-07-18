import { inputClassStyleCtx} from "~/app/ui/styles"
import { useContext } from "react"
import GroupDiv from "~/app/ui/groupDiv"


export default function PersonalData (
    {surname, name, fathername, surnameChange, nameChange, fathernameChange} :
    {
        surname: string,
        name: string,
        fathername: string,
        surnameChange: (val: string) => void,
        nameChange: (val: string) => void,
        fathernameChange: (val: string) => void
    }
) {
    const inputClass = useContext(inputClassStyleCtx)

    return (
        <GroupDiv>
            <p className="mb-4"><b>Личные данные*</b></p>
            <div>
                <label>Фамилия</label>
                <input
                    type="text"
                    required
                    className= {inputClass + " mt-1 mb-2"}
                    value = {surname}
                    onChange={e => surnameChange(e.target.value)}
                    maxLength={100}
                />
            </div>
            <div>
                <label>Имя</label>
                <input
                    type="text"
                    required
                    className= {inputClass + " mt-1 mb-2"}
                    value = {name}
                    onChange={e => nameChange(e.target.value)}
                    maxLength={100}
                />
            </div>
            <div className = "mt-2">
                <label>Отчество</label>
                <input
                    type="text"
                    required
                    className= {inputClass + " mt-1 mb-2"}
                    value = {fathername}
                    onChange={e => fathernameChange(e.target.value)}
                    maxLength={100}
                />
            </div>
        </GroupDiv>
    )
}