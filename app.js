// Supabase Configuration
const SUPABASE_URL = 'https://tgnqbayejloephsdqxae.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRnbnFiYXllamxvZXBoc2RxeGFlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM0MTMyMzUsImV4cCI6MjA3ODk4OTIzNX0.yICueAwjGZyFt5ycnhxOEx8MHgFhRBi9Zd4Drhj89IQ';
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// State
let currentUser = null;
let allContent = [];
let currentFilter = 'all';
let selectedFile = null;
let typingInterval = null;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initAuth();
    loadContent();
    setupEventListeners();
    polishUI();
    initTerminalEffect();
    initMatrixRain();
});

function initMatrixRain() {
    const canvas = document.createElement('canvas');
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100vw';
    canvas.style.height = '100vh';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '0';
    canvas.style.opacity = '0.03';
    document.body.prepend(canvas);
    
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const chars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
    const fontSize = 14;
    const columns = canvas.width / fontSize;
    const drops = Array(Math.floor(columns)).fill(1);
    
    function draw() {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#00ff41';
        ctx.font = fontSize + 'px monospace';
        
        for (let i = 0; i < drops.length; i++) {
            const text = chars[Math.floor(Math.random() * chars.length)];
            ctx.fillText(text, i * fontSize, drops[i] * fontSize);
            if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            }
            drops[i]++;
        }
    }
    
    setInterval(draw, 33);
    
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
}

function initTerminalEffect() {
    const title = document.querySelector('.app-title');
    if (title) {
        const originalText = title.textContent;
        title.textContent = '';
        let i = 0;
        const typeWriter = setInterval(() => {
            if (i < originalText.length) {
                title.textContent += originalText.charAt(i);
                i++;
            } else {
                clearInterval(typeWriter);
                title.style.borderRight = 'none';
            }
        }, 100);
    }
}

