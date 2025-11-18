<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>FileShare</title>
    <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Courier New', monospace;
            background: #000;
            color: #00ff00;
            line-height: 1.6;
        }

        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
        }

        /* Header */
        .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 1rem 0;
            border-bottom: 1px solid #00ff00;
            margin-bottom: 2rem;
        }

        .logo {
            font-size: 1.5rem;
            font-weight: bold;
        }

        .nav-buttons {
            display: flex;
            gap: 1rem;
        }

        .btn {
            background: transparent;
            border: 1px solid #00ff00;
            color: #00ff00;
            padding: 0.5rem 1rem;
            cursor: pointer;
            font-family: 'Courier New', monospace;
            transition: all 0.3s ease;
        }

        .btn:hover {
            background: #00ff00;
            color: #000;
        }

        /* Search and Filters */
        .controls {
            display: flex;
            gap: 1rem;
            margin-bottom: 2rem;
            flex-wrap: wrap;
        }

        .search-box {
            flex: 1;
            min-width: 300px;
        }

        .search-input {
            width: 100%;
            padding: 0.5rem;
            background: #111;
            border: 1px solid #00ff00;
            color: #00ff00;
            font-family: 'Courier New', monospace;
        }

        .filters {
            display: flex;
            gap: 0.5rem;
            flex-wrap: wrap;
        }

        .filter-btn {
            padding: 0.5rem 1rem;
            background: transparent;
            border: 1px solid #00ff00;
            color: #00ff00;
            cursor: pointer;
            font-family: 'Courier New', monospace;
        }

        .filter-btn.active {
            background: #00ff00;
            color: #000;
        }

        /* Content Grid */
        .content-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
            gap: 1.5rem;
            margin-bottom: 2rem;
        }

        .content-card {
            border: 1px solid #00ff00;
            padding: 1rem;
            background: #111;
            min-height: 400px;
            display: flex;
            flex-direction: column;
            transition: all 0.3s ease;
            position: relative;
        }

        .content-card:hover {
            box-shadow: 0 0 15px #00ff00;
            transform: translateY(-2px);
        }

        .card-preview {
            height: 200px;
            width: 100%;
            background: #000;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 1rem;
            border: 1px solid #333;
            position: relative;
        }

        .card-preview img {
            max-width: 100%;
            max-height: 100%;
            object-fit: contain;
        }

        .card-type-badge {
            position: absolute;
            top: 0.5rem;
            right: 0.5rem;
            background: rgba(0, 255, 0, 0.8);
            color: #000;
            padding: 0.2rem 0.5rem;
            font-size: 0.8rem;
        }

        .card-owner-badge {
            position: absolute;
            top: 0.5rem;
            left: 0.5rem;
            background: rgba(255, 255, 0, 0.8);
            color: #000;
            padding: 0.2rem 0.5rem;
            font-size: 0.8rem;
        }

        .card-content {
            flex: 1;
            display: flex;
            flex-direction: column;
        }

        .card-title {
            font-size: 1.1rem;
            margin-bottom: 0.5rem;
            word-break: break-word;
        }

        .card-description {
            color: #88ff88;
            margin-bottom: 1rem;
            flex: 1;
            word-break: break-word;
        }

        .card-tags {
            display: flex;
            flex-wrap: wrap;
            gap: 0.3rem;
            margin-bottom: 1rem;
        }

        .tag {
            background: rgba(0, 255, 0, 0.2);
            padding: 0.2rem 0.5rem;
            font-size: 0.8rem;
            border: 1px solid #00ff00;
        }

        .card-meta {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 0.5rem;
            font-size: 0.8rem;
            color: #88ff88;
            margin-bottom: 1rem;
        }

        .card-actions {
            display: flex;
            gap: 0.5rem;
            margin-top: auto;
        }

        .card-btn {
            flex: 1;
            padding: 0.5rem;
            background: transparent;
            border: 1px solid #00ff00;
            color: #00ff00;
            cursor: pointer;
            font-family: 'Courier New', monospace;
            font-size: 0.8rem;
        }

        .card-btn:hover {
            background: #00ff00;
            color: #000;
        }

        .card-btn.delete {
            border-color: #ff4444;
            color: #ff4444;
        }

        .card-btn.delete:hover {
            background: #ff4444;
            color: #000;
        }

        /* Modals */
        .modal {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            z-index: 1000;
            overflow-y: auto;
        }

        .modal.active {
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .modal-content {
            background: #000;
            border: 2px solid #00ff00;
            padding: 2rem;
            width: 90%;
            max-width: 500px;
            position: relative;
        }

        .view-modal .modal-content {
            max-width: 90vw;
            max-height: 90vh;
            width: auto;
        }

        .close-btn {
            position: absolute;
            top: 1rem;
            right: 1rem;
            background: none;
            border: none;
            color: #00ff00;
            font-size: 1.5rem;
            cursor: pointer;
        }

        .modal h2 {
            margin-bottom: 1.5rem;
            text-align: center;
        }

        .form-group {
            margin-bottom: 1rem;
        }

        .form-group label {
            display: block;
            margin-bottom: 0.5rem;
            color: #88ff88;
        }

        .form-control {
            width: 100%;
            padding: 0.5rem;
            background: #111;
            border: 1px solid #00ff00;
            color: #00ff00;
            font-family: 'Courier New', monospace;
        }

        .file-upload {
            border: 2px dashed #00ff00;
            padding: 2rem;
            text-align: center;
            cursor: pointer;
            transition: all 0.3s ease;
        }

        .file-upload:hover {
            background: rgba(0, 255, 0, 0.1);
        }

        .file-upload.has-file {
            border-color: #ffff00;
            background: rgba(255, 255, 0, 0.1);
        }

        .file-info {
            margin-top: 1rem;
            padding: 1rem;
            background: #111;
            border: 1px solid #00ff00;
            display: none;
        }

        .progress-bar {
            width: 100%;
            height: 20px;
            background: #111;
            border: 1px solid #00ff00;
            margin: 1rem 0;
            display: none;
        }

        .progress-fill {
            height: 100%;
            background: #00ff00;
            width: 0%;
            transition: width 0.3s ease;
        }

        .progress-text {
            text-align: center;
            font-size: 0.9rem;
            margin-bottom: 1rem;
        }

        .error-message {
            color: #ff4444;
            margin-top: 0.5rem;
            display: none;
        }

        .error-message.active {
            display: block;
        }

        .form-actions {
            display: flex;
            gap: 1rem;
            margin-top: 1.5rem;
        }

        .form-actions .btn {
            flex: 1;
        }

        /* Loading and Empty States */
        #loading {
            text-align: center;
            padding: 2rem;
            display: none;
        }

        #emptyState {
            text-align: center;
            padding: 3rem;
            display: none;
        }

        /* View Modal Specific */
        #viewContent {
            max-height: 70vh;
            overflow: auto;
            margin-bottom: 1rem;
        }

        #viewContent img,
        #viewContent video {
            max-width: 100%;
            max-height: 60vh;
            display: block;
            margin: 0 auto;
        }

        #viewMeta {
            text-align: center;
            color: #88ff88;
            margin-bottom: 1rem;
        }

        /* Scrollbar */
        ::-webkit-scrollbar {
            width: 8px;
        }

        ::-webkit-scrollbar-track {
            background: #111;
        }

        ::-webkit-scrollbar-thumb {
            background: #00ff00;
        }

        ::-webkit-scrollbar-thumb:hover {
            background: #88ff88;
        }

        /* Responsive */
        @media (max-width: 768px) {
            .content-grid {
                grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
                gap: 1rem;
            }

            .controls {
                flex-direction: column;
            }

            .search-box {
                min-width: auto;
            }

            .modal-content {
                margin: 1rem;
                padding: 1rem;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <!-- Header -->
        <header class="header">
            <div class="logo">[FILE_SHARE]</div>
            <div class="nav-buttons">
                <button id="loginBtn" class="btn">[LOGIN]</button>
                <button id="uploadBtn" class="btn" style="display:none;">[UPLOAD]</button>
                <button id="logoutBtn" class="btn" style="display:none;">[LOGOUT]</button>
            </div>
        </header>

        <!-- Controls -->
        <div class="controls">
            <div class="search-box">
                <input type="text" id="searchInput" class="search-input" placeholder="[SEARCH_FILES...]">
            </div>
            <div class="filters">
                <button class="filter-btn active" data-type="all">[ALL]</button>
                <button class="filter-btn" data-type="image">[IMAGES]</button>
                <button class="filter-btn" data-type="video">[VID]</button>
                <button class="filter-btn" data-type="audio">[AUDIO]</button>
                <button class="filter-btn" data-type="document">[DOCUMENTS]</button>
            </div>
        </div>

        <!-- Content Grid -->
        <div id="loading">[LOADING...]</div>
        <div id="emptyState">[NO_FILES_FOUND]</div>
        <div id="contentGrid" class="content-grid"></div>
    </div>

    <!-- Login Modal -->
    <div id="loginModal" class="modal">
        <div class="modal-content">
            <button class="close-btn">&times;</button>
            <h2>[LOGIN]</h2>
            <form id="loginForm">
                <div class="form-group">
                    <label for="loginUsername">USERNAME:</label>
                    <input type="text" id="loginUsername" class="form-control" required>
                </div>
                <div class="form-group">
                    <label for="loginPassword">PASSWORD:</label>
                    <input type="password" id="loginPassword" class="form-control" required>
                </div>
                <div id="loginError" class="error-message"></div>
                <div class="form-actions">
                    <button type="submit" class="btn">[LOGIN]</button>
                    <button type="button" class="btn cancel-btn">[CANCEL]</button>
                </div>
            </form>
            <p style="text-align:center;margin-top:1rem;">
                <button type="button" id="showSignupBtn" class="btn" style="background:none;border:none;color:#88ff88;text-decoration:underline;">
                    [CREATE_ACCOUNT]
                </button>
            </p>
        </div>
    </div>

    <!-- Signup Modal -->
    <div id="signupModal" class="modal">
        <div class="modal-content">
            <button class="close-btn">&times;</button>
            <h2>[CREATE_ACCOUNT]</h2>
            <form id="signupForm">
                <div class="form-group">
                    <label for="signupUsername">USERNAME:</label>
                    <input type="text" id="signupUsername" class="form-control" required>
                </div>
                <div class="form-group">
                    <label for="signupDisplayName">DISPLAY_NAME (OPTIONAL):</label>
                    <input type="text" id="signupDisplayName" class="form-control">
                </div>
                <div class="form-group">
                    <label for="signupPassword">PASSWORD:</label>
                    <input type="password" id="signupPassword" class="form-control" required>
                </div>
                <div class="form-group">
                    <label for="signupConfirmPassword">CONFIRM_PASSWORD:</label>
                    <input type="password" id="signupConfirmPassword" class="form-control" required>
                </div>
                <div id="signupError" class="error-message"></div>
                <div class="form-actions">
                    <button type="submit" class="btn">[CREATE]</button>
                    <button type="button" class="btn cancel-btn">[CANCEL]</button>
                </div>
            </form>
            <p style="text-align:center;margin-top:1rem;">
                <button type="button" id="showLoginBtn" class="btn" style="background:none;border:none;color:#88ff88;text-decoration:underline;">
                    [BACK_TO_LOGIN]
                </button>
            </p>
        </div>
    </div>

    <!-- Upload Modal -->
    <div id="uploadModal" class="modal">
        <div class="modal-content">
            <button class="close-btn">&times;</button>
            <h2>[UPLOAD_FILE]</h2>
            <form id="uploadForm">
                <div class="form-group">
                    <label for="uploadTitle">TITLE:</label>
                    <input type="text" id="uploadTitle" class="form-control" required>
                </div>
                <div class="form-group">
                    <label for="uploadDescription">DESCRIPTION (OPTIONAL):</label>
                    <textarea id="uploadDescription" class="form-control" rows="3"></textarea>
                </div>
                <div class="form-group">
                    <label for="uploadTags">TAGS (COMMA_SEPARATED):</label>
                    <input type="text" id="uploadTags" class="form-control" placeholder="tag1, tag2, tag3">
                </div>
                <div class="form-group">
                    <label>FILE:</label>
                    <div class="file-upload" id="fileUploadArea">
                        <input type="file" id="fileInput" style="display:none;">
                        <div class="file-label" id="fileLabel">[CLICK_TO_SELECT_FILE]</div>
                    </div>
                    <div id="fileInfo" class="file-info"></div>
                </div>
                <div id="uploadProgress" class="progress-bar">
                    <div class="progress-fill"></div>
                </div>
                <div class="progress-text"></div>
                <div id="uploadError" class="error-message"></div>
                <div class="form-actions">
                    <button type="submit" class="btn">[UPLOAD]</button>
                    <button type="button" class="btn cancel-btn">[CANCEL]</button>
                </div>
            </form>
        </div>
    </div>

    <!-- View Modal -->
    <div id="viewModal" class="modal view-modal">
        <div class="modal-content">
            <button class="close-btn">&times;</button>
            <h2 id="viewTitle">[FILE_TITLE]</h2>
            <div id="viewContent"></div>
            <div id="viewDescription" style="margin:1rem 0;"></div>
            <div id="viewMeta"></div>
            <div class="form-actions">
                <button id="downloadBtn" class="btn">[DOWNLOAD]</button>
                <button type="button" class="btn cancel-btn">[CLOSE]</button>
            </div>
        </div>
    </div>

    <script>
        // Supabase Configuration
        const SUPABASE_URL = 'https://tgnqbayejloephsdqxae.supabase.co';
        const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRnbnFiYXllamxvZXBoc2RxeGFlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM0MTMyMzUsImV4cCI6MjA3ODk4OTIzNX0.yICueAwjGZyFt5ycnhxOEx8MHgFhRBi9Zd4Drhj89IQ';
        
        // Initialize Supabase with larger file size limits
        const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
            auth: {
                persistSession: true,
                autoRefreshToken: true
            },
            global: {
                headers: {
                    'X-Client-Info': 'fileshare-app'
                }
            }
        });

        // State
        let currentUser = null;
        let allContent = [];
        let currentFilter = 'all';
        let selectedFile = null;
        let currentUploadController = null;

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

            // File upload area
            document.getElementById('fileUploadArea').addEventListener('click', () => {
                document.getElementById('fileInput').click();
            });
            document.getElementById('fileInput').addEventListener('change', handleFileSelect);

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

            // Download button in view modal
            document.getElementById('downloadBtn').addEventListener('click', handleDownload);

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

            // Cancel any ongoing upload
            if (currentUploadController) {
                currentUploadController.abort();
                currentUploadController = null;
            }

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
                document.querySelector('.progress-text').textContent = '';
                selectedFile = null;
                document.getElementById('fileUploadArea').classList.remove('has-file');
                document.getElementById('fileLabel').textContent = '[CLICK_TO_SELECT_FILE]';
                document.getElementById('fileInput').value = '';
                
                // Re-enable form
                document.querySelectorAll('#uploadForm button, #uploadForm input, #uploadForm textarea').forEach(el => {
                    el.disabled = false;
                });
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
                console.log('Attempting to create account for:', username);
             
                const { data, error } = await supabase
                    .from('accounts')
                    .insert([{
                        username,
                        password,
                        display_name: displayName
                    }])
                    .select()
                    .single();
             
                console.log('Insert result:', { data, error });
             
                if (error) {
                    console.error('Account creation error:', error);
                    if (error.code === '23505' || error.message.includes('duplicate') || error.message.includes('unique')) {
                        showError('signupError', 'Username already taken');
                    } else if (error.message.includes('policy') || error.message.includes('permission')) {
                        showError('signupError', 'Database permission error. Please enable RLS policies for the accounts table.');
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
                const fileUploadArea = document.getElementById('fileUploadArea');
                fileUploadArea.classList.add('has-file');
                document.getElementById('fileLabel').textContent = '[FILE_LOADED]';
             
                const fileInfo = document.getElementById('fileInfo');
                const fileType = detectFileType(selectedFile);
                const fileSize = formatFileSize(selectedFile.size);
                
                let warning = '';
                if (selectedFile.size > 100 * 1024 * 1024) { // 100MB
                    warning = '<div class="error-message active" style="margin-top:0.5rem;">[WARNING] Large file - upload may take several minutes</div>';
                }
                
                fileInfo.innerHTML = `
                    <p><strong>${selectedFile.name}</strong></p>
                    <small>SIZE: ${fileSize} :: TYPE: ${fileType.toUpperCase()}</small>
                    ${warning}
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
            if (type.includes('pdf') || type.includes('document') || type.includes('text') || name.match(/\.(txt|doc|docx|pdf)$/)) return 'document';
            return 'other';
        }

        // Upload - FIXED VERSION
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

            // File size validation with reasonable limits
            const MAX_FILE_SIZE = 2 * 1024 * 1024 * 1024; // 2GB
            if (selectedFile.size > MAX_FILE_SIZE) {
                showError('uploadError', `File too large. Maximum size: ${formatFileSize(MAX_FILE_SIZE)}`);
                return;
            }

            const title = document.getElementById('uploadTitle').value.trim();
            const description = document.getElementById('uploadDescription').value.trim();
            const tagsInput = document.getElementById('uploadTags').value.trim();
            const tags = tagsInput ? tagsInput.split(',').map(t => t.trim()).filter(t => t) : [];

            if (!title) {
                showError('uploadError', 'Title is required');
                return;
            }

            // Show progress
            const progressContainer = document.getElementById('uploadProgress');
            const progressFill = document.querySelector('.progress-fill');
            const progressText = document.querySelector('.progress-text');
            progressContainer.style.display = 'block';
            progressFill.style.width = '0%';
            progressText.textContent = '[INITIALIZING_UPLOAD...] 0%';

            // Disable form
            document.querySelectorAll('#uploadForm button, #uploadForm input, #uploadForm textarea').forEach(el => {
                el.disabled = true;
            });

            try {
                // Create abort controller for large files
                currentUploadController = new AbortController();
                
                const fileExt = selectedFile.name.split('.').pop();
                const fileName = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${fileExt}`;
                
                console.log('Starting upload for:', fileName, 'Size:', selectedFile.size);
                
                // Upload with progress using fetch for better control
                const uploadUrl = `${SUPABASE_URL}/storage/v1/object/files/${fileName}`;
                
                progressText.textContent = '[UPLOADING...] 0%';
                
                const response = await fetch(uploadUrl, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                        'Content-Type': selectedFile.type || 'application/octet-stream',
                        'x-upsert': 'false'
                    },
                    body: selectedFile,
                    signal: currentUploadController.signal
                });

                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(`Upload failed: ${response.status} - ${errorText}`);
                }

                const uploadResult = await response.json();
                console.log('Upload result:', uploadResult);

                // Verify the file was actually uploaded
                progressText.textContent = '[VERIFYING_UPLOAD...] 95%';
                progressFill.style.width = '95%';

                // Get public URL with retry logic
                let publicUrl;
                let retries = 3;
                
                while (retries > 0) {
                    const { data: urlData, error: urlError } = await supabase.storage
                        .from('files')
                        .getPublicUrl(fileName);
                    
                    if (urlData && urlData.publicUrl) {
                        publicUrl = urlData.publicUrl;
                        break;
                    }
                    
                    retries--;
                    if (retries > 0) {
                        await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second
                    }
                }

                if (!publicUrl) {
                    throw new Error('Could not get public URL for uploaded file');
                }

                // Verify the file is accessible
                const headResponse = await fetch(publicUrl, { method: 'HEAD' });
                if (!headResponse.ok) {
                    throw new Error('Uploaded file is not accessible');
                }

                // Create database entry
                progressText.textContent = '[CREATING_DATABASE_ENTRY...] 98%';
                progressFill.style.width = '98%';

                const { data: dbData, error: dbError } = await supabase
                    .from('content')
                    .insert([{
                        title,
                        description,
                        file_url: publicUrl,
                        file_type: detectFileType(selectedFile),
                        file_size: selectedFile.size,
                        uploader_name: currentUser.display_name || currentUser.username,
                        uploader_id: currentUser.id,
                        view_count: 0,
                        tags
                    }])
                    .select()
                    .single();

                if (dbError) {
                    console.error('Database error:', dbError);
                    // Try to clean up the uploaded file
                    try {
                        await supabase.storage.from('files').remove([fileName]);
                    } catch (cleanupError) {
                        console.error('Cleanup error:', cleanupError);
                    }
                    throw new Error(`Database error: ${dbError.message}`);
                }

                // Complete
                progressFill.style.width = '100%';
                progressText.textContent = '[UPLOAD_COMPLETE] 100%';

                console.log('Upload successful, database entry:', dbData);

                setTimeout(() => {
                    hideModal('uploadModal');
                    loadContent();
                    showNotification('File uploaded successfully!');
                }, 1000);

            } catch (err) {
                console.error('Upload error:', err);
                
                if (err.name === 'AbortError') {
                    showError('uploadError', 'Upload was cancelled');
                } else {
                    showError('uploadError', `Upload failed: ${err.message}`);
                }
                
                progressContainer.style.display = 'none';
            
                // Re-enable form
                document.querySelectorAll('#uploadForm button, #uploadForm input, #uploadForm textarea').forEach(el => {
                    el.disabled = false;
                });
            } finally {
                currentUploadController = null;
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
                document.getElementById('emptyState').innerHTML = '[ERROR_LOADING_CONTENT]';
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
            const tags = content.tags?.slice(0, 3).map(tag => `<span class="tag">#${escapeHtml(tag)}</span>`).join('') || '';
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
                            <div class="meta-item">USER: ${escapeHtml(content.uploader_name)}</div>
                            <div class="meta-item">VIEWS: ${content.view_count || 0}</div>
                            <div class="meta-item">DATE: ${formattedDate}</div>
                            <div class="meta-item">SIZE: ${fileSize}</div>
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
                        <img src="${content.file_url}" alt="${escapeHtml(content.title)}" onerror="this.style.display='none'">
                        <div class="card-type-badge">${typeLabel}</div>
                        ${ownerBadge}
                    </div>
                `;
            }

            return `
                <div class="card-preview">
                    <div style="font-size:3rem;color:rgba(0,255,65,0.6);">${getFileIcon(content.file_type)}</div>
                    <div class="card-type-badge">${typeLabel}</div>
                    ${ownerBadge}
                </div>
            `;
        }

        function getFileIcon(type) {
            switch(type) {
                case 'video': return '[VID]';
                case 'audio': return '[AUDIO]';
                case 'image': return '[IMAGES]';
                case 'document': return '[DOCUMENTS]';
                default: return '[FILE]';
            }
        }

        function getTypeLabel(type) {
            const labels = {
                'video': '[VID]',
                'audio': '[AUDIO]',
                'image': '[IMAGES]',
                'document': '[DOCUMENTS]',
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

            // Increment view count
            const newViewCount = (content.view_count || 0) + 1;
            await supabase
                .from('content')
                .update({ view_count: newViewCount })
                .eq('id', id);

            content.view_count = newViewCount;

            // Show modal
            document.getElementById('viewTitle').textContent = '> ' + content.title;

            const viewContent = document.getElementById('viewContent');
            if (content.file_type === 'video') {
                viewContent.innerHTML = `<video controls autoplay src="${content.file_url}" style="width:100%;max-height:70vh;background:#000;object-fit:contain;"></video>`;
            } else if (content.file_type === 'image') {
                viewContent.innerHTML = `<img src="${content.file_url}" alt="${escapeHtml(content.title)}" style="width:100%;max-height:70vh;object-fit:contain;background:#000;">`;
            } else if (content.file_type === 'audio') {
                viewContent.innerHTML = `
                    <div style="padding:2rem;background:#000;border:2px solid rgba(0,255,65,0.3);text-align:center;min-height:200px;display:flex;flex-direction:column;justify-content:center;">
                        <div style="font-size:4rem;margin-bottom:1rem;">[AUDIO]</div>
                        <audio controls autoplay src="${content.file_url}" style="width:100%;filter:invert(1) hue-rotate(180deg);"></audio>
                    </div>
                `;
            } else {
                viewContent.innerHTML = `
                    <div style="padding:3rem;text-align:center;background:#000;border:2px solid rgba(0,255,65,0.3);min-height:200px;display:flex;flex-direction:column;justify-content:center;">
                        <div style="font-size:3rem;margin-bottom:1rem;">${getFileIcon(content.file_type)}</div>
                        <p style="margin-bottom:1.5rem;">[FILE_PREVIEW_UNAVAILABLE]</p>
                        <p><small>Use download button to get the file</small></p>
                    </div>
                `;
            }

            const viewDescription = document.getElementById('viewDescription');
            if (content.description) {
                viewDescription.innerHTML = `<p>> ${escapeHtml(content.description)}</p>`;
                viewDescription.style.display = 'block';
            } else {
                viewDescription.style.display = 'none';
            }

            document.getElementById('viewMeta').innerHTML = `
                <span>UPLOADER: ${escapeHtml(content.uploader_name)}</span>
                <span>|</span>
                <span>VIEWS: ${content.view_count}</span>
                <span>|</span>
                <span>SIZE: ${formatFileSize(content.file_size)}</span>
            `;

            // Set download button
            const downloadBtn = document.getElementById('downloadBtn');
            downloadBtn.onclick = () => downloadFile(content.file_url, content.title + '.' + content.file_url.split('.').pop());

            showModal('viewModal');
            filterContent(); // Refresh to show updated view count
        }

        // Handle Download from View Modal
        function handleDownload() {
            const content = allContent.find(c => c.id === document.querySelector('.view-btn[data-id]')?.dataset.id);
            if (content) {
                downloadFile(content.file_url, content.title + '.' + content.file_url.split('.').pop());
            }
        }

        // Delete Content
        async function deleteContent(id) {
            if (!window.confirm('[CONFIRM_DELETE?] This action cannot be undone.')) return;

            const content = allContent.find(c => c.id === id);
            if (!content) return;

            try {
                // Delete from database
                const { error: dbError } = await supabase
                    .from('content')
                    .delete()
                    .eq('id', id);
             
                if (dbError) throw dbError;
             
                // Try to delete from storage
                const fileName = content.file_url.split('/').pop();
                await supabase.storage.from('files').remove([fileName]);
             
                // Refresh content
                loadContent();
                showNotification('File deleted successfully!');
            } catch (err) {
                console.error('Delete error:', err);
                window.alert('[ERROR] Failed to delete file: ' + err.message);
            }
        }

        // Download File
        async function downloadFile(url, fileName) {
            try {
                showNotification('Starting download...');
                
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
                
                showNotification('Download completed!');
            } catch (err) {
                console.error('Download error:', err);
                window.alert('[ERROR] Failed to download file: ' + err.message);
            }
        }

        // Utility function to show notifications
        function showNotification(message) {
            // Create notification element
            const notification = document.createElement('div');
            notification.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: #00ff00;
                color: #000;
                padding: 1rem 2rem;
                border: 2px solid #00ff00;
                font-family: 'Courier New', monospace;
                z-index: 10000;
                box-shadow: 0 0 10px #00ff00;
            `;
            notification.textContent = message;
            document.body.appendChild(notification);
            
            // Remove after 3 seconds
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 3000);
        }
    </script>
</body>
</html>
