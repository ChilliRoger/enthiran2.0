#  Enthiran - AI Chatbot

A free, AI-powered chatbot built with Flask and Google Gemini API, designed to help students during lab practicals.

## Features

- 💻 Real-time AI responses using Google Gemini
- 🎨 Modern, responsive UI
- 💾 Conversation history management
- 🚀 Deployed on Vercel (free hosting)
- 🔓 Bypasses firewall restrictions

## Tech Stack

- **Backend:** Flask (Python)
- **AI Model:** Google Gemini 1.5 Flash
- **Frontend:** HTML, CSS, JavaScript
- **Hosting:** Vercel

## Setup Instructions

### 1. Get Gemini API Key
1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a free API key
3. Save it securely

### 2. Local Development

```bash
# Clone the repository
git clone <your-repo-url>
cd enthiran-chatbot

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On Mac/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Set environment variable
# On Windows:
set GEMINI_API_KEY=your_api_key_here
# On Mac/Linux:
export GEMINI_API_KEY=your_api_key_here

# Run the app
python api/index.py
```

Visit `http://localhost:5000` in your browser.

### 3. Deploy to Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Add environment variable on Vercel dashboard
# Go to: Project Settings > Environment Variables
# Add: GEMINI_API_KEY = your_api_key_here
```

## Usage

1. Open the website
2. Type your programming question
3. Get instant AI-powered responses
4. Use "Clear Chat" to start a new conversation

## Project Structure

```
enthiran-chatbot/
├── api/
│   └── index.py          # Flask application
├── static/
│   ├── style.css         # Styling
│   └── script.js         # Frontend logic
├── templates/
│   └── index.html        # Main page
├── requirements.txt      # Python dependencies
├── vercel.json          # Vercel configuration
├── .gitignore
└── README.md
```

## Contributing

Feel free to fork this project and make improvements!

## License

MIT License - Free to use for educational purposes.

---

