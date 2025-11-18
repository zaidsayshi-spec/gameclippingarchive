<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>GCA Platform</title>
    <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
    <style>
        /* Modern UI Redesign for GCA Platform */
        :root {
            --primary: #00ff41;
            --primary-glow: rgba(0, 255, 65, 0.4);
            --primary-light: rgba(0, 255, 65, 0.1);
            --secondary: #8a2be2;
            --secondary-glow: rgba(138, 43, 226, 0.4);
            --dark: #0a0a0a;
            --darker: #050505;
            --dark-card: #111111;
            --light: #f0f0f0;
            --gray: #888;
            --success: #00c853;
            --error: #ff1744;
            --warning: #ff9800;
            --border-radius: 12px;
            --transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
            --shadow: 0 4px 20px rgba(0, 0, 0, 0.25);
            --glow: 0 0 20px var(--primary-glow);
        }

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }

        body {
            background: linear-gradient(135deg, var(--darker) 0%, var(--dark) 100%);
            color: var(--light);
            min-height: 100vh;
            line-height: 1.6;
            overflow-x: hidden;
        }

        /* Header Styles */
        header {
            background: rgba(10, 10, 10, 0.85);
            backdrop-filter: blur(10px);
            border-bottom: 1px solid rgba(0, 255, 65, 0.2);
            padding: 1rem 2rem;
            position: sticky;
            top: 0;
            z-index: 100;
            box-shadow: var(--shadow);
        }

        .header-content {
            display: flex;
            justify-content: space-between;
            align-items: center;
            max-width: 1400px;
            margin: 0 auto;
        }

        .logo {
            display: flex;
            align-items: center;
            gap: 12px;
            font-size: 1.8rem;
            font-weight: 700;
            color: var(--primary);
            text-shadow: 0 0 10px var(--primary-glow);
        }

        .logo-icon {
            font-size: 2rem;
            filter: drop-shadow(0 0 8px var(--primary-glow));
        }

        .header-actions {
            display: flex;
            gap: 1rem;
            align-items: center;
        }

        /* Button Styles */
        .btn {
            padding: 0.7rem 1.5rem;
            border-radius: var(--border-radius);
            border: none;
            font-weight: 600;
            cursor: pointer;
            transition: var(--transition);
            display: flex;
            align-items: center;
            gap: 8px;
            position: relative;
            overflow: hidden;
        }

        .btn::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
            transition: left 0.5s;
        }

        .btn:hover::before {
            left: 100%;
        }

        .btn-primary {
            background: linear-gradient(135deg, var(--primary) 0%, #00cc38 100%);
            color: var(--darker);
            box-shadow: 0 4px 15px rgba(0, 255, 65, 0.3);
        }

        .btn-primary:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(0, 255, 65, 0.5);
        }

        .btn-secondary {
            background: rgba(0, 255, 65, 0.1);
            color: var(--primary);
            border: 1px solid rgba(0, 255, 65, 0.3);
        }

        .btn-secondary:hover {
            background: rgba(0, 255, 65, 0.2);
            box-shadow: 0 0 15px rgba(0, 255, 65, 0.3);
        }

        .btn-outline {
            background: transparent;
            color: var(--light);
            border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .btn-outline:hover {
            background: rgba(255, 255, 255, 0.05);
            border-color: rgba(255, 255, 255, 0.4);
        }

        .btn-danger {
            background: rgba(255, 23, 68, 0.1);
            color: var(--error);
            border: 1px solid rgba(255, 23, 68, 0.3);
        }

        .btn-danger:hover {
            background: rgba(255, 23, 68, 0.2);
            box-shadow: 0 0 15px rgba(255, 23, 68, 0.3);
        }

        /* Main Content */
        main {
            max-width: 1400px;
            margin: 0 auto;
            padding: 2rem;
        }

        .controls {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 2rem;
            flex-wrap: wrap;
            gap: 1rem;
        }

        .search-container {
            position: relative;
            flex-grow: 1;
            max-width: 500px;
        }

        .search-icon {
            position: absolute;
            left: 15px;
            top: 50%;
            transform: translateY(-50%);
            color: var(--gray);
        }

        .search-input {
            width: 100%;
            padding: 0.8rem 1rem 0.8rem 3rem;
            border-radius: var(--border-radius);
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(255, 255, 255, 0.1);
            color: var(--light);
            font-size: 1rem;
            transition: var(--transition);
        }

        .search-input:focus {
            outline: none;
            border-color: var(--primary);
            box-shadow: 0 0 0 2px rgba(0, 255, 65, 0.2);
        }

        .filter-tabs {
            display: flex;
            background: rgba(255, 255, 255, 0.05);
            border-radius: var(--border-radius);
            padding: 4px;
            border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .filter-btn {
            padding: 0.6rem 1.2rem;
            background: transparent;
            border: none;
            color: var(--gray);
            border-radius: 8px;
            cursor: pointer;
            transition: var(--transition);
            font-weight: 500;
        }

        .filter-btn.active {
            background: rgba(0, 255, 65, 0.15);
            color: var(--primary);
            box-shadow: 0 0 10px rgba(0, 255, 65, 0.2);
        }

        .filter-btn:hover:not(.active) {
            background: rgba(255, 255, 255, 0.05);
            color: var(--light);
        }

        /* Content Grid */
        .content-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
            gap: 1.5rem;
            margin-bottom: 2rem;
        }

        .content-card {
            background: var(--dark-card);
            border-radius: var(--border-radius);
            overflow: hidden;
            transition: var(--transition);
            border: 1px solid rgba(255, 255, 255, 0.05);
            position: relative;
        }

        .content-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 1px;
            background: linear-gradient(90deg, transparent, var(--primary), transparent);
            opacity: 0;
            transition: opacity 0.3s;
        }

        .content-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4), var(--glow);
            border-color: rgba(0, 255, 65, 0.3);
        }

        .content-card:hover::before {
            opacity: 1;
        }

        .card-preview {
            position: relative;
            height: 180px;
            overflow: hidden;
            display: flex;
            align-items: center;
            justify-content: center;
            background: linear-gradient(135deg, rgba(0, 255, 65, 0.05) 0%, rgba(10, 10, 10, 0.8) 100%);
        }

        .card-preview img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            transition: transform 0.5s;
        }

        .content-card:hover .card-preview img {
            transform: scale(1.05);
        }

        .card-type-badge {
            position: absolute;
            top: 10px;
            right: 10px;
            background: rgba(0, 0, 0, 0.7);
            color: var(--primary);
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 0.7rem;
            font-weight: 600;
            backdrop-filter: blur(5px);
        }

        .card-owner-badge {
            position: absolute;
            top: 10px;
            left: 10px;
            background: rgba(0, 200, 83, 0.2);
            color: var(--success);
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 0.7rem;
            font-weight: 600;
            border: 1px solid rgba(0, 200, 83, 0.3);
        }

        .card-content {
            padding: 1.2rem;
        }

        .card-title {
            font-size: 1.1rem;
            margin-bottom: 0.5rem;
            color: var(--light);
            font-weight: 600;
            line-height: 1.4;
        }

        .card-description {
            color: var(--gray);
            font-size: 0.9rem;
            margin-bottom: 0.8rem;
            line-height: 1.5;
        }

        .card-tags {
            display: flex;
            flex-wrap: wrap;
            gap: 6px;
            margin-bottom: 1rem;
        }

        .tag {
            background: rgba(0, 255, 65, 0.1);
            color: var(--primary);
            padding: 3px 8px;
            border-radius: 12px;
            font-size: 0.75rem;
            border: 1px solid rgba(0, 255, 65, 0.2);
        }

        .card-meta {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
            margin-bottom: 1rem;
            font-size: 0.8rem;
            color: var(--gray);
        }

        .meta-item {
            display: flex;
            align-items: center;
            gap: 4px;
        }

        .card-actions {
            display: flex;
            gap: 8px;
        }

        .card-btn {
            flex: 1;
            padding: 0.5rem;
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(255, 255, 255, 0.1);
            color: var(--light);
            border-radius: 6px;
            cursor: pointer;
            transition: var(--transition);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 0.85rem;
        }

        .card-btn:hover {
            background: rgba(255, 255, 255, 0.1);
            transform: translateY(-2px);
        }

        .card-btn.view-btn:hover {
            background: rgba(0, 255, 65, 0.1);
            color: var(--primary);
            border-color: rgba(0, 255, 65, 0.3);
        }

        .card-btn.download-btn:hover {
            background: rgba(138, 43, 226, 0.1);
            color: var(--secondary);
            border-color: rgba(138, 43, 226, 0.3);
        }

        .card-btn.delete:hover {
            background: rgba(255, 23, 68, 0.1);
            color: var(--error);
            border-color: rgba(255, 23, 68, 0.3);
        }

        /* Modal Styles */
        .modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            backdrop-filter: blur(5px);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
            opacity: 0;
            visibility: hidden;
            transition: opacity 0.3s, visibility 0.3s;
            padding: 1rem;
        }

        .modal.active {
            opacity: 1;
            visibility: visible;
        }

        .modal-content {
            background: linear-gradient(135deg, var(--dark-card) 0%, var(--darker) 100%);
            border-radius: var(--border-radius);
            width: 100%;
            max-width: 500px;
            max-height: 90vh;
            overflow-y: auto;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(0, 255, 65, 0.1), 0 0 30px rgba(0, 255, 65, 0.2);
            border: 1px solid rgba(0, 255, 65, 0.2);
            position: relative;
            transform: translateY(20px);
            transition: transform 0.3s;
        }

        .modal.active .modal-content {
            transform: translateY(0);
        }

        .modal-header {
            padding: 1.5rem;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .modal-title {
            font-size: 1.3rem;
            font-weight: 600;
            color: var(--primary);
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .close-btn {
            background: none;
            border: none;
            color: var(--gray);
            font-size: 1.5rem;
            cursor: pointer;
            width: 30px;
            height: 30px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            transition: var(--transition);
        }

        .close-btn:hover {
            background: rgba(255, 255, 255, 0.1);
            color: var(--light);
        }

        .modal-body {
            padding: 1.5rem;
        }

        .form-group {
            margin-bottom: 1.2rem;
        }

        .form-label {
            display: block;
            margin-bottom: 0.5rem;
            color: var(--light);
            font-weight: 500;
        }

        .form-input {
            width: 100%;
            padding: 0.8rem 1rem;
            border-radius: 8px;
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(255, 255, 255, 0.1);
            color: var(--light);
            font-size: 1rem;
            transition: var(--transition);
        }

        .form-input:focus {
            outline: none;
            border-color: var(--primary);
            box-shadow: 0 0 0 2px rgba(0, 255, 65, 0.2);
        }

        .file-upload {
            position: relative;
            margin-bottom: 1.2rem;
        }

        .file-label {
            display: block;
            padding: 1.2rem;
            border: 2px dashed rgba(255, 255, 255, 0.2);
            border-radius: 8px;
            text-align: center;
            cursor: pointer;
            transition: var(--transition);
            background: rgba(255, 255, 255, 0.02);
        }

        .file-label:hover {
            border-color: rgba(0, 255, 65, 0.4);
            background: rgba(0, 255, 65, 0.05);
        }

        .file-label.has-file {
            border-color: var(--primary);
            background: rgba(0, 255, 65, 0.1);
            color: var(--primary);
        }

        .file-input {
            position: absolute;
            opacity: 0;
            width: 0;
            height: 0;
        }

        .file-info {
            margin-top: 0.8rem;
            padding: 0.8rem;
            background: rgba(0, 255, 65, 0.05);
            border-radius: 6px;
            border: 1px solid rgba(0, 255, 65, 0.1);
        }

        .progress-container {
            margin-top: 1rem;
            background: rgba(255, 255, 255, 0.05);
            border-radius: 10px;
            overflow: hidden;
            height: 10px;
        }

        .progress-fill {
            height: 100%;
            background: linear-gradient(90deg, var(--primary) 0%, #00cc38 100%);
            width: 0%;
            transition: width 0.3s;
            border-radius: 10px;
        }

        .progress-text {
            margin-top: 0.5rem;
            font-size: 0.8rem;
            color: var(--primary);
            text-align: center;
        }

        .error-message {
            padding: 0.8rem;
            background: rgba(255, 23, 68, 0.1);
            border: 1px solid rgba(255, 23, 68, 0.3);
            border-radius: 6px;
            color: var(--error);
            margin-top: 1rem;
            font-size: 0.9rem;
            display: none;
        }

        .error-message.active {
            display: block;
        }

        .modal-footer {
            padding: 1.5rem;
            border-top: 1px solid rgba(255, 255, 255, 0.1);
            display: flex;
            justify-content: flex-end;
            gap: 1rem;
        }

        /* View Modal Specific */
        #viewModal .modal-content {
            max-width: 800px;
        }

        #viewContent {
            max-height: 60vh;
            overflow: auto;
            display: flex;
            align-items: center;
            justify-content: center;
            background: #000;
            border-radius: 8px;
            margin-bottom: 1rem;
        }

        #viewDescription {
            margin-bottom: 1rem;
            padding: 1rem;
            background: rgba(255, 255, 255, 0.03);
            border-radius: 8px;
        }

        .view-meta {
            display: flex;
            gap: 1rem;
            margin-bottom: 1.5rem;
            flex-wrap: wrap;
            color: var(--gray);
            font-size: 0.9rem;
        }

        /* Loading and Empty States */
        .loading {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 3rem;
            color: var(--gray);
        }

        .spinner {
            width: 40px;
            height: 40px;
            border: 4px solid rgba(255, 255, 255, 0.1);
            border-left: 4px solid var(--primary);
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin-bottom: 1rem;
        }

        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }

        .empty-state {
            text-align: center;
            padding: 3rem;
            color: var(--gray);
        }

        .empty-icon {
            font-size: 4rem;
            margin-bottom: 1rem;
            opacity: 0.5;
        }

        /* Responsive Design */
        @media (max-width: 768px) {
            .header-content {
                flex-direction: column;
                gap: 1rem;
            }
            
            .controls {
                flex-direction: column;
                align-items: stretch;
            }
            
            .content-grid {
                grid-template-columns: 1fr;
            }
            
            .modal-content {
                margin: 1rem;
                width: calc(100% - 2rem);
            }
        }

        /* Utility Classes */
        .text-center {
            text-align: center;
        }

        .text-primary {
            color: var(--primary);
        }

        .mt-1 {
            margin-top: 1rem;
        }

        .mb-1 {
            margin-bottom: 1rem;
        }

        .hidden {
            display: none;
        }
    </style>
