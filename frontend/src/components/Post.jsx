import React, { useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Dialog, DialogContent, DialogTrigger } from './ui/dialog'
import { Bookmark, MessageCircle, MoreHorizontal, Send } from 'lucide-react'
import { Button } from './ui/button'
import { FaHeart, FaRegHeart } from "react-icons/fa";
import CommentDialog from './CommentDialog'
import { Input } from './ui/input'
import { useSelector } from 'react-redux'
import { toast } from 'sonner'
import axios from 'axios'

const Post = ({post}) => {
    const [text, setText] = useState('')
    const [open, setOpen] = useState(false);
    const {user} = useSelector(store => store.auth);

    const changeEventHandler = (e) => {
        const inputText = e.target.value;
        if(inputText.trim()) {
            setText(inputText);
        } else {
            setText('');
        }
    }

    const deletePostHandler = async () => {
        try {
            const res = await axios.delete(`http://localhost:8080/api/v1/post/delete/${post._id}`, {withCredentials: true});
            if(res.data.success) {
                toast.success(res.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message);
        }
    }
    return (
        <div className='my-8 w-full max-w-sm mx-auto'>
            <div className='flex justify-between items-center'>
                <div className='flex items-center gap-2'>
                    <Avatar>
                        <AvatarImage src={post.author?.profilePicture} alt='post-image' />
                        <AvatarFallback>{post.author?.username}</AvatarFallback>
                    </Avatar>
                    <h1>{post.author?.username}</h1>
                </div>
                <Dialog>
                    <DialogTrigger asChild>
                        <MoreHorizontal className='cursor-pointer' />
                    </DialogTrigger>
                    <DialogContent className='flex flex-col items-center text-sm text-center'>
                        <Button variant='ghost' className='w-fit cursor-pointer text-[#ED4956] font-bold'>Unfollow</Button>
                        <Button variant='ghost' className='w-fit cursor-pointer'>Add to favorites</Button>
                        {
                            user && user?._id === post?.author?._id && <Button onClick={deletePostHandler} variant='ghost' className='w-fit cursor-pointer'>Delete</Button>
                        }
                        
                    </DialogContent>
                </Dialog>
            </div>
            <img
                className='w-full h-auto rounded-sm my-2 aspect-square object-cover'
                    src={post.image}
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
            <span className='font-medium block mb-2'>{post.likes.length} likes</span>
            <p>
                <span className='font-medium mr-2'>{post.author?.username}</span>
                {post.caption}
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