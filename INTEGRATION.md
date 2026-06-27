# 🕌 AI Smart Taharah Assistant - Integration Instructions
## Developed by Ustaz Afdhal Irfan (IPG Kampus Pulau Pinang)

This modular high-performance widget can be integrated into any existing website or learning management system (LMS). Follow the instructions below to integrate either the client-side JavaScript module or the full-stack React implementation.

---

## 1. Standalone HTML / JS Client Integration (No Framework)

To inject this module into any standard HTML page, place the container element and load the CDN dependencies:

### Step A: Add the HTML Markup
```html
<!-- The container element where the AI Taharah widget will load -->
<div id="ai-taharah-module"></div>
```

### Step B: Load CDN Resources in `<head>` or before `</body>`
```html
<!-- Lucide Icons for beautiful vectors -->
<script src="https://unpkg.com/lucide@latest"></script>

<!-- Canvas Confetti for successful scan celebrations -->
<script src="https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js"></script>

<!-- Google Font pairing (Plus Jakarta Sans & JetBrains Mono) -->
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap">
```

### Step C: Load the Modular JS Widget Script (`js/ai-taharah-module.js`)
Ensure you compile or save the provided module code and reference it in your document:
```html
<script src="js/ai-taharah-module.js" defer></script>
```

---

## 2. Reusable CSS Styles
Apply these utility classes or animations to your stylesheet to enable the live laser scanning and gloss panel effects:

```css
@keyframes scan {
  0% { top: 0%; opacity: 1; }
  50% { top: 100%; opacity: 1; }
  100% { top: 0%; opacity: 1; }
}

.scan-line {
  position: absolute;
  width: 100%;
  height: 4px;
  background: linear-gradient(to right, rgba(59, 130, 246, 0), rgba(59, 130, 246, 0.8), rgba(59, 130, 246, 0));
  animation: scan 2.5s infinite linear;
  box-shadow: 0 0 12px rgba(59, 130, 246, 0.8);
}

.glass-panel {
  background: rgba(255, 255, 255, 0.75);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.pulse-glow {
  box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.7);
  animation: pulse-glow-anim 2s infinite;
}

@keyframes pulse-glow-anim {
  70% { box-shadow: 0 0 0 15px rgba(59, 130, 246, 0); }
  100% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0); }
}
```

---

## 3. Secure Backend API Proxy (Express Setup)

To secure your Gemini API keys and prevent exposure to the browser, set up a secure proxy route on your Node.js/Express server:

```javascript
const express = require("express");
const { GoogleGenAI, Type } = require("@google/genai");

const app = express();
app.use(express.json({ limit: "15mb" })); // Increase limit for Base64 images

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

app.post("/api/taharah/analyze", async (req, res) => {
  try {
    const { imageBase64, mimeType } = req.body;

    if (!imageBase64) {
      return res.status(400).json({ error: "Sila bekalkan data base64 imej." });
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: [
        {
          inlineData: {
            mimeType: mimeType || "image/jpeg",
            data: imageBase64,
          },
        },
        {
          text: "Lakukan analisis visual & Fiqh Taharah...",
        },
      ],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            objek: { type: Type.STRING },
            jenis_objek: { type: Type.STRING },
            kategori_fiqh: { type: Type.STRING },
            status_penggunaan: { type: Type.STRING },
            keyakinan: { type: Type.STRING },
            analisis_ai: { type: Type.STRING },
            penerangan_pendidikan: { type: Type.STRING },
            cadangan: { type: Type.STRING },
            amaran: { type: Type.STRING }
          },
          required: [
            "objek", "jenis_objek", "kategori_fiqh", "status_penggunaan",
            "keyakinan", "analisis_ai", "penerangan_pendidikan", "cadangan", "amaran"
          ]
        }
      }
    });

    res.json(JSON.parse(response.text.trim()));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

---

## 4. Web Speech API (Malay TTS Voice)

The widget features automatic voice synthesis in Malay/regional voice using the standard Web Speech API:
* Voice selection automatically filters for `ms-MY` or `id-ID` to provide a natural regional pronunciation.
* Users can play/pause/mute audio directly from the widget controls.
* No external API keys are required for voice synthesis.
