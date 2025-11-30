// Data storage
let cityData = JSON.parse(localStorage.getItem('cityData')) || [];
let issues = JSON.parse(localStorage.getItem('issues')) || [];
let feedback = JSON.parse(localStorage.getItem('feedback')) || [];
let users = JSON.parse(localStorage.getItem('users')) || [];
let notifications = JSON.parse(localStorage.getItem('notifications')) || [];
let admins = JSON.parse(localStorage.getItem('admins')) || [
    { username: 'srisanth', password: 'sasi123', email: 'srisanth@admin.com' },
    { username: 'admin2', password: 'admin2', email: 'admin2@admin.com' }
];
let currentUser = null;
let isAdmin = false;

// DOM elements
const adminBtn = document.getElementById('adminBtn');
const userBtn = document.getElementById('userBtn');
const logoutBtn = document.getElementById('logoutBtn');
const welcomePanel = document.getElementById('welcomePanel');
const adminLoginPanel = document.getElementById('adminLoginPanel');
const userLoginPanel = document.getElementById('userLoginPanel');
const userRegisterPanel = document.getElementById('userRegisterPanel');
const adminResetPanel = document.getElementById('adminResetPanel');
const userResetPanel = document.getElementById('userResetPanel');
const adminPanel = document.getElementById('adminPanel');
const userPanel = document.getElementById('userPanel');



// Panel switching
adminBtn.addEventListener('click', showAdminPanel);
userBtn.addEventListener('click', showUserPanel);
logoutBtn.addEventListener('click', logout);

// Role selection - Add event listeners when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    const selectAdminBtn = document.getElementById('selectAdmin');
    const selectUserBtn = document.getElementById('selectUser');
    
    if (selectAdminBtn) {
        selectAdminBtn.addEventListener('click', showAdminLogin);
    }
    if (selectUserBtn) {
        selectUserBtn.addEventListener('click', showUserLogin);
    }
});

// Login forms - ensure proper validation
document.addEventListener('DOMContentLoaded', function() {
    const adminForm = document.getElementById('adminLoginForm');
    const userForm = document.getElementById('userLoginForm');
    
    if (adminForm) {
        adminForm.addEventListener('submit', function(e) {
            e.preventDefault();
            adminLogin(e);
        });
    }
    
    if (userForm) {
        userForm.addEventListener('submit', function(e) {
            e.preventDefault();
            userLogin(e);
        });
    }
});
document.getElementById('userRegisterForm').addEventListener('submit', userRegister);
document.getElementById('createAdminForm').addEventListener('submit', createNewAdmin);

// Reset forms
document.getElementById('adminResetForm').addEventListener('submit', adminReset);
document.getElementById('userResetForm').addEventListener('submit', userReset);

function showWelcome() {
    welcomePanel.classList.remove('hidden');
    adminLoginPanel.classList.add('hidden');
    userLoginPanel.classList.add('hidden');
    userRegisterPanel.classList.add('hidden');
    adminResetPanel.classList.add('hidden');
    userResetPanel.classList.add('hidden');
    adminPanel.classList.add('hidden');
    userPanel.classList.add('hidden');
    adminBtn.classList.remove('active');
    userBtn.classList.remove('active');
    logoutBtn.classList.add('hidden');
}

window.showAdminLogin = function() {
    document.getElementById('welcomePanel').classList.add('hidden');
    document.getElementById('adminLoginPanel').classList.remove('hidden');
    document.getElementById('userLoginPanel').classList.add('hidden');
    document.getElementById('adminPanel').classList.add('hidden');
    document.getElementById('userPanel').classList.add('hidden');
    generateAdminLoginCaptcha();
}

window.showUserLogin = function() {
    document.getElementById('welcomePanel').classList.add('hidden');
    document.getElementById('userLoginPanel').classList.remove('hidden');
    document.getElementById('adminLoginPanel').classList.add('hidden');
    document.getElementById('adminPanel').classList.add('hidden');
    document.getElementById('userPanel').classList.add('hidden');
    generateLoginCaptcha();
}

function showUserRegister() {
    showRegisterTab();
}

function showLoginTab() {
    document.getElementById('loginTab').classList.add('active');
    document.getElementById('registerTab').classList.remove('active');
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-btn')[0].classList.add('active');
    setTimeout(() => generateLoginCaptcha(), 100);
}

function showRegisterTab() {
    document.getElementById('registerTab').classList.add('active');
    document.getElementById('loginTab').classList.remove('active');
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-btn')[1].classList.add('active');
    setTimeout(() => generateRegisterCaptcha(), 100);
}

function showAdminReset() {
    adminLoginPanel.classList.add('hidden');
    adminResetPanel.classList.remove('hidden');
}

function showUserReset() {
    userLoginPanel.classList.add('hidden');
    userResetPanel.classList.remove('hidden');
}

function showAdminPanel() {
    if (!isAdmin) return;
    welcomePanel.classList.add('hidden');
    adminLoginPanel.classList.add('hidden');
    userLoginPanel.classList.add('hidden');
    adminPanel.classList.remove('hidden');
    userPanel.classList.add('hidden');
    adminBtn.classList.add('active');
    userBtn.classList.remove('active');
    logoutBtn.classList.remove('hidden');
}

function showUserPanel() {
    if (!currentUser) return;
    welcomePanel.classList.add('hidden');
    adminLoginPanel.classList.add('hidden');
    userLoginPanel.classList.add('hidden');
    userPanel.classList.remove('hidden');
    adminPanel.classList.add('hidden');
    userBtn.classList.add('active');
    adminBtn.classList.remove('active');
    logoutBtn.classList.remove('hidden');
    displayServices();
}

function adminLogin(e) {
    e.preventDefault();
    const username = document.getElementById('adminUsername').value.trim();
    const password = document.getElementById('adminPassword').value.trim();
    const captchaInputElement = document.getElementById('adminLoginCaptchaInput');
    
    // Strict validation - must have both fields
    if (!username || !password) {
        alert('Please enter both username and password.');
        return false;
    }
    
    // CAPTCHA validation
    if (captchaInputElement && adminLoginCaptcha) {
        const captchaInput = captchaInputElement.value.trim();
        if (captchaInput !== adminLoginCaptcha) {
            alert('Invalid CAPTCHA. Please try again.');
            generateAdminLoginCaptcha();
            captchaInputElement.value = '';
            return false;
        }
    }
    
    // STRICT CREDENTIAL CHECK - MUST MATCH EXACTLY
    if (username !== 'srisanth' || password !== 'sasi123') {
        alert('Access Denied: Invalid username or password.');
        document.getElementById('adminUsername').value = '';
        document.getElementById('adminPassword').value = '';
        generateAdminLoginCaptcha();
        document.getElementById('adminLoginCaptchaInput').value = '';
        return false;
    }
    
    // SUCCESS - Navigate to admin panel
    currentUser = username;
    isAdmin = true;
    
    // Hide login panel and show admin panel
    document.getElementById('adminLoginPanel').classList.add('hidden');
    document.getElementById('adminPanel').classList.remove('hidden');
    document.getElementById('welcomePanel').classList.add('hidden');
    
    // Update navigation buttons
    document.getElementById('logoutBtn').classList.remove('hidden');
    document.getElementById('adminBtn').classList.add('hidden');
    document.getElementById('userBtn').classList.add('hidden');
    
    // Clear form
    document.getElementById('adminUsername').value = '';
    document.getElementById('adminPassword').value = '';
    document.getElementById('adminLoginCaptchaInput').value = '';
    
    alert('Admin login successful!');
    return true;
}

function userLogin(e) {
    e.preventDefault();
    const username = document.getElementById('userUsername').value;
    const password = document.getElementById('userPassword').value;
    const captchaInputElement = document.getElementById('loginCaptchaInput');
    
    if (captchaInputElement && loginCaptcha) {
        const captchaInput = captchaInputElement.value;
        if (captchaInput !== loginCaptcha) {
            alert('Invalid CAPTCHA. Please try again.');
            generateLoginCaptcha();
            captchaInputElement.value = '';
            return;
        }
    }
    
    const existingUser = users.find(u => u.username === username);
    
    if (existingUser) {
        if (existingUser.blocked) {
            alert('Your account has been blocked by the administrator.');
            return;
        }
        if (existingUser.password === password) {
            currentUser = username;
            isAdmin = false;
            showUserPanel();
            e.target.reset();
            alert('Login successful!');
        } else {
            alert('Invalid password');
        }
    } else {
        alert('User not found. Please register first.');
    }
}

function userRegister(e) {
    e.preventDefault();
    const username = document.getElementById('regUsername').value;
    const password = document.getElementById('regPassword').value;
    const fullName = document.getElementById('regFullName').value;
    const phone = document.getElementById('regPhone').value;
    const email = document.getElementById('regEmail').value;
    const captchaInput = document.getElementById('registerCaptchaInput').value;
    
    if (captchaInput !== registerCaptcha) {
        alert('Invalid CAPTCHA. Please try again.');
        generateRegisterCaptcha();
        document.getElementById('registerCaptchaInput').value = '';
        return;
    }
    
    const existingUser = users.find(u => u.username === username);
    
    if (existingUser) {
        alert('Username already exists. Please choose a different username.');
        return;
    }
    
    if (!validateEmail(email)) {
        alert('Please enter a valid email address ending with .com\nAllowed providers: gmail.com, yahoo.com, hotmail.com, outlook.com, etc.');
        return;
    }
    
    if (!validatePhone(phone)) {
        alert('Phone number must be exactly 10 digits\nExample: 9876543210');
        return;
    }
    
    if (!validatePassword(password)) {
        alert('Password requirements not met:\n• Length: 5-8 characters\n• Must contain: uppercase letter, lowercase letter, number, special character\nExample: Pass@123');
        return;
    }
    
    if (username && password && fullName && phone && email) {
        const newUser = {
            username,
            password,
            fullName,
            phone,
            email,
            registeredDate: new Date().toLocaleDateString()
        };
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));
        
        e.target.reset();
        alert('Registration successful! Please login with your credentials.');
        showUserLogin();
    } else {
        alert('Please fill all fields');
    }
}

function logout() {
    currentUser = null;
    isAdmin = false;
    
    // Hide all panels
    document.querySelectorAll('.panel').forEach(panel => {
        panel.classList.add('hidden');
    });
    
    // Show welcome panel
    welcomePanel.classList.remove('hidden');
    
    // Reset navigation buttons
    adminBtn.classList.remove('active');
    userBtn.classList.remove('active');
    logoutBtn.classList.add('hidden');
    
    // Hide all sections within panels
    document.querySelectorAll('.section, .form-container').forEach(section => {
        section.classList.add('hidden');
    });
    
    // Reset any active tabs
    document.querySelectorAll('.nav-tab').forEach(tab => {
        tab.classList.remove('active');
    });
}

// Admin functions
function showAddForm() {
    if (!isAdmin) {
        alert('Access denied. Admin authentication required.');
        return;
    }
    hideAllSections();
    setActiveTab('Add City Info');
    const form = document.getElementById('addForm');
    form.classList.remove('hidden');
}

