// Supabase Configuration
const SUPABASE_URL = 'https://tgnqbayejloephsdqxae.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRnbnFiYXllamxvZXBoc2RxeGFlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM0MTMyMzUsImV4cCI6MjA3ODk4OTIzNX0.yICueAwjGZyFt5ycnhxOEx8MHgFhRBi9Zd4Drhj89IQ';
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Enhanced Compression Settings
const COMPRESSION_CONFIG = {
  image: {
    maxWidth: 2560,
    maxHeight: 2560,
    quality: 0.82,
    targetSizeMB: Infinity,
    minQuality: 0.6
  },
  video: {
    maxWidth: 1920,
    maxHeight: 1080,
    skipCompressionUnderMB: 50, // Skip compression for files under 50MB
    targetBitrate: 2500000 // 2.5 Mbps
  },
  audio: {
    skipCompression: true // Audio is already compressed
  }
};

// State
let currentUser = null;
let allContent = [];
let currentFilter = 'all';
let selectedFile = null;
let compressedFile = null;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  initAuth();
  loadContent();
  setupEventListeners();
  polishUI();
});

function polishUI() {
  const style = document.createElement('style');
  style.textContent = `
    body, .modal, .content-card {
      font-family: 'Courier New', monospace;
      color: #00ff00;
      background-color: #000;
    }
    ::-webkit-scrollbar {
      width: 0px;
      background: transparent;
    }
    .content-card {
      border: 1px solid #00ff00;
      padding: 10px;
      margin: 10px;
      box-shadow: 0 0 10px #00ff00;
      min-width: 300px;
      max-width: 350px;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      box-sizing: border-box;
    }
    .card-actions {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
      margin-top: 8px;
    }
    .card-btn {
      flex: 1;
      min-width: 80px;
      padding: 8px 12px;
      white-space: nowrap;
    }
    .card-preview {
      height: 200px;
      width: 100%;
      object-fit: cover;
      position: relative;
      background: #001100;
    }
    .card-preview img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .view-modal .modal-content {
      background: #000;
      border: 2px solid #00ff00;
      max-width: 90vw;
      max-height: 90vh;
      overflow: hidden;
    }
    .compression-info {
      color: #00ff00;
      font-size: 0.85em;
      margin-top: 5px;
      padding: 8px;
      border: 1px solid rgba(0,255,0,0.5);
      background: rgba(0,255,0,0.05);
    }
    .compression-progress {
      width: 100%;
      height: 4px;
      background: rgba(0,255,0,0.2);
      margin: 8px 0;
      border-radius: 2px;
      overflow: hidden;
    }
    .compression-progress-bar {
      height: 100%;
      background: #00ff00;
      transition: width 0.3s ease;
      box-shadow: 0 0 10px #00ff00;
    }
    .upload-progress-container {
      position: fixed;
      bottom: 10px;
      right: 10px;
      background: #000;
      border: 1px solid #00ff00;
      padding: 10px;
      box-shadow: 0 0 10px #00ff00;
      z-index: 1000;
    }
  `;
  document.head.appendChild(style);
}

