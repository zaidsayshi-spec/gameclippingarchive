<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Grok Content Archive</title>
    <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
    <style>
        /* Improved CSS: Modern dark theme with green accents, better typography, responsive layout, no emojis */
        :root {
            --bg-primary: #0a0a0a;
            --bg-secondary: #1a1a1a;
            --text-primary: #ffffff;
            --text-secondary: #b0b0b0;
            --accent-green: #00ff41;
            --accent-green-dark: #00cc34;
            --error-red: #ff4d4d;
            --border-color: rgba(255, 255, 255, 0.1);
            --shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
        }

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: 'Monaco', 'Courier New', monospace; /* Hacker-style font */
        }

        body {
            background: var(--bg-primary);
            color: var(--text-primary);
            line-height: 1.6;
            padding: 2rem;
            min-height: 100vh;
        }

        header {
            text-align: center;
            margin-bottom: 2rem;
        }

        h1 {
            font-size: 2.5rem;
            color: var(--accent-green);
            text-shadow: 0 0 10px var(--accent-green-dark);
        }

        /* Navigation */
        nav {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 2rem;
            padding: 1rem;
            background: var(--bg-secondary);
            border-radius: 8px;
            border: 1px solid var(--border-color);
        }

        .auth-buttons button {
            background: var(--accent-green);
            color: var(--bg-primary);
            border: none;
            padding: 0.75rem 1.5rem;
            border-radius: 4px;
            cursor: pointer;
            font-weight: bold;
            transition: background 0.3s, transform 0.2s;
        }

        .auth-buttons button:hover {
            background: var(--accent-green-dark);
            transform: translateY(-2px);
        }

        .auth-buttons button:disabled {
            background: #666;
            cursor: not-allowed;
        }

        /* Search and Filters */
        .search-filters {
            display: flex;
            gap: 1rem;
            margin-bottom: 2rem;
        }

        #searchInput {
            flex: 1;
            padding: 0.75rem;
            background: var(--bg-secondary);
            border: 1px solid var(--border-color);
            color: var(--text-primary);
            border-radius: 4px;
        }

        .filter-btn {
            background: var(--bg-secondary);
            color: var(--text-secondary);
            border: 1px solid var(--border-color);
            padding: 0.75rem 1rem;
            border-radius: 4px;
            cursor: pointer;
            transition: all 0.3s;
        }

        .filter-btn.active,
        .filter-btn:hover {
            background: var(--accent-green);
            color: var(--bg-primary);
            border-color: var(--accent-green-dark);
        }

        /* Content Grid */
        #contentGrid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
            gap: 2rem;
        }

        .content-card {
            background: var(--bg-secondary);
            border-radius: 8px;
            overflow: hidden;
            box-shadow: var(--shadow);
            transition: transform 0.3s;
        }

        .content-card:hover {
            transform: translateY(-5px);
        }

        .card-preview {
            height: 200px;
            background: #000;
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
        }

        .card-preview img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }

        .card-type-badge {
            position: absolute;
            top: 1rem;
            right: 1rem;
            background: rgba(0, 0, 0, 0.7);
            color: var(--accent-green);
            padding: 0.25rem 0.5rem;
            border-radius: 4px;
            font-size: 0.8rem;
        }

        .card-owner-badge {
            position: absolute;
            bottom: 1rem;
            left: 1rem;
            background: var(--accent-green);
            color: var(--bg-primary);
            padding: 0.25rem 0.5rem;
            border-radius: 4px;
            font-size: 0.8rem;
        }

        .card-content {
            padding: 1.5rem;
        }

        .card-title {
            font-size: 1.2rem;
            margin-bottom: 0.5rem;
            color: var(--accent-green);
        }

        .card-description {
            font-size: 0.9rem;
            color: var(--text-secondary);
            margin-bottom: 1rem;
        }

        .card-tags {
            display: flex;
            flex-wrap: wrap;
            gap: 0.5rem;
            margin-bottom: 1rem;
        }

        .tag {
            background: rgba(255, 255, 255, 0.1);
            color: var(--text-secondary);
            padding: 0.25rem 0.5rem;
            border-radius: 4px;
            font-size: 0.8rem;
        }

        .card-meta {
            display: flex;
            flex-wrap: wrap;
            gap: 1rem;
            font-size: 0.8rem;
            color: var(--text-secondary);
            margin-bottom: 1rem;
        }

        .card-actions {
            display: flex;
            gap: 0.5rem;
        }

        .card-btn {
            flex: 1;
            background: var(--accent-green);
            color: var(--bg-primary);
            border: none;
            padding: 0.75rem;
            border-radius: 4px;
            cursor: pointer;
            font-weight: bold;
            transition: background 0.3s;
        }

        .card-btn:hover {
            background: var(--accent-green-dark);
        }

        .card-btn.delete {
            background: var(--error-red);
        }

        .card-btn.delete:hover {
            background: #cc0000;
        }

        /* Modals */
        .modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: none;
            align-items: center;
            justify-content: center;
            z-index: 1000;
        }

        .modal.active {
            display: flex;
        }

        .modal-content {
            background: var(--bg-secondary);
            padding: 2rem;
            border-radius: 8px;
            width: 90%;
            max-width: 500px;
            box-shadow: var(--shadow);
            position: relative;
        }

        .close-btn {
            position: absolute;
            top: 1rem;
            right: 1rem;
            background: none;
            border: none;
            color: var(--text-secondary);
            font-size: 1.5rem;
            cursor: pointer;
        }

        .modal h2 {
            font-size: 1.5rem;
            margin-bottom: 1.5rem;
            color: var(--accent-green);
        }

        form {
            display: flex;
            flex-direction: column;
            gap: 1rem;
        }

        input, textarea {
            padding: 0.75rem;
            background: var(--bg-primary);
            border: 1px solid var(--border-color);
            color: var(--text-primary);
            border-radius: 4px;
        }

        textarea {
            min-height: 100px;
            resize: vertical;
        }

        .btn-primary {
            background: var(--accent-green);
            color: var(--bg-primary);
            border: none;
            padding: 0.75rem;
            border-radius: 4px;
            cursor: pointer;
            font-weight: bold;
            transition: background 0.3s;
        }

        .btn-primary:hover {
            background: var(--accent-green-dark);
        }

        .btn-secondary {
            background: transparent;
            color: var(--accent-green);
            border: 1px solid var(--accent-green);
            padding: 0.75rem;
            border-radius: 4px;
            cursor: pointer;
            transition: background 0.3s;
        }

        .btn-secondary:hover {
            background: rgba(0, 255, 65, 0.1);
        }

        .error-message {
            background: rgba(255, 77, 77, 0.1);
            color: var(--error-red);
            padding: 0.75rem;
            border-radius: 4px;
            display: none;
        }

        .error-message.active {
            display: block;
        }

        /* File Upload Specific */
        .file-upload {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
        }

        .file-label {
            background: var(--bg-primary);
            border: 1px dashed var(--border-color);
            padding: 2rem;
            text-align: center;
            border-radius: 4px;
            cursor: pointer;
            transition: border 0.3s;
        }

        .file-label:hover,
        .file-label.has-file {
            border-color: var(--accent-green);
        }

        #fileInfo {
            background: rgba(255, 255, 255, 0.05);
            padding: 1rem;
            border-radius: 4px;
            display: none;
        }

        #uploadProgress {
            background: var(--bg-primary);
            padding: 1rem;
            border-radius: 4px;
            display: none;
        }

        .progress-bar {
            height: 8px;
            background: #333;
            border-radius: 4px;
            overflow: hidden;
            margin-bottom: 0.5rem;
        }

        .progress-fill {
            height: 100%;
            background: var(--accent-green);
            width: 0;
            transition: width 0.3s;
        }

        .progress-text {
            text-align: center;
            font-size: 0.9rem;
        }

        /* View Modal Specific */
        #viewModal .modal-content {
            max-width: 800px;
        }

        #viewDescription {
            margin: 1rem 0;
            color: var(--text-secondary);
        }

        #viewMeta {
            font-size: 0.9rem;
            color: var(--text-secondary);
            display: flex;
            gap: 1rem;
        }

        /* Loading and Empty State */
        #loading {
            text-align: center;
            padding: 2rem;
            color: var(--accent-green);
        }

        #emptyState {
            text-align: center;
            padding: 2rem;
            color: var(--text-secondary);
            display: none;
        }

        /* Responsive */
        @media (max-width: 768px) {
            body {
                padding: 1rem;
            }

            #contentGrid {
                grid-template-columns: 1fr;
            }
        }
    </style>