</head>
<body>
    <header>
        <div class="header-content">
            <div class="logo">
                <span class="logo-icon">⚡</span>
                <span>GCA Platform</span>
            </div>
            <div class="header-actions">
                <button id="loginBtn" class="btn btn-secondary">Login</button>
                <button id="uploadBtn" class="btn btn-primary hidden">Upload</button>
                <button id="logoutBtn" class="btn btn-outline hidden">Logout</button>
            </div>
        </div>
    </header>

    <main>
        <div class="controls">
            <div class="search-container">
                <span class="search-icon">🔍</span>
                <input type="text" id="searchInput" class="search-input" placeholder="Search content...">
            </div>
            <div class="filter-tabs">
                <button class="filter-btn active" data-type="all">All</button>
                <button class="filter-btn" data-type="image">Images</button>
                <button class="filter-btn" data-type="video">Videos</button>
                <button class="filter-btn" data-type="audio">Audio</button>
                <button class="filter-btn" data-type="document">Documents</button>
            </div>
        </div>

        <div id="loading" class="loading">
            <div class="spinner"></div>
            <p>Loading content...</p>
        </div>

        <div id="emptyState" class="empty-state hidden">
            <div class="empty-icon">📁</div>
            <h3>No content found</h3>
            <p>Upload some files to get started!</p>
        </div>

        <div id="contentGrid" class="content-grid"></div>
    </main>

    <!-- Login Modal -->
    <div id="loginModal" class="modal">
        <div class="modal-content">
            <div class="modal-header">
                <h2 class="modal-title">🔐 Login</h2>
                <button class="close-btn">&times;</button>
            </div>
            <div class="modal-body">
                <form id="loginForm">
                    <div class="form-group">
                        <label class="form-label" for="loginUsername">Username</label>
                        <input type="text" id="loginUsername" class="form-input" required>
                    </div>
                    <div class="form-group">
                        <label class="form-label" for="loginPassword">Password</label>
                        <input type="password" id="loginPassword" class="form-input" required>
                    </div>
                    <div id="loginError" class="error-message"></div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-outline cancel-btn">Cancel</button>
                        <button type="submit" class="btn btn-primary">Login</button>
                    </div>
                </form>
                <div class="text-center mt-1">
                    <p>Don't have an account? <button id="showSignupBtn" class="btn btn-outline" style="padding: 0.3rem 0.8rem;">Sign Up</button></p>
                </div>
            </div>
        </div>
    </div>

    <!-- Signup Modal -->
    <div id="signupModal" class="modal">
        <div class="modal-content">
            <div class="modal-header">
                <h2 class="modal-title">📝 Sign Up</h2>
                <button class="close-btn">&times;</button>
            </div>
            <div class="modal-body">
                <form id="signupForm">
                    <div class="form-group">
                        <label class="form-label" for="signupUsername">Username</label>
                        <input type="text" id="signupUsername" class="form-input" required>
                    </div>
                    <div class="form-group">
                        <label class="form-label" for="signupDisplayName">Display Name (Optional)</label>
                        <input type="text" id="signupDisplayName" class="form-input">
                    </div>
                    <div class="form-group">
                        <label class="form-label" for="signupPassword">Password</label>
                        <input type="password" id="signupPassword" class="form-input" required>
                    </div>
                    <div class="form-group">
                        <label class="form-label" for="signupConfirmPassword">Confirm Password</label>
                        <input type="password" id="signupConfirmPassword" class="form-input" required>
                    </div>
                    <div id="signupError" class="error-message"></div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-outline cancel-btn">Cancel</button>
                        <button type="submit" class="btn btn-primary">Sign Up</button>
                    </div>
                </form>
                <div class="text-center mt-1">
                    <p>Already have an account? <button id="showLoginBtn" class="btn btn-outline" style="padding: 0.3rem 0.8rem;">Login</button></p>
                </div>
            </div>
        </div>
    </div>

    <!-- Upload Modal -->
    <div id="uploadModal" class="modal">
        <div class="modal-content">
            <div class="modal-header">
                <h2 class="modal-title">📤 Upload File</h2>
                <button class="close-btn">&times;</button>
            </div>
            <div class="modal-body">
                <form id="uploadForm">
                    <div class="file-upload">
                        <label for="fileInput" class="file-label" id="fileLabel">
                            📁 Click to select file or drag & drop
                        </label>
                        <input type="file" id="fileInput" class="file-input">
                        <div id="fileInfo" class="file-info hidden"></div>
                    </div>
                    <div class="form-group">
                        <label class="form-label" for="uploadTitle">Title</label>
                        <input type="text" id="uploadTitle" class="form-input" required>
                    </div>
                    <div class="form-group">
                        <label class="form-label" for="uploadDescription">Description (Optional)</label>
                        <textarea id="uploadDescription" class="form-input" rows="3"></textarea>
                    </div>
                    <div class="form-group">
                        <label class="form-label" for="uploadTags">Tags (comma separated)</label>
                        <input type="text" id="uploadTags" class="form-input" placeholder="tag1, tag2, tag3">
                    </div>
                    <div id="uploadProgress" class="hidden">
                        <div class="progress-container">
                            <div class="progress-fill"></div>
                        </div>
                        <div class="progress-text">[UPLOADING...] 0%</div>
                    </div>
                    <div id="uploadError" class="error-message"></div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-outline cancel-btn">Cancel</button>
                        <button type="submit" class="btn btn-primary">Upload</button>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <!-- View Modal -->
    <div id="viewModal" class="modal">
        <div class="modal-content">
            <div class="modal-header">
                <h2 class="modal-title" id="viewTitle">Content Viewer</h2>
                <button class="close-btn">&times;</button>
            </div>
            <div class="modal-body">
                <div id="viewContent"></div>
                <div id="viewDescription" class="hidden"></div>
                <div class="view-meta" id="viewMeta"></div>
                <div class="modal-footer">
                    <button id="downloadBtn" class="btn btn-primary">Download</button>
                    <button class="btn btn-outline cancel-btn">Close</button>
                </div>
            </div>
        </div>
    </div>

    <script>
        // Supabase Configuration
        const SUPABASE_URL = 'https://tgnqbayejloephsdqxae.supabase.co';
        const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRnbnFiYXllamxvZXBoc2RxeGFlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM0MTMyMzUsImV4cCI6MjA3ODk4OTIzNX0.yICueAwjGZyFt5ycnhxOEx8MHgFhRBi9Zd4Drhj89IQ';
        const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        
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
                loginBtn.classList.add('hidden');
                uploadBtn.classList.remove('hidden');
                logoutBtn.classList.remove('hidden');
            } else {
                loginBtn.classList.remove('hidden');
                uploadBtn.classList.add('hidden');
                logoutBtn.classList.add('hidden');
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
                document.getElementById('fileInfo').classList.add('hidden');
                document.getElementById('uploadProgress').classList.add('hidden');
                selectedFile = null;
                document.querySelector('.file-label').classList.remove('has-file');
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
                // Create account - let database handle duplicate username via unique constraint
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
                    console.error('Error code:', error.code);
                    console.error('Error message:', error.message);
                    console.error('Error details:', error.details);
                   
                    // Check if it's a duplicate username error
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
                const fileLabel = document.querySelector('.file-label');
                fileLabel.classList.add('has-file');
                document.getElementById('fileLabel').textContent = '[FILE_LOADED]';
               
                const fileInfo = document.getElementById('fileInfo');
                fileInfo.innerHTML = `<p><strong>${selectedFile.name}</strong></p><small>SIZE: ${(selectedFile.size / 1024 / 1024).toFixed(2)}MB :: TYPE: ${detectFileType(selectedFile).toUpperCase()}</small>`;
                fileInfo.classList.remove('hidden');
               
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
            progressContainer.classList.remove('hidden');
           
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
                        progressText.textContent = `[UPLOADING...] ${Math.floor(progress)}%`;
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
                progressText.textContent = '[UPLOADING...] 95%';
               
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
                progressText.textContent = '[UPLOAD_COMPLETE] 100%';
               
                setTimeout(() => {
                    hideModal('uploadModal');
                    loadContent();
                }, 500);
               
            } catch (err) {
                console.error('Upload error:', err);
                showError('uploadError', 'Upload failed: ' + err.message);
                progressContainer.classList.add('hidden');
               
                // Re-enable form
                document.querySelectorAll('#uploadForm button, #uploadForm input, #uploadForm textarea').forEach(el => {
                    el.disabled = false;
                });
            }
        }
        
        // Load Content
        async function loadContent() {
            document.getElementById('loading').classList.remove('hidden');
            document.getElementById('contentGrid').innerHTML = '';
            document.getElementById('emptyState').classList.add('hidden');
           
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
                document.getElementById('loading').classList.add('hidden');
                document.getElementById('emptyState').classList.remove('hidden');
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
            document.getElementById('loading').classList.add('hidden');
            const grid = document.getElementById('contentGrid');
            const emptyState = document.getElementById('emptyState');
           
            if (content.length === 0) {
                grid.innerHTML = '';
                emptyState.classList.remove('hidden');
                return;
            }
           
            emptyState.classList.add('hidden');
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
                            <div class="meta-item">👤 ${escapeHtml(content.uploader_name)}</div>
                            <div class="meta-item">👁 ${content.view_count || 0}</div>
                            <div class="meta-item">📅 ${formattedDate}</div>
                            <div class="meta-item">💾 ${fileSize}</div>
                        </div>
                        <div class="card-actions">
                            <button class="card-btn view-btn" data-id="${content.id}">▶ View</button>
                            <button class="card-btn download-btn" data-url="${content.file_url}">↓</button>
                            ${isOwner ? `<button class="card-btn delete delete-btn" data-id="${content.id}">🗑</button>` : ''}
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
                <div class="card-preview" style="display:flex;align-items:center;justify-content:center;">
                    <div style="font-size:3rem;color:rgba(0,255,65,0.6);">${getFileIcon(content.file_type)}</div>
                    <div class="card-type-badge">${typeLabel}</div>
                    ${ownerBadge}
                </div>
            `;
        }
        
        function getFileIcon(type) {
            switch(type) {
                case 'video': return '🎬';
                case 'audio': return '🎵';
                case 'image': return '🖼';
                case 'document': return '📄';
                default: return '📁';
            }
        }
        
        function getTypeLabel(type) {
            const labels = {
                'video': '[VID]',
                'audio': '[AUD]',
                'image': '[IMG]',
                'document': '[DOC]',
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
            document.getElementById('viewTitle').textContent = content.title;
           
            const viewContent = document.getElementById('viewContent');
            if (content.file_type === 'video') {
                viewContent.innerHTML = `<video controls autoplay src="${content.file_url}" style="width:100%;max-height:70vh;background:#000;"></video>`;
            } else if (content.file_type === 'image') {
                viewContent.innerHTML = `<img src="${content.file_url}" alt="${escapeHtml(content.title)}" style="width:100%;max-height:70vh;object-fit:contain;background:#000;">`;
            } else if (content.file_type === 'audio') {
                viewContent.innerHTML = `
                    <div style="padding:2rem;background:#000;border:2px solid rgba(0,255,65,0.3);text-align:center;">
                        <div style="font-size:4rem;margin-bottom:1rem;">🎵</div>
                        <audio controls autoplay src="${content.file_url}" style="width:100%;filter:invert(1) hue-rotate(180deg);"></audio>
                    </div>
                `;
            } else {
                viewContent.innerHTML = `
                    <div style="padding:3rem;text-align:center;background:#000;border:2px solid rgba(0,255,65,0.3);">
                        <p style="margin-bottom:1.5rem;">[FILE_PREVIEW_UNAVAILABLE]</p>
                        <button class="btn btn-primary" onclick="window.open('${content.file_url}', '_blank')">Download File</button>
                    </div>
                `;
            }
           
            const viewDescription = document.getElementById('viewDescription');
            if (content.description) {
                viewDescription.innerHTML = `<p>${escapeHtml(content.description)}</p>`;
                viewDescription.classList.remove('hidden');
            } else {
                viewDescription.classList.add('hidden');
            }
           
            document.getElementById('viewMeta').innerHTML = `
                <span>UPLOADER: ${escapeHtml(content.uploader_name)}</span>
                <span>|</span>
                <span>VIEWS: ${content.view_count}</span>
            `;
           
            document.getElementById('downloadBtn').onclick = () => window.open(content.file_url, '_blank');
           
            showModal('viewModal');
            filterContent(); // Refresh to show updated view count
        }
        
        // Delete Content
        async function deleteContent(id) {
            if (!confirm('[CONFIRM_DELETE?] This action cannot be undone.')) return;
           
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
                alert('[ERROR] Failed to delete file');
            }
        }
    </script>
</body>
</html>