// Advanced Image Compression
async function compressImage(file, config = COMPRESSION_CONFIG.image) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        const ratio = Math.min(config.maxWidth / width, config.maxHeight / height, 1);
        width = Math.floor(width * ratio);
        height = Math.floor(height * ratio);

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d', { alpha: false });

        if (ratio < 0.5) {
          const tempCanvas = document.createElement('canvas');
          const tempCtx = tempCanvas.getContext('2d', { alpha: false });
          let currentWidth = img.width;
          let currentHeight = img.height;
          tempCanvas.width = currentWidth;
          tempCanvas.height = currentHeight;
          tempCtx.drawImage(img, 0, 0);

          while (currentWidth > width * 2 || currentHeight > height * 2) {
            currentWidth = Math.max(Math.floor(currentWidth / 2), width);
            currentHeight = Math.max(Math.floor(currentHeight / 2), height);
            const nextCanvas = document.createElement('canvas');
            const nextCtx = nextCanvas.getContext('2d', { alpha: false });
            nextCanvas.width = currentWidth;
            nextCanvas.height = currentHeight;
            nextCtx.imageSmoothingEnabled = true;
            nextCtx.imageSmoothingQuality = 'high';
            nextCtx.drawImage(tempCanvas, 0, 0, currentWidth, currentHeight);
            tempCanvas.width = currentWidth;
            tempCanvas.height = currentHeight;
            tempCtx.clearRect(0, 0, currentWidth, currentHeight);
            tempCtx.drawImage(nextCanvas, 0, 0);
          }
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          ctx.drawImage(tempCanvas, 0, 0, width, height);
        } else {
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          ctx.drawImage(img, 0, 0, width, height);
        }

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Canvas compression failed'));
              return;
            }
            const compressedFile = new File(
              [blob],
              file.name.split('.')[0] + '_compressed.jpg',
              { type: 'image/jpeg', lastModified: Date.now() }
            );
            const savedPercent = ((1 - blob.size / file.size) * 100).toFixed(1);
            resolve({
              file: compressedFile,
              originalSize: file.size,
              compressedSize: blob.size,
              compressionRatio: savedPercent,
              dimensions: `${width}x${height}`,
              originalDimensions: `${img.width}x${img.height}`
            });
          },
          'image/jpeg',
          config.quality
        );
      };
      img.onerror = () => reject(new Error('Image loading failed'));
    };
    reader.onerror = () => reject(new Error('File reading failed'));
  });
}

// Helper functions for mime types
function getBestVideoMime() {
  const candidates = [
    'video/webm;codecs=vp9,opus',
    'video/webm;codecs=vp8,opus',
    'video/webm'
  ];
  for (const mime of candidates) {
    if (MediaRecorder.isTypeSupported(mime)) return mime;
  }
  return 'video/webm';
}

function getBestAudioMime() {
  const candidates = [
    'audio/webm;codecs=opus',
    'audio/webm'
  ];
  for (const mime of candidates) {
    if (MediaRecorder.isTypeSupported(mime)) return mime;
  }
  return 'audio/webm';
}

