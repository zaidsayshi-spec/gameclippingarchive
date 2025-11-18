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