function showManageServices() {
    if (!isAdmin) {
        alert('Access denied. Admin authentication required.');
        return;
    }
    alert(`Total Services: ${cityData.length}\nTotal Issues: ${issues.length}\nTotal Feedback: ${feedback.length}`);
}

function showInfrastructure() {
    if (!isAdmin) {
        alert('Access denied. Admin authentication required.');
        return;
    }
    const infrastructure = cityData.filter(item => item.type === 'infrastructure');
    alert(`Infrastructure Items: ${infrastructure.length}\n${infrastructure.map(item => `- ${item.name} (${item.city})`).join('\n')}`);
}

function showReports() {
    if (!isAdmin) {
        alert('Access denied. Admin authentication required.');
        return;
    }
    hideAllSections();
    setActiveTab('View Reports');
    const section = document.getElementById('reportsSection');
    section.classList.remove('hidden');
    displayReports();
}

function showFeedbacks() {
    if (!isAdmin) {
        alert('Access denied. Admin authentication required.');
        return;
    }
    hideAllSections();
    setActiveTab('View Feedback');
    const section = document.getElementById('feedbackSection');
    section.classList.remove('hidden');
    displayFeedbacks();
}

function displayReports() {
    const container = document.getElementById('reportsList');
    if (issues.length === 0) {
        container.innerHTML = '<p>No reports found.</p>';
        return;
    }
    
    container.innerHTML = issues.map(issue => `
        <div class="report-item">
            <h4>Issue with: ${issue.service}</h4>
            <p>${issue.description}</p>
            <div class="status ${issue.status}">${issue.status.toUpperCase()}</div>
            <button class="status-btn" onclick="updateStatus(${issue.id}, 'solved')">Mark Solved</button>
            <button class="status-btn" onclick="updateStatus(${issue.id}, 'unsolved')">Mark Unsolved</button>
            ${issue.status === 'solved' ? `<button class="delete-btn" onclick="deleteReport(${issue.id})">Delete Report</button>` : ''}
            <div class="meta">Reported by: ${issue.user} on ${issue.dateReported}</div>
        </div>
    `).join('');
}

function displayFeedbacks() {
    const container = document.getElementById('feedbackList');
    if (feedback.length === 0) {
        container.innerHTML = '<p>No feedback found.</p>';
        return;
    }
    
    container.innerHTML = feedback.map(fb => `
        <div class="feedback-item">
            <h4>Feedback for: ${fb.service}</h4>
            <p>${fb.feedback}</p>
            <div class="rating">Rating: ${fb.rating}/5 stars</div>
            <div class="status ${fb.status || 'pending'}">${(fb.status || 'pending').toUpperCase()}</div>
            <button class="status-btn" onclick="updateFeedbackStatus(${fb.id}, 'reviewed')">Mark Reviewed</button>
            <button class="delete-btn" onclick="deleteFeedback(${fb.id})">Delete Feedback</button>
            <div class="meta">By: ${fb.user} on ${fb.dateSubmitted}</div>
        </div>
    `).join('');
}

function updateStatus(issueId, newStatus) {
    const issue = issues.find(i => i.id === issueId);
    if (issue) {
        issue.status = newStatus;
        localStorage.setItem('issues', JSON.stringify(issues));
        
        // Get user phone number
        const user = users.find(u => u.username === issue.user);
        const phoneNumber = user ? user.phone : 'Unknown';
        
        const smsMessage = newStatus === 'solved' ? 
            `Good news! Your issue with "${issue.service}" has been resolved. - City Management` :
            `Your issue with "${issue.service}" is being reviewed and marked as ${newStatus}. - City Management`;
        
        // Send notification to user
        const notification = {
            id: Date.now(),
            user: issue.user,
            message: smsMessage,
            phone: phoneNumber,
            date: new Date().toLocaleDateString(),
            type: 'issue_update'
        };
        notifications.push(notification);
        localStorage.setItem('notifications', JSON.stringify(notifications));
        
        displayReports();
        alert(`Issue marked as ${newStatus}\nSMS sent to: ${phoneNumber}\nMessage: ${smsMessage}`);
    }
}

function updateFeedbackStatus(feedbackId, newStatus) {
    const fb = feedback.find(f => f.id === feedbackId);
    if (fb) {
        fb.status = newStatus;
        localStorage.setItem('feedback', JSON.stringify(feedback));
        
        // Get user phone number
        const user = users.find(u => u.username === fb.user);
        const phoneNumber = user ? user.phone : 'Unknown';
        
        const smsMessage = `Thank you for your feedback on "${fb.service}". Your input helps us improve our services! - City Management`;
        
        // Send notification to user
        const notification = {
            id: Date.now(),
            user: fb.user,
            message: smsMessage,
            phone: phoneNumber,
            date: new Date().toLocaleDateString(),
            type: 'feedback_thanks'
        };
        notifications.push(notification);
        localStorage.setItem('notifications', JSON.stringify(notifications));
        
        displayFeedbacks();
        alert(`Feedback marked as ${newStatus}\nSMS sent to: ${phoneNumber}\nMessage: ${smsMessage}`);
    }
}

function showMyReports() {
    if (!currentUser) {
        alert('Please login to view your reports.');
        return;
    }
    hideAllUserSections();
    setActiveUserTab('My Reports');
    const section = document.getElementById('myReportsSection');
    section.classList.remove('hidden');
    displayMyReports();
}

function displayMyReports() {
    const container = document.getElementById('myReportsList');
    const myIssues = issues.filter(issue => issue.user === currentUser);
    const myFeedback = feedback.filter(fb => fb.user === currentUser);
    
    let html = '<h4>My Reports</h4>';
    if (myIssues.length === 0) {
        html += '<p>No reports found.</p>';
    } else {
        html += myIssues.map(issue => `
            <div class="report-item">
                <h5>${issue.service}</h5>
                <p>${issue.description}</p>
                <div class="status ${issue.status}">${issue.status.toUpperCase()}</div>
                <button class="edit-btn" onclick="editMyReport(${issue.id})">Edit</button>
                <button class="delete-btn" onclick="deleteMyReport(${issue.id})">Delete</button>
                <div class="meta">Reported on ${issue.dateReported}</div>
            </div>
        `).join('');
    }
    
    html += '<h4>My Feedback</h4>';
    if (myFeedback.length === 0) {
        html += '<p>No feedback found.</p>';
    } else {
        html += myFeedback.map(fb => `
            <div class="feedback-item">
                <h5>${fb.service}</h5>
                <p>${fb.feedback}</p>
                <div class="rating">Rating: ${fb.rating}/5 stars</div>
                <div class="status ${fb.status || 'pending'}">${(fb.status || 'pending').toUpperCase()}</div>
                <button class="edit-btn" onclick="editMyFeedback(${fb.id})">Edit</button>
                <button class="delete-btn" onclick="deleteMyFeedback(${fb.id})">Delete</button>
                <div class="meta">Submitted on ${fb.dateSubmitted}</div>
            </div>
        `).join('');
    }
    
    container.innerHTML = html;
}

function showNotifications() {
    if (!currentUser) {
        alert('Please login to view notifications.');
        return;
    }
    hideAllUserSections();
    setActiveUserTab('Notifications');
    const section = document.getElementById('notificationsSection');
    section.classList.remove('hidden');
    displayNotifications();
}

function displayNotifications() {
    const container = document.getElementById('notificationsList');
    const userNotifications = notifications.filter(n => n.user === currentUser);
    
    if (userNotifications.length === 0) {
        container.innerHTML = '<p>No notifications found.</p>';
        return;
    }
    
    container.innerHTML = userNotifications.map(notification => `
        <div class="notification-item ${notification.type}">
            <p>${notification.message}</p>
            <div class="meta">SMS sent to: ${notification.phone} on ${notification.date}</div>
        </div>
    `).join('');
}

// Service edit form submission
document.getElementById('serviceEditForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const serviceId = parseInt(document.getElementById('editServiceId').value);
    const serviceIndex = cityData.findIndex(s => s.id === serviceId);
    
    if (serviceIndex !== -1) {
        cityData[serviceIndex] = {
            ...cityData[serviceIndex],
            city: document.getElementById('editCityName').value,
            name: document.getElementById('editServiceName').value,
            type: document.getElementById('editServiceType').value,
            address: document.getElementById('editAddress').value,
            latitude: document.getElementById('editLatitude').value,
            longitude: document.getElementById('editLongitude').value,
            phone: document.getElementById('editPhone').value,
            email: document.getElementById('editEmail').value,
            hours: document.getElementById('editHours').value,
            emergency: document.getElementById('editEmergency').value
        };
        
        localStorage.setItem('cityData', JSON.stringify(cityData));
        
        this.reset();
        document.getElementById('editServiceForm').classList.add('hidden');
        document.getElementById('editServicesSection').classList.remove('hidden');
        displayEditServices();
        displayServices();
        alert('Service updated successfully!');
    }
});

// City form submission
document.getElementById('cityForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const newService = {
        id: Date.now(),
        city: document.getElementById('cityName').value,
        name: document.getElementById('serviceName').value,
        type: document.getElementById('serviceType').value,
        address: document.getElementById('address').value,
        latitude: document.getElementById('latitude').value,
        longitude: document.getElementById('longitude').value,
        phone: document.getElementById('phone').value,
        email: document.getElementById('email').value,
        hours: document.getElementById('hours').value,
        emergency: document.getElementById('emergency').value,
        dateAdded: new Date().toLocaleDateString()
    };
    
    cityData.push(newService);
    localStorage.setItem('cityData', JSON.stringify(cityData));
    
    this.reset();
    document.getElementById('addForm').classList.add('hidden');
    alert('Service added successfully!');
});

// User functions
function searchServices() {
    const query = document.getElementById('searchInput').value.toLowerCase();
    const selectedCity = document.getElementById('cityFilter').value;
    
    let filtered = cityData;
    
    if (selectedCity) {
        filtered = filtered.filter(service => service.city === selectedCity);
    }
    
    if (query) {
        filtered = filtered.filter(service => 
            service.name.toLowerCase().includes(query) ||
            service.city.toLowerCase().includes(query) ||
            service.description.toLowerCase().includes(query)
        );
    }
    
    displayServices(filtered);
}

function updateCityFilter() {
    const cityFilter = document.getElementById('cityFilter');
    const cities = [...new Set(cityData.map(service => service.city))];
    
    const currentValue = cityFilter.value;
    cityFilter.innerHTML = '<option value="">All Cities</option>';
    
    cities.forEach(city => {
        const option = document.createElement('option');
        option.value = city;
        option.textContent = city;
        cityFilter.appendChild(option);
    });
    
    cityFilter.value = currentValue;
}

