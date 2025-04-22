import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import Message from "./messageModel.js";
import cors from "cors";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors({
  origin: 'http://127.0.0.1:5501', 
  methods: 'GET,POST',
  allowedHeaders: 'Content-Type'
}));
app.use(express.json());

mongoose.connect("mongodb://localhost:27017/chat", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));


const frontendPath = path.join(__dirname, "../frontend");
app.use(express.static(frontendPath));


app.get("/api/messages/:productId", async (req, res) => {
  try {
    const messages = await Message.find({ productId: req.params.productId }).sort({ timestamp: 1 });
    res.json(messages);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch messages" });
  }
});


app.post("/api/messages", async (req, res) => {
  const { productId, username, message } = req.body;
  if (!productId || !username || !message) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const newMessage = new Message({ productId, username, message });
    await newMessage.save();
    res.status(201).json(newMessage);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to send message" });
  }
});


app.get("/", (req, res) => {
    res.sendFile(path.join(frontendPath, "index.html"));
});


const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
