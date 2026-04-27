// =============================================
//  Student Portal JavaScript
//  Backend API: Render (deployed)
// =============================================

// 🔁 After deploying to Render, replace this URL with your actual Render URL
// Example: 'https://student-portal-backend.onrender.com/api'
const API = 'https://stdport.onrender.com/api';

// Global state
let currentStudent = null;
let attendanceData = [];

// ── Utility: get / save current student ──────
function getStudent() {
    const s = sessionStorage.getItem('currentStudent');
    return s ? JSON.parse(s) : null;
}
function saveStudent(student) {
    sessionStorage.setItem('currentStudent', JSON.stringify(student));
    currentStudent = student;
}
function clearSession() {
    sessionStorage.clear();
    currentStudent = null;
}

// ── Utility: simple toast ─────────────────────
function showToast(msg, type = 'info') {
    let toast = document.getElementById('_toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = '_toast';
        toast.style.cssText = `
            position:fixed;bottom:24px;right:24px;padding:12px 20px;
            border-radius:8px;color:#fff;font-weight:600;font-size:14px;
            z-index:9999;transition:opacity .3s;box-shadow:0 4px 12px rgba(0,0,0,.25)`;
        document.body.appendChild(toast);
    }
    toast.textContent = msg;
    toast.style.background = type === 'error' ? '#e74c3c' : type === 'success' ? '#27ae60' : '#2c3e50';
    toast.style.opacity = '1';
    clearTimeout(toast._t);
    toast._t = setTimeout(() => toast.style.opacity = '0', 3000);
}

// =============================================
//  AUTH
// =============================================

async function handleLogin() {
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();
    const errorDiv = document.getElementById('errorMessage');

    try {
        const res  = await fetch(`${API}/login`, {
            method:  'POST',
            headers: { 'Content-Type': 'application/json' },
            body:    JSON.stringify({ username, password })
        });
        const data = await res.json();

        if (!res.ok) {
            if (errorDiv) { errorDiv.textContent = data.error; errorDiv.style.display = 'block'; }
            return;
        }

        saveStudent(data.student);
        window.location.href = 'src/html/dashboard.html';

    } catch (err) {
        if (errorDiv) { errorDiv.textContent = 'Cannot connect to server. Make sure backend is running.'; errorDiv.style.display = 'block'; }
    }
}

async function handleRegister() {
    const fullName        = document.getElementById('regFullName').value.trim();
    const username        = document.getElementById('regUsername').value.trim();
    const email           = document.getElementById('regEmail').value.trim();
    const password        = document.getElementById('regPassword').value;
    const confirmPassword = document.getElementById('regConfirmPassword').value;
    const studentId       = document.getElementById('regStudentId').value.trim();

    const errorMsg   = document.getElementById('registerErrorMessage');
    const successMsg = document.getElementById('registerSuccessMessage');
    errorMsg.style.display   = 'none';
    successMsg.style.display = 'none';

    if (password !== confirmPassword) {
        errorMsg.textContent = 'Passwords do not match!';
        errorMsg.style.display = 'block';
        return;
    }
    if (password.length < 6) {
        errorMsg.textContent = 'Password must be at least 6 characters!';
        errorMsg.style.display = 'block';
        return;
    }

    try {
        const res  = await fetch(`${API}/register`, {
            method:  'POST',
            headers: { 'Content-Type': 'application/json' },
            body:    JSON.stringify({ fullName, username, email, password, studentId })
        });
        const data = await res.json();

        if (!res.ok) {
            errorMsg.textContent   = data.error;
            errorMsg.style.display = 'block';
            return;
        }

        successMsg.style.display = 'block';
        document.getElementById('registerForm').reset();
        setTimeout(() => { switchToLogin(); successMsg.style.display = 'none'; }, 2000);

    } catch (err) {
        errorMsg.textContent   = 'Cannot connect to server. Make sure backend is running.';
        errorMsg.style.display = 'block';
    }
}

function handleLogout() {
    clearSession();
    window.location.href = '../../index.html';
}

function checkLogin() {
    const student     = getStudent();
    const currentPath = window.location.pathname;
    const onLoginPage = currentPath.includes('index.html') || currentPath.endsWith('/');

    if (!student && !onLoginPage) {
        window.location.href = '../../index.html';
        return false;
    }
    if (student && onLoginPage) {
        window.location.href = 'src/html/dashboard.html';
        return false;
    }
    if (student) currentStudent = student;
    return true;
}

// =============================================
//  ATTENDANCE  (fetch from backend)
// =============================================

async function loadAttendanceFromAPI() {
    const student = getStudent();
    if (!student) return [];

    try {
        const res  = await fetch(`${API}/attendance/${student.id}`);
        const data = await res.json();
        attendanceData = data;
        return data;
    } catch (err) {
        showToast('Backend not reachable. Showing cached data.', 'error');
        return [];
    }
}

// =============================================
//  CALCULATION HELPERS  (unchanged logic)
// =============================================

