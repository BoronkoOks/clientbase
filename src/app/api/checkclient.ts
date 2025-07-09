"use client"

import Cookies from "js-cookie"


export async function checkSession() {
    return Cookies.get("session-token")
}