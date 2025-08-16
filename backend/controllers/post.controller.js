import sharp from "sharp";
import { Post } from "../models/post.model.js";
import cloudinary from "../utils/cloudinary.js";
import { User } from "../models/user.model.js";
import { Comment } from "../models/comment.model.js";
import { getReceiverSocketId, io } from "../socket/socket.js";

export const addNewPost = async (req, res) => {
    try {
        const { caption } = req.body;
        const image = req.file;
        const authorId = req.id;

        if (!image) {
            return res.status(400).json({
                message: "Image is required",
                success: false,
            })
        }

        // image upload
        const optimizedImageBuffer = await sharp(image.buffer).resize({ width: 800, height: 800, fit: "inside" }).toFormat("jpeg", { quality: 80 }).toBuffer();
        //buffer to data uri
        const fileUri = `data:image/jpeg;base64,${optimizedImageBuffer.toString("base64")}`;
        const cloudinaryResponse = await cloudinary.uploader.upload(fileUri);
        const post = await Post.create({
            caption,
            image: cloudinaryResponse.secure_url,
            author: authorId,
        })
        const user = await User.findById(authorId);
        if (user) {
            user.posts.push(post._id);
            await user.save();
        }
        await post.populate({ path: "author", select: "-password" });

        return res.status(200).json({
            message: "Post created successfully",
            success: true,
            post,
        })
    } catch (error) {
        console.log(error);
    }
}

export const getAllPost = async (req, res) => {
    try {
        const posts = await Post.find().sort({ createdAt: -1 })
            .populate({ path: "author", select: "username profilePicture" })
            .populate({
                path: "comments",
                sort: { createdAt: -1 },
                populate: {
                    path: "author",
                    select: "username profilePicture",
                }
            });

        return res.status(200).json({
            message: "Posts fetched successfully",
            success: true,
            posts,
        })
    } catch (error) {
        console.log(error);
    }
};

export const getUserPost = async (req, res) => {
    try {
        const authorId = req.id;
        const posts = await Post.find({ author: authorId }).sort({ createdAt: -1 }).populate({
            path: "author",
            select: "username, profilePicture"
        }).populate({
            path: "comments",
            sort: { createdAt: -1 },
            populate: {
                path: "author",
                select: "username, profilePicture",
            }
        });
        return res.status(200).json({
            message: "Posts fetched successfully",
            success: true,
            posts,
        })
    } catch (error) {
        console.log(error);
    }
}

export const likePost = async (req, res) => {
    try {
        const likeUserId = req.id;
        const postId = req.params.id;
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({
                message: "Post not found",
                success: false,
            })
        }
        // like logic
        await post.updateOne({ $addToSet: { likes: likeUserId } });
        await post.save();

        // implement socket io for real time notification
        const user = await User.findById(likeUserId).select("username profilePicture");
        const postOwnerId = post.author.toString();
        if (postOwnerId !== likeUserId) {
            // emit a notification event
            const notification = {
                type: "like",
                userId: likeUserId,
                userDetails: user,
                postId,
                message: "Your post was liked"
            }
            const postOwnerSocketId = getReceiverSocketId(postOwnerId);
            io.to(postOwnerSocketId).emit("notification", notification);
        }


        return res.status(200).json({
            message: "Post liked successfully",
            success: true,
        })
    } catch (error) {
        console.log(error);
    }
}

export const dislikePost = async (req, res) => {
    try {
        const likeUserId = req.id;
        const postId = req.params.id;
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({
                message: "Post not found",
                success: false,
            })
        }
        // dislike logic
        await post.updateOne({ $pull: { likes: likeUserId } });
        await post.save();

        // implement socket io for real time notification
        const user = await User.findById(likeUserId).select("username profilePicture");
        const postOwnerId = post.author.toString();
        if (postOwnerId !== likeUserId) {
            // emit a notification event
            const notification = {
                type: "dislike",
                userId: likeUserId,
                userDetails: user,
                postId,
                message: "Your post was disliked"
            }
            const postOwnerSocketId = getReceiverSocketId(postOwnerId);
            io.to(postOwnerSocketId).emit("notification", notification);
        }


        return res.status(200).json({
            message: "Post liked successfully",
            success: true,
        })
    } catch (error) {
        console.log(error);
    }
}

export const addComment = async (req, res) => {
    try {
        const postId = req.params.id;
        const commentUserId = req.id;

        const {text} = req.body;

        const post = await Post.findById(postId);

        if (!text) return res.status(400).json({message: "Comment is required", success: false});

        const comment = await Comment.create({
            text,
            author: commentUserId,
            post: postId,
        });
        
        await comment.populate({
            path: "author",
            select: "username, profilePicture",
        });

        post.comments.push(comment._id);
        await post.save();

        return res.status(201).json({
            message: "Comment added successfully",
            success: true,
            comment,
        })
    } catch (error) {
        console.log(error);
    }
}

export const getCommentsOfPost = async (req, res) => {
    try {
        const postId = req.params.id;
        const comments = await Comment.find({post: postId}).populate("author", "username, profilePicture");

        if (!comments) return res.status(404).json({message: "No comments found", success: false});

        return res.status(200).json({
            message: "Comments fetched successfully",
            success: true,
            comments,
        })
    } catch (error) {
        console.log(error);
    }
}

export const deletePost = async (req, res) => {
    try {
        const postId = req.params.id;
        const authorId = req.id;

        const post = await Post.findById(postId);
        if (!post) return res.status(404).json({message: "Post not found", success: false});

        // check if the logged in user is the author of the post
        if (post.author.toString() !== authorId) return res.status(403).json({message: "You are not authorized to delete this post", success: false});

        //delete post
        await Post.findByIdAndDelete(postId);


        // remove the post id from the user's posts array
        let user = await User.findById(authorId);
        user.posts = user.posts.filter((id) => id.toString() !== postId);
        await user.save();

        //delete associated comments
        await Comment.deleteMany({post: postId});

        return res.status(200).json({
            message: "Post deleted successfully",
            success: true,
        })
    } catch (error) {
        console.log(error);
    }
}

export const bookmarkPost = async (req, res) => {
    try {
        const postId = req.params.id;
        const authorId = req.id;
        const post = await Post.findById(postId);
        if (!post) return res.status(404).json({message: "Post not found", success: false});

        const user = await User.findById(authorId);
        if (user.bookmarks.includes(post._id)) {
            // already bookmarked -> remove from bookmarks
            await user.updateOne({$pull: {bookmarks: post._id}});
            await user.save();
            return res.status(200).json({
                type: "unsaved",
                message: "Post removed from bookmarks",
                success: true,
            })
        } else {
            // not bookmarked -> add to bookmarks
            await user.updateOne({$addToSet: {bookmarks: post._id}});
            await user.save();
            return res.status(200).json({
                type: "saved",
                message: "Post added to bookmarks",
                success: true,
            })
        }
    } catch (error) {
        console.log(error);
    }
}