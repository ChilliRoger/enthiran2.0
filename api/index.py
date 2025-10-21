from flask import Flask, render_template, request, jsonify, stream_with_context, Response
import google.generativeai as genai
import os
import json
from pathlib import Path
from dotenv import load_dotenv

# Get the base directory (parent of 'api' folder)
BASE_DIR = Path(__file__).resolve().parent.parent

# Load environment variables from .env file
load_dotenv(BASE_DIR / '.env')

app = Flask(__name__, 
            template_folder=str(BASE_DIR / 'templates'),
            static_folder=str(BASE_DIR / 'static'))

# Configure Gemini API
GEMINI_API_KEY = os.environ.get('GEMINI_API_KEY')
if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)

# Initialize the model
def get_model():
    return genai.GenerativeModel('gemini-2.0-flash')

# Store conversation history (in production, use a database)
conversations = {}

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/api/chat', methods=['POST'])
def chat():
    try:
        data = request.json
        user_message = data.get('message', '').strip()
        session_id = data.get('session_id', 'default')
        
        if not user_message:
            return jsonify({'error': 'Message is required'}), 400
        
        if not GEMINI_API_KEY:
            return jsonify({'error': 'API key not configured'}), 500
        
        # Get or create conversation history
        if session_id not in conversations:
            conversations[session_id] = []
        
        # Add user message to history
        conversations[session_id].append({
            'role': 'user',
            'parts': [user_message]
        })
        
        # Generate response
        model = get_model()
        chat = model.start_chat(history=conversations[session_id][:-1])
        response = chat.send_message(user_message)
        
        # Add assistant response to history
        conversations[session_id].append({
            'role': 'model',
            'parts': [response.text]
        })
        
        return jsonify({
            'response': response.text,
            'session_id': session_id
        })
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/clear', methods=['POST'])
def clear_history():
    try:
        data = request.json
        session_id = data.get('session_id', 'default')
        
        if session_id in conversations:
            conversations[session_id] = []
        
        return jsonify({'message': 'History cleared'})
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/health', methods=['GET'])
def health():
    return jsonify({'status': 'healthy', 'api_configured': bool(GEMINI_API_KEY)})

# For local development
if __name__ == '__main__':
    app.run(debug=True, port=5000)