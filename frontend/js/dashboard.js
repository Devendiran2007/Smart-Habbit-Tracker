// Dashboard JavaScript - Main Application Logic

// Require authentication
if (!auth.requireAuth()) {
    throw new Error('Not authenticated');
}

// State
let habits = [];
let currentView = 'dashboard';
let editingHabitId = null;

// DOM Elements
const userName = document.getElementById('userName');
const logoutBtn = document.getElementById('logoutBtn');
const addHabitBtn = document.getElementById('addHabitBtn');
const habitModal = document.getElementById('habitModal');
const closeModal = document.getElementById('closeModal');
const cancelBtn = document.getElementById('cancelBtn');
const habitForm = document.getElementById('habitForm');
const saveBtn = document.getElementById('saveBtn');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

async function initializeApp() {
    // Set user name
    const user = auth.getUser();
    if (user && user.username) {
        userName.textContent = user.username;
    }
    
    // Load habits
    await loadHabits();
    
    // Setup event listeners
    setupEventListeners();
}

// Event Listeners
function setupEventListeners() {
    // Logout
    logoutBtn.addEventListener('click', () => {
        auth.logout();
    });
    
    // Navigation
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const view = item.dataset.view;
            switchView(view);
        });
    });
    
    // Add habit modal
    addHabitBtn.addEventListener('click', openAddHabitModal);
    closeModal.addEventListener('click', closeHabitModal);
    cancelBtn.addEventListener('click', closeHabitModal);
    
    // Form submission
    habitForm.addEventListener('submit', handleHabitSubmit);
    
    // Close modal on outside click
    habitModal.addEventListener('click', (e) => {
        if (e.target === habitModal) {
            closeHabitModal();
        }
    });
}

// View Switching
function switchView(viewName) {
    currentView = viewName;
    
    // Update nav
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
        if (item.dataset.view === viewName) {
            item.classList.add('active');
        }
    });
    
    // Update views
    document.querySelectorAll('.view').forEach(view => {
        view.classList.remove('active');
    });
    document.getElementById(`${viewName}View`).classList.add('active');
    
    // Update header
    const headers = {
        dashboard: { title: 'Dashboard', subtitle: 'Track your habits and build consistency' },
        habits: { title: 'My Habits', subtitle: 'Manage all your habits' },
        stats: { title: 'Statistics', subtitle: 'View detailed analytics' },
        profile: { title: 'Profile Settings', subtitle: 'Manage your account' }
    };
    
    document.getElementById('headerTitle').textContent = headers[viewName].title;
    document.getElementById('headerSubtitle').textContent = headers[viewName].subtitle;
    
    // Render view content
    if (viewName === 'habits') {
        renderAllHabits();
    } else if (viewName === 'stats') {
        renderDetailedStats();
    } else if (viewName === 'profile') {
        renderProfile();
    }
}

// Load Habits
async function loadHabits() {
    try {
        const fetchedHabits = await api.getHabits();
        
        // Check completion status for each habit from the backend
        const habitsWithStatus = await Promise.all(
            fetchedHabits.map(async (habit) => {
                try {
                    // Check if completed today from backend
                    const completionStatus = await api.checkCompletedToday(habit.id);
                    const completedToday = completionStatus.completed_today || false;
                    
                    // Get stats
                    const stats = await api.getStats(habit.id);
                    
                    return {
                        ...habit,
                        completedToday: completedToday,
                        currentStreak: stats?.current_streak || 0,
                        totalCompletions: stats?.total_completions || 0
                    };
                } catch (error) {
                    // If we can't get status, default to not completed
                    return {
                        ...habit,
                        completedToday: false,
                        currentStreak: 0,
                        totalCompletions: 0
                    };
                }
            })
        );
        
        habits = habitsWithStatus;
        renderDashboard();
    } catch (error) {
        console.error('Failed to load habits:', error);
        showError('Failed to load habits');
    }
}

// Render Dashboard
function renderDashboard() {
    updateStats();
    renderTodayHabits();
}

// Update Stats
function updateStats() {
    const totalHabits = habits.length;
    document.getElementById('totalHabits').textContent = totalHabits;
    
    // For now, set placeholder values
    // These would be calculated from actual completion data
    document.getElementById('completedToday').textContent = '0';
    document.getElementById('longestStreak').textContent = '0';
    document.getElementById('completionRate').textContent = '0%';
}

