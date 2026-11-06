import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '10mb' }));

// Initialize GoogleGenAI server-side with telemetry header
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Matrix AI Chat API
app.post('/api/matrix/chat', async (req, res) => {
  try {
    const { messages, systemPrompt } = req.body;
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'Messages array is required' });
    }

    if (!ai) {
      // If GEMINI_API_KEY is not configured, provide a helpful message
      const lastMsg = messages[messages.length - 1]?.content?.toLowerCase() || '';
      let fallback = "I am Matrix AI, your cybernetic copilot. Neural link connected. To activate full generative reasoning, please ensure your GEMINI_API_KEY is set in Settings > Secrets.";
      if (lastMsg.includes('help') || lastMsg.includes('what can you do')) {
        fallback = "I am Matrix AI, the cybernetic intelligence of Aetheris Liquid OS. I can assist with writing documents, solving formula equations in Excel, generating presentation slide outlines, explaining optical glass mechanics, writing TypeScript code, and orchestrating system workflows.";
      }
      return res.json({ reply: fallback, fallback: true });
    }

    const defaultSystem = `You are Matrix AI, the intelligent cybernetic core and operating system co-pilot of Aetheris Liquid OS.
You possess comprehensive expertise in:
- Aetheris OS architecture: liquid glass user interface, optical refraction, fluid dynamics canvas, GNOME Shell workflows, and workspace management.
- Productivity suite: Liquid Word (.docx), Liquid Excel spreadsheets & formulas (.xlsx), Liquid PowerPoint decks (.pptx), Liquid Workspace Kanban & docs (Notion), and Liquid Studio ink/canvas.
- General programming, software design, science, mathematics, creative writing, and executive problem solving.
Tone: Sophisticated, articulate, razor-sharp, inspiring, and exceptionally useful. Use clean markdown formatting with code blocks when presenting technical solutions or structured lists.`;

    // Map conversation history
    const history = messages.slice(0, -1).map((m: any) => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.content }],
    }));

    const lastMessage = messages[messages.length - 1];

    // Send message with retry logic for transient high-demand spikes
    let replyText = '';
    const modelsToTry = ['gemini-3.8-flash', 'gemini-flash-latest'];
    let lastErr: any = null;

    for (const modelName of modelsToTry) {
      try {
        const chat = ai.chats.create({
          model: modelName,
          history: history.length > 0 ? history : undefined,
          config: {
            systemInstruction: systemPrompt || defaultSystem,
          },
        });

        const response = await chat.sendMessage({
          message: lastMessage.content,
        });

        replyText = response.text || '';
        if (replyText) break;
      } catch (err: any) {
        lastErr = err;
        console.warn(`Model ${modelName} attempt error:`, err?.message || err);
        // Short delay before trying fallback model
        await new Promise((resolve) => setTimeout(resolve, 800));
      }
    }

    if (!replyText && lastErr) {
      throw lastErr;
    }

    res.json({ reply: replyText });
  } catch (error: any) {
    console.error('Matrix AI error:', error);
    let userFriendly = error?.message || 'Matrix AI encountered a neural processing error.';
    try {
      const parsed = JSON.parse(userFriendly);
      if (parsed?.error?.message) {
        userFriendly = parsed.error.message;
      }
    } catch {}

    res.status(500).json({
      error: userFriendly,
      status: error?.status,
    });
  }
});

// Matrix AI Quick Prompt (for contextual toolbar queries, summaries, formulas)
app.post('/api/matrix/quick', async (req, res) => {
  try {
    const { prompt, context } = req.body;
    if (!ai) {
      return res.json({ reply: 'Matrix AI: Gemini API key not configured in environment.' });
    }
    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: `${context ? `Context: ${context}\n\n` : ''}User request: ${prompt}`,
      config: {
        systemInstruction: 'You are Matrix AI, the cybernetic operating system copilot. Provide a concise, immediate answer.',
      },
    });
    res.json({ reply: response.text || '' });
  } catch (error: any) {
    console.error('Matrix quick error:', error);
    res.status(500).json({ error: error?.message || 'Error executing quick AI command.' });
  }
});

async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static('dist'));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve('dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Aetheris OS] Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
