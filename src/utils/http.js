// 封装axios
import { message } from 'antd'
import axios from 'axios'
import { getToken, removeToken } from './token'
import { history } from './history'
import { service } from '@/constants/constant'

const http = axios.create({
  baseURL: service.baseUrl,
  timeout: 60000
})



// 添加请求拦截器
http.interceptors.request.use((config) => {
  //携带token
  const token = getToken()
  if (token && !config.headers.Authorization) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
}, (error) => {
  return Promise.reject(error)
})

// 添加响应拦截器
http.interceptors.response.use((response) => {
  // 2xx 范围内的状态码都会触发该函数。
  // 对响应数据做点什么
  if (response.config.url.startsWith('https://api.github.com')) {
    return response.data
  }
  if (response.data.code === 401) {
    message.error(`验证权限失败: ${response.data.msg}`)
    history.push('/login')
    removeToken()
  } else if (response.data.code !== 200) {
    message.error(`操作失败: ${response.data.msg}`)
    return
  }
  return response.data
}, (error) => {
  // 超出 2xx 范围的状态码都会触发该函数。
  // 对响应错误做点什么
  //token异常时  退出登录
  // if (error.response.data.code === 401) {
  //   message.error(`验证权限失败: ${error.response.data.msg}`)
  //   history.push('/login')
  //   removeToken()
  // } else {
  //message.error(error)
  //}
  return Promise.reject(error)
})

export default http