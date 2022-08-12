// 封装ls存取userId

const key = 's_u'

const setUserId = (userId) => {
  return window.localStorage.setItem(key, userId)
}

const getUserId = () => {
  return window.localStorage.getItem(key)
}

const removeUserId = () => {
  return window.localStorage.removeItem(key)
}

export {
  setUserId,
  getUserId,
  removeUserId
}