function calculatePercentage(attended, total) {
    return total > 0 ? Math.round((attended / total) * 100) : 0;
}

function calculateClassesNeeded(attended, total) {
    const numerator = (0.75 * total) - attended;
    if (numerator <= 0) return 0;
    return Math.ceil(numerator / 0.25);
}

function calculateSafeLeaves(attended, total) {
    if (attended / total < 0.75) return 0;
    return Math.max(0, Math.floor(attended / 0.75) - total);
}

function getAttendanceStatus(pct) {
    if (pct >= 75) return 'good';
    if (pct >= 60) return 'warning';
    return 'danger';
}
function getBadgeClass(pct)    { const s = getAttendanceStatus(pct); return `badge-${s}`; }
function getProgressClass(pct) { const s = getAttendanceStatus(pct); return `progress-${s}`; }

function analyzeLeaveRequirements(records) {
    return records.map(r => {
        const pct = r.percentage;
        let a = { subject: r.subject, currentAttendance: pct, totalClasses: r.totalClasses, attendedClasses: r.attendedClasses };
        if (pct >= 75) {
            const canMiss = calculateSafeLeaves(r.attendedClasses, r.totalClasses);
            a.status  = 'safe';
            a.canMiss = canMiss;
            a.message = canMiss > 0
                ? `You can safely miss ${canMiss} more class(es) and stay above 75%.`
                : `You're at the minimum. Don't miss any more classes.`;
        } else {
            const needed = calculateClassesNeeded(r.attendedClasses, r.totalClasses);
            a.status         = pct >= 60 ? 'warning' : 'critical';
            a.classesNeeded  = needed;
            a.message        = `Attend ${needed} consecutive class(es) to reach 75%.`;
        }
        return a;
    });
}

function generateRecommendations(analysis) {
    const recs = [];
    const critical = analysis.filter(a => a.status === 'critical');
    const warning  = analysis.filter(a => a.status === 'warning');
    const safe     = analysis.filter(a => a.status === 'safe');

    if (critical.length) recs.push(`🚨 URGENT: Critical attendance in ${critical.map(s => s.subject).join(', ')}.`);
    if (warning.length)  recs.push(`⚠️ WARNING: Needs attention — ${warning.map(s => s.subject).join(', ')}.`);
    if (safe.length) {
        const total = safe.reduce((sum, s) => sum + (s.canMiss || 0), 0);
        if (total > 0) recs.push(`✅ GOOD: You can miss up to ${total} class(es) across ${safe.length} safe subject(s).`);
    }
    if (!recs.length) recs.push('📚 Keep it up! Maintain your current attendance.');
    return recs;
}

// =============================================
//  PAGE LOADERS
// =============================================

async function loadDashboardData() {
    if (!checkLogin()) return;
    updateStudentName();

    const records = await loadAttendanceFromAPI();
    if (!records.length) return;

    const totalClasses  = records.reduce((s, r) => s + r.totalClasses, 0);
    const totalAttended = records.reduce((s, r) => s + r.attendedClasses, 0);
    const overallPct    = calculatePercentage(totalAttended, totalClasses);
    const analysis      = analyzeLeaveRequirements(records);

    setText('overallAttendance', `${overallPct}%`);
    setText('totalSubjects',     records.length);

    const statusEl = document.getElementById('attendanceStatus');
    if (statusEl) {
        const s = getAttendanceStatus(overallPct);
        statusEl.textContent = s === 'good' ? 'Good' : s === 'warning' ? 'Warning' : 'Critical';
        statusEl.className   = `stat-value ${s}`;
    }

    const subjectsListEl = document.getElementById('subjectsList');
    if (subjectsListEl) {
        subjectsListEl.innerHTML = records.map(r => `
            <div style="margin-bottom:8px">
                <strong>${r.subject}</strong> — ${r.percentage}%
            </div>`).join('');
    }

    setText('criticalSubjects', analysis.filter(a => a.status === 'critical').length);
    setText('safeLeaves',       analysis.filter(a => a.status === 'safe').reduce((sum, a) => sum + (a.canMiss || 0), 0));
}

async function loadAttendanceData() {
    if (!checkLogin()) return;
    updateStudentName();

    const records = await loadAttendanceFromAPI();
    if (!records.length) return;

    const totalClasses  = records.reduce((s, r) => s + r.totalClasses, 0);
    const totalAttended = records.reduce((s, r) => s + r.attendedClasses, 0);
    setText('overallPercentage', `${calculatePercentage(totalAttended, totalClasses)}%`);

    const listEl = document.getElementById('attendanceList');
    if (listEl) {
        listEl.innerHTML = records.map(r => `
            <div class="subject-card">
                <div class="subject-header">
                    <span class="subject-name">${r.subject}</span>
                    <span class="attendance-badge ${getBadgeClass(r.percentage)}">${r.percentage}%</span>
                </div>
                <div class="attendance-details">
                    <div class="detail-row"><span class="detail-label">Total Classes:</span><span class="detail-value">${r.totalClasses}</span></div>
                    <div class="detail-row"><span class="detail-label">Attended:</span><span class="detail-value">${r.attendedClasses}</span></div>
                    <div class="detail-row"><span class="detail-label">Missed:</span><span class="detail-value">${r.totalClasses - r.attendedClasses}</span></div>
                </div>
                <div class="progress-bar">
                    <div class="progress-fill ${getProgressClass(r.percentage)}" style="width:${r.percentage}%"></div>
                </div>
            </div>`).join('');
    }
}

