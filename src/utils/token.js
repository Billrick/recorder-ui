// 封装ls存取token

const key = 's_token'

const setToken = (token) => {
  return window.localStorage.setItem(key, token)
}

const getToken = () => {
  return window.localStorage.getItem(key)
}

const removeToken = () => {
  return window.localStorage.removeItem(key)
}

const isLogin = () => {
  return window.localStorage.getItem(key) != null
}

export {
  setToken,
  getToken,
  removeToken,
  isLogin
}