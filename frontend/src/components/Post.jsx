import React, { useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Dialog, DialogContent, DialogTrigger } from './ui/dialog'
import { Bookmark, MessageCircle, MoreHorizontal, Send } from 'lucide-react'
import { Button } from './ui/button'
import { FaHeart, FaRegHeart } from "react-icons/fa";
import CommentDialog from './CommentDialog'
import { Input } from './ui/input'

const Post = () => {
    const [text, setText] = useState('')
    const [open, setOpen] = useState(false);

    const changeEventHandler = (e) => {
        const inputText = e.target.value;
        if(inputText.trim()) {
            setText(inputText);
        } else {
            setText('');
        }
    }
    return (
        <div className='my-8 w-full max-w-sm mx-auto'>
            <div className='flex justify-between items-center'>
                <div className='flex items-center gap-2'>
                    <Avatar>
                        <AvatarImage src='' alt='post-image' />
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <h1>username</h1>
                </div>
                <Dialog>
                    <DialogTrigger asChild>
                        <MoreHorizontal className='cursor-pointer' />
                    </DialogTrigger>
                    <DialogContent className='flex flex-col items-center text-sm text-center'>
                        <Button variant='ghost' className='w-fit cursor-pointer text-[#ED4956] font-bold'>Unfollow</Button>
                        <Button variant='ghost' className='w-fit cursor-pointer'>Add to favorites</Button>
                        <Button variant='ghost' className='w-fit cursor-pointer'>Delete</Button>
                    </DialogContent>
                </Dialog>
            </div>
            <img
                className='w-full h-auto rounded-sm my-2 aspect-square object-cover'
                src="https://media.istockphoto.com/id/1251629816/photo/the-perfect-setting-to-complete-work.webp?a=1&b=1&s=612x612&w=0&k=20&c=62nJPTSm46tUSpEyHIi2Mbq9ProbZ9KfcHoQB5CUnjA="
                alt="post-image"
            />

            <div className='flex items-center justify-between my-2'>
                <div className='flex items-center gap-4'>
                    <FaRegHeart size={'22px'} className='cursor-pointer hover:text-gray-600' />
                    <MessageCircle onClick={() => setOpen(true)} className='cursor-pointer hover:text-gray-600' />
                    <Send className='cursor-pointer hover:text-gray-600' />
                </div>
                <Bookmark className='cursor-pointer hover:text-gray-600' />
            </div>
            <span className='font-medium block mb-2'>1k likes</span>
            <p>
                <span className='font-medium mr-2'>username</span>
                caption
            </p>
            <span onClick={() => setOpen(true)} className='cursor-pointer text-sm text-gray-400'>View all 10 comments</span>
            <CommentDialog open={open} setOpen={setOpen} />
            <div className='flex items-center justify-between'>
                <input
                    type='text'
                    placeholder='Add a comment...'
                    value={text}
                    onChange={changeEventHandler}
                    className='w-full outline-none text-sm'
                />
                {
                    text && <span className='text-[#3BADF8]'>Post</span>
                }
                
            </div>
        </div>
    )
}

export default Post