function polishUI() {
    const style = document.createElement('style');
    style.textContent = `
        @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&display=swap');
        
        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }
        
        body {
            font-family: 'Share Tech Mono', 'Courier New', monospace;
            color: #00ff41;
            background-color: #0a0a0a;
            overflow-x: hidden;
            position: relative;
        }
        
        body::before {
            content: '';
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: 
                repeating-linear-gradient(0deg, rgba(0, 255, 65, 0.03) 0px, transparent 1px, transparent 2px, rgba(0, 255, 65, 0.03) 3px),
                repeating-linear-gradient(90deg, rgba(0, 255, 65, 0.03) 0px, transparent 1px, transparent 2px, rgba(0, 255, 65, 0.03) 3px);
            pointer-events: none;
            z-index: 1;
        }
        
        #app {
            position: relative;
            z-index: 2;
        }
        
        ::-webkit-scrollbar {
            width: 10px;
            height: 10px;
        }
        
        ::-webkit-scrollbar-track {
            background: #000;
            border: 1px solid #00ff41;
        }
        
        ::-webkit-scrollbar-thumb {
            background: #00ff41;
            box-shadow: 0 0 10px #00ff41;
        }
        
        ::-webkit-scrollbar-thumb:hover {
            background: #00ff88;
            box-shadow: 0 0 20px #00ff88;
        }
        
        .app-header {
            background: linear-gradient(180deg, #000 0%, #0a0a0a 100%);
            border-bottom: 2px solid #00ff41;
            padding: 1rem 2rem;
            box-shadow: 0 0 30px rgba(0, 255, 65, 0.3);
            position: sticky;
            top: 0;
            z-index: 100;
            backdrop-filter: blur(10px);
        }
        
        .app-title {
            font-size: 2rem;
            text-shadow: 0 0 20px #00ff41, 0 0 40px #00ff41;
            animation: glitch 3s infinite;
            border-right: 2px solid #00ff41;
            white-space: nowrap;
            overflow: hidden;
        }
        
        @keyframes glitch {
            0%, 90%, 100% { transform: translate(0); }
            91% { transform: translate(-2px, 2px); }
            92% { transform: translate(2px, -2px); }
            93% { transform: translate(-2px, 2px); }
        }
        
        .header-actions {
            display: flex;
            gap: 1rem;
            align-items: center;
        }
        
        .btn, .card-btn {
            background: transparent;
            color: #00ff41;
            border: 2px solid #00ff41;
            padding: 0.5rem 1.5rem;
            cursor: pointer;
            font-family: 'Share Tech Mono', monospace;
            font-size: 0.9rem;
            text-transform: uppercase;
            letter-spacing: 2px;
            position: relative;
            overflow: hidden;
            transition: all 0.3s ease;
        }
        
        .btn::before, .card-btn::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: rgba(0, 255, 65, 0.2);
            transition: left 0.3s ease;
            z-index: -1;
        }
        
        .btn:hover::before, .card-btn:hover::before {
            left: 0;
        }
        
        .btn:hover, .card-btn:hover {
            box-shadow: 0 0 20px #00ff41, inset 0 0 20px rgba(0, 255, 65, 0.2);
            transform: translateY(-2px);
        }
        
        .btn:active, .card-btn:active {
            transform: translateY(0);
        }
        
        .btn.primary {
            background: #00ff41;
            color: #000;
            font-weight: bold;
            animation: pulse 2s infinite;
        }
        
        @keyframes pulse {
            0%, 100% { box-shadow: 0 0 5px #00ff41; }
            50% { box-shadow: 0 0 20px #00ff41, 0 0 40px #00ff41; }
        }
        
        .search-bar {
            display: flex;
            gap: 1rem;
            padding: 2rem;
            background: rgba(0, 0, 0, 0.5);
            border: 1px solid #00ff41;
            margin: 2rem;
            box-shadow: inset 0 0 30px rgba(0, 255, 65, 0.1);
        }
        
        .search-input {
            flex: 1;
            background: #000;
            border: 2px solid #00ff41;
            color: #00ff41;
            padding: 0.75rem 1rem;
            font-family: 'Share Tech Mono', monospace;
            font-size: 1rem;
            box-shadow: inset 0 0 10px rgba(0, 255, 65, 0.2);
        }
        
        .search-input:focus {
            outline: none;
            box-shadow: 0 0 20px rgba(0, 255, 65, 0.5), inset 0 0 20px rgba(0, 255, 65, 0.3);
        }
        
        .search-input::placeholder {
            color: rgba(0, 255, 65, 0.5);
        }
        
        .filters {
            display: flex;
            gap: 0.5rem;
        }
        
        .filter-btn {
            padding: 0.75rem 1.5rem;
        }
        
        .filter-btn.active {
            background: #00ff41;
            color: #000;
            box-shadow: 0 0 20px #00ff41;
        }
        
        .content-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
            gap: 2rem;
            padding: 2rem;
        }
        
        .content-card {
            background: linear-gradient(145deg, #0a0a0a 0%, #000 100%);
            border: 2px solid #00ff41;
            padding: 0;
            box-shadow: 0 0 30px rgba(0, 255, 65, 0.2);
            min-height: 450px;
            max-width: 100%;
            display: flex;
            flex-direction: column;
            overflow: hidden;
            position: relative;
            transition: all 0.3s ease;
        }
        
        .content-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 5px 50px rgba(0, 255, 65, 0.5);
            border-color: #00ff88;
        }
        
        .content-card::before {
            content: '';
            position: absolute;
            top: -2px;
            left: -2px;
            right: -2px;
            bottom: -2px;
            background: linear-gradient(45deg, transparent 30%, #00ff41 50%, transparent 70%);
            opacity: 0;
            transition: opacity 0.5s;
            animation: border-flow 3s linear infinite;
            z-index: -1;
        }
        
        .content-card:hover::before {
            opacity: 1;
        }
        
        @keyframes border-flow {
            0% { background-position: 0% 50%; }
            100% { background-position: 200% 50%; }
        }
        
        .card-preview {
            height: 220px;
            width: 100%;
            overflow: hidden;
            position: relative;
            background: #000;
            border-bottom: 1px solid #00ff41;
        }
        
        .card-preview img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            transition: transform 0.3s ease;
            filter: brightness(0.8) contrast(1.2);
        }
        
        .content-card:hover .card-preview img {
            transform: scale(1.1);
            filter: brightness(1) contrast(1.2);
        }
        
        .card-type-badge, .card-owner-badge {
            position: absolute;
            top: 10px;
            padding: 0.3rem 0.8rem;
            background: rgba(0, 0, 0, 0.8);
            border: 1px solid #00ff41;
            font-size: 0.7rem;
            box-shadow: 0 0 10px rgba(0, 255, 65, 0.5);
            z-index: 10;
        }
        
        .card-type-badge {
            right: 10px;
        }
        
        .card-owner-badge {
            left: 10px;
            border-color: #ff00ff;
            color: #ff00ff;
            box-shadow: 0 0 10px rgba(255, 0, 255, 0.5);
        }
        
        .card-content {
            padding: 1.5rem;
            flex: 1;
            display: flex;
            flex-direction: column;
            gap: 1rem;
        }
        
        .card-title {
            font-size: 1.3rem;
            text-shadow: 0 0 10px #00ff41;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
        
        .card-description {
            color: rgba(0, 255, 65, 0.7);
            font-size: 0.9rem;
            line-height: 1.5;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
        }
        
        .card-tags {
            display: flex;
            gap: 0.5rem;
            flex-wrap: wrap;
        }
        
        .tag {
            background: rgba(0, 255, 65, 0.1);
            border: 1px solid #00ff41;
            padding: 0.2rem 0.6rem;
            font-size: 0.75rem;
            border-radius: 2px;
        }
        
        .card-meta {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 0.5rem;
            padding: 1rem 0;
            border-top: 1px solid rgba(0, 255, 65, 0.3);
            border-bottom: 1px solid rgba(0, 255, 65, 0.3);
            font-size: 0.8rem;
            color: rgba(0, 255, 65, 0.7);
        }
        
        .meta-item {
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
        
        .card-actions {
            display: flex;
            gap: 0.5rem;
            margin-top: auto;
        }
        
        .card-btn {
            flex: 1;
            padding: 0.6rem;
            font-size: 0.8rem;
        }
        
        .card-btn.delete {
            border-color: #ff0000;
            color: #ff0000;
        }
        
        .card-btn.delete:hover {
            background: rgba(255, 0, 0, 0.1);
            box-shadow: 0 0 20px #ff0000;
        }
        
        .modal {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.95);
            z-index: 1000;
            align-items: center;
            justify-content: center;
            backdrop-filter: blur(5px);
        }
        
        .modal.active {
            display: flex;
        }
        
        .modal-content {
            background: linear-gradient(145deg, #0a0a0a 0%, #000 100%);
            border: 3px solid #00ff41;
            padding: 2rem;
            max-width: 600px;
            width: 90%;
            max-height: 90vh;
            overflow: auto;
            box-shadow: 0 0 100px rgba(0, 255, 65, 0.5);
            position: relative;
            animation: modal-appear 0.3s ease;
        }
        
        @keyframes modal-appear {
            from {
                opacity: 0;
                transform: scale(0.8) translateY(-50px);
            }
            to {
                opacity: 1;
                transform: scale(1) translateY(0);
            }
        }
        
        .view-modal .modal-content {
            max-width: 95vw;
            max-height: 95vh;
            padding: 1rem;
        }
        
        #viewContent {
            max-width: 100%;
            overflow: auto;
            margin: 1rem 0;
        }
        
        #viewContent img, #viewContent video {
            max-width: 100%;
            max-height: 75vh;
            object-fit: contain;
            display: block;
            margin: 0 auto;
        }
        
        .modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 2rem;
            padding-bottom: 1rem;
            border-bottom: 2px solid #00ff41;
        }
        
        .modal-title {
            font-size: 1.8rem;
            text-shadow: 0 0 20px #00ff41;
        }
        
        .close-btn {
            background: transparent;
            border: 2px solid #ff0000;
            color: #ff0000;
            font-size: 1.5rem;
            width: 40px;
            height: 40px;
            cursor: pointer;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .close-btn:hover {
            background: rgba(255, 0, 0, 0.2);
            box-shadow: 0 0 20px #ff0000;
            transform: rotate(90deg);
        }
        
        .form-group {
            margin-bottom: 1.5rem;
        }
        
        .form-label {
            display: block;
            margin-bottom: 0.5rem;
            color: #00ff41;
            font-size: 0.9rem;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        
        .form-input, .form-textarea {
            width: 100%;
            background: #000;
            border: 2px solid #00ff41;
            color: #00ff41;
            padding: 0.75rem;
            font-family: 'Share Tech Mono', monospace;
            font-size: 1rem;
            box-shadow: inset 0 0 10px rgba(0, 255, 65, 0.2);
            transition: all 0.3s ease;
        }
        
        .form-input:focus, .form-textarea:focus {
            outline: none;
            box-shadow: 0 0 20px rgba(0, 255, 65, 0.5), inset 0 0 20px rgba(0, 255, 65, 0.3);
            border-color: #00ff88;
        }
        
        .form-textarea {
            resize: vertical;
            min-height: 100px;
        }
        
        .file-input-wrapper {
            position: relative;
            overflow: hidden;
        }
        
        .file-label {
            display: block;
            width: 100%;
            background: #000;
            border: 3px dashed #00ff41;
            color: #00ff41;
            padding: 2rem;
            text-align: center;
            cursor: pointer;
            transition: all 0.3s ease;
            font-size: 1.1rem;
        }
        
        .file-label:hover {
            background: rgba(0, 255, 65, 0.1);
            border-style: solid;
            box-shadow: 0 0 30px rgba(0, 255, 65, 0.3);
        }
        
        .file-label.has-file {
            border-color: #00ff88;
            background: rgba(0, 255, 65, 0.1);
            animation: file-loaded 0.5s ease;
        }
        
        @keyframes file-loaded {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.05); }
        }
        
        #fileInput {
            position: absolute;
            top: 0;
            left: 0;
            opacity: 0;
            width: 100%;
            height: 100%;
            cursor: pointer;
        }
        
        #fileInfo {
            margin-top: 1rem;
            padding: 1rem;
            background: rgba(0, 255, 65, 0.05);
            border: 1px solid #00ff41;
            text-align: center;
        }
        
        .progress-container {
            margin-top: 1rem;
            background: #000;
            border: 2px solid #00ff41;
            padding: 1rem;
            position: relative;
            overflow: hidden;
        }
        
        .progress-bar {
            height: 30px;
            background: #0a0a0a;
            border: 1px solid #00ff41;
            position: relative;
            overflow: hidden;
        }
        
        .progress-fill {
            height: 100%;
            background: linear-gradient(90deg, #00ff41 0%, #00ff88 100%);
            transition: width 0.3s ease;
            box-shadow: 0 0 20px #00ff41;
            animation: progress-glow 1s infinite;
        }
        
        @keyframes progress-glow {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.7; }
        }
        
        .progress-text {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            color: #00ff41;
            font-weight: bold;
            text-shadow: 0 0 10px #000;
            z-index: 10;
        }
        
        .error-message {
            display: none;
            background: rgba(255, 0, 0, 0.1);
            border: 2px solid #ff0000;
            color: #ff0000;
            padding: 1rem;
            margin-bottom: 1rem;
            animation: shake 0.5s ease;
        }
        
        .error-message.active {
            display: block;
        }
        
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-10px); }
            75% { transform: translateX(10px); }
        }
        
        .loading {
            text-align: center;
            padding: 4rem;
            font-size: 2rem;
            animation: loading-pulse 1.5s infinite;
        }
        
        @keyframes loading-pulse {
            0%, 100% { opacity: 0.3; }
            50% { opacity: 1; }
        }
        
        .empty-state {
            text-align: center;
            padding: 4rem;
            font-size: 1.5rem;
            color: rgba(0, 255, 65, 0.5);
        }
        
        .modal-actions {
            display: flex;
            gap: 1rem;
            margin-top: 2rem;
        }
        
        .modal-actions .btn {
            flex: 1;
        }
        
        .text-link {
            color: #00ff41;
            text-decoration: none;
            border-bottom: 1px solid #00ff41;
            transition: all 0.3s ease;
        }
        
        .text-link:hover {
            text-shadow: 0 0 10px #00ff41;
            border-bottom-color: transparent;
        }
        
        .view-meta {
            display: flex;
            gap: 1rem;
            justify-content: center;
            padding: 1rem;
            background: rgba(0, 255, 65, 0.05);
            border: 1px solid rgba(0, 255, 65, 0.3);
            margin: 1rem 0;
            font-size: 0.9rem;
        }
        
        @media (max-width: 768px) {
            .content-grid {
                grid-template-columns: 1fr;
                gap: 1.5rem;
                padding: 1rem;
            }
            
            .search-bar {
                flex-direction: column;
            }
            
            .filters {
                flex-wrap: wrap;
            }
            
            .app-header {
                padding: 1rem;
            }
            
            .app-title {
                font-size: 1.5rem;
            }
        }
    `;
    document.head.appendChild(style);
}