// Add event listener for city filter
document.addEventListener('DOMContentLoaded', function() {
    // Initialize admin data
    if (!localStorage.getItem('admins')) {
        localStorage.setItem('admins', JSON.stringify(admins));
    }
    
    // Add city filter change listener
    setTimeout(() => {
        const cityFilter = document.getElementById('cityFilter');
        if (cityFilter) {
            cityFilter.addEventListener('change', searchServices);
        }
        
        // Auto-update admin email when username changes
        const adminUsernameInput = document.getElementById('newAdminUsername');
        const adminEmailInput = document.getElementById('newAdminEmail');
        if (adminUsernameInput && adminEmailInput) {
            adminUsernameInput.addEventListener('input', function() {
                adminEmailInput.value = this.value + '@admin.com';
            });
        }
        
        // Phone number validation
        const phoneInput = document.getElementById('regPhone');
        if (phoneInput) {
            phoneInput.addEventListener('input', function() {
                this.value = this.value.replace(/\D/g, '').substring(0, 10);
                if (this.value.length === 10) {
                    this.style.borderColor = 'green';
                } else {
                    this.style.borderColor = 'red';
                }
            });
        }
    }, 100);
    
    showWelcome();
});

function displayServices(services = cityData) {
    const container = document.getElementById('servicesDisplay');
    
    if (services.length === 0) {
        container.innerHTML = '<p>No services found.</p>';
        return;
    }
    
    container.innerHTML = services.map(service => `
        <div class="service-card">
            <div class="city">${service.city}</div>
            <h3>${service.name}</h3>
            <div class="type">${service.type.replace('-', ' ').toUpperCase()}</div>
            ${service.address ? `<p><strong>Address:</strong> ${service.address}</p>` : ''}
            ${service.phone ? `<p><strong>Phone:</strong> ${service.phone}</p>` : ''}
            ${service.hours ? `<p><strong>Hours:</strong> ${service.hours}</p>` : ''}
            ${service.emergency ? `<p><strong>Emergency:</strong> ${service.emergency}</p>` : ''}
            <div class="map-actions">
                <button class="map-btn" onclick="showMap('${service.address}', ${service.latitude || 0}, ${service.longitude || 0})">📍 View on Map</button>
                <button class="map-btn" onclick="getDirections('${service.address}')">🧭 Get Directions</button>
            </div>
            <small>Added: ${service.dateAdded}</small>
        </div>
    `).join('');
    
    updateCityFilter();
}

function showReportForm() {
    if (!currentUser) {
        alert('Please login to report issues.');
        return;
    }
    hideAllUserSections();
    setActiveUserTab('Report Issue');
    populateServiceDropdown('issueService');
    document.getElementById('reportForm').classList.remove('hidden');
}

function showFeedbackForm() {
    if (!currentUser) {
        alert('Please login to give feedback.');
        return;
    }
    hideAllUserSections();
    setActiveUserTab('Give Feedback');
    populateServiceDropdown('feedbackService');
    document.getElementById('feedbackForm').classList.remove('hidden');
}

// Issue form submission
document.getElementById('issueForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const serviceName = document.getElementById('issueService').value;
    const issueDesc = document.getElementById('issueDesc').value;
    
    const newIssue = {
        id: Date.now(),
        service: serviceName,
        description: issueDesc,
        user: currentUser,
        dateReported: new Date().toLocaleDateString(),
        status: 'pending'
    };
    
    issues.push(newIssue);
    localStorage.setItem('issues', JSON.stringify(issues));
    
    this.reset();
    document.getElementById('reportForm').classList.add('hidden');
    alert('Issue reported successfully!');
});

// Feedback form submission
document.getElementById('userFeedbackForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const serviceName = document.getElementById('feedbackService').value;
    const feedbackDesc = document.getElementById('feedbackDesc').value;
    const rating = document.getElementById('rating').value;
    
    const newFeedback = {
        id: Date.now(),
        service: serviceName,
        feedback: feedbackDesc,
        rating: rating,
        user: currentUser,
        dateSubmitted: new Date().toLocaleDateString()
    };
    
    feedback.push(newFeedback);
    localStorage.setItem('feedback', JSON.stringify(feedback));
    
    // Auto thank user for feedback via SMS
    const user = users.find(u => u.username === currentUser);
    const phoneNumber = user ? user.phone : 'Unknown';
    const smsMessage = `Thank you for your feedback on "${serviceName}"! We appreciate your input. - City Management`;
    
    const thankYouNotification = {
        id: Date.now() + 1,
        user: currentUser,
        message: smsMessage,
        phone: phoneNumber,
        date: new Date().toLocaleDateString(),
        type: 'feedback_thanks'
    };
    notifications.push(thankYouNotification);
    localStorage.setItem('notifications', JSON.stringify(notifications));
    
    this.reset();
    document.getElementById('feedbackForm').classList.add('hidden');
    alert('Feedback submitted successfully! Check notifications for confirmation.');
});

// Sample data initialization
if (cityData.length === 0) {
    const sampleData = [
        {
            id: 1,
            city: "Tadepalli",
            name: "Tadepalli Government Hospital",
            type: "hospital",
            address: "Main Road, Tadepalli, Guntur District",
            phone: "08632-123456",
            email: "tadepalli.hospital@gov.in",
            hours: "24/7",
            emergency: "108",
            dateAdded: new Date().toLocaleDateString()
        },
        {
            id: 2,
            city: "Tadepalli",
            name: "Tadepalli Police Station",
            type: "police-station",
            address: "Police Station Road, Tadepalli",
            phone: "08632-234567",
            hours: "24/7",
            emergency: "100",
            dateAdded: new Date().toLocaleDateString()
        },
        {
            id: 3,
            city: "Tadepalli",
            name: "Tadepalli Municipal Office",
            type: "government",
            address: "Municipal Building, Tadepalli",
            phone: "08632-345678",
            email: "municipal@tadepalli.gov.in",
            hours: "9 AM - 5 PM",
            dateAdded: new Date().toLocaleDateString()
        },
        {
            id: 4,
            city: "Tadepalli",
            name: "Tadepalli Public Library",
            type: "library",
            address: "Library Street, Tadepalli",
            phone: "08632-456789",
            hours: "9 AM - 7 PM",
            dateAdded: new Date().toLocaleDateString()
        },
        {
            id: 5,
            city: "Tadepalli",
            name: "Tadepalli Bus Station",
            type: "transport",
            address: "Bus Stand Road, Tadepalli",
            phone: "08632-567890",
            hours: "5 AM - 11 PM",
            dateAdded: new Date().toLocaleDateString()
        },
        {
            id: 6,
            city: "Vijayawada",
            name: "Government General Hospital",
            type: "hospital",
            address: "Hospital Road, Vijayawada",
            phone: "0866-2574001",
            hours: "24/7",
            emergency: "108",
            dateAdded: new Date().toLocaleDateString()
        },
        {
            id: 7,
            city: "Vijayawada",
            name: "One Town Police Station",
            type: "police-station",
            address: "One Town, Vijayawada",
            phone: "0866-2471100",
            hours: "24/7",
            emergency: "100",
            dateAdded: new Date().toLocaleDateString()
        },
        {
            id: 8,
            city: "Vijayawada",
            name: "VMC Office",
            type: "government",
            address: "Municipal Corporation, Vijayawada",
            phone: "0866-2578142",
            email: "vmc@vijayawada.gov.in",
            hours: "9 AM - 5 PM",
            dateAdded: new Date().toLocaleDateString()
        },
        {
            id: 9,
            city: "Vijayawada",
            name: "Vijayawada Railway Station",
            type: "transport",
            address: "Railway Station Road, Vijayawada",
            phone: "0866-2571234",
            hours: "24/7",
            dateAdded: new Date().toLocaleDateString()
        },
        {
            id: 10,
            city: "Vijayawada",
            name: "Indira Gandhi Municipal Stadium",
            type: "park",
            address: "Benz Circle, Vijayawada",
            phone: "0866-2471500",
            hours: "6 AM - 9 PM",
            dateAdded: new Date().toLocaleDateString()
        }
    ];
    
    cityData = sampleData;
    localStorage.setItem('cityData', JSON.stringify(cityData));
}

function validatePassword(password) {
    if (password.length < 5 || password.length > 8) {
        return false;
    }
    
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    return hasUppercase && hasLowercase && hasNumber && hasSpecial;
}

function validateEmail(email) {
    if (!email || !email.includes('@') || email.split('@').length !== 2) {
        return false;
    }
    
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
        return false;
    }
    
    const parts = email.split('@');
    if (parts.length !== 2) {
        return false;
    }
    
    const domain = parts[1].toLowerCase().trim();
    const allowedDomains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'icloud.com', 'aol.com', 'live.com', 'msn.com'];
    
    return allowedDomains.includes(domain);
}

function validatePhone(phone) {
    const cleanPhone = phone.replace(/\D/g, '');
    return cleanPhone.length === 10;
}

// Map functions
function showMap(address, lat, lng) {
    if (lat && lng && lat != 0 && lng != 0) {
        window.open(`https://www.google.com/maps?q=${lat},${lng}`, '_blank');
    } else {
        window.open(`https://www.google.com/maps/search/${encodeURIComponent(address)}`, '_blank');
    }
}

