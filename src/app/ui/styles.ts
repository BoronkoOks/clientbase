import {createContext} from "react"

export const mainColor = "blue"
export const mainColorCtx = createContext("blue")

export const navbarButtonCtx = createContext("btn bg-" + mainColor + "-400 border-1 rounded-none border-" + mainColor + "-600 hover:text-gray-50 hover:bg-" + mainColor + "-600")
export const currentPageButtonCtx = createContext("btn bg-gray-100 border-2 rounded-none border-" + mainColor + "-600 border-b-0 hover:text-gray-50 hover:bg-" + mainColor + "-600")

export const inputClassStyleCtx = createContext("input input-bordered")



