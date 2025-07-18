import { inputClassStyleCtx } from "~/app/ui/styles"
import { useContext } from "react"
import GroupDiv from "~/app/ui/groupDiv"


export default function PasswordChange(
    {newPassword, newPasswordRepeat, newPasswordChange, newPasswordRepeatChange} :
    {
        newPassword: string,
        newPasswordRepeat: string,
        newPasswordChange: (val: string) => void,
        newPasswordRepeatChange: (val: string) => void
    }
)
{
    const inputClassStyle = useContext(inputClassStyleCtx)
    
    return (
        <GroupDiv className = " w-80">
            <p className="mb-4"><b>Сменить пароль</b></p>
            <div>
                <label className = "mt-2 mr-2">Новый пароль</label>
                <input
                    type="password"
                    required
                    className= {inputClassStyle + " mt-1 mb-2"}
                    value = {newPassword}
                    onChange={(e)=> newPasswordChange(e.target.value)}
                />
            </div>
            <div>
                <label className = "mt-2 mr-2">Повторите пароль</label>
                <input
                    type="password"
                    required
                    className= {inputClassStyle + " mt-1 mb-2"}
                    value = {newPasswordRepeat}
                    onChange={(e)=> newPasswordRepeatChange(e.target.value)}
                />
            </div>
        </GroupDiv>
    )
}