// Auth
function initAuth() {
    const session = localStorage.getItem('gca_session');
    if (session) {
        try {
            currentUser = JSON.parse(session);
            updateAuthUI();
        } catch (e) {
            localStorage.removeItem('gca_session');
        }
    }
}

function updateAuthUI() {
    const loginBtn = document.getElementById('loginBtn');
    const uploadBtn = document.getElementById('uploadBtn');
    const logoutBtn = document.getElementById('logoutBtn');
  
    if (currentUser) {
        loginBtn.style.display = 'none';
        uploadBtn.style.display = 'block';
        logoutBtn.style.display = 'block';
    } else {
        loginBtn.style.display = 'block';
        uploadBtn.style.display = 'none';
        logoutBtn.style.display = 'none';
    }
}

// Event Listeners
function setupEventListeners() {
    // Auth buttons
    document.getElementById('loginBtn').addEventListener('click', () => showModal('loginModal'));
    document.getElementById('uploadBtn').addEventListener('click', () => showModal('uploadModal'));
    document.getElementById('logoutBtn').addEventListener('click', logout);
  
    // Modal toggles
    document.getElementById('showSignupBtn').addEventListener('click', () => {
        hideModal('loginModal');
        showModal('signupModal');
    });
    document.getElementById('showLoginBtn').addEventListener('click', () => {
        hideModal('signupModal');
        showModal('loginModal');
    });
  
    // Close buttons
    document.querySelectorAll('.close-btn, .cancel-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const modal = e.target.closest('.modal');
            if (modal) hideModal(modal.id);
        });
    });
  
    // Forms
    document.getElementById('loginForm').addEventListener('submit', handleLogin);
    document.getElementById('signupForm').addEventListener('submit', handleSignup);
    document.getElementById('uploadForm').addEventListener('submit', handleUpload);
  
    // Search and filters
    document.getElementById('searchInput').addEventListener('input', filterContent);
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            currentFilter = e.target.dataset.type;
            filterContent();
        });
    });
  
    // File input
    document.getElementById('fileInput').addEventListener('change', handleFileSelect);
  
    // Click outside modal to close
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) hideModal(modal.id);
        });
    });
}

