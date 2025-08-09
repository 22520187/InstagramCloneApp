import React from 'react'
import Feed from './Feed'
import { Outdent } from 'lucide-react'
import RightSidebar from './RightSidebar'
import useGetAllPost from '@/hooks/useGetAllPost'

const Home = () => {
  useGetAllPost();
  return (
    <div className='flex'>
      <div className='flex-grow'>
        <Feed />
        <Outdent />
      </div>
      <RightSidebar />
    </div>
  )
}

export default Home