function getDirections(address) {
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`, '_blank');
}

function showUsers() {
    if (!isAdmin) {
        alert('Access denied. Admin authentication required.');
        return;
    }
    hideAllSections();
    setActiveTab('View Users');
    const section = document.getElementById('usersSection');
    section.classList.remove('hidden');
    displayUsers();
}

function displayUsers() {
    const container = document.getElementById('usersList');
    if (users.length === 0) {
        container.innerHTML = '<p>No registered users found.</p>';
        return;
    }
    
    container.innerHTML = users.map(user => `
        <div class="user-item ${user.blocked ? 'blocked-user' : ''}">
            <h4>${user.fullName} (@${user.username})</h4>
            <p><strong>Phone:</strong> ${user.phone}</p>
            <p><strong>Email:</strong> ${user.email}</p>
            <div class="user-status">
                <span class="status-badge ${user.blocked ? 'blocked' : 'active'}">
                    ${user.blocked ? 'BLOCKED' : 'ACTIVE'}
                </span>
                <button onclick="toggleUserBlock('${user.username}')" class="block-btn ${user.blocked ? 'unblock' : 'block'}">
                    ${user.blocked ? 'Unblock' : 'Block'}
                </button>
            </div>
            <div class="meta">Registered: ${user.registeredDate}</div>
        </div>
    `).join('');
}

function adminReset(e) {
    e.preventDefault();
    const username = document.getElementById('resetAdminUsername').value;
    const newPassword = document.getElementById('newAdminPassword').value;
    const confirmPassword = document.getElementById('confirmAdminPassword').value;
    
    const admin = admins.find(a => a.username === username);
    
    if (!admin) {
        alert('Invalid admin username');
        return;
    }
    
    if (newPassword !== confirmPassword) {
        alert('Passwords do not match');
        return;
    }
    
    if (newPassword !== username) {
        alert('Password must match the username exactly');
        return;
    }
    
    admin.password = newPassword;
    localStorage.setItem('admins', JSON.stringify(admins));
    
    alert('Admin password reset successful!');
    e.target.reset();
    showAdminLogin();
}

function userReset(e) {
    e.preventDefault();
    const username = document.getElementById('resetUserUsername').value;
    const email = document.getElementById('resetUserEmail').value;
    const newPassword = document.getElementById('newUserPassword').value;
    const confirmPassword = document.getElementById('confirmUserPassword').value;
    
    const user = users.find(u => u.username === username && u.email === email);
    
    if (!user) {
        alert('User not found or email does not match');
        return;
    }
    
    if (newPassword !== confirmPassword) {
        alert('Passwords do not match');
        return;
    }
    
    if (!validatePassword(newPassword)) {
        alert('Password must be 5-8 characters with at least:\n• One uppercase letter\n• One lowercase letter\n• One number\n• One special character');
        return;
    }
    
    if (!validateEmail(email)) {
        alert('Please enter a valid email address ending with .com');
        return;
    }
    
    user.password = newPassword;
    localStorage.setItem('users', JSON.stringify(users));
    
    alert('Password reset successful!');
    e.target.reset();
    showUserLogin();
}

function showDeleteOptions() {
    if (!isAdmin) {
        alert('Access denied. Admin authentication required.');
        return;
    }
    hideAllSections();
    setActiveTab('Delete Services');
    const section = document.getElementById('deleteSection');
    section.classList.remove('hidden');
    displayDeleteOptions();
}

function hideAllSections() {
    document.querySelectorAll('.section, .form-container').forEach(section => {
        section.classList.add('hidden');
    });
}

function setActiveTab(tabName) {
    document.querySelectorAll('.admin-nav .nav-tab').forEach(tab => {
        tab.classList.remove('active');
        if (tab.textContent.includes(tabName)) {
            tab.classList.add('active');
        }
    });
}

function hideAllUserSections() {
    document.getElementById('servicesDisplay').style.display = 'none';
    document.querySelectorAll('#userPanel .section, #userPanel .form-container').forEach(section => {
        section.classList.add('hidden');
    });
}

function setActiveUserTab(tabName) {
    document.querySelectorAll('.user-nav .nav-tab').forEach(tab => {
        tab.classList.remove('active');
        if (tab.textContent.includes(tabName)) {
            tab.classList.add('active');
        }
    });
}

function showCityServices() {
    hideAllUserSections();
    setActiveUserTab('City Services');
    document.getElementById('servicesDisplay').style.display = 'grid';
    displayServices();
}

function displayDeleteOptions() {
    const container = document.getElementById('deleteList');
    if (cityData.length === 0) {
        container.innerHTML = '<p>No city services to delete.</p>';
        return;
    }
    
    container.innerHTML = cityData.map(service => `
        <div class="delete-item">
            <input type="checkbox" id="delete_${service.id}" value="${service.id}">
            <label for="delete_${service.id}">
                <strong>${service.name}</strong> - ${service.city} (${service.type.replace('-', ' ')})
            </label>
        </div>
    `).join('');
}

function deleteSelected() {
    const checkboxes = document.querySelectorAll('#deleteList input[type="checkbox"]:checked');
    const selectedIds = Array.from(checkboxes).map(cb => parseInt(cb.value));
    
    if (selectedIds.length === 0) {
        alert('Please select services to delete.');
        return;
    }
    
    if (confirm(`Delete ${selectedIds.length} selected service(s)? This action cannot be undone.`)) {
        cityData = cityData.filter(service => !selectedIds.includes(service.id));
        localStorage.setItem('cityData', JSON.stringify(cityData));
        displayServices();
        displayDeleteOptions();
        alert(`${selectedIds.length} service(s) deleted successfully.`);
    }
}

function showCreateAdmin() {
    if (!isAdmin) {
        alert('Access denied. Admin authentication required.');
        return;
    }
    hideAllSections();
    setActiveTab('Create Admin');
    const section = document.getElementById('createAdminSection');
    section.classList.remove('hidden');
    displayAdminsList();
    setTimeout(() => generateCreateAdminCaptcha(), 100);
}

function createNewAdmin(e) {
    e.preventDefault();
    
    const captchaInput = document.getElementById('createAdminCaptchaInput').value;
    
    if (captchaInput !== createAdminCaptcha) {
        alert('Invalid CAPTCHA. Please try again.');
        generateCreateAdminCaptcha();
        document.getElementById('createAdminCaptchaInput').value = '';
        return;
    }
    
    if (admins.length >= 5) {
        alert('Maximum 5 admin accounts allowed.');
        return;
    }
    
    const username = document.getElementById('newAdminUsername').value;
    const password = document.getElementById('newAdminPassword').value;
    
    const existingAdmin = admins.find(a => a.username === username);
    if (existingAdmin) {
        alert('Admin username already exists.');
        return;
    }
    
    if (password !== username) {
        alert('Password must match the username exactly.');
        return;
    }
    
    const newAdmin = {
        username: username,
        password: password,
        email: username + '@admin.com'
    };
    
    admins.push(newAdmin);
    localStorage.setItem('admins', JSON.stringify(admins));
    
    e.target.reset();
    displayAdminsList();
    alert('New admin created successfully!');
}

function displayAdminsList() {
    const container = document.getElementById('adminsList');
    
    let html = '<h4>Current Admin Accounts (' + admins.length + '/5)</h4>';
    if (admins.length >= 5) {
        html += '<p style="color: red; font-weight: bold;">⚠️ Maximum admin limit reached!</p>';
    }
    html += admins.map((admin, index) => `
        <div class="admin-item">
            <strong>${admin.username}</strong>
            <br><small>Email: ${admin.email || admin.username + '@admin.com'}</small>
            ${admins.length > 1 ? `<button onclick="deleteAdmin('${admin.username}')" class="delete-admin-btn">Delete</button>` : ''}
        </div>
    `).join('');
    
    container.innerHTML = html;
}

function deleteAdmin(username) {
    if (admins.length <= 1) {
        alert('Cannot delete the last admin account.');
        return;
    }
    
    if (confirm(`Delete admin account "${username}"? This action cannot be undone.`)) {
        admins = admins.filter(admin => admin.username !== username);
        localStorage.setItem('admins', JSON.stringify(admins));
        displayAdminsList();
        alert('Admin account deleted successfully.');
    }
}

function toggleUserBlock(username) {
    const user = users.find(u => u.username === username);
    if (user) {
        user.blocked = !user.blocked;
        localStorage.setItem('users', JSON.stringify(users));
        displayUsers();
        alert(`User ${username} has been ${user.blocked ? 'blocked' : 'unblocked'}`);
    }
}

function showEditServices() {
    if (!isAdmin) {
        alert('Access denied. Admin authentication required.');
        return;
    }
    hideAllSections();
    setActiveTab('Edit Services');
    const section = document.getElementById('editServicesSection');
    section.classList.remove('hidden');
    displayEditServices();
}

function displayEditServices() {
    const container = document.getElementById('editServicesList');
    if (cityData.length === 0) {
        container.innerHTML = '<p>No city services to edit.</p>';
        return;
    }
    
    container.innerHTML = cityData.map(service => `
        <div class="edit-service-item">
            <h4>${service.name}</h4>
            <p><strong>City:</strong> ${service.city} | <strong>Type:</strong> ${service.type.replace('-', ' ')}</p>
            <p><strong>Address:</strong> ${service.address}</p>
            <button onclick="editService(${service.id})" class="edit-btn">Edit</button>
        </div>
    `).join('');
}

function editService(serviceId) {
    const service = cityData.find(s => s.id === serviceId);
    if (!service) return;
    
    document.getElementById('editServiceId').value = service.id;
    document.getElementById('editCityName').value = service.city;
    document.getElementById('editServiceName').value = service.name;
    document.getElementById('editServiceType').value = service.type;
    document.getElementById('editAddress').value = service.address;
    document.getElementById('editLatitude').value = service.latitude || '';
    document.getElementById('editLongitude').value = service.longitude || '';
    document.getElementById('editPhone').value = service.phone || '';
    document.getElementById('editEmail').value = service.email || '';
    document.getElementById('editHours').value = service.hours || '';
    document.getElementById('editEmergency').value = service.emergency || '';
    
    document.getElementById('editServicesSection').classList.add('hidden');
    document.getElementById('editServiceForm').classList.remove('hidden');
}

function cancelEdit() {
    document.getElementById('editServiceForm').classList.add('hidden');
    document.getElementById('editServicesSection').classList.remove('hidden');
    document.getElementById('serviceEditForm').reset();
}

// Admin delete functions
function deleteReport(reportId) {
    if (confirm('Delete this report? This action cannot be undone.')) {
        issues = issues.filter(issue => issue.id !== reportId);
        localStorage.setItem('issues', JSON.stringify(issues));
        displayReports();
        alert('Report deleted successfully.');
    }
}

function deleteFeedback(feedbackId) {
    if (confirm('Delete this feedback? This action cannot be undone.')) {
        feedback = feedback.filter(fb => fb.id !== feedbackId);
        localStorage.setItem('feedback', JSON.stringify(feedback));
        displayFeedbacks();
        alert('Feedback deleted successfully.');
    }
}

// User edit/delete functions
function editMyReport(reportId) {
    const issue = issues.find(i => i.id === reportId && i.user === currentUser);
    if (!issue) return;
    
    const newDescription = prompt('Edit your report:', issue.description);
    if (newDescription && newDescription.trim()) {
        issue.description = newDescription.trim();
        localStorage.setItem('issues', JSON.stringify(issues));
        displayMyReports();
        alert('Report updated successfully.');
    }
}

function deleteMyReport(reportId) {
    if (confirm('Delete your report? This action cannot be undone.')) {
        issues = issues.filter(issue => issue.id !== reportId);
        localStorage.setItem('issues', JSON.stringify(issues));
        displayMyReports();
        alert('Report deleted successfully.');
    }
}

function editMyFeedback(feedbackId) {
    const fb = feedback.find(f => f.id === feedbackId && f.user === currentUser);
    if (!fb) return;
    
    const newFeedback = prompt('Edit your feedback:', fb.feedback);
    const newRating = prompt('Edit your rating (1-5):', fb.rating);
    
    if (newFeedback && newFeedback.trim() && newRating && newRating >= 1 && newRating <= 5) {
        fb.feedback = newFeedback.trim();
        fb.rating = newRating;
        localStorage.setItem('feedback', JSON.stringify(feedback));
        displayMyReports();
        alert('Feedback updated successfully.');
    }
}

function deleteMyFeedback(feedbackId) {
    if (confirm('Delete your feedback? This action cannot be undone.')) {
        feedback = feedback.filter(fb => fb.id !== feedbackId);
        localStorage.setItem('feedback', JSON.stringify(feedback));
        displayMyReports();
        alert('Feedback deleted successfully.');
    }
}

// Advanced Features
let payments = JSON.parse(localStorage.getItem('payments')) || [];
let chatMessages = JSON.parse(localStorage.getItem('chatMessages')) || [];
let currentCaptcha = '';
let loginCaptcha = '';
let registerCaptcha = '';
let adminLoginCaptcha = '';
let createAdminCaptcha = '';

// Generate CAPTCHA for login and register
function generateLoginCaptcha() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    loginCaptcha = '';
    for (let i = 0; i < 6; i++) {
        loginCaptcha += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    const captchaElement = document.getElementById('loginCaptchaText');
    if (captchaElement) {
        captchaElement.textContent = loginCaptcha;
    }
}

function generateRegisterCaptcha() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    registerCaptcha = '';
    for (let i = 0; i < 6; i++) {
        registerCaptcha += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    document.getElementById('registerCaptchaText').textContent = registerCaptcha;
}

function generateAdminLoginCaptcha() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    adminLoginCaptcha = '';
    for (let i = 0; i < 6; i++) {
        adminLoginCaptcha += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    const captchaElement = document.getElementById('adminLoginCaptchaText');
    if (captchaElement) {
        captchaElement.textContent = adminLoginCaptcha;
    }
}

function generateCreateAdminCaptcha() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    createAdminCaptcha = '';
    for (let i = 0; i < 6; i++) {
        createAdminCaptcha += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    document.getElementById('createAdminCaptchaText').textContent = createAdminCaptcha;
}

// Payment Gateway
function showPayments() {
    if (!currentUser) {
        alert('Please login to access payments.');
        return;
    }
    hideAllUserSections();
    setActiveUserTab('Pay Bills');
    document.getElementById('paymentsSection').classList.remove('hidden');
    generateCaptcha();
}

function generateCaptcha() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    currentCaptcha = '';
    for (let i = 0; i < 6; i++) {
        currentCaptcha += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    document.getElementById('captchaText').textContent = currentCaptcha;
}

function processPayment() {
    const billType = document.getElementById('billType').value;
    const billNumber = document.getElementById('billNumber').value;
    const amount = document.getElementById('amount').value;
    const captchaInput = document.getElementById('captchaInput').value;
    
    if (!billType || !billNumber || !amount || !captchaInput) {
        alert('Please fill all fields');
        return;
    }
    
    if (captchaInput !== currentCaptcha) {
        alert('Invalid CAPTCHA. Please try again.');
        generateCaptcha();
        document.getElementById('captchaInput').value = '';
        return;
    }
    
    const payment = {
        id: Date.now(),
        user: currentUser,
        billType,
        billNumber,
        amount: parseFloat(amount),
        date: new Date().toLocaleDateString(),
        status: 'completed'
    };
    
    payments.push(payment);
    localStorage.setItem('payments', JSON.stringify(payments));
    
    alert(`Payment of ₹${amount} for ${billType} bill successful!\nTransaction ID: ${payment.id}`);
    
    // Reset form
    document.getElementById('billType').value = '';
    document.getElementById('billNumber').value = '';
    document.getElementById('amount').value = '';
    document.getElementById('captchaInput').value = '';
    generateCaptcha();
}

// Live Chat
function showChat() {
    if (!currentUser) {
        alert('Please login to access chat.');
        return;
    }
    hideAllUserSections();
    setActiveUserTab('Live Chat');
    document.getElementById('chatSection').classList.remove('hidden');
    displayChatMessages();
}

function sendMessage() {
    const input = document.getElementById('chatInput');
    const message = input.value.trim();
    
    if (!message) return;
    
    const chatMessage = {
        id: Date.now(),
        user: currentUser,
        message,
        timestamp: new Date().toLocaleTimeString(),
        type: 'user'
    };
    
    chatMessages.push(chatMessage);
    
    // Auto-reply from support
    setTimeout(() => {
        const supportReply = {
            id: Date.now() + 1,
            user: 'Support',
            message: getAutoReply(message),
            timestamp: new Date().toLocaleTimeString(),
            type: 'support'
        };
        chatMessages.push(supportReply);
        localStorage.setItem('chatMessages', JSON.stringify(chatMessages));
        displayChatMessages();
    }, 1000);
    
    localStorage.setItem('chatMessages', JSON.stringify(chatMessages));
    displayChatMessages();
    input.value = '';
}

function getAutoReply(message) {
    const msg = message.toLowerCase();
    if (msg.includes('road') || msg.includes('pothole')) {
        return 'Thank you for reporting the road issue. Our team will inspect and resolve it within 48 hours.';
    } else if (msg.includes('street light') || msg.includes('light')) {
        return 'Street light issues are prioritized. We will fix it within 24 hours.';
    } else if (msg.includes('water') || msg.includes('drainage')) {
        return 'Water and drainage issues are handled by our municipal team. Expected resolution: 2-3 days.';
    } else {
        return 'Thank you for contacting us. Your query has been noted and will be addressed soon.';
    }
}

function displayChatMessages() {
    const container = document.getElementById('chatMessages');
    if (!container) return;
    
    const userMessages = chatMessages.filter(msg => 
        msg.user === currentUser || 
        msg.type === 'ai' || 
        msg.type === 'bot' || 
        (msg.type === 'admin' && msg.targetUser === currentUser)
    );
    
    container.innerHTML = userMessages.map(msg => `
        <div class="chat-message ${msg.type}">
            <strong>${msg.user}:</strong> ${msg.message}
            <span class="timestamp">${msg.timestamp}</span>
        </div>
    `).join('');
    
    container.scrollTop = container.scrollHeight;
}

// Dashboard with Charts
function showDashboard() {
    if (!currentUser) {
        alert('Please login to view dashboard.');
        return;
    }
    hideAllUserSections();
    setActiveUserTab('Dashboard');
    document.getElementById('dashboardSection').classList.remove('hidden');
    updateDashboardStats();
    drawActivityChart();
}

function updateDashboardStats() {
    const userReports = issues.filter(issue => issue.user === currentUser).length;
    const userFeedback = feedback.filter(fb => fb.user === currentUser).length;
    const userPayments = payments.filter(payment => payment.user === currentUser).length;
    
    document.getElementById('reportCount').textContent = userReports;
    document.getElementById('feedbackCount').textContent = userFeedback;
    document.getElementById('billCount').textContent = userPayments;
}

function drawActivityChart() {
    const canvas = document.getElementById('activityChart');
    const ctx = canvas.getContext('2d');
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const data = [5, 10, 8, 12, 7, 15, 9];
    const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    
    const barWidth = 40;
    const barSpacing = 10;
    const maxHeight = 150;
    const maxValue = Math.max(...data);
    
    data.forEach((value, index) => {
        const barHeight = (value / maxValue) * maxHeight;
        const x = index * (barWidth + barSpacing) + 50;
        const y = canvas.height - barHeight - 30;
        
        const gradient = ctx.createLinearGradient(0, y, 0, y + barHeight);
        gradient.addColorStop(0, '#007bff');
        gradient.addColorStop(1, '#0056b3');
        ctx.fillStyle = gradient;
        
        ctx.fillRect(x, y, barWidth, barHeight);
        
        ctx.fillStyle = '#333';
        ctx.font = '12px Arial';
        ctx.fillText(labels[index], x + 10, canvas.height - 10);
        ctx.fillText(value.toString(), x + 15, y - 5);
    });
    
    ctx.fillStyle = '#333';
    ctx.font = '16px Arial';
    ctx.fillText('Weekly Activity', 10, 20);
}

// Admin Chat Functions
function showAdminChat() {
    if (!isAdmin) {
        alert('Access denied. Admin authentication required.');
        return;
    }
    hideAllSections();
    setActiveTab('Live Chat');
    document.getElementById('adminChatSection').classList.remove('hidden');
    displayAdminChat();
    updateChatStats();
}

function displayAdminChat() {
    const container = document.getElementById('adminChatMessages');
    const allMessages = chatMessages.filter(msg => msg.type === 'user' || msg.type === 'admin');
    
    container.innerHTML = allMessages.map(msg => `
        <div class="admin-chat-message ${msg.type}">
            <strong>${msg.user}:</strong> ${msg.message}
            <span class="timestamp">${msg.timestamp}</span>
        </div>
    `).join('');
    
    // Update user dropdown
    const userSelect = document.getElementById('chatUser');
    const activeUsers = [...new Set(chatMessages.filter(msg => msg.type === 'user').map(msg => msg.user))];
    userSelect.innerHTML = '<option value="">Select User to Reply</option>';
    activeUsers.forEach(user => {
        const option = document.createElement('option');
        option.value = user;
        option.textContent = user;
        userSelect.appendChild(option);
    });
}

function sendAdminMessage() {
    const selectedUser = document.getElementById('chatUser').value;
    const input = document.getElementById('adminChatInput');
    const message = input.value.trim();
    
    if (!selectedUser || !message) {
        alert('Please select a user and enter a message.');
        return;
    }
    
    const adminMessage = {
        id: Date.now(),
        user: 'Admin',
        message: `@${selectedUser}: ${message}`,
        timestamp: new Date().toLocaleTimeString(),
        type: 'admin',
        targetUser: selectedUser
    };
    
    chatMessages.push(adminMessage);
    localStorage.setItem('chatMessages', JSON.stringify(chatMessages));
    displayAdminChat();
    updateChatStats();
    input.value = '';
}

function updateChatStats() {
    const activeUsers = [...new Set(chatMessages.filter(msg => msg.type === 'user').map(msg => msg.user))].length;
    const totalMessages = chatMessages.length;
    
    document.getElementById('activeUsers').textContent = activeUsers;
    document.getElementById('totalMessages').textContent = totalMessages;
    document.getElementById('avgResponseTime').textContent = '2.3';
    document.getElementById('onlineAgents').textContent = '1';
}

// Advanced AI Chat Bot (Alexa-like)
let voiceEnabled = true;
let speechRecognition = null;
let speechSynthesis = window.speechSynthesis;
let isListening = false;

// Initialize Speech Recognition
if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
    speechRecognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    speechRecognition.continuous = false;
    speechRecognition.interimResults = false;
    speechRecognition.lang = 'en-US';
    
    speechRecognition.onresult = function(event) {
        const transcript = event.results[0][0].transcript;
        document.getElementById('chatInput').value = transcript;
        sendMessage();
    };
    
    speechRecognition.onend = function() {
        isListening = false;
        document.getElementById('voiceBtn').textContent = '🎤';
        document.getElementById('voiceStatus').textContent = '🎤 Voice Ready';
    };
}

function startVoiceInput() {
    if (!speechRecognition) {
        alert('Voice recognition not supported in this browser');
        return;
    }
    
    if (isListening) {
        speechRecognition.stop();
        return;
    }
    
    isListening = true;
    document.getElementById('voiceBtn').textContent = '🔴';
    document.getElementById('voiceStatus').textContent = '🎤 Listening...';
    speechRecognition.start();
}

function toggleVoiceOutput() {
    voiceEnabled = !voiceEnabled;
    const btn = document.getElementById('speakerBtn');
    btn.textContent = voiceEnabled ? '🔊' : '🔇';
    btn.title = voiceEnabled ? 'Voice On' : 'Voice Off';
}

function speakMessage(text) {
    if (!voiceEnabled || !speechSynthesis) return;
    
    // Extract SSML content or clean text for speech
    let speechText = text;
    const ssmlMatch = text.match(/<speak>(.*?)<\/speak>/);
    if (ssmlMatch) {
        speechText = ssmlMatch[1];
    } else {
        // Remove markdown and formatting for speech
        speechText = text.replace(/\*\*(.*?)\*\*/g, '$1')
                        .replace(/•/g, '')
                        .replace(/\n/g, ' ')
                        .replace(/\*\*/g, '')
                        .substring(0, 200); // Keep under 25 seconds
    }
    
    const utterance = new SpeechSynthesisUtterance(speechText);
    utterance.rate = 0.9;
    utterance.pitch = 1.1; // Slightly higher for Aurora
    utterance.volume = 0.8;
    
    // Try to use a female voice for Aurora
    const voices = speechSynthesis.getVoices();
    const femaleVoice = voices.find(voice => 
        voice.name.includes('Female') || 
        voice.name.includes('Samantha') ||
        voice.name.includes('Karen') ||
        voice.gender === 'female'
    );
    if (femaleVoice) {
        utterance.voice = femaleVoice;
    }
    
    speechSynthesis.speak(utterance);
}

function quickAction(action) {
    document.getElementById('chatInput').value = action;
    sendMessage();
}

function sendMessage() {
    const input = document.getElementById('chatInput');
    const message = input.value.trim();
    
    if (!message) return;
    
    const chatMessage = {
        id: Date.now(),
        user: currentUser,
        message,
        timestamp: new Date().toLocaleTimeString(),
        type: 'user'
    };
    
    chatMessages.push(chatMessage);
    localStorage.setItem('chatMessages', JSON.stringify(chatMessages));
    displayChatMessages();
    
    // Show typing indicator
    showTypingIndicator();
    
    // Aurora AI Reply
    setTimeout(() => {
        const aiReply = getAdvancedAIReply(message);
        const botReply = {
            id: Date.now() + 1,
            user: 'Aurora',
            message: aiReply.text,
            timestamp: new Date().toLocaleTimeString(),
            type: 'ai',
            action: aiReply.action
        };
        
        chatMessages.push(botReply);
        localStorage.setItem('chatMessages', JSON.stringify(chatMessages));
        hideTypingIndicator();
        displayChatMessages();
        
        // Speak the response
        speakMessage(aiReply.text);
        
        // Execute action if any
        if (aiReply.action) {
            executeAIAction(aiReply.action);
        }
    }, 1500);
    
    input.value = '';
}

function showTypingIndicator() {
    const container = document.getElementById('chatMessages');
    const indicator = document.createElement('div');
    indicator.id = 'typingIndicator';
    indicator.className = 'typing-indicator';
    indicator.innerHTML = '<strong>Aurora:</strong> <span class="dots">Thinking...</span>';
    container.appendChild(indicator);
    container.scrollTop = container.scrollHeight;
}

function hideTypingIndicator() {
    const indicator = document.getElementById('typingIndicator');
    if (indicator) indicator.remove();
}

function getAdvancedAIReply(message) {
    const msg = message.toLowerCase();
    const time = new Date().getHours();
    const greeting = time < 12 ? 'Good morning' : time < 18 ? 'Good afternoon' : 'Good evening';
    const userName = currentUser || 'there';
    
    // Aurora's perfect greetings
    if (msg.includes('hello') || msg.includes('hi') || msg.includes('hey') || msg.includes('aurora')) {
        return {
            text: `<speak>Hello ${userName}! I'm Aurora, your personal city assistant.</speak> \n\n${greeting}! I'm delighted to help you today. I can assist with: \n\n**🏛️ City Services** \n• Report issues (roads, street lights, municipal problems) \n• Pay bills (water, electricity, property tax) \n• Find service locations and hours \n• Emergency contacts and information \n\n**🎯 Quick Actions Available:** \n• Voice commands (click 🎤) \n• File attachments for reports \n• Real-time status updates \n\n**What would you like to do first?** Just tell me naturally - I understand conversational language!`,
            action: null
        };
    }
    
    // Perfect emergency handling
    if (msg.includes('emergency') || msg.includes('urgent') || msg.includes('help me') || msg.includes('911') || msg.includes('108')) {
        return {
            text: '<speak>I understand this is urgent. Let me help you immediately.</speak> \n\n**🚨 EMERGENCY CONTACTS:** \n• **Medical Emergency:** 108 (Ambulance) \n• **Police Emergency:** 100 \n• **Fire Emergency:** 101 \n• **Disaster Management:** 1077 \n\n**For immediate life-threatening emergencies, call these numbers directly.** \n\n**Non-emergency city issues:** I can help you report problems like road damage, street lights, water issues, or municipal concerns. \n\n**What type of situation are you dealing with?** I'm here to guide you to the right help.',
            action: 'emergency'
        };
    }
    
    // Perfect road issue assistance
    if (msg.includes('road') || msg.includes('pothole') || msg.includes('street') || msg.includes('pavement') || msg.includes('asphalt')) {
        return {
            text: '<speak>I can help you report road issues immediately!</speak> \n\n**🛣️ ROAD ISSUE REPORTING** \n\n**Response Time:** Typically resolved within 48 hours \n**Priority Level:** High for safety hazards \n\n**What I need from you:** \n• Exact location (street name, landmarks) \n• Description of the problem \n• Photos if possible (helps speed repairs) \n• Your contact information \n\n**Types of road issues I can help with:** \n• Potholes and cracks \n• Damaged pavement \n• Road surface problems \n• Street markings issues \n\n**Ready to file your report?** I\'ll open the form and guide you through each step. The city maintenance team will be notified immediately.',
            action: 'open_report_road'
        };
    }
    
    // Perfect street light assistance
    if (msg.includes('light') || msg.includes('lamp') || msg.includes('lighting') || msg.includes('dark') || msg.includes('bulb')) {
        return {
            text: '<speak>Street lighting issues are a safety priority!</speak> \n\n**💡 STREET LIGHT REPORTING** \n\n**Response Time:** Usually fixed within 24 hours \n**Priority Level:** HIGH - Safety critical \n\n**Common issues I can help with:** \n• Lights not working (outages) \n• Flickering or dim lights \n• Broken light fixtures \n• Lights on during daytime \n• Missing or damaged poles \n\n**Information needed:** \n• Exact location (street address/intersection) \n• Type of problem \n• How many lights affected \n• Safety concerns \n\n**Why this matters:** Proper lighting prevents accidents and crime. The city electrical team treats these as urgent repairs. \n\n**Shall I open the report form for you?** I\'ll make sure your safety concern gets immediate attention.',
            action: 'open_report_light'
        };
    }
    

    
    // Weather-like queries
    if (msg.includes('weather') || msg.includes('temperature')) {
        return {
            text: 'I don\'t have weather data, but I can help you with city services! For weather updates, try a weather app. Is there anything city-related I can help you with?',
            action: null
        };
    }
    
    // Time queries
    if (msg.includes('time') || msg.includes('what time')) {
        const currentTime = new Date().toLocaleTimeString();
        return {
            text: `The current time is ${currentTime}. Is there anything else I can help you with regarding city services?`,
            action: null
        };
    }
    
    // Service information
    if (msg.includes('hospital') || msg.includes('medical')) {
        return {
            text: 'I can help you find nearby hospitals! We have Government General Hospital and other medical facilities. Would you like me to show you the city services directory?',
            action: 'show_services'
        };
    }
    
    // Municipal services
    if (msg.includes('municipal') || msg.includes('government') || msg.includes('office')) {
        return {
            text: 'Municipal offices handle various city services. I can show you locations, contact details, and operating hours. What specific service do you need?',
            action: 'show_services'
        };
    }
    
    // Feedback and complaints
    if (msg.includes('complaint') || msg.includes('feedback') || msg.includes('review')) {
        return {
            text: 'Your feedback is valuable! I can help you submit feedback about city services. This helps improve our services. Would you like me to open the feedback form?',
            action: 'open_feedback'
        };
    }
    
    // Perfect thank you responses
    if (msg.includes('thank') || msg.includes('thanks') || msg.includes('appreciate')) {
        return {
            text: '<speak>You\'re absolutely welcome!</speak> \n\n**😊 It\'s my pleasure to help you!** I\'m always here to make your city service experience smooth and efficient. \n\n**Remember, I\'m available 24/7 for:** \n• Any new issues or questions \n• Status updates on your reports \n• Additional city services \n• Emergency information \n\n**Is there anything else I can help you with today?** Feel free to ask me anything about city services anytime!',
            action: null
        };
    }
    
    // Perfect capabilities explanation
    if (msg.includes('what can you do') || msg.includes('help') || msg.includes('capabilities') || msg.includes('features') || msg.includes('services')) {
        return {
            text: '<speak>I\'m Aurora, your comprehensive city assistant! Let me show you everything I can do.</speak> \n\n**🌟 MY COMPLETE CAPABILITIES** \n\n**🏛️ City Service Management:** \n• Report issues (roads, street lights, municipal problems) \n• Track report status and updates \n• Receive SMS notifications \n• Edit or delete your reports \n\n**🗺️ City Information:** \n• Find services in Tadepalli & Vijayawada \n• Get addresses, phone numbers, hours \n• View on maps and get directions \n• Emergency contact information \n\n**🎤 Advanced Features:** \n• Voice recognition and commands \n• Natural language conversation \n• File attachments for reports \n• Multi-tab chat interface \n• Export chat history \n• Real-time notifications \n\n**📊 Personal Dashboard:** \n• View your activity analytics \n• Track reports and payments \n• Personal statistics and charts \n\n**What would you like to explore first?** Just ask me naturally - I understand conversational language and can help with any city service need!',
            action: null
        };
    }
    
    // Municipal and government services
    if (msg.includes('municipal') || msg.includes('government') || msg.includes('office') || msg.includes('city hall')) {
        return {
            text: '<speak>I can help you with municipal services!</speak> \n\n**🏛️ MUNICIPAL SERVICES** \n\n**Available Offices:** \n• Tadepalli Municipal Office \n• VMC Office (Vijayawada) \n• Government service centers \n\n**Services Provided:** \n• Birth/Death certificates \n• Property registrations \n• Business licenses \n• Tax assessments \n• Complaint registrations \n\n**Office Hours:** Typically 9 AM - 5 PM \n**Contact Information:** Available for all locations \n\n**Would you like me to show you specific office details or help you report a municipal issue?**',
            action: 'show_services'
        };
    }
    
    // Water and drainage issues
    if (msg.includes('water') || msg.includes('drainage') || msg.includes('sewage') || msg.includes('leak')) {
        return {
            text: '<speak>Water and drainage issues need immediate attention!</speak> \n\n**💧 WATER & DRAINAGE SERVICES** \n\n**Common Issues:** \n• Water supply problems \n• Drainage blockages \n• Sewage overflows \n• Pipe leaks \n• Water quality concerns \n\n**Response Time:** 2-3 days for resolution \n**Emergency Water Issues:** Contact municipal office directly \n\n**Reporting Process:** \n1. Describe the exact problem \n2. Provide precise location \n3. Include photos if possible \n4. Specify urgency level \n\n**Ready to report a water/drainage issue?** I\'ll help you file a detailed report.',
            action: 'open_report_municipal'
        };
    }
    
    // Perfect default response with intelligent suggestions
    const intelligentSuggestion = getIntelligentSuggestion(msg);
    return {
        text: `<speak>I\'m here to help you with any city service need!</speak> \n\n**🤔 I understand you need assistance.** Let me help you find exactly what you\'re looking for. \n\n${intelligentSuggestion} \n\n**💡 Quick Suggestions:** \n• Say "report road problem" for infrastructure issues \n• Say "find hospital" for service locations \n• Say "emergency help" for urgent situations \n• Use the quick action buttons below \n• Try voice commands with the 🎤 button \n\n**I\'m designed to understand natural conversation - just tell me what you need help with!**`,
        action: null
    };
    
    // Session storage
    const sessionSummary = {
        user: currentUser,
        lastTopic: detectTopic(message),
        timestamp: new Date().toISOString()
    };
    localStorage.setItem('auroraSession', JSON.stringify(sessionSummary));
}

