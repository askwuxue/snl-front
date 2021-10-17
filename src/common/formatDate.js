export default function (value) {
  if (!value) {
    return 'xxxx-xx-xx xx:xx:xx'
  }
  const date = new Date(value)
  const year = date.getFullYear()
  const month = (date.getMonth() + 1) < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1
  const day = date.getDay() < 10 ? '0' + date.getDay() : date.getDay()
  const hours = date.getHours() < 10 ? '0' + date.getHours() : date.getHours()
  const minutes = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()
  const seconds = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
}
