import Cookies from 'js-cookie'
// const TOKEN_KEY = 'token'

const UUID_KEY = 'uuid'
// const getToken = () => localStorage.getItem(TOKEN_KEY)
// const setToken = token => localStorage.setItem(TOKEN_KEY, token)
// const clearToken = () => localStorage.removeItem(TOKEN_KEY)
const setUuid = uuid => localStorage.setItem(UUID_KEY,uuid)
const getUuid = () => localStorage.getItem(UUID_KEY)
const setUsername = username => localStorage.setItem('username',username)
const getUsername = ()=> localStorage.getItem('username')
const TokenKey = 'Admin-Token'

const getToken = () => {
  return Cookies.get(TokenKey)
}

const setToken = (token) => {
  return Cookies.set(TokenKey, token)
}

const clearToken = () => {
  return Cookies.remove(TokenKey)
}
export {getToken, setToken, clearToken,setUuid,getUuid,setUsername,getUsername}