function getIntelligentSuggestion(message) {
    const msg = message.toLowerCase();
    
    if (msg.includes('problem') || msg.includes('issue') || msg.includes('broken')) {
        return '**It sounds like you have a problem to report.** I can help you report issues with roads, street lights, water, or other municipal services.';
    }
    
    if (msg.includes('find') || msg.includes('where') || msg.includes('location')) {
        return '**Looking for a location?** I can help you find hospitals, police stations, government offices, and other city services in Tadepalli and Vijayawada.';
    }
    
    if (msg.includes('how') || msg.includes('process') || msg.includes('procedure')) {
        return '**Need to know how something works?** I can explain processes for reporting issues, paying bills, or accessing city services.';
    }
    
    return '**I can help with reporting issues, finding services, or answering questions about city operations.**';
}

function detectTopic(message) {
    const msg = message.toLowerCase();
    if (msg.includes('road') || msg.includes('pothole')) return 'roads';
    if (msg.includes('light')) return 'lighting';
    if (msg.includes('bill') || msg.includes('pay')) return 'payments';
    if (msg.includes('emergency')) return 'emergency';
    return 'general';
}

function executeAIAction(action) {
    setTimeout(() => {
        switch(action) {
            case 'open_report_road':
                showReportForm();
                document.getElementById('issueService').value = 'road';
                break;
            case 'open_report_light':
                showReportForm();
                document.getElementById('issueService').value = 'streetlight';
                break;
            case 'open_payments':
                showPayments();
                break;
            case 'open_feedback':
                showFeedbackForm();
                break;
            case 'show_services':
                showCityServices();
                break;
            case 'emergency':
                alert('Emergency Contacts:\n• Medical Emergency: 108\n• Police: 100\n• Fire Department: 101\n• Disaster Management: 1077');
                break;
        }
    }, 500);
}

