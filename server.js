require('dotenv').config(); // <-- lisa see esimeseks
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const { OpenAI } = require('openai');

const app = express();
const port = process.env.PORT || 3000;

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

app.post('/chat', async (req, res) => {
  const userMessage = req.body.message;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [{ role: 'user', content: userMessage }]
    });

    const botReply = response.choices[0].message.content;
    res.json({ reply: botReply });
  } catch (error) {
    res.json({ reply: 'Viga: ei saanud OpenAI vastust.' });
  }
});

app.listen(port, () => {
  console.log(`Server töötab pordil ${port}`);
});
