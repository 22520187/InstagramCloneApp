import ChatPage from './components/ChatPage'
import EditProfile from './components/EditProfile'
import Home from './components/Home'
import Login from './components/Login'
import MainLayout from './components/MainLayout'
import Profile from './components/Profile'
import Signup from './components/Signup'
import {createBrowserRouter, RouterProvider} from 'react-router-dom'

const browserRouter = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout/>,
    children: [
      {
        path: '/',
        element: <Home/>
      },
      {
        path: '/profile/:id',
        element: <Profile/>
      },
      {
        path: '/account/edit',
        element: <EditProfile/>
      },
      {
        path: '/chat',
        element: <ChatPage/>
      }
    ]
  },
  {
    path: '/signup',
    element: <Signup/>
  },
  {
    path: '/login',
    element: <Login/>
  }
])

function App() {

  return (
    <>
    <RouterProvider router={browserRouter}/>
    </>
      
  )
}

export default App