// Add event listener for chat input
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        const chatInput = document.getElementById('chatInput');
        if (chatInput) {
            chatInput.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    sendMessage();
                }
            });
        }
        
        const adminChatInput = document.getElementById('adminChatInput');
        if (adminChatInput) {
            adminChatInput.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    sendAdminMessage();
                }
            });
        }
    }, 100);
});

// Advanced Live Charts System
let chartUpdateInterval = null;

function showAnalytics() {
    if (!isAdmin) {
        alert('Access denied. Admin authentication required.');
        return;
    }
    hideAllSections();
    setActiveTab('Live Analytics');
    document.getElementById('analyticsSection').classList.remove('hidden');
    initializeCharts();
    startLiveUpdates();
}

function showUserAnalytics() {
    if (!currentUser) {
        alert('Please login to view analytics.');
        return;
    }
    hideAllUserSections();
    setActiveUserTab('My Analytics');
    document.getElementById('userAnalyticsSection').classList.remove('hidden');
    initializeUserCharts();
}

function initializeCharts() {
    drawDailyChart();
    drawUserActivityChart();
    updateLiveStats();
}

function initializeUserCharts() {
    drawMyReportsChart();
    drawMyActivityChart();
    drawMyPaymentsChart();
    updateUserStats();
}



function drawDailyChart() {
    const canvas = document.getElementById('dailyChart');
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const data = days.map(() => Math.floor(Math.random() * 20) + 5); // Simulated data
    
    const barWidth = 30;
    const barSpacing = 10;
    const maxHeight = 150;
    const maxValue = Math.max(...data);
    
    ctx.fillStyle = '#36A2EB';
    
    data.forEach((value, index) => {
        const barHeight = (value / maxValue) * maxHeight;
        const x = index * (barWidth + barSpacing) + 20;
        const y = canvas.height - barHeight - 30;
        
        // Gradient effect
        const gradient = ctx.createLinearGradient(0, y, 0, y + barHeight);
        gradient.addColorStop(0, '#36A2EB');
        gradient.addColorStop(1, '#1E88E5');
        ctx.fillStyle = gradient;
        
        ctx.fillRect(x, y, barWidth, barHeight);
        
        // Labels
        ctx.fillStyle = '#333';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(days[index], x + barWidth/2, canvas.height - 10);
        ctx.fillText(value.toString(), x + barWidth/2, y - 5);
    });
}

