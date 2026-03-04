import express from "express";
import * as dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const router = express.Router();

const apiKey = process.env.DALLE_API_KEY;
if (!apiKey) {
  throw new Error("DALLE_API_KEY is not set");
}

const openai = new OpenAI({ apiKey });

router.route("/").get((req, res) => {
  res.status(200).json({ message: "Hello from DALL.E Routes!" });
});

router.route("/").post(async (req, res) => {
  try {
    const prompt = req.body?.prompt?.trim();
    if (!prompt) {
      return res.status(400).json({ message: "Prompt is required" });
    }

    console.log("Generating image for prompt:", prompt);

    const response = await Promise.race([
      openai.images.generate({
        prompt,
        n: 1,
        size: "1024x1024",
        response_format: "b64_json",
      }),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("OpenAI request timed out")), 15000),
      ),
    ]);

    console.log("OpenAI response received:", response);

    const image = response?.data?.[0]?.b64_json;
    if (!image) {
      console.error("No image in response:", response);
      return res
        .status(502)
        .json({ message: "No image returned from upstream" });
    }

    res.status(200).json({ photo: image });
  } catch (error) {
    console.error("OpenAI Error:", error);
    res.status(500).json({ message: error.message || "Something went wrong" });
  }
});

export default router;
