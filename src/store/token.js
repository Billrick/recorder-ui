import { getToken } from "@/utils"
import { http } from '@/utils'
import { makeAutoObservable } from 'mobx'

class TokenStore {
  token = '' || getToken()//刷新页面时 从localStorage中拿去token
  constructor() {
    makeAutoObservable(this)
  }
  doLogin = async ({ username, password }) => {
    return await http.post('/login', { username, password })
    // if (res.code === 200) {
    //   this.token = res.data.tokenValue
    //   setToken(this.token)
    //   return
    // }
  }
  doLogout = async () => {
    return await http.post('/logout')

  }

}

export default TokenStore