// IMPROVED Video Compression - No frame dropping, faster processing
async function compressVideo(file, config = COMPRESSION_CONFIG.video) {
  try {
    const fileSizeMB = file.size / 1024 / 1024;
    
    // Skip compression for reasonably sized files
    if (fileSizeMB < config.skipCompressionUnderMB) {
      console.log(`[✓ Video size OK (${fileSizeMB.toFixed(2)}MB), skipping compression]`);
      return {
        file: file,
        originalSize: file.size,
        compressedSize: file.size,
        compressionRatio: 0,
        note: 'Video already optimized - uploading original'
      };
    }

    console.log('[Starting video compression...]');
    const url = URL.createObjectURL(file);
    const video = document.createElement('video');
    video.src = url;
    video.muted = false;
    video.preload = 'metadata';
    video.style.display = 'none';
    document.body.appendChild(video);

    await new Promise((resolve, reject) => {
      video.onloadedmetadata = resolve;
      video.onerror = () => reject(new Error('Video loading failed'));
      setTimeout(() => reject(new Error('Video load timeout')), 30000);
    });

    // Check if resize is needed
    let width = video.videoWidth;
    let height = video.videoHeight;
    const needsResize = width > config.maxWidth || height > config.maxHeight;

    if (!needsResize) {
      console.log('[✓ Video dimensions OK, uploading original]');
      document.body.removeChild(video);
      URL.revokeObjectURL(url);
      return {
        file: file,
        originalSize: file.size,
        compressedSize: file.size,
        compressionRatio: 0,
        note: 'Video dimensions already optimal'
      };
    }

    // Calculate new dimensions
    const ratio = Math.min(config.maxWidth / width, config.maxHeight / height);
    width = Math.floor(width * ratio);
    height = Math.floor(height * ratio);

    // Create canvas for drawing
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    canvas.style.display = 'none';
    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d', {
      alpha: false,
      desynchronized: true
    });

    // Setup streams
    const fps = 30;
    const canvasStream = canvas.captureStream(fps);
    
    // Capture audio from original video
    const videoStream = video.captureStream();
    const audioTracks = videoStream.getAudioTracks();
    
    const combinedStream = new MediaStream();
    combinedStream.addTrack(canvasStream.getVideoTracks()[0]);
    if (audioTracks.length > 0) {
      combinedStream.addTrack(audioTracks[0]);
    }

    // Setup MediaRecorder
    const mimeType = getBestVideoMime();
    const mediaRecorder = new MediaRecorder(combinedStream, {
      mimeType,
      videoBitsPerSecond: config.targetBitrate,
      audioBitsPerSecond: 128000
    });

    const chunks = [];
    mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunks.push(e.data);
    };

    const compressionPromise = new Promise((resolve, reject) => {
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: mimeType });
        resolve(blob);
      };
      mediaRecorder.onerror = reject;
      setTimeout(() => reject(new Error('Compression timeout')), 300000);
    });

    mediaRecorder.start(1000); // Collect chunks every second

    // Frame-perfect drawing loop
    let isDrawing = true;
    let frameCount = 0;

    const drawFrame = () => {
      if (!isDrawing || video.paused || video.ended) return;
      
      ctx.drawImage(video, 0, 0, width, height);
      frameCount++;

      // Update progress
      if (video.duration > 0) {
        const percent = Math.min(95, (video.currentTime / video.duration) * 100);
        const progressBar = document.getElementById('compressionProgress');
        if (progressBar) {
          progressBar.style.width = `${percent}%`;
        }
      }

      // Use requestVideoFrameCallback for perfect sync (Chrome/Edge)
      if ('requestVideoFrameCallback' in video) {
        video.requestVideoFrameCallback(drawFrame);
      } else {
        requestAnimationFrame(drawFrame);
      }
    };

    // Start drawing before playback
    if ('requestVideoFrameCallback' in video) {
      video.requestVideoFrameCallback(drawFrame);
    } else {
      requestAnimationFrame(drawFrame);
    }

    // Play video
    await video.play();

    // Wait for completion
    await new Promise((resolve) => {
      video.onended = () => {
        isDrawing = false;
        resolve();
      };
    });

    // Stop recording
    mediaRecorder.stop();
    const blob = await compressionPromise;

    // Cleanup
    document.body.removeChild(video);
    document.body.removeChild(canvas);
    URL.revokeObjectURL(url);

    const progressBar = document.getElementById('compressionProgress');
    if (progressBar) progressBar.style.width = '100%';

    // Only use compressed version if it's actually smaller
    if (blob.size >= file.size * 0.9) {
      console.log('[Using original - compressed not smaller]');
      return {
        file: file,
        originalSize: file.size,
        compressedSize: file.size,
        compressionRatio: 0,
        note: 'Resized version not smaller, using original'
      };
    }

    const ext = mimeType.includes('mp4') ? 'mp4' : 'webm';
    const compressedFile = new File(
      [blob],
      file.name.replace(/\.[^.]+$/, `_resized.${ext}`),
      { type: mimeType.split(';')[0] }
    );

    console.log(`[✓ Video compressed: ${(file.size/1024/1024).toFixed(2)}MB → ${(blob.size/1024/1024).toFixed(2)}MB, ${frameCount} frames]`);

    return {
      file: compressedFile,
      originalSize: file.size,
      compressedSize: blob.size,
      compressionRatio: ((1 - blob.size / file.size) * 100).toFixed(1),
      dimensions: `${width}x${height}`,
      originalDimensions: `${video.videoWidth}x${video.videoHeight}`
    };

  } catch (error) {
    console.error('[✗ Video compression error:]', error);
    return {
      file: file,
      originalSize: file.size,
      compressedSize: file.size,
      compressionRatio: 0,
      error: true,
      note: `Uploading original video (${error.message})`
    };
  }
}