// Modal Management
function showModal(modalId) {
    document.getElementById(modalId).classList.add('active');
    document.body.style.overflow = 'hidden';
}

function hideModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
    document.body.style.overflow = 'auto';
  
    // Reset forms
    if (modalId === 'loginModal') {
        document.getElementById('loginForm').reset();
        document.getElementById('loginError').classList.remove('active');
    } else if (modalId === 'signupModal') {
        document.getElementById('signupForm').reset();
        document.getElementById('signupError').classList.remove('active');
    } else if (modalId === 'uploadModal') {
        resetUploadForm();
    } else if (modalId === 'viewModal') {
        const media = document.querySelector('#viewContent video, #viewContent audio');
        if (media) {
            media.pause();
            media.currentTime = 0;
        }
        document.getElementById('viewContent').innerHTML = '';
    }
}

function showError(elementId, message) {
    const element = document.getElementById(elementId);
    element.textContent = '[ERROR] ' + message;
    element.classList.add('active');
}

function hideError(elementId) {
    document.getElementById(elementId).classList.remove('active');
}

// Reset Upload Form
function resetUploadForm() {
    document.getElementById('uploadForm').reset();
    document.getElementById('uploadError').classList.remove('active');
    document.getElementById('fileInfo').style.display = 'none';
    document.getElementById('uploadProgress').style.display = 'none';
    selectedFile = null;
    
    const fileLabel = document.querySelector('.file-label');
    if (fileLabel) fileLabel.classList.remove('has-file');
    
    const fileLabelText = document.getElementById('fileLabel');
    if (fileLabelText) fileLabelText.textContent = '[DRAG_AND_DROP_OR_CLICK]';
    
    const fileInput = document.getElementById('fileInput');
    if (fileInput) {
        fileInput.value = '';
        const newInput = fileInput.cloneNode(true);
        fileInput.parentNode.replaceChild(newInput, fileInput);
        newInput.addEventListener('change', handleFileSelect);
    }
    
    document.querySelectorAll('#uploadForm button, #uploadForm input, #uploadForm textarea').forEach(el => {
        el.disabled = false;
    });
}