function drawUserActivityChart() {
    const canvas = document.getElementById('userActivityChart');
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const hours = Array.from({length: 24}, (_, i) => i);
    const data = hours.map(() => Math.floor(Math.random() * 10));
    
    ctx.strokeStyle = '#4BC0C0';
    ctx.lineWidth = 3;
    ctx.beginPath();
    
    data.forEach((value, index) => {
        const x = (index / 23) * (canvas.width - 40) + 20;
        const y = canvas.height - 30 - (value / 10) * 140;
        
        if (index === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
        
        // Draw points
        ctx.fillStyle = '#4BC0C0';
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, 2 * Math.PI);
        ctx.fill();
    });
    
    ctx.stroke();
}



function drawMyReportsChart() {
    const canvas = document.getElementById('myReportsChart');
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const myIssues = issues.filter(issue => issue.user === currentUser);
    const solved = myIssues.filter(issue => issue.status === 'solved').length;
    const pending = myIssues.filter(issue => issue.status === 'pending').length;
    const unsolved = myIssues.filter(issue => issue.status === 'unsolved').length;
    
    const data = [solved, pending, unsolved];
    const colors = ['#28a745', '#ffc107', '#dc3545'];
    const labels = ['Solved', 'Pending', 'Unsolved'];
    
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = 70;
    let currentAngle = 0;
    const total = data.reduce((sum, val) => sum + val, 0) || 1;
    
    data.forEach((value, index) => {
        const sliceAngle = (value / total) * 2 * Math.PI;
        
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle);
        ctx.closePath();
        ctx.fillStyle = colors[index];
        ctx.fill();
        
        currentAngle += sliceAngle;
    });
    
    // Legend
    labels.forEach((label, index) => {
        ctx.fillStyle = colors[index];
        ctx.fillRect(10, 10 + index * 20, 15, 15);
        ctx.fillStyle = '#333';
        ctx.font = '12px Arial';
        ctx.fillText(`${label}: ${data[index]}`, 30, 22 + index * 20);
    });
}

function drawMyActivityChart() {
    const canvas = document.getElementById('myActivityChart');
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    const data = months.map(() => Math.floor(Math.random() * 15) + 2);
    
    const barWidth = 25;
    const barSpacing = 15;
    const maxHeight = 120;
    const maxValue = Math.max(...data);
    
    data.forEach((value, index) => {
        const barHeight = (value / maxValue) * maxHeight;
        const x = index * (barWidth + barSpacing) + 20;
        const y = canvas.height - barHeight - 30;
        
        const gradient = ctx.createLinearGradient(0, y, 0, y + barHeight);
        gradient.addColorStop(0, '#667eea');
        gradient.addColorStop(1, '#764ba2');
        ctx.fillStyle = gradient;
        
        ctx.fillRect(x, y, barWidth, barHeight);
        
        ctx.fillStyle = '#333';
        ctx.font = '10px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(months[index], x + barWidth/2, canvas.height - 10);
        ctx.fillText(value.toString(), x + barWidth/2, y - 5);
    });
}

function drawMyPaymentsChart() {
    const canvas = document.getElementById('myPaymentsChart');
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const myPayments = payments.filter(payment => payment.user === currentUser);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    const data = months.map(() => Math.floor(Math.random() * 5000) + 1000);
    
    ctx.strokeStyle = '#28a745';
    ctx.lineWidth = 3;
    ctx.beginPath();
    
    data.forEach((value, index) => {
        const x = (index / (months.length - 1)) * (canvas.width - 40) + 20;
        const y = canvas.height - 30 - (value / 5000) * 120;
        
        if (index === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
        
        ctx.fillStyle = '#28a745';
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, 2 * Math.PI);
        ctx.fill();
        
        // Labels
        ctx.fillStyle = '#333';
        ctx.font = '10px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(months[index], x, canvas.height - 10);
    });
    
    ctx.stroke();
}

function updateLiveStats() {
    document.getElementById('liveReports').textContent = issues.filter(i => i.status === 'pending').length;
    document.getElementById('liveUsers').textContent = users.length;
    document.getElementById('liveFeedback').textContent = feedback.filter(f => !f.status).length;
}

function updateUserStats() {
    const myIssues = issues.filter(issue => issue.user === currentUser);
    const myPayments = payments.filter(payment => payment.user === currentUser);
    const myFeedback = feedback.filter(fb => fb.user === currentUser);
    
    document.getElementById('myTotalReports').textContent = myIssues.length;
    document.getElementById('mySolvedReports').textContent = myIssues.filter(i => i.status === 'solved').length;
    document.getElementById('myTotalPayments').textContent = myPayments.length;
    
    const avgRating = myFeedback.length > 0 ? 
        (myFeedback.reduce((sum, fb) => sum + parseInt(fb.rating), 0) / myFeedback.length).toFixed(1) : '0';
    document.getElementById('myAvgRating').textContent = avgRating;
}

function startLiveUpdates() {
    if (chartUpdateInterval) clearInterval(chartUpdateInterval);
    
    chartUpdateInterval = setInterval(() => {
        if (document.getElementById('analyticsSection').classList.contains('hidden')) {
            clearInterval(chartUpdateInterval);
            return;
        }
        initializeCharts();
    }, 5000); // Update every 5 seconds
}

function refreshCharts() {
    initializeCharts();
    alert('Charts refreshed with latest data!');
}

function updateTimeRange() {
    const range = document.getElementById('timeRange').value;
    // Filter data based on time range and refresh charts
    initializeCharts();
}

// Advanced Chat Functions
let chatTheme = 'light';
let chatNotifications = true;
let supportQueue = [];

// User Chat Functions
function showChatTab(tabName) {
    document.querySelectorAll('.feature-tab').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.chat-tab-content').forEach(content => content.classList.remove('active'));
    
    document.querySelector(`[onclick="showChatTab('${tabName}')"]`).classList.add('active');
    document.getElementById(`${tabName}ChatTab`).classList.add('active');
}

function clearChat() {
    if (confirm('Clear all chat messages?')) {
        chatMessages = chatMessages.filter(msg => 
            msg.user !== currentUser && 
            msg.type !== 'ai' && 
            !(msg.type === 'admin' && msg.targetUser === currentUser)
        );
        localStorage.setItem('chatMessages', JSON.stringify(chatMessages));
        displayChatMessages();
        alert('Chat cleared!');
    }
}

