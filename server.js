const express = require('express');
const bodyParser = require('body-parser');
const { OpenAI } = require('openai');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 10000;

// Middleware
app.use(bodyParser.json());

// OpenAI API konfiguratsioon
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// GET /
app.get('/', (req, res) => {
  res.send('Tere tulemast OSLogistiX chatboti serverisse!');
});

// POST /chat
app.post('/chat', async (req, res) => {
  const question = req.body.question;

  if (!question) {
    return res.status(400).json({ error: 'Küsimus puudub päringu kehas.' });
  }

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo', // või 'gpt-4', kui sul on sellele ligipääs
      messages: [
        { role: 'system', content: 'Oled abivalmis assistent.' },
        { role: 'user', content: question }
      ],
    });

    const answer = completion.choices[0].message.content;
    res.json({ answer });
  } catch (error) {
    console.error('OpenAI API viga:', error);
    res.status(500).json({ error: 'OpenAI API vastus ebaõnnestus.' });
  }
});

// Serveri käivitamine
app.listen(port, () => {
  console.log(`Server töötab pordil ${port}`);
});
