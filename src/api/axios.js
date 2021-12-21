/**
 * Created by WebStorm.
 * User: nirongxu
 * Date: 2019-01-02
 * Description: 文件描述
 */
import axios from 'axios'
import Cookies from 'js-cookie'
import NProgress from 'nprogress'
import { Message } from 'element-ui'
// axios默认配置
axios.defaults.timeout = 10000 // 超时时间
axios.defaults.baseURL = process.env.API_HOST
axios.defaults.withCredentials = true
// axios.defaults.withCredentials = true

// http request 拦截器
axios.interceptors.request.use(config => {
  NProgress.start()
  config.headers['Content-Type'] = 'application/json;charset=UTF-8'
  if (localStorage.getItem('token')) {
    config.headers.Authorization = 'Bearer ' + localStorage.getItem('token')
  }
  // if (Cookies.get('access_token')) {
  //   config.headers.Authorization = 'Bearer' + Cookies.get('access_token')
  // }
  return config
},
error => {
  return Promise.reject(error.response)
})

// http response 拦截器
axios.interceptors.response.use(
  response => {
    NProgress.done()
    if (response && response.data && response.data.code) {
      if (response.data.code === 11000) {
        Cookies.set('access_token', response.data.message, { expires: 1 / 12 })
        return Promise.resolve()
      } else if (response.data.code === 10000) { // 约定报错信息
        Message({
          message: response.data.message,
          type: 'warning'
        })
        return Promise.reject(response)
      } else if (response.data.code !== 0) {
        return Promise.reject(new Error(response.data.msg))
      }
    }
    return Promise.resolve(response)
  },
  error => {
    NProgress.done()
    Message({
      message: `${error.response.data.message}`,
      type: 'error'
    })
    if (error.response.status === 404) {
      Message({
        message: '请求地址出错',
        type: 'warning'
      })
    } else if (error.response.status === 401) {
      Message({
        message: error.response.data.message,
        type: 'warning'
      })
      Cookies.remove('access_token')
      setTimeout(() => {
        location.reload()
      }, 3000)
    }
    return Promise.reject(error.response) // 返回接口返回的错误信息
  })


export default axios
