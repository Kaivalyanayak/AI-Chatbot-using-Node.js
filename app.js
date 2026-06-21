require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const OpenAI = require("openai");

const Message = require("./models/Message");

const app = express();

// MongoDB Connection
mongoose.connect("mongodb://127.0.0.1:27017/chatbot")
.then(() => {
    console.log("MongoDB Connected");
})
.catch((err) => {
    console.log("MongoDB Error:", err);
});

// Groq Configuration (OpenAI-compatible)
const groq = new OpenAI({
    apiKey: process.env.GROQ_API_KEY,
    baseURL: "https://api.groq.com/openai/v1"
});

// Middleware
app.use(bodyParser.json());
app.use(express.static("public"));

app.set("view engine", "ejs");

// Home Route
app.get("/", (req, res) => {
    res.render("index");
});

// Chat Route
app.post("/chat", async (req, res) => {

    try {

        const userMessage = req.body.message;

        if (!userMessage) {
            return res.json({
                response: "Please enter a message."
            });
        }

        const completion = await groq.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: [
                { role: "user", content: userMessage }
            ]
        });

        const botResponse = completion.choices[0].message.content;

        // Save to MongoDB
        await Message.create({
            userMessage: userMessage,
            chatbotResponse: botResponse
        });

        res.json({
            response: botResponse
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            response:
            "Sorry, AI service is currently unavailable."
        });
    }
});

// Server
const PORT = 3000;

app.listen(PORT, () => {
    console.log(
        `Server running on port ${PORT}`
    );
});