// Generate unique session ID
const SESSION_ID = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);

// DOM elements
const chatContainer = document.getElementById('chatContainer');
const userInput = document.getElementById('userInput');
const sendBtn = document.getElementById('sendBtn');
const clearBtn = document.getElementById('clearBtn');
const sendIcon = document.getElementById('sendIcon');
const loadingIcon = document.getElementById('loadingIcon');

// Initialize
let isProcessing = false;

// Auto-resize textarea
userInput.addEventListener('input', function() {
    this.style.height = 'auto';
    this.style.height = (this.scrollHeight) + 'px';
});

// Send message on Enter (Shift+Enter for new line)
userInput.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
    }
});

// Send button click
sendBtn.addEventListener('click', sendMessage);

// Clear chat button
clearBtn.addEventListener('click', clearChat);

// Send message function
async function sendMessage() {
    const message = userInput.value.trim();
    
    if (!message || isProcessing) return;
    
    // Remove welcome message if exists
    const welcomeMsg = document.querySelector('.welcome-message');
    if (welcomeMsg) {
        welcomeMsg.remove();
    }
    
    // Add user message to chat
    addMessage(message, 'user');
    
    // Clear input
    userInput.value = '';
    userInput.style.height = 'auto';
    
    // Show loading state
    isProcessing = true;
    sendBtn.disabled = true;
    sendIcon.classList.add('hidden');
    loadingIcon.classList.remove('hidden');
    
    // Show typing indicator
    const typingId = showTypingIndicator();
    
    try {
        // Send request to backend
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message: message,
                session_id: SESSION_ID
            })
        });
        
        const data = await response.json();
        
        // Remove typing indicator
        removeTypingIndicator(typingId);
        
        if (response.ok) {
            // Add bot response
            addMessage(data.response, 'bot');
        } else {
            // Show error
            addMessage('❌ Error: ' + (data.error || 'Something went wrong'), 'bot');
        }
    } catch (error) {
        // Remove typing indicator
        removeTypingIndicator(typingId);
        
        // Show error
        addMessage('❌ Network error. Please check your connection.', 'bot');
        console.error('Error:', error);
    } finally {
        // Reset loading state
        isProcessing = false;
        sendBtn.disabled = false;
        sendIcon.classList.remove('hidden');
        loadingIcon.classList.add('hidden');
        userInput.focus();
    }
}

// Add message to chat
function addMessage(text, type) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}-message`;
    
    const label = document.createElement('div');
    label.className = 'message-label';
    label.textContent = type === 'user' ? 'You' : 'Enthiran';
    
    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    
    // Format code blocks
    const formattedText = formatMessage(text);
    contentDiv.innerHTML = formattedText;
    
    messageDiv.appendChild(label);
    messageDiv.appendChild(contentDiv);
    chatContainer.appendChild(messageDiv);
    
    // Scroll to bottom
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

// Format message with code blocks
function formatMessage(text) {
    // Replace code blocks with proper formatting
    text = text.replace(/```(\w+)?\n([\s\S]*?)```/g, function(match, lang, code) {
        return `<pre><code>${escapeHtml(code.trim())}</code></pre>`;
    });
    
    // Replace inline code
    text = text.replace(/`([^`]+)`/g, '<code>$1</code>');
    
    // Replace newlines with <br>
    text = text.replace(/\n/g, '<br>');
    
    return text;
}

// Escape HTML
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Show typing indicator
function showTypingIndicator() {
    const typingDiv = document.createElement('div');
    typingDiv.className = 'message bot-message';
    typingDiv.id = 'typing-indicator';
    
    const label = document.createElement('div');
    label.className = 'message-label';
    label.textContent = 'Enthiran';
    
    const indicator = document.createElement('div');
    indicator.className = 'typing-indicator';
    indicator.innerHTML = '<span></span><span></span><span></span>';
    
    typingDiv.appendChild(label);
    typingDiv.appendChild(indicator);
    chatContainer.appendChild(typingDiv);
    
    chatContainer.scrollTop = chatContainer.scrollHeight;
    
    return 'typing-indicator';
}

// Remove typing indicator
function removeTypingIndicator(id) {
    const indicator = document.getElementById(id);
    if (indicator) {
        indicator.remove();
    }
}

// Clear chat
async function clearChat() {
    if (!confirm('Are you sure you want to clear the chat history?')) {
        return;
    }
    
    try {
        await fetch('/api/clear', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                session_id: SESSION_ID
            })
        });
        
        // Clear chat container
        chatContainer.innerHTML = `
            <div class="welcome-message">
                <h2>👋 Welcome to Enthiran!</h2>
                <p>I'm your AI assistant, ready to help you with:</p>
                <ul>
                    <li>💻 Programming and coding questions</li>
                    <li>🐛 Debugging and error fixing</li>
                    <li>📚 Explanations and tutorials</li>
                    <li>💡 Algorithm and data structure help</li>
                </ul>
                <p><strong>Start typing your question below!</strong></p>
            </div>
        `;
    } catch (error) {
        alert('Failed to clear chat. Please try again.');
        console.error('Error:', error);
    }
}

// Check API health on load
window.addEventListener('load', async function() {
    try {
        const response = await fetch('/api/health');
        const data = await response.json();
        
        if (!data.api_configured) {
            addMessage('⚠️ API key not configured. Please add your Gemini API key to environment variables.', 'bot');
        }
    } catch (error) {
        console.error('Health check failed:', error);
    }
});