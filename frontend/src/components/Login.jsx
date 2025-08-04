import React, { useState } from 'react'
import { Label } from './ui/label'
import { Input } from './ui/input'
import { Button } from './ui/button'
import axios from 'axios'
import { toast } from 'sonner'
const Login = () => {  
  const [input, setInput] = useState({
    username: '',
    email: '',
    password: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value })
  }
  const loginHandler = async (e) => {
    e.preventDefault()
    console.log(input)
    try {
      setIsLoading(true)
      const res = await axios.post('http://localhost:8080/api/v1/user/login', input, {
        headers: {
          'Content-Type': 'application/json'
        },
        withCredentials: true
      });
      if (res.data.success) {
        toast.success(res.data.message)
        setInput({
          email: '',
          password: ''
        })
      }
    } catch (error) {
      console.log(error)
      toast.error(error.response.data.message);
    } finally {
      setIsLoading(false);
    } 
  }
  return (
    <div className='flex item-center justify-center h-screen w-screen'>
      <form onSubmit={signupHandler} className='shadow-lg flex flex-col gap-5 p-10 text-left'>
        <div className='my-4'>
          <h1 className='text-2xl font-bold text-center'>Logo</h1>
          <p>Login to see photos and videos from your friends.</p>
        </div>
        <div className='text-left'>
          <span className='font-medium'>Email</span>
          <Input
            type='email'
            name='email'
            value={input.email}
            onChange={changeEventHandler}
            placeholder='Email'
            className='focus-visible:ring-transparent my-2'
          />
        </div>
        <div className='text-left'>
          <span className='font-medium'>Password</span>
          <Input
            type='password'
            name='password'
            value={input.password}
            onChange={changeEventHandler}
            placeholder='Password'
            className='focus-visible:ring-transparent my-2'
          />
        </div>
        <Button type='submit'>Login</Button>

      </form>
    </div>
  )
}

export default Login