// Login
async function handleLogin(e) {
    e.preventDefault();
    hideError('loginError');
  
    const username = document.getElementById('loginUsername').value.trim();
    const password = document.getElementById('loginPassword').value;
  
    try {
        const { data, error } = await supabase
            .from('accounts')
            .select('*')
            .eq('username', username)
            .maybeSingle();
      
        if (error) {
            console.error('Login query error:', error);
            showError('loginError', 'Login failed. Please try again.');
            return;
        }
      
        if (!data) {
            showError('loginError', 'Username not found');
            return;
        }
      
        if (data.password !== password) {
            showError('loginError', 'Invalid password');
            return;
        }
      
        currentUser = {
            id: data.id,
            username: data.username,
            display_name: data.display_name
        };
      
        localStorage.setItem('gca_session', JSON.stringify(currentUser));
        updateAuthUI();
        hideModal('loginModal');
        loadContent();
    } catch (err) {
        console.error('Login error:', err);
        showError('loginError', 'Login failed. Please try again.');
    }
}

// Signup
async function handleSignup(e) {
    e.preventDefault();
    hideError('signupError');
  
    const username = document.getElementById('signupUsername').value.trim();
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('signupConfirmPassword').value;
    const displayName = document.getElementById('signupDisplayName').value.trim() || username;
  
    if (username.length < 3) {
        showError('signupError', 'Username must be at least 3 characters');
        return;
    }
  
    if (password.length < 6) {
        showError('signupError', 'Password must be at least 6 characters');
        return;
    }
  
    if (password !== confirmPassword) {
        showError('signupError', 'Passwords do not match');
        return;
    }
  
    try {
        const { data, error } = await supabase
            .from('accounts')
            .insert([{
                username,
                password,
                display_name: displayName
            }])
            .select()
            .single();
      
        if (error) {
            if (error.code === '23505' || error.message.includes('duplicate') || error.message.includes('unique')) {
                showError('signupError', 'Username already taken');
            } else {
                showError('signupError', 'Account creation failed: ' + error.message);
            }
            return;
        }
      
        currentUser = {
            id: data.id,
            username: data.username,
            display_name: data.display_name
        };
      
        localStorage.setItem('gca_session', JSON.stringify(currentUser));
        updateAuthUI();
        hideModal('signupModal');
        loadContent();
    } catch (err) {
        console.error('Signup error:', err);
        showError('signupError', 'Account creation failed. Please try again.');
    }
}

// Logout
function logout() {
    localStorage.removeItem('gca_session');
    currentUser = null;
    updateAuthUI();
    loadContent();
}