function exportChat() {
    const userMessages = chatMessages.filter(msg => 
        msg.user === currentUser || msg.type === 'ai' || (msg.type === 'admin' && msg.targetUser === currentUser)
    );
    
    const chatData = userMessages.map(msg => 
        `[${msg.timestamp}] ${msg.user}: ${msg.message}`
    ).join('\n');
    
    const blob = new Blob([chatData], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chat-history-${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
}

function toggleChatTheme() {
    chatTheme = chatTheme === 'light' ? 'dark' : 'light';
    const container = document.getElementById('chatContainer');
    const btn = document.getElementById('themeBtn');
    
    if (chatTheme === 'dark') {
        container.style.background = '#2c3e50';
        container.style.color = 'white';
        btn.textContent = '☀️ Light';
    } else {
        container.style.background = 'white';
        container.style.color = 'black';
        btn.textContent = '🌙 Dark';
    }
}

function attachFile() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*,.pdf,.doc,.docx';
    input.onchange = function(e) {
        const file = e.target.files[0];
        if (file) {
            const message = `📎 File attached: ${file.name} (${(file.size/1024).toFixed(1)}KB)`;
            document.getElementById('chatInput').value = message;
        }
    };
    input.click();
}

function addEmoji() {
    const emojis = ['😊', '👍', '❤️', '😢', '😡', '🤔', '👏', '🙏', '✅', '❌'];
    const emoji = emojis[Math.floor(Math.random() * emojis.length)];
    const input = document.getElementById('chatInput');
    input.value += emoji;
    input.focus();
}

function requestHumanSupport() {
    const category = document.getElementById('supportCategory').value;
    const message = document.getElementById('supportMessage').value;
    
    if (!category || !message) {
        alert('Please select a category and describe your issue.');
        return;
    }
    
    const supportRequest = {
        id: Date.now(),
        user: currentUser,
        category,
        message,
        timestamp: new Date().toLocaleTimeString(),
        status: 'waiting'
    };
    
    supportQueue.push(supportRequest);
    localStorage.setItem('supportQueue', JSON.stringify(supportQueue));
    
    alert('Your request has been submitted. A human agent will assist you shortly.');
    document.getElementById('supportCategory').value = '';
    document.getElementById('supportMessage').value = '';
}

function filterChatHistory() {
    const date = document.getElementById('historyDate').value;
    const filter = document.getElementById('historyFilter').value;
    
    let filteredMessages = chatMessages;
    
    if (date) {
        filteredMessages = filteredMessages.filter(msg => 
            new Date(msg.timestamp).toDateString() === new Date(date).toDateString()
        );
    }
    
    if (filter !== 'all') {
        filteredMessages = filteredMessages.filter(msg => {
            if (filter === 'user') return msg.user === currentUser;
            if (filter === 'ai') return msg.type === 'ai';
            if (filter === 'admin') return msg.type === 'admin';
            return true;
        });
    }
    
    displayChatHistory(filteredMessages);
}

function displayChatHistory(messages = chatMessages) {
    const container = document.getElementById('chatHistory');
    container.innerHTML = messages.map(msg => `
        <div class="history-message ${msg.type}">
            <div class="message-header">
                <strong>${msg.user}</strong>
                <span class="timestamp">${msg.timestamp}</span>
            </div>
            <div class="message-content">${msg.message}</div>
        </div>
    `).join('');
}

function downloadHistory() {
    const allMessages = chatMessages.map(msg => 
        `[${msg.timestamp}] ${msg.user} (${msg.type}): ${msg.message}`
    ).join('\n');
    
    const blob = new Blob([allMessages], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `full-chat-history-${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
}

// Admin Chat Functions
function showAdminTab(tabName) {
    document.querySelectorAll('.admin-tab').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.admin-tab-content').forEach(content => content.classList.remove('active'));
    
    document.querySelector(`[onclick="showAdminTab('${tabName}')"]`).classList.add('active');
    document.getElementById(`${tabName}Tab`).classList.add('active');
    
    if (tabName === 'analytics') {
        drawChatAnalytics();
    }
}

function refreshChatData() {
    displayAdminChat();
    updateChatStats();
    updateActiveUsersList();
    updateSupportQueue();
    alert('Chat data refreshed!');
}

function exportAllChats() {
    const allChats = chatMessages.map(msg => 
        `[${msg.timestamp}] ${msg.user} (${msg.type}): ${msg.message}`
    ).join('\n');
    
    const blob = new Blob([allChats], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `all-chats-${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
}

function toggleChatNotifications() {
    chatNotifications = !chatNotifications;
    const btn = document.getElementById('notifyBtn');
    btn.textContent = chatNotifications ? '🔔 Notifications' : '🔕 Notifications';
    btn.style.opacity = chatNotifications ? '1' : '0.6';
}

function updateActiveUsersList() {
    const container = document.getElementById('activeUsersList');
    const activeUsers = [...new Set(chatMessages.filter(msg => msg.type === 'user').map(msg => msg.user))];
    
    container.innerHTML = activeUsers.map(user => `
        <div class="user-item" onclick="selectUser('${user}')">
            <div class="user-name">${user}</div>
            <div class="user-status">🟢 Online</div>
        </div>
    `).join('');
}

function selectUser(username) {
    document.querySelectorAll('.user-item').forEach(item => item.classList.remove('active'));
    event.target.closest('.user-item').classList.add('active');
    
    document.getElementById('selectedUser').textContent = `Chatting with: ${username}`;
    document.getElementById('chatUser').value = username;
    
    // Load chat history for selected user
    const userMessages = chatMessages.filter(msg => 
        msg.user === username || (msg.type === 'admin' && msg.targetUser === username)
    );
    displayAdminChatMessages(userMessages);
}

function displayAdminChatMessages(messages = chatMessages) {
    const container = document.getElementById('adminChatMessages');
    container.innerHTML = messages.map(msg => `
        <div class="admin-chat-message ${msg.type}">
            <div class="message-header">
                <strong>${msg.user}</strong>
                <span class="timestamp">${msg.timestamp}</span>
            </div>
            <div class="message-content">${msg.message}</div>
        </div>
    `).join('');
    container.scrollTop = container.scrollHeight;
}

function insertTemplate(type) {
    const templates = {
        greeting: 'Hello! Thank you for contacting city support. How can I help you today?',
        closing: 'Thank you for using our service. Is there anything else I can help you with?',
        escalate: 'I\'m escalating your issue to a specialist who will contact you shortly.'
    };
    
    document.getElementById('adminChatInput').value = templates[type];
}

function transferChat() {
    const selectedUser = document.getElementById('chatUser').value;
    if (!selectedUser) {
        alert('Please select a user first.');
        return;
    }
    alert(`Chat with ${selectedUser} has been transferred to another agent.`);
}

function endChat() {
    const selectedUser = document.getElementById('chatUser').value;
    if (!selectedUser) {
        alert('Please select a user first.');
        return;
    }
    if (confirm(`End chat session with ${selectedUser}?`)) {
        alert(`Chat session with ${selectedUser} has been ended.`);
        document.getElementById('selectedUser').textContent = 'Select a user to chat';
        document.getElementById('chatUser').value = '';
    }
}

function updateSupportQueue() {
    supportQueue = JSON.parse(localStorage.getItem('supportQueue')) || [];
    const container = document.getElementById('supportQueue');
    
    document.getElementById('queueCount').textContent = supportQueue.length;
    document.getElementById('avgWait').textContent = '2.5 min';
    
    container.innerHTML = supportQueue.map(request => `
        <div class="queue-item">
            <div class="queue-header">
                <strong>${request.user}</strong>
                <span class="queue-category">${request.category}</span>
                <span class="queue-time">${request.timestamp}</span>
            </div>
            <div class="queue-message">${request.message}</div>
            <div class="queue-actions">
                <button onclick="acceptSupport(${request.id})" class="accept-btn">Accept</button>
                <button onclick="rejectSupport(${request.id})" class="reject-btn">Reject</button>
            </div>
        </div>
    `).join('');
}

function acceptSupport(requestId) {
    supportQueue = supportQueue.filter(req => req.id !== requestId);
    localStorage.setItem('supportQueue', JSON.stringify(supportQueue));
    updateSupportQueue();
    alert('Support request accepted!');
}

function rejectSupport(requestId) {
    supportQueue = supportQueue.filter(req => req.id !== requestId);
    localStorage.setItem('supportQueue', JSON.stringify(supportQueue));
    updateSupportQueue();
    alert('Support request rejected.');
}

function drawChatAnalytics() {
    // Chat Volume Chart
    const volumeCanvas = document.getElementById('chatVolumeChart');
    if (volumeCanvas) {
        const ctx = volumeCanvas.getContext('2d');
        ctx.clearRect(0, 0, volumeCanvas.width, volumeCanvas.height);
        
        const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        const data = days.map(() => Math.floor(Math.random() * 50) + 10);
        
        const barWidth = 30;
        const barSpacing = 10;
        const maxHeight = 150;
        const maxValue = Math.max(...data);
        
        data.forEach((value, index) => {
            const barHeight = (value / maxValue) * maxHeight;
            const x = index * (barWidth + barSpacing) + 20;
            const y = volumeCanvas.height - barHeight - 30;
            
            const gradient = ctx.createLinearGradient(0, y, 0, y + barHeight);
            gradient.addColorStop(0, '#007bff');
            gradient.addColorStop(1, '#0056b3');
            ctx.fillStyle = gradient;
            
            ctx.fillRect(x, y, barWidth, barHeight);
            
            ctx.fillStyle = '#333';
            ctx.font = '12px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(days[index], x + barWidth/2, volumeCanvas.height - 10);
            ctx.fillText(value.toString(), x + barWidth/2, y - 5);
        });
    }
    
    // Update top issues
    const topIssues = [
        { issue: 'Road Problems', count: 45 },
        { issue: 'Street Lights', count: 32 },
        { issue: 'Water Issues', count: 28 },
        { issue: 'Billing', count: 19 },
        { issue: 'Other', count: 15 }
    ];
    
    const issuesContainer = document.getElementById('topIssues');
    if (issuesContainer) {
        issuesContainer.innerHTML = topIssues.map(item => `
            <div class="issue-item">
                <span class="issue-name">${item.issue}</span>
                <span class="issue-count">${item.count}</span>
            </div>
        `).join('');
    }
}

function populateServiceDropdown(selectId) {
    const select = document.getElementById(selectId);
    const currentValue = select.value;
    
    select.innerHTML = '<option value="">Select Issue Type</option>';
    
    const issueTypes = [
        { value: 'road', text: 'Road Problems' },
        { value: 'streetlight', text: 'Street Light Problems' },
        { value: 'municipal', text: 'Municipal Problems' },
        { value: 'ragging', text: 'Ragging Issues' },
        { value: 'other', text: 'Other Issues' }
    ];
    
    issueTypes.forEach(issue => {
        const option = document.createElement('option');
        option.value = issue.value;
        option.textContent = issue.text;
        select.appendChild(option);
    });
    
    select.value = currentValue;
}