</head>
<body>
    <header>
        <h1>Grok Content Archive</h1>
    </header>

    <nav>
        <div class="auth-buttons">
            <button id="loginBtn">Login</button>
            <button id="uploadBtn" style="display: none;">Upload</button>
            <button id="logoutBtn" style="display: none;">Logout</button>
        </div>
    </nav>

    <section class="search-filters">
        <input type="text" id="searchInput" placeholder="Search content...">
        <button class="filter-btn active" data-type="all">All</button>
        <button class="filter-btn" data-type="image">Images</button>
        <button class="filter-btn" data-type="video">Videos</button>
        <button class="filter-btn" data-type="audio">Audio</button>
        <button class="filter-btn" data-type="document">Documents</button>
        <button class="filter-btn" data-type="other">Other</button>
    </section>

    <div id="loading" style="display: none;">Loading content...</div>
    <div id="emptyState" style="display: none;">No content found. Upload something!</div>
    <div id="contentGrid"></div>

    <!-- Login Modal -->
    <div id="loginModal" class="modal">
        <div class="modal-content">
            <button class="close-btn">&times;</button>
            <h2>Login</h2>
            <form id="loginForm">
                <input type="text" id="loginUsername" placeholder="Username" required>
                <input type="password" id="loginPassword" placeholder="Password" required>
                <button type="submit" class="btn-primary">Login</button>
                <button type="button" id="showSignupBtn" class="btn-secondary">Sign Up Instead</button>
            </form>
            <div id="loginError" class="error-message"></div>
        </div>
    </div>

    <!-- Signup Modal -->
    <div id="signupModal" class="modal">
        <div class="modal-content">
            <button class="close-btn">&times;</button>
            <h2>Sign Up</h2>
            <form id="signupForm">
                <input type="text" id="signupUsername" placeholder="Username" required>
                <input type="text" id="signupDisplayName" placeholder="Display Name (optional)">
                <input type="password" id="signupPassword" placeholder="Password" required>
                <input type="password" id="signupConfirmPassword" placeholder="Confirm Password" required>
                <button type="submit" class="btn-primary">Sign Up</button>
                <button type="button" id="showLoginBtn" class="btn-secondary">Login Instead</button>
            </form>
            <div id="signupError" class="error-message"></div>
        </div>
    </div>

    <!-- Upload Modal -->
    <div id="uploadModal" class="modal">
        <div class="modal-content">
            <button class="close-btn">&times;</button>
            <h2>Upload Content</h2>
            <form id="uploadForm">
                <input type="text" id="uploadTitle" placeholder="Title" required>
                <textarea id="uploadDescription" placeholder="Description (optional)"></textarea>
                <input type="text" id="uploadTags" placeholder="Tags (comma-separated, optional)">
                <div class="file-upload">
                    <label for="fileInput" class="file-label" id="fileLabel">Click to select file</label>
                    <input type="file" id="fileInput" style="display: none;" required>
                </div>
                <div id="fileInfo"></div>
                <div id="uploadProgress">
                    <div class="progress-bar">
                        <div class="progress-fill"></div>
                    </div>
                    <div class="progress-text">Uploading... 0%</div>
                </div>
                <button type="submit" class="btn-primary">Upload</button>
                <button type="button" class="btn-secondary cancel-btn">Cancel</button>
            </form>
            <div id="uploadError" class="error-message"></div>
        </div>
    </div>

    <!-- View Modal -->
    <div id="viewModal" class="modal">
        <div class="modal-content">
            <button class="close-btn">&times;</button>
            <h2 id="viewTitle"></h2>
            <div id="viewContent"></div>
            <div id="viewDescription" style="display: none;"></div>
            <div id="viewMeta"></div>
            <button id="downloadBtn" class="btn-primary">Download</button>
        </div>
    </div>

    <script>
        // Supabase Configuration
        const SUPABASE_URL = 'https://tgnqbayejloephsdqxae.supabase.co';
        const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRnbnFiYXllamxvZXBoc2RxeGFlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM0MTMyMzUsImV4cCI6MjA3ODk4OTIzNX0.yICueAwjGZyFt5ycnhxOEx8MHgFhRBi9Zd4Drhj89IQ';
        const supabase = Supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        // State
        let currentUser = null;
        let allContent = [];
        let currentFilter = 'all';
        let selectedFile = null;
        // Initialize
        document.addEventListener('DOMContentLoaded', () => {
            initAuth();
            loadContent();
            setupEventListeners();
        });
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
                uploadBtn.style.display = 'inline-block';
                logoutBtn.style.display = 'inline-block';
            } else {
                loginBtn.style.display = 'inline-block';
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
                document.getElementById('uploadForm').reset();
                document.getElementById('uploadError').classList.remove('active');
                document.getElementById('fileInfo').style.display = 'none';
                document.getElementById('uploadProgress').style.display = 'none';
                selectedFile = null;
                document.querySelector('.file-label').classList.remove('has-file');
                document.getElementById('fileLabel').textContent = 'Click to select file';
            } else if (modalId === 'viewModal') {
                document.getElementById('viewContent').innerHTML = '';
            }
        }
        function showError(elementId, message) {
            const element = document.getElementById(elementId);
            element.textContent = 'Error: ' + message;
            element.classList.add('active');
        }
        function hideError(elementId) {
            document.getElementById(elementId).classList.remove('active');
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
                document.getElementById('fileLabel').textContent = 'File Selected';
               
                const fileInfo = document.getElementById('fileInfo');
                fileInfo.innerHTML = `
                    <p><strong>${selectedFile.name}</strong></p>
                    <small>Size: ${(selectedFile.size / 1024 / 1024).toFixed(2)} MB | Type: ${detectFileType(selectedFile).toUpperCase()}</small>
                `;
                fileInfo.style.display = 'block';
               
                // Auto-fill title
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
           
            // Show progress
            const progressContainer = document.getElementById('uploadProgress');
            const progressFill = document.querySelector('.progress-fill');
            const progressText = document.querySelector('.progress-text');
            progressContainer.style.display = 'block';
           
            // Disable form
            document.querySelectorAll('#uploadForm button, #uploadForm input, #uploadForm textarea').forEach(el => {
                el.disabled = true;
            });
           
            try {
                // Simulate progress
                let progress = 0;
                const progressInterval = setInterval(() => {
                    progress += Math.random() * 15;
                    if (progress < 90) {
                        progressFill.style.width = progress + '%';
                        progressText.textContent = `Uploading... ${Math.floor(progress)}%`;
                    }
                }, 300);
               
                // Upload file to Supabase Storage
                const fileExt = selectedFile.name.split('.').pop();
                const fileName = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${fileExt}`;
               
                const { data: uploadData, error: uploadError } = await supabase.storage
                    .from('files')
                    .upload(fileName, selectedFile);
               
                if (uploadError) throw uploadError;
               
                // Get public URL
                const { data: urlData } = supabase.storage
                    .from('files')
                    .getPublicUrl(fileName);
               
                clearInterval(progressInterval);
                progressFill.style.width = '95%';
                progressText.textContent = 'Uploading... 95%';
               
                // Create database entry
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
               
                // Complete
                progressFill.style.width = '100%';
                progressText.textContent = 'Upload Complete - 100%';
               
                setTimeout(() => {
                    hideModal('uploadModal');
                    loadContent();
                }, 500);
               
            } catch (err) {
                console.error('Upload error:', err);
                showError('uploadError', 'Upload failed: ' + err.message);
                progressContainer.style.display = 'none';
               
                // Re-enable form
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
           
            // Add event listeners
            document.querySelectorAll('.view-btn').forEach(btn => {
                btn.addEventListener('click', () => viewContent(btn.dataset.id));
            });
           
            document.querySelectorAll('.download-btn').forEach(btn => {
                btn.addEventListener('click', () => window.open(btn.dataset.url, '_blank'));
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
            const typeLabel = getTypeLabel(content.file_type);
            const tags = content.tags?.slice(0, 3).map(tag => `<span class="tag">#${tag}</span>`).join('') || '';
            const moreTagsLabel = content.tags?.length > 3 ? `<span class="tag">+${content.tags.length - 3}</span>` : '';
            const formattedDate = new Date(content.created_at).toLocaleDateString();
            const fileSize = formatFileSize(content.file_size);
           
            return `
                <div class="content-card">
                    ${preview}
                    <div class="card-content">
                        <h3 class="card-title">${escapeHtml(content.title)}</h3>
                        ${content.description ? `<p class="card-description">${escapeHtml(content.description)}</p>` : ''}
                        ${tags || moreTagsLabel ? `<div class="card-tags">${tags}${moreTagsLabel}</div>` : ''}
                        <div class="card-meta">
                            <div class="meta-item">Uploader: ${escapeHtml(content.uploader_name)}</div>
                            <div class="meta-item">Views: ${content.view_count || 0}</div>
                            <div class="meta-item">Date: ${formattedDate}</div>
                            <div class="meta-item">Size: ${fileSize}</div>
                        </div>
                        <div class="card-actions">
                            <button class="card-btn view-btn" data-id="${content.id}">View</button>
                            <button class="card-btn download-btn" data-url="${content.file_url}">Download</button>
                            ${isOwner ? `<button class="card-btn delete delete-btn" data-id="${content.id}">Delete</button>` : ''}
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
            ) ? '<div class="card-owner-badge">Your File</div>' : '';
           
            if (content.file_type === 'image') {
                return `
                    <div class="card-preview">
                        <img src="${content.file_url}" alt="${escapeHtml(content.title)}" onerror="this.style.display='none'">
                        <div class="card-type-badge">${typeLabel}</div>
                        ${ownerBadge}
                    </div>
                `;
            }
           
            return `
                <div class="card-preview" style="display:flex;align-items:center;justify-content:center;">
                    <div style="font-size:1.5rem;color:var(--accent-green);">${getFileIcon(content.file_type)}</div>
                    <div class="card-type-badge">${typeLabel}</div>
                    ${ownerBadge}
                </div>
            `;
        }
        function getFileIcon(type) {
            switch(type) {
                case 'video': return 'Video';
                case 'audio': return 'Audio';
                case 'image': return 'Image';
                case 'document': return 'Document';
                default: return 'File';
            }
        }
        function getTypeLabel(type) {
            const labels = {
                'video': 'VID',
                'audio': 'AUD',
                'image': 'IMG',
                'document': 'DOC',
                'other': 'FILE'
            };
            return labels[type] || 'FILE';
        }
        function formatFileSize(bytes) {
            if (!bytes) return 'Unknown';
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
           
            // Increment view count
            const newViewCount = (content.view_count || 0) + 1;
            await supabase
                .from('content')
                .update({ view_count: newViewCount })
                .eq('id', id);
           
            content.view_count = newViewCount;
           
            // Show modal
            document.getElementById('viewTitle').textContent = content.title;
           
            const viewContent = document.getElementById('viewContent');
            if (content.file_type === 'video') {
                viewContent.innerHTML = `<video controls autoplay src="${content.file_url}" style="width:100%;max-height:70vh;background:#000;"></video>`;
            } else if (content.file_type === 'image') {
                viewContent.innerHTML = `<img src="${content.file_url}" alt="${escapeHtml(content.title)}" style="width:100%;max-height:70vh;object-fit:contain;background:#000;">`;
            } else if (content.file_type === 'audio') {
                viewContent.innerHTML = `
                    <div style="padding:2rem;background:#000;border:1px solid var(--border-color);text-align:center;">
                        <div style="font-size:2rem;margin-bottom:1rem;color:var(--accent-green);">Audio File</div>
                        <audio controls autoplay src="${content.file_url}" style="width:100%;"></audio>
                    </div>
                `;
            } else {
                viewContent.innerHTML = `
                    <div style="padding:3rem;text-align:center;background:#000;border:1px solid var(--border-color);">
                        <p style="margin-bottom:1.5rem;">Preview unavailable for this file type</p>
                        <button class="btn-primary" onclick="window.open('${content.file_url}', '_blank')">Download File</button>
                    </div>
                `;
            }
           
            const viewDescription = document.getElementById('viewDescription');
            if (content.description) {
                viewDescription.innerHTML = `<p>${escapeHtml(content.description)}</p>`;
                viewDescription.style.display = 'block';
            } else {
                viewDescription.style.display = 'none';
            }
           
            document.getElementById('viewMeta').innerHTML = `
                <span>Uploader: ${escapeHtml(content.uploader_name)}</span>
                <span>|</span>
                <span>Views: ${content.view_count}</span>
            `;
           
            document.getElementById('downloadBtn').onclick = () => window.open(content.file_url, '_blank');
           
            showModal('viewModal');
            filterContent(); // Refresh to show updated view count
        }
        // Delete Content
        async function deleteContent(id) {
            if (!confirm('Are you sure you want to delete this? This action cannot be undone.')) return;
           
            const content = allContent.find(c => c.id === id);
            if (!content) return;
           
            try {
                // Delete from database
                const { error: dbError } = await supabase
                    .from('content')
                    .delete()
                    .eq('id', id);
               
                if (dbError) throw dbError;
               
                // Try to delete from storage (optional, may fail if file doesn't exist)
                const fileName = content.file_url.split('/').pop();
                await supabase.storage.from('files').remove([fileName]);
               
                // Refresh content
                loadContent();
            } catch (err) {
                console.error('Delete error:', err);
                alert('Failed to delete file');
            }
        }
    </script>
</body>
</html>