// File Selection
function handleFileSelect(e) {
    selectedFile = e.target.files[0];
    if (selectedFile) {
        const fileLabel = document.querySelector('.file-label');
        fileLabel.classList.add('has-file');
        document.getElementById('fileLabel').textContent = '[FILE_LOADED] ✓';
      
        const fileInfo = document.getElementById('fileInfo');
        fileInfo.innerHTML = `
            <p><strong>📁 ${selectedFile.name}</strong></p>
            <small>SIZE: ${(selectedFile.size / 1024 / 1024).toFixed(2)}MB :: TYPE: ${detectFileType(selectedFile).toUpperCase()}</small>
        `;
        fileInfo.style.display = 'block';
      
        if (!document.getElementById('uploadTitle').value) {
            document.getElementById('uploadTitle').value = selectedFile.name.replace(/\.[^/.]+$/, '');
        }
    }
}

function detectFileType(file) {
    const type = file.type;
    const name = file.name.toLowerCase();
  
    if (type.startsWith('image/')) return 'image';
    if (type.startsWith('video/')) return 'video';
    if (type.startsWith('audio/') || name.match(/\.(mp3|wav|ogg|m4a|flac|aac)$/)) return 'audio';
    if (type.includes('pdf') || type.includes('document') || type.includes('text')) return 'document';
    return 'other';
}

