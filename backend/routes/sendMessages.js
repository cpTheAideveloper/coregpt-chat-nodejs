import express from "express";
import { chatHelper } from "../utils/OpenAiHelpers.js";

const router = express.Router();

router.post("/", async (req, res) => {
    try {
      const userInput = req.body.userInput;
      const message = { role: "user", content: userInput };
      const result = await chatHelper(message);
      res.status(200).json(result);
    } catch (error) {
      console.error("Error processing request:", error);
      res.status(500).json({ error: "Error processing request" });
    }
  });


  export default router;