async function loadLeaveTrackerData() {
    if (!checkLogin()) return;
    updateStudentName();

    const records = await loadAttendanceFromAPI();
    if (!records.length) return;

    const analysis      = analyzeLeaveRequirements(records);
    const recs          = generateRecommendations(analysis);

    const leaveEl = document.getElementById('leaveAnalysis');
    if (leaveEl) {
        leaveEl.innerHTML = analysis.map(a => `
            <div class="leave-card ${a.status}">
                <div class="leave-header">
                    <span class="leave-subject">${a.subject}</span>
                    <span class="leave-status status-${a.status}">${a.status.toUpperCase()}</span>
                </div>
                <div class="leave-details">
                    <div class="detail-row"><span class="detail-label">Current Attendance:</span><span class="detail-value">${a.currentAttendance}%</span></div>
                    <div class="detail-row"><span class="detail-label">Attended/Total:</span><span class="detail-value">${a.attendedClasses}/${a.totalClasses}</span></div>
                </div>
                <div class="leave-message ${a.status}">${a.message}</div>
            </div>`).join('');
    }

    const recsEl = document.getElementById('recommendations');
    if (recsEl) {
        recsEl.innerHTML = recs.map(r => `<div class="recommendation-item"><p>${r}</p></div>`).join('');
    }
}

// =============================================
//  PROFILE
// =============================================

async function loadProfileData() {
    if (!checkLogin()) return;
    updateStudentName();

    const student = getStudent();
    try {
        const res  = await fetch(`${API}/profile/${student.id}`);
        const data = await res.json();
        // Fill profile fields if they exist on the page
        setVal('profileName',     data.name);
        setVal('profileEmail',    data.email);
        setVal('profilePhone',    data.phone);
        setVal('profileCourse',   data.course);
        setVal('profileSemester', data.semester);
        setVal('profileStudentId',data.studentId);
        // Update display name in header
        const nameDisplay = document.getElementById('displayName');
        if (nameDisplay) nameDisplay.textContent = data.name;
    } catch (err) {
        showToast('Could not load profile from server.', 'error');
    }
}

async function saveProfile() {
    const student = getStudent();
    const body = {
        name:     getVal('profileName'),
        email:    getVal('profileEmail'),
        phone:    getVal('profilePhone'),
        course:   getVal('profileCourse'),
        semester: getVal('profileSemester')
    };

    try {
        const res  = await fetch(`${API}/profile/${student.id}`, {
            method:  'PUT',
            headers: { 'Content-Type': 'application/json' },
            body:    JSON.stringify(body)
        });
        const data = await res.json();
        saveStudent({ ...student, ...data });
        showToast('Profile saved!', 'success');
    } catch (err) {
        showToast('Could not save profile.', 'error');
    }
}

// =============================================
//  UI HELPERS
// =============================================

function setText(id, val)  { const el = document.getElementById(id); if (el) el.textContent = val; }
function setVal(id, val)   { const el = document.getElementById(id); if (el) el.value = val || ''; }
function getVal(id)        { const el = document.getElementById(id); return el ? el.value : ''; }

function updateStudentName() {
    const s = getStudent();
    const el = document.getElementById('studentName');
    if (el && s) el.textContent = s.name;
}

function setActiveSidebarLink() {
    const current = window.location.pathname.split('/').pop();
    document.querySelectorAll('.sidebar-menu a').forEach(link => {
        const href = link.getAttribute('href') || '';
        link.classList.toggle('active', href === current);
    });
}

function toggleMobileMenu() {
    const menu = document.getElementById('navbarMenu');
    if (menu) menu.classList.toggle('active');
}

function toggleDropdown(event, id) {
    event.preventDefault();
    event.stopPropagation();
    const menu = document.getElementById(id);
    if (!menu) return;
    document.querySelectorAll('.dropdown-menu').forEach(m => { if (m.id !== id) m.classList.remove('show'); });
    menu.classList.toggle('show');
}

document.addEventListener('click', e => {
    if (!e.target.closest('.nav-dropdown') && !e.target.closest('.navbar-user')) {
        document.querySelectorAll('.dropdown-menu').forEach(m => m.classList.remove('show'));
    }
});

// ── Route dispatcher ──────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    const path = window.location.pathname;
    if (path.includes('dashboard.html'))    loadDashboardData();
    else if (path.includes('attendance.html'))   loadAttendanceData();
    else if (path.includes('leave-tracker.html')) loadLeaveTrackerData();
    else if (path.includes('profile.html'))      loadProfileData();
    setActiveSidebarLink();
});