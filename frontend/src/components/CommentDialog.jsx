import React, { useState } from 'react'
import { Dialog, DialogContent, DialogTrigger } from './ui/dialog'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Link } from 'react-router-dom'
import { MoreHorizontal } from 'lucide-react'
import { Button } from './ui/button'

const CommentDialog = ({ open, setOpen }) => {

    const [text, setText] = useState('');

    const changeEventHandler = (e) => {
        const inputText = e.target.value;
        if (inputText.trim()) {
            setText(inputText);
        } else {
            setText('');
        }
    }

    const sendMessageHandler = async () => {
        alert(text);
    }

    return (
        <Dialog open={open}>
            <DialogContent onInteractOutside={() => setOpen(false)} className='!max-w-5xl p-0 flex flex-col'>
                <div className='flex flex-1'>
                    <div className='w-1/2'>
                        <img
                            src="https://media.istockphoto.com/id/1251629816/photo/the-perfect-setting-to-complete-work.webp?a=1&b=1&s=612x612&w=0&k=20&c=62nJPTSm46tUSpEyHIi2Mbq9ProbZ9KfcHoQB5CUnjA="
                            alt="post-image"
                            className='w-full h-full object-cover rounded-lg'
                        />
                    </div>
                    <div className='w-1/2 flex flex-col justify-between'>
                        <div className='flex items-center justify-between p-4'>
                            <div className='flex items-center gap-3'>
                                <Link>
                                    <Avatar>
                                        <AvatarImage src="" />
                                        <AvatarFallback>CN</AvatarFallback>
                                    </Avatar>
                                </Link>
                                <div>
                                    <Link className='text-xs font-semibold'>username</Link>
                                    {/* <span className='text-gray-500 text-sm'>Bio here...</span> */}
                                </div>
                            </div>
                            <Dialog>
                                <DialogTrigger asChild>
                                    <MoreHorizontal className='cursor-pointer' />
                                </DialogTrigger>
                                <DialogContent className='flex flex-col item-center text-sm text-center'>
                                    <div className='cursor-pointer w-full text-[#ED4956] font-bold' >
                                        Unfolllow
                                    </div>
                                    <div className='cursor-pointer w-full' >
                                        Add to favorites
                                    </div>
                                </DialogContent>
                            </Dialog>
                        </div>
                        <hr />
                        <div className='flex-1 overflow-y-auto max-h-96 p-4'>
                            comments ayenge
                        </div>
                        <div className='p-4'>
                            <div className='flex items-center gap-2'>
                                <input
                                    type="text"
                                    value={text}
                                    onChange={changeEventHandler}
                                    placeholder='Add a comment...'
                                    className='w-full border-gray-300 p-2 rounded outline-none'
                                />
                                <Button disabled={!text.trim()} onClick={sendMessageHandler} variant='outline'>Send</Button>
                            </div>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default CommentDialog