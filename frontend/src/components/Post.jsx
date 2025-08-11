import React, { useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Dialog, DialogContent, DialogTrigger } from './ui/dialog'
import { Bookmark, MessageCircle, MoreHorizontal, Send } from 'lucide-react'
import { Button } from './ui/button'
import { FaHeart, FaRegHeart } from "react-icons/fa";
import CommentDialog from './CommentDialog'
import { Input } from './ui/input'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'sonner'
import axios from 'axios'
import { setPosts, setSelectedPost } from '@/redux/postSlice'
import { Badge } from './ui/badge'

const Post = ({ post }) => {
    const [text, setText] = useState('')
    const [open, setOpen] = useState(false);
    const { user } = useSelector(store => store.auth);
    const { posts } = useSelector(store => store.post);
    const [liked, setLiked] = useState(post?.likes?.includes(user?._id) || false);
    const [postLike, setPostLike] = useState(post?.likes?.length);
    const [comment, setComment] = useState(post?.comments);
    const dispatch = useDispatch();

    const changeEventHandler = (e) => {
        const inputText = e.target.value;
        if (inputText.trim()) {
            setText(inputText);
        } else {
            setText('');
        }
    }

    const likePrDislikeHandler = async () => {
        try {
            const action = liked ? 'dislike' : 'like';
            const res = await axios.get(`http://localhost:8080/api/v1/post/${post?._id}/${action}`, { withCredentials: true });
            if (res.data.success) {
                const updateLikes = liked ? postLike - 1 : postLike + 1;
                setPostLike(updateLikes);
                setLiked(!liked);

                // update the post in the redux store
                const updatedPostData = posts.map(p =>
                    p._id === post?._id ? {
                        ...p,
                        likes: liked ? p.likes.filter(id => id !== user?._id) : [...p.likes, user?._id]
                    } : p
                );
                dispatch(setPosts(updatedPostData));
                toast.success(res.data.message);
            }
        } catch (error) {
            console.log(error);
        }
    }

    const commentHandler = async () => {
        try {
            const res = await axios.post(`http://localhost:8080/api/v1/post/${post._id}/comment`, { text }, {
                headers: {
                    'Content-Type': 'application/json',
                },
                withCredentials: true
            });
            if (res.data.success) {
                const updatedCommentData = [...comment, res.data.comment];
                setComment(updatedCommentData);

                const updatedPostData = posts.map(p =>
                    p._id === post?._id ? { ...p, comments: updatedCommentData } : p
                );

                dispatch(setPosts(updatedPostData));
                toast.success(res.data.message);
                setText('');
            }
        } catch (error) {
            console.log(error);
        }
    }


    const deletePostHandler = async () => {
        try {
            const res = await axios.delete(`http://localhost:8080/api/v1/post/delete/${post?._id}`, { withCredentials: true });
            if (res.data.success) {
                const updatedPostData = posts.filter((postItem) => postItem?._id !== post?._id);
                dispatch(setPosts(updatedPostData));
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
                    <div className='flex items-center gap-3'>
                        <h1>{post.author?.username}</h1>
                        {user?._id === post.author?._id && <Badge variant='secondary'>Author </Badge>}
                    </div>
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
                    {
                        liked ? <FaHeart size={'24'} onClick={likePrDislikeHandler} className='cursor-pointer text-red-600' /> : <FaRegHeart onClick={likePrDislikeHandler} size={'22px'} className='cursor-pointer hover:text-gray-600' />
                    }
                    <MessageCircle onClick={() => {
                        dispatch(setSelectedPost(post));
                        setOpen(true)
                    }} className='cursor-pointer hover:text-gray-600' />
                    <Send className='cursor-pointer hover:text-gray-600' />
                </div>
                <Bookmark className='cursor-pointer hover:text-gray-600' />
            </div>
            <span className='font-medium block mb-2'>{postLike} likes</span>
            <p>
                <span className='font-medium mr-2'>{post.author?.username}</span>
                {post.caption}
            </p>
            {
                comment?.length > 0 && (
                    <span onClick={() => {
                        dispatch(setSelectedPost(post));
                        setOpen(true)
                    }} className='cursor-pointer text-sm text-gray-400'>View all {comment?.length} comments</span>
                )
            }
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
                    text && <span onClick={commentHandler} className='text-[#3BADF8] cursor-pointer'>Post</span>
                }

            </div>
        </div>
    )
}

export default Post