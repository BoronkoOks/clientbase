"use client"

import {useState, useContext} from "react"
import { User } from "@prisma/client"
import { api } from "~/trpc/react"
import PersonalData from "~/app/_components/_common/groupedFields/personalData"
import ContactInfo from "~/app/_components/_common/groupedFields/contactInfo"
import PasswordChange from "~/app/_components/_common/groupedFields/passwordChange"
import {checkEditedEmailDuplicates, checkEditedPhoneDuplicates} from "~/app/api/action/user"
import { useRouter } from "next/navigation"
import { regularButtonStyleCtx, labelInlineBlockStyleCtx, labelErrInlineBlockStyleCtx} from "~/app/ui/styles"
import DeleteButton from "~/app/_components/_common/deleteButton"
import ErrLabel from "../_common/errLabel"


export function ProfileInfo (
    {userdata, editSection = false, pageName = "?"} : 
    {
        userdata: User,
        editSection: boolean,
        pageName?: string
    }
)
{
    const updateButtonStyle = useContext(regularButtonStyleCtx)
    const labelHeaderStyle = useContext(labelInlineBlockStyleCtx)

    const [user, setUser] = useState<User>(userdata)
    const [newPassword, setNewPassword] = useState<string>("")
    const [newPasswordRepeat, setNewPasswordRepeat] = useState<string>("")
    const [errMessage, setErrMessage] = useState<string>("")

    const updateUserMutation = api.user.updateUser.useMutation()
    const deleteUserMutation = api.user.deleteUser.useMutation()
    const utils = api.useUtils()
    const router = useRouter()


    function Save(){
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
                        utils.section.getUserList.invalidate()
                        setErrMessage("")
                    },
                    onError(error) {
                        setErrMessage(JSON.stringify(error))
                    },
                }
            )
        }
    }

    function Delete() {
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
                onError(error) {
                    setErrMessage(JSON.stringify(error))
                },
            }
        )
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
                            Save()
                        }
                    }
                    else {
                        Save()
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
            Delete()
        }
    }


    return (
        <table>
            <tbody>
                <tr>
                    <td className = "pb-4" colSpan={3}>
                        <div>
                            <label className = {labelHeaderStyle}>
                                {pageName}
                            </label>
                            <button type="submit" className={updateButtonStyle + " inline-block"}
                                onClick={handleSave}>
                                    Обновить
                            </button>
                            {
                                pageName == "Сотрудник" &&
                                <DeleteButton
                                    onClick = {handleDelete}
                                    className = "mt-3 ml-4 inline-block"
                                />
                            }
                            {
                                errMessage != "" && <ErrLabel message = {errMessage} className="ml-4" />
                            }
                        </div>
                    </td>
                </tr>
                <tr>
                    <td className = "align-top">
                        <PersonalData
                            surname = {user.surname}
                            name = {user.name}
                            fathername = {user.fathername}
                            surnameChange = {val => setUser({...user, surname: val})}
                            nameChange = {val => setUser({...user, name: val})}
                            fathernameChange = {val => setUser({...user, fathername: val})}
                        />
                    </td>
                    <td className = "pl-6 align-top">
                        <ContactInfo 
                            user = {user}
                            setUser = {setUser}
                            edit = {editSection}
                        />
                    </td>
                    <td className = "pl-6 align-top">
                        <PasswordChange 
                            newPassword = {newPassword}
                            newPasswordRepeat = {newPasswordRepeat}
                            newPasswordChange = {setNewPassword}
                            newPasswordRepeatChange = {setNewPasswordRepeat}
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