// Render Today's Habits
function renderTodayHabits() {
    const pendingContainer = document.getElementById('todayHabits');
    const completedContainer = document.getElementById('completedHabits');
    
    if (habits.length === 0) {
        pendingContainer.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">🎯</div>
                <p>No habits yet. Click "Add Habit" to get started!</p>
            </div>
        `;
        completedContainer.innerHTML = `
            <div class="empty-state">
                <p style="color: var(--text-secondary); font-size: 0.9rem;">No habits completed yet today</p>
            </div>
        `;
        return;
    }
    
    // Separate completed and pending habits
    const pendingHabits = habits.filter(h => !h.completedToday);
    const completedHabits = habits.filter(h => h.completedToday);
    
    // Render pending habits
    if (pendingHabits.length === 0) {
        pendingContainer.innerHTML = `
            <div class="empty-state">
                <p style="color: var(--text-secondary); font-size: 0.9rem;">All habits completed! 🎉</p>
            </div>
        `;
    } else {
        pendingContainer.innerHTML = pendingHabits.map(habit => createHabitCard(habit)).join('');
    }
    
    // Render completed habits
    if (completedHabits.length === 0) {
        completedContainer.innerHTML = `
            <div class="empty-state">
                <p style="color: var(--text-secondary); font-size: 0.9rem;">No habits completed yet today</p>
            </div>
        `;
    } else {
        completedContainer.innerHTML = completedHabits.map(habit => createHabitCard(habit)).join('');
    }
    
    // Add event listeners
    attachHabitEventListeners();
}

// Render All Habits
function renderAllHabits() {
    const container = document.getElementById('allHabits');
    
    if (habits.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">🎯</div>
                <p>No habits yet. Click "Add Habit" to get started!</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = habits.map(habit => createHabitCard(habit, true)).join('');
    
    // Add event listeners
    attachHabitEventListeners();
}

// Create Habit Card HTML
function createHabitCard(habit, showActions = true) {
    const isCompleted = habit.completedToday || false;
    
    return `
        <div class="habit-card ${isCompleted ? 'completed' : ''}" data-habit-id="${habit.id}">
            <div class="habit-checkbox ${isCompleted ? 'checked' : ''}" data-habit-id="${habit.id}">
            </div>
            <div class="habit-info">
                <div class="habit-title">${escapeHtml(habit.title)}</div>
                ${habit.description ? `<div class="habit-description">${escapeHtml(habit.description)}</div>` : ''}
                <div class="habit-stats">
                    <div class="habit-stat">
                        <span>🔥</span>
                        <span>${habit.currentStreak || 0} day streak</span>
                    </div>
                    <div class="habit-stat">
                        <span>✅</span>
                        <span>${habit.totalCompletions || 0} completions</span>
                    </div>
                </div>
            </div>
            ${showActions ? `
                <div class="habit-actions">
                    <button class="btn-icon edit-habit" data-habit-id="${habit.id}" title="Edit">
                        ✏️
                    </button>
                    <button class="btn-icon delete delete-habit" data-habit-id="${habit.id}" title="Delete">
                        🗑️
                    </button>
                </div>
            ` : ''}
        </div>
    `;
}

// Attach Event Listeners to Habit Cards
function attachHabitEventListeners() {
    // Checkboxes
    document.querySelectorAll('.habit-checkbox').forEach(checkbox => {
        checkbox.addEventListener('click', handleHabitComplete);
    });
    
    // Edit buttons
    document.querySelectorAll('.edit-habit').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const habitId = parseInt(e.target.dataset.habitId);
            openEditHabitModal(habitId);
        });
    });
    
    // Delete buttons
    document.querySelectorAll('.delete-habit').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const habitId = parseInt(e.target.dataset.habitId);
            handleHabitDelete(habitId);
        });
    });
}

// Handle Habit Completion
async function handleHabitComplete(e) {
    const habitId = parseInt(e.target.dataset.habitId);
    const checkbox = e.target;
    const card = checkbox.closest('.habit-card');
    const wasCompleted = checkbox.classList.contains('checked');
    
    // Toggle visual state immediately with animation
    if (wasCompleted) {
        // Unchecking - remove from database
        checkbox.classList.remove('checked');
        card.classList.remove('completed');
        
        try {
            await api.uncompleteHabit(habitId);
            
            // Update habit state
            const habit = habits.find(h => h.id === habitId);
            if (habit) {
                habit.completedToday = false;
                
                // Reload streak data to reflect the change
                try {
                    const stats = await api.getStats(habitId);
                    habit.currentStreak = stats.current_streak;
                    habit.totalCompletions = stats.total_completions;
                } catch (error) {
                    // Reset to 0 if we can't get stats
                    habit.currentStreak = 0;
                    habit.totalCompletions = Math.max(0, (habit.totalCompletions || 0) - 1);
                }
            }
            
            // Animate and move back to pending
            card.style.animation = 'slideOut 0.3s ease-out';
            
            setTimeout(() => {
                renderTodayHabits();
                showSuccess('Habit unmarked');
            }, 300);
            
            updateStats();
            
        } catch (error) {
            // Revert on error
            checkbox.classList.add('checked');
            card.classList.add('completed');
            showError('Failed to unmark habit');
        }
        
    } else {
        // Checking - mark as complete
        checkbox.classList.add('checked');
        card.classList.add('completed');
        
        try {
            await api.completeHabit(habitId);
            
            // Update habit state
            const habit = habits.find(h => h.id === habitId);
            if (habit) {
                habit.completedToday = true;
                
                // Reload streak data to reflect the change
                try {
                    const stats = await api.getStats(habitId);
                    habit.currentStreak = stats.current_streak;
                    habit.totalCompletions = stats.total_completions;
                } catch (error) {
                    // Increment locally if we can't get stats
                    habit.currentStreak = (habit.currentStreak || 0) + 1;
                    habit.totalCompletions = (habit.totalCompletions || 0) + 1;
                }
            }
            
            // Animate card moving to completed section
            card.style.animation = 'slideOut 0.3s ease-out';
            
            setTimeout(() => {
                renderTodayHabits();
                showSuccess('Habit completed! 🎉');
            }, 300);
            
            // Update stats
            updateStats();
            
        } catch (error) {
            // Revert on error
            checkbox.classList.remove('checked');
            card.classList.remove('completed');
            
            if (error.message && error.message.includes('Already completed')) {
                // If already completed, update local state
                const habit = habits.find(h => h.id === habitId);
                if (habit) {
                    habit.completedToday = true;
                }
                renderTodayHabits();
            } else {
                showError('Failed to update habit');
            }
        }
    }
}

// Modal Functions
function openAddHabitModal() {
    editingHabitId = null;
    document.getElementById('modalTitle').textContent = 'Add New Habit';
    document.getElementById('habitTitle').value = '';
    document.getElementById('habitDescription').value = '';
    habitModal.classList.add('show');
}

function openEditHabitModal(habitId) {
    const habit = habits.find(h => h.id === habitId);
    if (!habit) return;
    
    editingHabitId = habitId;
    document.getElementById('modalTitle').textContent = 'Edit Habit';
    document.getElementById('habitTitle').value = habit.title;
    document.getElementById('habitDescription').value = habit.description || '';
    habitModal.classList.add('show');
}

function closeHabitModal() {
    habitModal.classList.remove('show');
    editingHabitId = null;
    habitForm.reset();
}

// Handle Habit Submit
async function handleHabitSubmit(e) {
    e.preventDefault();
    
    const title = document.getElementById('habitTitle').value.trim();
    const description = document.getElementById('habitDescription').value.trim();
    
    if (!title) {
        showError('Please enter a habit name');
        return;
    }
    
    // Show loading
    saveBtn.classList.add('loading');
    saveBtn.disabled = true;
    
    try {
        const habitData = { title, description };
        
        if (editingHabitId) {
            await api.updateHabit(editingHabitId, habitData);
            showSuccess('Habit updated successfully');
        } else {
            await api.createHabit(habitData);
            showSuccess('Habit created successfully');
        }
        
        closeHabitModal();
        await loadHabits();
        
    } catch (error) {
        showError('Failed to save habit');
    } finally {
        saveBtn.classList.remove('loading');
        saveBtn.disabled = false;
    }
}

// Handle Habit Delete
async function handleHabitDelete(habitId) {
    if (!confirm('Are you sure you want to delete this habit?')) {
        return;
    }
    
    try {
        await api.deleteHabit(habitId);
        showSuccess('Habit deleted successfully');
        await loadHabits();
    } catch (error) {
        showError('Failed to delete habit');
    }
}

// Render Detailed Stats
async function renderDetailedStats() {
    const container = document.getElementById('detailedStats');
    
    if (habits.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">📊</div>
                <p>No statistics available yet. Start tracking habits to see your progress!</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = '<div class="loading">Loading statistics...</div>';
    
    try {
        const statsPromises = habits.map(async (habit) => {
            try {
                const stats = await api.getStats(habit.id);
                return { habit, stats };
            } catch (error) {
                return { habit, stats: null };
            }
        });
        
        const results = await Promise.all(statsPromises);
        
        container.innerHTML = `
            <div class="stats-cards-grid">
                ${results.map(({ habit, stats }) => {
                    if (!stats) {
                        return `
                            <div class="stat-detail-card">
                                <div class="stat-card-header">
                                    <h3>${escapeHtml(habit.title)}</h3>
                                    <span class="stat-badge">No Data</span>
                                </div>
                                <p class="stat-no-data">Start completing this habit to see statistics</p>
                            </div>
                        `;
                    }
                    
                    const completionRate = stats.completion_rate_last_30_days;
                    const streakStatus = stats.current_streak >= 7 ? 'excellent' : stats.current_streak >= 3 ? 'good' : 'start';
                    
                    return `
                        <div class="stat-detail-card">
                            <div class="stat-card-header">
                                <div class="stat-card-title">
                                    <div class="stat-icon">🎯</div>
                                    <h3>${escapeHtml(habit.title)}</h3>
                                </div>
                                <span class="stat-badge ${streakStatus}">${stats.current_streak} day streak</span>
                            </div>
                            
                            <div class="stat-metrics">
                                <div class="stat-metric">
                                    <div class="metric-icon">🔥</div>
                                    <div class="metric-content">
                                        <div class="metric-value">${stats.current_streak}</div>
                                        <div class="metric-label">Current Streak</div>
                                    </div>
                                </div>
                                
                                <div class="stat-metric">
                                    <div class="metric-icon">⭐</div>
                                    <div class="metric-content">
                                        <div class="metric-value">${stats.longest_streak}</div>
                                        <div class="metric-label">Best Streak</div>
                                    </div>
                                </div>
                                
                                <div class="stat-metric">
                                    <div class="metric-icon">✅</div>
                                    <div class="metric-content">
                                        <div class="metric-value">${stats.total_completions}</div>
                                        <div class="metric-label">Total Done</div>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="stat-progress">
                                <div class="progress-header">
                                    <span class="progress-label">30-Day Completion Rate</span>
                                    <span class="progress-value">${completionRate}%</span>
                                </div>
                                <div class="progress-bar">
                                    <div class="progress-fill" style="width: ${completionRate}%"></div>
                                </div>
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
        `;
        
    } catch (error) {
        container.innerHTML = '<div class="error">Failed to load statistics</div>';
    }
}

// Render Profile
async function renderProfile() {
    try {
        const user = await api.getCurrentUser();
        
        // Populate form fields
        document.getElementById('profileUsername').value = user.username;
        document.getElementById('profileEmail').value = user.email;
        
        // Setup form handlers if not already done
        setupProfileHandlers();
    } catch (error) {
        console.error('Failed to load profile:', error);
        showError('Failed to load profile information');
    }
}

// Setup Profile Form Handlers
function setupProfileHandlers() {
    const profileForm = document.getElementById('profileForm');
    const passwordForm = document.getElementById('passwordForm');
    
    // Remove existing listeners to avoid duplicates
    const newProfileForm = profileForm.cloneNode(true);
    const newPasswordForm = passwordForm.cloneNode(true);
    profileForm.parentNode.replaceChild(newProfileForm, profileForm);
    passwordForm.parentNode.replaceChild(newPasswordForm, passwordForm);
    
    // Profile update handler
    newProfileForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const username = document.getElementById('profileUsername').value.trim();
        const email = document.getElementById('profileEmail').value.trim();
        
        if (!username || !email) {
            showError('Please fill in all fields');
            return;
        }
        
        try {
            await api.updateProfile({ username, email });
            
            // Update stored user data
            const user = auth.getUser();
            user.username = username;
            user.email = email;
            localStorage.setItem('user', JSON.stringify(user));
            
            // Update display
            document.getElementById('userName').textContent = username;
            
            showSuccess('Profile updated successfully! 🎉');
        } catch (error) {
            showError(error.message || 'Failed to update profile');
        }
    });
    
    // Password change handler
    newPasswordForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const currentPassword = document.getElementById('currentPassword').value;
        const newPassword = document.getElementById('newPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        
        // Validation
        if (!currentPassword || !newPassword || !confirmPassword) {
            showError('Please fill in all password fields');
            return;
        }
        
        if (newPassword.length < 6) {
            showError('New password must be at least 6 characters');
            return;
        }
        
        if (newPassword !== confirmPassword) {
            showError('New passwords do not match');
            return;
        }
        
        try {
            await api.changePassword({
                old_password: currentPassword,
                new_password: newPassword
            });
            
            // Clear form
            newPasswordForm.reset();
            
            showSuccess('Password changed successfully! 🔒');
        } catch (error) {
            showError(error.message || 'Failed to change password');
        }
    });
}

// Utility Functions
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function showSuccess(message) {
    // Simple alert for now - could be replaced with toast notification
    console.log('Success:', message);
    alert(message);
}

function showError(message) {
    // Simple alert for now - could be replaced with toast notification
    console.error('Error:', message);
    alert(message);
}
