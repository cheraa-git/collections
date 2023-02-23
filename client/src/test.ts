import axios from "./axios-app"

export const registerManyUsers = async () => {
  for (let i = 700; i < 1000; i++) {
    await axios.post('/auth/register', { nickname: `test${i}`, email: `test${i}`, password: '12345' })
  }
  console.log('registerManyUsers SUCCESS')
}
