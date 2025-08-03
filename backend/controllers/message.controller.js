import { Conversation } from "../models/conversation.model.js";
import { Message } from "../models/message.model.js";
// for chatting
export const sendMessage = async (req, res) => {
    try {
        const senderId = req.id;
        const receiverId = req.params.id;
        const { message } = req.body;

        let conversation = await Conversation.findOne({
            participants: { $all: [senderId, receiverId] },

        });

        // establish conversation if not started yet
        if (!conversation) {
            conversation = await Conversation.create({
                participants: [senderId, receiverId],
            })
        };
        const newMessage = await Message.create({
            senderId,
            receiverId,
            message
        });
        if (newMessage) conversation.messages.push(newMessage._id);

        await conversation.save();
        await newMessage.save();

        await Promise.all([conversation.save(), newMessage.save()]);

        // implement socket.io for real time messaging


        return res.status(201).json({
            message: "Message sent successfully",
            success: true,
            newMessage,
        });
        
    } catch (error) {
        console.log(error);
    }
}

export const getMessage = async (req, res) => {
    try {
        const senderId = req.id;
        const receiverId = req.params.id;
        const conversation = await Conversation.findOne({
            participants: { $all: [senderId, receiverId] },
        });
        if (!conversation) {
            return res.status(404).json({
                message: "Conversation not found",
            })
        }
        return res.status(200).json({
            message: "Messages fetched successfully",
            success: true,
            messages: conversation?.messages,
        });
    } catch(error) {
        console.log(error);
    }
}
