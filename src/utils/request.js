import axios from 'axios'

const request = axios.create({
  timeout: 2000
})

// 获取baseURL
const getBaseURL = url => {
  if (url.startsWith('/front')) {
    return 'http://edufront.lagou.com'
  } else {
    return 'http://eduboss.lagou.com'
  }
}

request.interceptors.request.use(config => {
  // 根据config参数的url属性值动态设置baseURL
  config.baseURL = getBaseURL(config.url)
  return config
})

export default request