// IMPROVED Audio Compression - Skip re-encoding (already compressed)
async function compressAudio(file, config = COMPRESSION_CONFIG.audio) {
  try {
    const fileSizeMB = file.size / 1024 / 1024;
    
    // Audio files are typically already compressed (MP3, AAC, etc.)
    // Re-encoding takes forever and doesn't help much
    console.log(`[✓ Audio file (${fileSizeMB.toFixed(2)}MB), uploading original]`);
    
    return {
      file: file,
      originalSize: file.size,
      compressedSize: file.size,
      compressionRatio: 0,
      note: 'Audio already compressed - no re-encoding needed'
    };
    
  } catch (error) {
    console.error('[✗ Audio processing error:]', error);
    return {
      file: file,
      originalSize: file.size,
      compressedSize: file.size,
      compressionRatio: 0,
      error: true,
      note: `Using original audio (${error.message})`
    };
  }
}

// Create upload progress indicator
function createUploadProgress(fileName) {
  const progressContainer = document.createElement('div');
  progressContainer.className = 'upload-progress-container';
  progressContainer.innerHTML = `
    <p>Uploading ${fileName}</p>
    <div class="compression-progress">
      <div class="compression-progress-bar" style="width: 0%"></div>
    </div>
  `;
  document.body.appendChild(progressContainer);
  return progressContainer.querySelector('.compression-progress-bar');
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
  document.getElementById('loginBtn').addEventListener('click', () => showModal('loginModal'));
  document.getElementById('uploadBtn').addEventListener('click', () => showModal('uploadModal'));
  document.getElementById('logoutBtn').addEventListener('click', logout);
  
  document.getElementById('showSignupBtn').addEventListener('click', () => {
    hideModal('loginModal');
    showModal('signupModal');
  });
  
  document.getElementById('showLoginBtn').addEventListener('click', () => {
    hideModal('signupModal');
    showModal('loginModal');
  });
  
  document.querySelectorAll('.close-btn, .cancel-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const modal = e.target.closest('.modal');
      if (modal) hideModal(modal.id);
    });
  });
  
  document.getElementById('loginForm').addEventListener('submit', handleLogin);
  document.getElementById('signupForm').addEventListener('submit', handleSignup);
  document.getElementById('uploadForm').addEventListener('submit', handleUpload);
  document.getElementById('searchInput').addEventListener('input', filterContent);
  
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');
      currentFilter = e.target.dataset.type;
      filterContent();
    });
  });
  
  document.getElementById('fileInput').addEventListener('change', handleFileSelect);
  
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
    compressedFile = null;
    document.querySelector('.file-label').classList.remove('has-file');
    document.getElementById('fileInput').value = '';
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
    const { data, error } = await supabase
      .from('accounts')
      .insert([{ username, password, display_name: displayName }])
      .select()
      .single();
    
    if (error) {
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

// File Selection with Smart Compression
async function handleFileSelect(e) {
  selectedFile = e.target.files[0];
  compressedFile = null;
  
  if (selectedFile) {
    const fileLabel = document.querySelector('.file-label');
    fileLabel.classList.add('has-file');
    document.getElementById('fileLabel').textContent = '[FILE_LOADED]';
    
    const fileType = detectFileType(selectedFile);
    let infoHTML = `
      <p><strong>${selectedFile.name}</strong></p>
      <small>SIZE: ${(selectedFile.size / 1024 / 1024).toFixed(2)}MB :: TYPE: ${fileType.toUpperCase()}</small>
      <div class="compression-progress">
        <div class="compression-progress-bar" id="compressionProgress" style="width: 0%"></div>
      </div>
    `;
    
    document.getElementById('fileInfo').innerHTML = infoHTML;
    document.getElementById('fileInfo').style.display = 'block';
    
    // Smart compression based on file type
    try {
      let result;
      const progressBar = document.getElementById('compressionProgress');
      
      if (fileType === 'image') {
        progressBar.style.width = '30%';
        infoHTML += '<p style="color: #ffff00;">[OPTIMIZING_IMAGE...]</p>';
        document.getElementById('fileInfo').innerHTML = infoHTML;
        result = await compressImage(selectedFile);
      } else if (fileType === 'video') {
        progressBar.style.width = '10%';
        infoHTML += '<p style="color: #ffff00;">[ANALYZING_VIDEO...]</p>';
        document.getElementById('fileInfo').innerHTML = infoHTML;
        result = await compressVideo(selectedFile);
      } else if (fileType === 'audio') {
        progressBar.style.width = '50%';
        infoHTML += '<p style="color: #ffff00;">[ANALYZING_AUDIO...]</p>';
        document.getElementById('fileInfo').innerHTML = infoHTML;
        result = await compressAudio(selectedFile);
      } else {
        result = {
          file: selectedFile,
          originalSize: selectedFile.size,
          compressedSize: selectedFile.size,
          compressionRatio: 0
        };
      }
      
      progressBar.style.width = '100%';
      
      if (result) {
        if (result.compressedSize < result.originalSize) {
          compressedFile = result.file;
        }
        
        infoHTML = `
          <p><strong>${selectedFile.name}</strong></p>
          <small>TYPE: ${fileType.toUpperCase()}</small>
          <div class="compression-info">
            <p>[ANALYSIS_COMPLETE]</p>
            ${result.originalDimensions ? `<p>ORIGINAL_DIM: ${result.originalDimensions}</p>` : ''}
            ${result.dimensions ? `<p>COMPRESSED_DIM: ${result.dimensions}</p>` : ''}
            <p>ORIGINAL_SIZE: ${(result.originalSize / 1024 / 1024).toFixed(2)}MB</p>
            <p>UPLOAD_SIZE: ${(result.compressedSize / 1024 / 1024).toFixed(2)}MB</p>
            ${result.compressionRatio > 0 ? `<p style="color: #00ffff;">SPACE_SAVED: ${result.compressionRatio}%</p>` : ''}
            ${result.compressedSize < result.originalSize ? 
              `<p style="color: #00ff00;">✓ COMPRESSION_SUCCESSFUL</p>` : 
              `<p style="color: #00ff00;">✓ FILE_READY</p>`
            }
            ${result.note ? `<p>${result.note}</p>` : ''}
          </div>
        `;
      }
    } catch (error) {
      console.error('Processing error:', error);
      infoHTML += '<p style="color: #ff0000;">[PROCESSING_FAILED - WILL_UPLOAD_ORIGINAL]</p>';
    }
    
    document.getElementById('fileInfo').innerHTML = infoHTML;
    
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
  if (type.startsWith('audio/') || name.match(/\.(mp3|wav|ogg|m4a|flac|aac)/)) return 'audio';
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
  const fileType = detectFileType(selectedFile);
  const fileToUpload = compressedFile || selectedFile;
  
  const timestamp = Date.now();
  const randomStr = Math.random().toString(36).substr(2, 9);
  const originalExt = selectedFile.name.split('.').pop().toLowerCase();
  let finalExt = originalExt;
  
  if (compressedFile) {
    if (fileType === 'image') {
      finalExt = 'jpg';
    } else if (fileType === 'video') {
      finalExt = compressedFile.name.split('.').pop().toLowerCase();
    } else if (fileType === 'audio') {
      finalExt = compressedFile.name.split('.').pop().toLowerCase();
    }
  }
  
  const fileName = `${timestamp}-${randomStr}.${finalExt}`;
  console.log('Uploading file:', fileName, 'Size:', fileToUpload.size, 'Type:', fileToUpload.type);
  
  // Close modal and show background progress
  hideModal('uploadModal');
  const progressBar = createUploadProgress(fileName);
  progressBar.style.width = '0%';
  
  try {
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('files')
      .upload(fileName, fileToUpload, {
        cacheControl: '3600',
        upsert: false,
        contentType: fileToUpload.type
      });
    
    if (uploadError) {
      console.error('Upload error details:', uploadError);
      throw uploadError;
    }
    
    progressBar.style.width = '90%';
    
    const { data: urlData } = supabase.storage
      .from('files')
      .getPublicUrl(fileName);
    
    const { error: dbError } = await supabase
      .from('content')
      .insert([{
        title,
        description,
        file_url: urlData.publicUrl,
        file_type: fileType,
        file_size: fileToUpload.size,
        uploader_name: currentUser.display_name || currentUser.username,
        uploader_id: currentUser.id,
        view_count: 0,
        tags
      }]);
    
    if (dbError) throw dbError;
    
    progressBar.style.width = '100%';
    loadContent();
  } catch (err) {
    console.error('Upload error:', err);
    alert('Upload failed: ' + err.message);
  } finally {
    setTimeout(() => {
      progressBar.parentElement.remove();
    }, 3000);
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
    <div class="card-preview" style="display:flex;align-items:center;justify-content:center;">
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
    case 'image': return '[IMG]';
    case 'document': return '[DOC]';
    default: return '[FILE]';
  }
}

function getTypeLabel(type) {
  const labels = {
    'video': '[VID]',
    'audio': '[AUDIO]',
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
  
  const newViewCount = (content.view_count || 0) + 1;
  await supabase
    .from('content')
    .update({ view_count: newViewCount })
    .eq('id', id);
  
  content.view_count = newViewCount;
  
  document.getElementById('viewTitle').textContent = '> ' + content.title;
  const viewContent = document.getElementById('viewContent');
  
  if (content.file_type === 'video') {
    viewContent.innerHTML = `
      <video controls autoplay src="${content.file_url}" 
        style="width:100%;height:80vh;background:#000;object-fit:contain;">
      </video>
    `;
  } else if (content.file_type === 'image') {
    viewContent.innerHTML = `
      <img src="${content.file_url}" alt="${escapeHtml(content.title)}" 
        style="width:100%;height:80vh;object-fit:contain;background:#000;">
    `;
  } else if (content.file_type === 'audio') {
    viewContent.innerHTML = `
      <div style="padding:2rem;background:#000;border:2px solid rgba(0,255,65,0.3);text-align:center;height:80vh;display:flex;flex-direction:column;justify-content:center;">
        <div style="font-size:4rem;margin-bottom:1rem;">[AUDIO]</div>
        <audio controls autoplay src="${content.file_url}" style="width:100%;filter:invert(1) hue-rotate(180deg);"></audio>
      </div>
    `;
  } else {
    viewContent.innerHTML = `
      <div style="padding:3rem;text-align:center;background:#000;border:2px solid rgba(0,255,65,0.3);height:80vh;display:flex;flex-direction:column;justify-content:center;">
        <p style="margin-bottom:1.5rem;">[FILE_PREVIEW_UNAVAILABLE]</p>
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
  `;
  
  const downloadBtn = document.getElementById('downloadBtn');
  if (downloadBtn) {
    downloadBtn.style.display = 'none';
  }
  
  showModal('viewModal');
  filterContent();
}

// Delete Content
async function deleteContent(id) {
  if (!window.confirm('[CONFIRM_DELETE?] This action cannot be undone.')) return;
  
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
    window.alert('[ERROR] Failed to delete file');
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
    window.alert('[ERROR] Failed to download file');
  }
}
