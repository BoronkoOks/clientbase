"use client"

import {useState, useContext} from "react"
import { User } from "@prisma/client"
import { api } from "~/trpc/react"
import PersonalData from "~/app/_components/_common/groupedFields/personalData"
import ContactInfo from "~/app/_components/_common/groupedFields/contactInfo"
import GroupDiv from "~/app/ui/groupDiv"
import { useRouter } from "next/navigation"
import {checkEmailDuplicates, checkPhoneDuplicates} from "~/app/api/action/user"
import { inputClassStyleCtx, labelInlineBlockStyleCtx, regularButtonStyleCtx } from "~/app/ui/styles"
import ErrLabel from "~/app/_components/_common/errLabel"


export function AddUser () {
    const [user, setUser] = useState<User>({
        id: "",
        surname: "",
        name: "",
        fathername: "",
        email: "",
        emailVerified: null,
        image: null,
        phone: "",
        sectionId: "",
        password: "",
        role: "SOTR"
    })

    const [errMessage, setErrMessage] = useState<string>("")

    const createUserMutation = api.user.createUser.useMutation()
    const utils = api.useUtils()

    const inputClassStyle = useContext(inputClassStyleCtx)
    const labelHeaderClass = useContext(labelInlineBlockStyleCtx)
    const addButtonStyle = useContext(regularButtonStyleCtx)

    const router = useRouter()


    function Saving(){
        createUserMutation.mutate(
            {
                surname: user.surname,
                name: user.name,
                fathername: user.fathername,
                email: user.email,
                phone: user.phone,
                role: user.role,
                sectionId: user.sectionId,
                password: user.password
            },
            {
                onSuccess: () => {
                    utils.user.getUserList.invalidate()
                    setErrMessage("")
                    router.push('/user')
                },
                onError(error) {
                    setErrMessage(JSON.stringify(error))
                },
            }
        )
    }


    async function handleSave () {
        if (user.surname.trim() != "" && user.name.trim() != "" && user.fathername.trim() != "" &&
             user.email.trim() != "" && user.phone.length == 15 &&
             user.sectionId != "" && user.password?.trim() != ""
        )
        {
            const emailExists = await checkEmailDuplicates(user.email)

            if (emailExists)
            {
                setErrMessage("Пользователь с таким email уже существует")
            }
            else {
                const phoneExists = await checkPhoneDuplicates(user.phone)

                if (phoneExists) {
                    setErrMessage("Пользователь с таким телефоном уже существует")
                }
                else {
                    Saving()
                }
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
                            <label className = {labelHeaderClass}>Новый сотрудник</label>
                            <button type="submit" className={addButtonStyle + " inline-block"} onClick={() => handleSave()}>
                                Добавить
                            </button>
                            {
                                errMessage != "" && <ErrLabel message = {errMessage} />
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
                            surnameChange={val => setUser({...user, surname: val})}
                            nameChange={val => setUser({...user, name: val})}
                            fathernameChange={val => setUser({...user, fathername: val})}
                        />
                    </td>
                    <td className = "pl-6 align-top">
                        <ContactInfo 
                            user = {user}
                            setUser = {setUser}
                            edit = {true}
                        />
                    </td>
                    <td className = "pl-6 align-top">
                        <GroupDiv>
                            <p className="mb-4"><b>Пароль*</b></p>
                            <input
                                type="password"
                                required
                                className= {inputClassStyle + " mt-1 mb-2"}
                                value = {user.password ?? ""}
                                onChange={(e)=> setUser({...user, password: e.target.value})}
                            />
                        </GroupDiv>
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