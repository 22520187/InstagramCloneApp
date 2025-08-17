import React, { useEffect, useState } from 'react'
import { Label } from './ui/label'
import { Input } from './ui/input'
import { Button } from './ui/button'
import axios from 'axios'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { setAuthUser } from '../redux/authSlice'
const Login = () => {  
  const [input, setInput] = useState({
    username: '',
    email: '',
    password: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const {user} = useSelector(store => store.auth)
  const dispatch = useDispatch()
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
        dispatch(setAuthUser(res.data.user));
        navigate('/');
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

  useEffect(() => {
    if(user){
      navigate('/');
    }
  },[])
  return (
    <div className='flex item-center justify-center h-screen w-screen'>
      <form onSubmit={loginHandler} className='shadow-lg flex flex-col gap-5 p-10 text-left'>
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
        {
          isLoading ? (
            <Button>
              <Loader2 className='mr-2 h-4 w-4 animate-spin' />
              Please wait...
            </Button>
          ) : (
            <Button type='submit' className='my-4'>Login</Button>
          )
        }
        
        <span className='text-center'>Don't have an account? <Link className='text-blue-600' to='/signup'>Signup</Link></span>

      </form>
    </div>
  )
}

export default Login