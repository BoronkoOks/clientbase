"use client"

import {useState} from "react"
import { User } from "@prisma/client"
import { api } from "~/trpc/react"
import { updateButtonStyle } from "~/styles/daisystyles"
import PersonalData from "../_common/personalData"
import ContactInfo from "../_common/contactInfo"
import GroupDiv from "~/app/ui/groupDiv"
import { useRouter } from "next/navigation"
import {checkEmailDuplicates, checkPhoneDuplicates} from "~/app/api/action/user"


// добавить проверку на уникальность почты и телефона

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

    const inputClassStyle = "input input-bordered"

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
                onError(error, variables, context) {
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
                            <label className = "mt-2 mr-4 font-bold inline-block align-middle">Новый сотрудник</label>
                            <button type="submit" className={updateButtonStyle + " inline-block"}
                                onClick={() => handleSave()}>
                                    Добавить
                            </button>
                            {
                                errMessage != "" &&
                                <label className = "mt-3 ml-4 inline-block align-middle text-red-700">{errMessage}</label>
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
                            edit = {true}
                            emailChange = {val => setUser({...user, email: val})}
                            phoneChange = {val => setUser({...user, phone: val})}
                            sectionChange = {val => setUser({...user, sectionId: val})}
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