"use client"

import {useState} from "react"
import { User } from "@prisma/client"
import { api } from "~/trpc/react"
import { updateButtonStyle } from "~/styles/daisystyles"
import PersonalData from "../_common/personalData"
import ContactInfo from "../_common/contactInfo"
import PasswordChange from "../_common/passwordChange"
import {checkEditedEmailDuplicates, checkEditedPhoneDuplicates} from "~/app/api/action/user"
import { usePathname, useRouter, useSearchParams } from "next/navigation"


// добавить проверку на уникальность почты и телефона

export function ProfileInfo (
    {userdata, editSection = false, pageName = "?"} : 
    {
        userdata: User,
        editSection: boolean,
        pageName?: string
    }
)
{

    const deleteButtonStyle = "btn bg-red-500 border-2 border-red-800 hover:text-gray-50 hover:bg-red-700"

    const [user, setUser] = useState<User>(userdata)
    const [newPassword, setNewPassword] = useState<string>("")
    const [newPasswordRepeat, setNewPasswordRepeat] = useState<string>("")

    const [errMessage, setErrMessage] = useState<string>("")

    const updateUserMutation = api.user.updateUser.useMutation()
    const deleteUserMutation = api.user.deleteUser.useMutation()
    const utils = api.useUtils()
    const router = useRouter()

    function Saving(){
        setNewPassword("")
        setNewPasswordRepeat("")

        if (errMessage != "Сотрудник удалён") {
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
                },
                {
                    onSuccess: () => {
                        utils.user.getMyProfile.invalidate()
                        utils.user.getById.invalidate()
                        setErrMessage("")
                    },
                    onError(error, variables, context) {
                        setErrMessage(JSON.stringify(error))
                    },
                }
            )
        }

        
    }


    async function handleSave () {
        if (user.surname.trim() != "" && user.name.trim() != "" && user.fathername.trim() != "" &&
             user.email.trim() != "" && user.phone.length == 15
        )
        {
            const emailDuplicates = await checkEditedEmailDuplicates(user.email, user.id)

            if (emailDuplicates) {
                setErrMessage("Данный email зарегистрирован на другого пользователя")
            }
            else {
                const phoneDuplicates = await checkEditedPhoneDuplicates(user.phone, user.id)

                if (phoneDuplicates) {
                    setErrMessage("Данный телефон зарегистрирован на другого пользователя")
                }
                else {
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
            }
        }
        else {
            setErrMessage("Необходимо заполнить обязательные поля")
        }
    }


    function handleDelete () {
        if (errMessage != "Точно удалить?") {
            setErrMessage("Точно удалить?")
        }
        else {
            deleteUserMutation.mutate(
                {
                    id: user.id
                },
                {
                    onSuccess: () => {
                        utils.user.getUserList.invalidate()
                        setErrMessage("Сотрудник удалён")
                        router.push("/user")
                    },
                    onError(error, variables, context) {
                        setErrMessage(JSON.stringify(error))
                    },
                }
            )
            
        }
    }


    return (
        <table>
            <tbody>
                <tr>
                    <td className = "pb-4" colSpan={3}>
                        <div>
                            <label className = "mt-2 mr-4 font-bold inline-block align-middle">
                                {pageName}
                            </label>
                            <button type="submit" className={updateButtonStyle + " inline-block"}
                                onClick={() => handleSave()}>
                                    Обновить
                            </button>
                            {
                                pageName == "Сотрудник" &&
                                <button type="submit" className={deleteButtonStyle + " mt-3 ml-4 inline-block"}
                                    onClick={() => handleDelete()}
                                    >
                                        Удалить
                                </button>
                            }
                            
                            {
                                errMessage != "" &&
                                <label className = "mt-2 ml-6 inline-block align-middle text-red-700">{errMessage}</label>
                            }
                        </div>
                    </td>
                </tr>
                <tr>
                    <td>
                        <PersonalData
                            surname = {user.surname}
                            name = {user.name}
                            fathername = {user.fathername}
                            surnameChange={val => setUser({...user, surname: val})}
                            nameChange={val => setUser({...user, name: val})}
                            fathernameChange={val => setUser({...user, fathername: val})}
                        />
                    </td>
                    <td className = "pl-6 align-top">
                        <ContactInfo 
                            email = {user.email}
                            phone = {user.phone}
                            sectionId = {user.sectionId}
                            edit = {editSection}
                            emailChange = {val => setUser({...user, email: val})}
                            phoneChange = {val => setUser({...user, phone: val})}
                            sectionChange = {val => setUser({...user, sectionId: val})}
                        />
                    </td>
                    <td className = "pl-6 align-top">
                        <PasswordChange 
                            newPassword = {newPassword}
                            newPasswordRepeat = {newPasswordRepeat}
                            newPasswordChange={setNewPassword}
                            newPasswordRepeatChange={setNewPasswordRepeat}
                        />
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