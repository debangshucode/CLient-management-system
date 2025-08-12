// src/axios.ts
import axios from "axios"

const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "", // adjust this as per your setup
  withCredentials: true, // this allows cookies to be sent (needed for session auth)
})

export default instance
