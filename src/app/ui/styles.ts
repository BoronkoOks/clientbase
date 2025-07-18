import {createContext} from "react"

export const mainColor = "blue"
export const mainColorCtx = createContext("blue")

export const navbarButtonCtx = createContext("btn bg-" + mainColor + "-400 border-1 rounded-none border-" + mainColor + "-600 hover:text-gray-50 hover:bg-" + mainColor + "-600")
export const currentPageButtonCtx = createContext("btn bg-gray-100 border-2 rounded-none border-" + mainColor + "-600 border-b-0 hover:text-gray-50 hover:bg-" + mainColor + "-600")

export const regularButtonStyleCtx = createContext("btn bg-" + mainColor + "-400 border-2 border-" + mainColor + "-600 mt-3 hover:text-gray-50 hover:bg-" + mainColor + "-600")
export const deleteButtonStyleCtx = createContext("btn bg-red-500 border-2 border-red-800 hover:text-gray-50 hover:bg-red-700")

export const labelInlineBlockStyleCtx = createContext("mt-2 mr-4 font-bold inline-block align-middle")
export const labelErrInlineBlockStyleCtx = createContext("mt-2 ml-6 inline-block align-middle text-red-700")

export const groupDivStyleCtx = createContext("border-blue-300 border-2 py-3 px-4 rounded-lg")

export const inputClassStyleCtx = createContext("input input-bordered")

export const tdStyleCtx = createContext("px-2 border border-black border-solid")
export const tableStyleCtx = createContext("box-border my-4 border-collapse border-1 border-black")
export const tdPageStyleCtx = createContext("align-top pl-4 pt-4")
