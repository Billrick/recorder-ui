import { history } from '@/utils/history'
import {
  setToken,
  getToken,
  removeToken, isLogin
} from '@/utils/token'
import {
  setUserId,
  getUserId,
  removeUserId
} from '@/utils/user'
import http from './http'
export { setUserId, getUserId, removeUserId }
export { setToken, getToken, removeToken, isLogin }
export { history }
export { http }