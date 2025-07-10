"use client"

import {useState} from "react"
import { User } from "@prisma/client"
import { api } from "~/trpc/react"
import PhoneInput from "~/app/_components/myprofile/phoneInput"
import { updateButtonStyle } from "~/styles/daisystyles"


// добавить проверку на уникальность почты и телефона

export function ProfileInfo ({userdata} : {userdata: User}) {

    const [user, setUser] = useState<User>(userdata)
    const [newPassword, setNewPassword] = useState<string>("")
    const [newPasswordRepeat, setNewPasswordRepeat] = useState<string>("")

    const inputClassStyle = "input input-bordered"
    const divBox = "border-blue-300 border-2 py-2 px-4 rounded-lg"

    const {data: sections, isLoading} = api.section.getSectionList.useQuery({query: ""})

    const [errMessage, setErrMessage] = useState<string>("")

    const updateUserMutation = api.user.updateUser.useMutation()

    function Saving(){
        setErrMessage("")
        setNewPassword("")
        setNewPasswordRepeat("")

        updateUserMutation.mutate(
            {
                id: user.id,
                surname: user.surname,
                name: user.name,
                fathername: user.fathername,
                email: user.email,
                phone: user.phone,
                role: user.role,
                sectionId: user.sectionId,
                password: newPassword.trim().length > 0 ? newPassword : user.password
            }
        )
    }


    function handleSave () {
        if (user.surname.trim() != "" && user.name.trim() != "" && user.fathername.trim() != "" &&
             user.email.trim() != "" && user.phone.length == 16
        )
        {
            if (newPassword.trim().length > 0) {
                if (newPassword != newPasswordRepeat) {
                    setErrMessage("Пароли не совпадают")
                }
                else {
                    Saving()
                }
            }
            else {
                Saving()
            }
        }
        else {
            setErrMessage("Необходимо заполнить обязательные поля")
        }
    }

    return (
        <table>
            <tbody>
                <tr>
                    <td className = "pb-4" colSpan={3}>
                        <div>
                            <label className = "mt-2 mr-4 font-bold inline-block align-middle">Профиль</label>
                            <button type="submit" className={updateButtonStyle + " inline-block"}
                                onClick={() => handleSave()}>
                                    Обновить
                            </button>
                            {
                                errMessage != "" &&
                                <label className = "mt-2 ml-4 inline-block align-middle text-red-700">{errMessage}</label>
                            }
                        </div>
                    </td>
                </tr>
                <tr>
                    <td>
                        <div className = {divBox}>
                            <p className="mb-4"><b>Личные данные*</b></p>
                            <div>
                                <label>Фамилия</label>
                                <input
                                    type="text"
                                    required
                                    className= {inputClassStyle + " mt-1 mb-2"}
                                    value = {user.surname}
                                    onChange={(e)=> setUser({...user, surname: e.target.value})}
                                />
                            </div>
                            <div>
                                <label>Имя</label>
                                <input
                                    type="text"
                                    required
                                    className= {inputClassStyle + " mt-1 mb-2"}
                                    value = {user.name}
                                    onChange={(e)=> setUser({...user, name: e.target.value})}
                                />
                            </div>
                            <div className = "mt-2">
                                <label>Отчество</label>
                                <input
                                    type="text"
                                    required
                                    className= {inputClassStyle + " mt-1 mb-2"}
                                    value = {user.fathername}
                                    onChange={(e)=> setUser({...user, fathername: e.target.value})}
                                />
                            </div>
                         </div>
                    </td>
                    <td className = "pl-6 align-top">
                        <div className = {divBox}>
                            <p className="mb-4"><b>Контактная информация*</b></p>
                            <div>
                                <label className = "mt-2 mr-2">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    required
                                    className= {inputClassStyle + " mt-1 mb-2"}
                                    value = {user.email}
                                    onChange={(e)=> setUser({...user, email: e.target.value})}
                                />
                            </div>
                            <div>
                                <label className = "mt-2 mr-2">Телефон</label>
                                <PhoneInput
                                    phone = {user.phone}
                                    onChange={(newPhone)=> {setUser({...user, phone: newPhone})}}
                                    className={inputClassStyle + " mt-1 mb-2"}
                                />
                            </div>
                            {
                                user.role == "ADMIN" &&
                                <div  className = "mt-4">
                                    <label>Подразделение</label><br/>
                                    {
                                        isLoading ? <div>загрузка...</div>
                                        :
                                        <select
                                            value = {sections ? user.sectionId ?? sections[0]?.id : ""}
                                            onChange={e => setUser({...user, sectionId: e.target.value})}
                                            className="mt-2 p-1"
                                        >
                                            {
                                                sections?.map(s => 
                                                    <option key = {s.id} value={s.id}>
                                                        {s.name}
                                                    </option>
                                                )
                                            }
                                        </select>
                                    }
                                </div>
                             }
                        </div>
                    </td>
                    <td className = "pl-6 align-top">
                        <div className = {divBox}>
                            <p className="mb-4"><b>Сменить пароль</b></p>
                            <div>
                                <label className = "mt-2 mr-2">Новый пароль</label>
                                <input
                                    type="password"
                                    required
                                    className= {inputClassStyle + " mt-1 mb-2"}
                                    value = {newPassword}
                                    onChange={(e)=> setNewPassword(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className = "mt-2 mr-2">Повторите пароль</label>
                                <input
                                    type="password"
                                    required
                                    className= {inputClassStyle + " mt-1 mb-2"}
                                    value = {newPasswordRepeat}
                                    onChange={(e)=> setNewPasswordRepeat(e.target.value)}
                                />
                            </div>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td className="pt-4">
                        <p>* - обязательно к заполнению</p>
                    </td>
                </tr>
            </tbody>
        </table>
    )
}