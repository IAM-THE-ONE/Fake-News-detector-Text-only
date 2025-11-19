const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

app.post("/analyze", async (req, res) => {
  const { text, apiKey } = req.body;

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "openai/gpt-4o-mini",  // free + high quality
        messages: [
          {
            role: "system",
            content: "You are a fake news classification AI. Classify text as REAL or FAKE with confidence percentage."
          },
          {
            role: "user",
            content: `Classify this news as REAL or FAKE:\n\n${text}`
          }
        ]
      })
    });

    const data = await response.json();

    // Extract model's answer
    const output = data.choices?.[0]?.message?.content || "Unable to analyze.";

    res.send({ result: output });

  } catch (err) {
    console.error(err);
    res.status(500).send({ error: "Server error", details: err.message });
  }
});

app.listen(5000, () => console.log("Server running on port 5000"));


