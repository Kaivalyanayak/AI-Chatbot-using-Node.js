const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
    userMessage: String,
    chatbotResponse: String,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model(
    "Message",
    messageSchema
);