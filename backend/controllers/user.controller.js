import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";
import { Post } from "../models/post.model.js";

export const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(401).json({ message: "All fields are required", success: false });
        }

        const user = await User.findOne({ email })
        if (user) {
            return res.status(400).json({ message: "User already exists", success: false });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        await User.create({ username, email, password: hashedPassword });

        return res.status(201).json({ message: "User registered successfully", success: true });
    } catch (error) {
        console.log(error);
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "All fields are required", success: false });
        }

        let user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "Incorrect email or password", success: false });
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(401).json({ message: "Incorrect email or password", success: false });
        }

        // populate each post if in the posts array
        const populatedPosts = await Promise.all(
            user.posts.map( async (postId) => {
                const post = Post.findById(postId);
                if (post.author.equals(user._id)) {
                    return post;
                }
                return null;

            })
        );

        user = {
            _id: user._id,
            username: user.username,
            email: user.email,
            profilePicture: user.profilePicture,
            bio: user.bio,
            followers: user.followers,
            following: user.following,
            posts: populatedPosts,
        }

        const token = await jwt.sign({ userId: user._id }, process.env.SECRET_KEY, { expiresIn: '1d' });
        return res.cookie('token', token, { httpOnly: true, secure: true, sameSite: 'strict', maxAge: 24 * 60 * 60 * 1000 }).json({
            message: `Welcome back ${user.username}`,
            success: true,
            user,
        }) // 1 day
    } catch (error) {
        console.log(error);

    }
};

export const logout = async (req, res) => {
    try {
        return res.cookie("token", "", { maxAge: 0 }).json({
            message: "Logged out successfully",
            success: true,
        })
    } catch (error) {
        console.log(error);
    }
};

export const getProfile = async (req, res) => {
    try {
        const userId = req.params.id;
        let user = await User.findById(userId)
        return res.status(200).json({
            user,
            success: true,
        });
    } catch (error) {
        console.log(error);
    }
};

export const editProfile = async (req, res) => {
    try {
        const userId = req.id;
        const { bio, gender } = req.body;
        const profilePicture = req.file;
        let cloudResponse;

        if (profilePicture) {
            const fileUri = getDataUri(profilePicture);
            cloudResponse = await cloudinary.uploader.upload(fileUri);
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found", success: false });
        };
        if (bio) user.bio = bio;
        if (gender) user.gender = gender;
        if (profilePicture) user.profilePicture = cloudResponse.secure_url;

        await user.save();

        return res.status(200).json({
            message: "Profile updated successfully",
            success: true,
            user
        })
    } catch (error) {
        console.log(error);
    }
};

export const getSuggestedUsers = async (req, res) => {
    try {
        const suggestedUsers = await User.find({ _id: { $ne: req.id } }).select("-password");
        if (!suggestedUsers) {
            return res.status(404).json({ message: "Currently do not have any suggested users", success: false });
        };
        return res.status(200).json({
            users: suggestedUsers,
            success: true,
        });
    } catch (error) {
        console.log(error);
    }
};

export const followOrUnfollow = async (req, res) => {
    try {
        const followeKrneWala = req.id;
        const jiskaFollowKrunga = req.params.id;
        if (followeKrneWala === jiskaFollowKrunga) {
            return res.status(400).json({ message: "You cannot follow yourself", success: false });
        }

        const user = await User.findById(jiskaFollowKrunga);
        const targetUser = await User.findById(followeKrneWala);

        if (!user || !targetUser) {
            return res.status(404).json({ message: "User not found", success: false });
        }

        // check if user is already following the target user
        const isFollowing = user.following.includes(jiskaFollowKrunga);

        if (isFollowing) {
            // unfollow logic
            await Promise.all([
                User.updateOne({ _id: followeKrneWala }, { $pull: { following: jiskaFollowKrunga } }),
                User.updateOne({ _id: jiskaFollowKrunga }, { $pull: { followers: followeKrneWala } }),
            ])
            return res.status(200).json({
                message: "Unfollowed successfully",
                success: true,
            })
        } else {
            // follow logic
            await Promise.all([
                User.updateOne({ _id: followeKrneWala }, { $push: { following: jiskaFollowKrunga } }),
                User.updateOne({ _id: jiskaFollowKrunga }, { $push: { followers: followeKrneWala } }),
            ])
            return res.status(200).json({
                message: "Followed successfully",
                success: true,
            })
        }
    } catch (error) {
        console.log(error);
    }
}