// Upload
async function handleUpload(e) {
    e.preventDefault();
    hideError('uploadError');
  
    if (!currentUser) {
        showError('uploadError', 'You must be logged in to upload');
        return;
    }
  
    if (!selectedFile) {
        showError('uploadError', 'Please select a file');
        return;
    }
  
    const title = document.getElementById('uploadTitle').value.trim();
    const description = document.getElementById('uploadDescription').value.trim();
    const tagsInput = document.getElementById('uploadTags').value.trim();
    const tags = tagsInput ? tagsInput.split(',').map(t => t.trim()).filter(t => t) : [];
  
    const progressContainer = document.getElementById('uploadProgress');
    const progressFill = document.querySelector('.progress-fill');
    const progressText = document.querySelector('.progress-text');
    progressContainer.style.display = 'block';
    progressFill.style.width = '10%';
    progressText.textContent = '[INITIALIZING...] 10%';
  
    document.querySelectorAll('#uploadForm button, #uploadForm input, #uploadForm textarea').forEach(el => {
        el.disabled = true;
    });
  
    try {
        const fileExt = selectedFile.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${fileExt}`;
        
        progressFill.style.width = '30%';
        progressText.textContent = '[UPLOADING...] 30%';
        
        const { data: uploadData, error: uploadError } = await supabase.storage
            .from('files')
            .upload(fileName, selectedFile, {
                cacheControl: '3600',
                upsert: false
            });
      
        if (uploadError) throw uploadError;
        
        progressFill.style.width = '70%';
        progressText.textContent = '[PROCESSING...] 70%';
      
        const { data: urlData } = supabase.storage
            .from('files')
            .getPublicUrl(fileName);
      
        progressFill.style.width = '85%';
        progressText.textContent = '[SAVING...] 85%';
      
        const { error: dbError } = await supabase
            .from('content')
            .insert([{
                title,
                description,
                file_url: urlData.publicUrl,
                file_type: detectFileType(selectedFile),
                file_size: selectedFile.size,
                uploader_name: currentUser.display_name || currentUser.username,
                uploader_id: currentUser.id,
                view_count: 0,
                tags
            }]);
      
        if (dbError) throw dbError;
      
        progressFill.style.width = '100%';
        progressText.textContent = '[COMPLETE] 100%';
      
        setTimeout(() => {
            hideModal('uploadModal');
            loadContent();
        }, 500);
      
    } catch (err) {
        console.error('Upload error:', err);
        showError('uploadError', 'Upload failed: ' + err.message);
        progressContainer.style.display = 'none';
      
        document.querySelectorAll('#uploadForm button, #uploadForm input, #uploadForm textarea').forEach(el => {
            el.disabled = false;
        });
    }
}

// Load Content
async function loadContent() {
    document.getElementById('loading').style.display = 'block';
    document.getElementById('contentGrid').innerHTML = '';
    document.getElementById('emptyState').style.display = 'none';
  
    try {
        const { data, error } = await supabase
            .from('content')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(200);
      
        if (error) throw error;
      
        allContent = data || [];
        filterContent();
    } catch (err) {
        console.error('Load error:', err);
        document.getElementById('loading').style.display = 'none';
        document.getElementById('emptyState').style.display = 'block';
    }
}

// Filter Content
function filterContent() {
    const searchQuery = document.getElementById('searchInput').value.toLowerCase();
  
    let filtered = allContent.filter(content => {
        const matchesSearch = !searchQuery ||
            content.title?.toLowerCase().includes(searchQuery) ||
            content.description?.toLowerCase().includes(searchQuery) ||
            content.uploader_name?.toLowerCase().includes(searchQuery) ||
            content.tags?.some(tag => tag.toLowerCase().includes(searchQuery));
      
        const matchesType = currentFilter === 'all' || content.file_type === currentFilter;
      
        return matchesSearch && matchesType;
    });
  
    displayContent(filtered);
}

// Display Content
function displayContent(content) {
    document.getElementById('loading').style.display = 'none';
    const grid = document.getElementById('contentGrid');
    const emptyState = document.getElementById('emptyState');
  
    if (content.length === 0) {
        grid.innerHTML = '';
        emptyState.style.display = 'block';
        return;
    }
  
    emptyState.style.display = 'none';
    grid.innerHTML = content.map(item => createContentCard(item)).join('');
  
    document.querySelectorAll('.view-btn').forEach(btn => {
        btn.addEventListener('click', () => viewContent(btn.dataset.id));
    });
  
    document.querySelectorAll('.download-btn').forEach(btn => {
        btn.addEventListener('click', async () => {
            const url = btn.dataset.url;
            const fileName = url.split('/').pop();
            await downloadFile(url, fileName);
        });
    });
  
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', () => deleteContent(btn.dataset.id));
    });
}

// Create Content Card
function createContentCard(content) {
    const isOwner = currentUser && (
        currentUser.username === 'Zaid' ||
        content.uploader_name === currentUser.display_name ||
        content.uploader_name === currentUser.username ||
        content.uploader_id === currentUser.id
    );
  
    const preview = getPreviewHTML(content);
    const tags = content.tags?.slice(0, 3).map(tag => `<span class="tag">#${tag}</span>`).join('') || '';
    const moreTagsLabel = content.tags?.length > 3 ? `<span class="tag">+${content.tags.length - 3}</span>` : '';
    const formattedDate = new Date(content.created_at).toLocaleDateString();
    const fileSize = formatFileSize(content.file_size);
  
    return `
        <div class="content-card">
            ${preview}
            <div class="card-content">
                <h3 class="card-title">> ${escapeHtml(content.title)}</h3>
                ${content.description ? `<p class="card-description">${escapeHtml(content.description)}</p>` : ''}
                ${tags || moreTagsLabel ? `<div class="card-tags">${tags}${moreTagsLabel}</div>` : ''}
                <div class="card-meta">
                    <div class="meta-item">👤 ${escapeHtml(content.uploader_name)}</div>
                    <div class="meta-item">👁️ ${content.view_count || 0}</div>
                    <div class="meta-item">📅 ${formattedDate}</div>
                    <div class="meta-item">💾 ${fileSize}</div>
                </div>
                <div class="card-actions">
                    <button class="card-btn view-btn" data-id="${content.id}">[VIEW]</button>
                    <button class="card-btn download-btn" data-url="${content.file_url}">[DOWNLOAD]</button>
                    ${isOwner ? `<button class="card-btn delete delete-btn" data-id="${content.id}">[DELETE]</button>` : ''}
                </div>
            </div>
        </div>
    `;
}

function getPreviewHTML(content) {
    const typeLabel = getTypeLabel(content.file_type);
    const ownerBadge = currentUser && (
        currentUser.username === 'Zaid' ||
        content.uploader_name === currentUser.display_name ||
        content.uploader_name === currentUser.username ||
        content.uploader_id === currentUser.id
    ) ? '<div class="card-owner-badge">[YOUR_FILE]</div>' : '';
  
    if (content.file_type === 'image') {
        return `
            <div class="card-preview">
                <img src="${content.file_url}" alt="${escapeHtml(content.title)}" style="width:100%;height:100%;object-fit:cover;" onerror="this.style.display='none'">
                <div class="card-type-badge">${typeLabel}</div>
                ${ownerBadge}
            </div>
        `;
    }
  
    return `
        <div class="card-preview" style="display:flex;align-items:center;justify-content:center;">
            <div style="font-size:4rem;color:rgba(0,255,65,0.6);">${getFileIcon(content.file_type)}</div>
            <div class="card-type-badge">${typeLabel}</div>
            ${ownerBadge}
        </div>
    `;
}

function getFileIcon(type) {
    switch(type) {
        case 'video': return '🎬';
        case 'audio': return '🎵';
        case 'image': return '🖼️';
        case 'document': return '📄';
        default: return '📦';
    }
}

function getTypeLabel(type) {
    const labels = {
        'video': '[VIDEO]',
        'audio': '[AUDIO]',
        'image': '[IMAGE]',
        'document': '[DOCUMENT]',
        'other': '[FILE]'
    };
    return labels[type] || '[FILE]';
}

function formatFileSize(bytes) {
    if (!bytes) return 'UNKNOWN';
    const sizes = ['B', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0B';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + sizes[i];
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// View Content
async function viewContent(id) {
    const content = allContent.find(c => c.id === id);
    if (!content) return;
  
    const newViewCount = (content.view_count || 0) + 1;
    await supabase
        .from('content')
        .update({ view_count: newViewCount })
        .eq('id', id);
  
    content.view_count = newViewCount;
  
    document.getElementById('viewTitle').textContent = '> ' + content.title;
  
    const viewContent = document.getElementById('viewContent');
    if (content.file_type === 'video') {
        viewContent.innerHTML = `<video controls autoplay src="${content.file_url}" style="width:100%;max-height:75vh;background:#000;object-fit:contain;"></video>`;
    } else if (content.file_type === 'image') {
        viewContent.innerHTML = `<img src="${content.file_url}" alt="${escapeHtml(content.title)}" style="width:100%;max-height:75vh;object-fit:contain;background:#000;">`;
    } else if (content.file_type === 'audio') {
        viewContent.innerHTML = `
            <div style="padding:3rem;background:#000;border:2px solid rgba(0,255,65,0.3);text-align:center;max-height:75vh;display:flex;flex-direction:column;justify-content:center;gap:2rem;">
                <div style="font-size:5rem;">🎵</div>
                <h3 style="font-size:1.5rem;">${escapeHtml(content.title)}</h3>
                <audio controls autoplay src="${content.file_url}" style="width:100%;max-width:600px;margin:0 auto;"></audio>
            </div>
        `;
    } else {
        viewContent.innerHTML = `
            <div style="padding:3rem;text-align:center;background:#000;border:2px solid rgba(0,255,65,0.3);max-height:75vh;display:flex;flex-direction:column;justify-content:center;">
                <p style="margin-bottom:1.5rem;font-size:1.5rem;">⏳ [LOADING...]</p>
            </div>
        `;
        fetch(content.file_url)
            .then(res => {
                if (res.ok) {
                    const contentType = res.headers.get('content-type');
                    if (contentType && (contentType.startsWith('text/') || contentType === 'application/javascript' || contentType === 'application/json')) {
                        return res.text().then(text => {
                            viewContent.innerHTML = `<pre style="white-space: pre-wrap; word-wrap: break-word; word-break: break-word; max-height:75vh;overflow:auto;background:#000;color:#00ff41;padding:2rem;border:2px solid rgba(0,255,65,0.3);">${escapeHtml(text)}</pre>`;
                        });
                    } else {
                        viewContent.innerHTML = `
                            <div style="padding:3rem;text-align:center;background:#000;border:2px solid rgba(0,255,65,0.3);max-height:75vh;display:flex;flex-direction:column;justify-content:center;gap:1rem;">
                                <div style="font-size:4rem;">❌</div>
                                <p style="font-size:1.3rem;">[PREVIEW_NOT_AVAILABLE]</p>
                                <small>Download the file to view it</small>
                            </div>
                        `;
                    }
                } else {
                    throw new Error('Fetch failed');
                }
            })
            .catch(err => {
                console.error(err);
                viewContent.innerHTML = `
                    <div style="padding:3rem;text-align:center;background:#000;border:2px solid rgba(0,255,65,0.3);max-height:75vh;display:flex;flex-direction:column;justify-content:center;gap:1rem;">
                        <div style="font-size:4rem;">❌</div>
                        <p style="font-size:1.3rem;">[PREVIEW_NOT_AVAILABLE]</p>
                        <small>Download the file to view it</small>
                    </div>
                `;
            });
    }
  
    const viewDescription = document.getElementById('viewDescription');
    if (content.description) {
        viewDescription.innerHTML = `<p>> ${escapeHtml(content.description)}</p>`;
        viewDescription.style.display = 'block';
    } else {
        viewDescription.style.display = 'none';
    }
  
    document.getElementById('viewMeta').innerHTML = `
        <span>👤 ${escapeHtml(content.uploader_name)}</span>
        <span>|</span>
        <span>👁️ ${content.view_count} views</span>
        <span>|</span>
        <span>💾 ${formatFileSize(content.file_size)}</span>
    `;
  
    showModal('viewModal');
    filterContent();
}

// Delete Content
async function deleteContent(id) {
    if (!window.confirm('⚠️ [CONFIRM_DELETE?]\n\nThis action cannot be undone.\nThe file will be permanently deleted.')) return;
  
    const content = allContent.find(c => c.id === id);
    if (!content) return;
  
    try {
        const { error: dbError } = await supabase
            .from('content')
            .delete()
            .eq('id', id);
      
        if (dbError) throw dbError;
      
        const fileName = content.file_url.split('/').pop();
        await supabase.storage.from('files').remove([fileName]);
      
        loadContent();
    } catch (err) {
        console.error('Delete error:', err);
        window.alert('❌ [ERROR] Failed to delete file: ' + err.message);
    }
}

// Download File
async function downloadFile(url, fileName) {
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Network response was not ok');
        const blob = await response.blob();
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(link.href);
    } catch (err) {
        console.error('Download error:', err);
        window.alert('❌ [ERROR] Failed to download file: ' + err.message);
    }
}
