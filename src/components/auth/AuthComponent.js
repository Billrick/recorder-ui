import { Navigate } from "react-router-dom"
import { getToken } from "@/utils"

function AuthComponent ({ children }) {
  const token = getToken()
  if (token) {
    return <>{children}</>
  } else {
    return <Navigate to="/login"></Navigate>
  }
}

export default AuthComponent