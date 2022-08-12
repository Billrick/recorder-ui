import { makeAutoObservable } from 'mobx'

class UserStore {
  userInfo = null//刷新页面时 从localStorage中拿去token
  constructor() {
    makeAutoObservable(this)
  }
  setUserInfo = (d) => {
    this.userInfo = d
  }
  getUser = () => {
    return this.userInfo
  }
  doClear = () => {
    this.userInfo = null
  }
}

export default UserStore