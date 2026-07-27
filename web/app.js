// API Configuration
const API_BASE_URL = window.location.hostname === 'localhost' 
    ? 'http://localhost:3000/api'
    : 'https://jobmap-backend-57v5.onrender.com/api';

class AuthService {
    async login(email, password) {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'خطأ في تسجيل الدخول');
        }

        const data = await response.json();
        localStorage.setItem('accessToken', data.accessToken);
        if (data.refreshToken) {
            localStorage.setItem('refreshToken', data.refreshToken);
        }
        localStorage.setItem('user', JSON.stringify(data.user));
        return data;
    }

    async register(email, password, firstName, lastName, role = 'seeker') {
        const response = await fetch(`${API_BASE_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email,
                password,
                firstName,
                lastName,
                role,
            }),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'خطأ في إنشاء الحساب');
        }

        const data = await response.json();
        localStorage.setItem('accessToken', data.accessToken);
        if (data.refreshToken) {
            localStorage.setItem('refreshToken', data.refreshToken);
        }
        localStorage.setItem('user', JSON.stringify(data.user));
        return data;
    }

    logout() {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
    }

    getAccessToken() {
        return localStorage.getItem('accessToken');
    }

    isAuthenticated() {
        return !!this.getAccessToken();
    }
}

const authService = new AuthService();

// UI Management
class UIManager {
    constructor() {
        this.currentPage = 'login';
    }

    showLoginPage() {
        document.getElementById('app').innerHTML = `
            <div class="container">
                <h1 class="form-title">مرحبا بك</h1>
                <p class="form-subtitle">سجل الدخول إلى حسابك</p>
                <div id="alertContainer"></div>
                <form id="loginForm">
                    <div class="form-group">
                        <label for="email">البريد الإلكتروني</label>
                        <input type="email" id="email" name="email" placeholder="example@mail.com" required>
                    </div>
                    <div class="form-group">
                        <label for="password">كلمة المرور</label>
                        <div class="password-wrapper">
                            <input type="password" id="password" name="password" placeholder="••••••••" required>
                            <button type="button" class="toggle-password" onclick="togglePasswordVisibility('password')">👁️</button>
                        </div>
                    </div>
                    <button type="submit" id="loginBtn">تسجيل الدخول</button>
                </form>
                <div class="form-footer">
                    لا تملك حسابا؟ <a onclick="ui.showRegisterPage()">سجل الآن</a>
                </div>
                <div id="socialButtonsContainer"></div>
            </div>
        `;
        this.currentPage = 'login';
        document.getElementById('loginForm').addEventListener('submit', this.handleLogin.bind(this));
        addSocialLoginButtons('socialButtonsContainer');
    }

    showRegisterPage() {
        document.getElementById('app').innerHTML = `
            <div class="container">
                <h1 class="form-title">انضم إلينا</h1>
                <p class="form-subtitle">أنشئ حسابك الآن</p>
                <div id="alertContainer"></div>
                <form id="registerForm">
                    <div class="form-group">
                        <label for="firstName">الاسم الأول</label>
                        <input type="text" id="firstName" name="firstName" required>
                    </div>
                    <div class="form-group">
                        <label for="lastName">اسم العائلة</label>
                        <input type="text" id="lastName" name="lastName" required>
                    </div>
                    <div class="form-group">
                        <label for="regEmail">البريد الإلكتروني</label>
                        <input type="email" id="regEmail" name="email" placeholder="example@mail.com" required>
                    </div>
                    <div class="form-group">
                        <label for="regPassword">كلمة المرور</label>
                        <div class="password-wrapper">
                            <input type="password" id="regPassword" name="password" placeholder="••••••••" required>
                            <button type="button" class="toggle-password" onclick="togglePasswordVisibility('regPassword')">👁️</button>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="role">نوع الحساب</label>
                        <select id="role" name="role" class="role-select" required>
                            <option value="seeker">طالب وظيفة</option>
                            <option value="employer">صاحب عمل</option>
                            <option value="recruitment_agency">شركة توظيف</option>
                            <option value="admin">مسؤول النظام</option>
                        </select>
                    </div>
                    <button type="submit" id="registerBtn">إنشاء الحساب</button>
                </form>
                <div class="form-footer">
                    لديك حساب بالفعل؟ <a onclick="ui.showLoginPage()">سجل الدخول</a>
                </div>
                <div id="socialButtonsContainer"></div>
            </div>
        `;
        this.currentPage = 'register';
        document.getElementById('registerForm').addEventListener('submit', this.handleRegister.bind(this));
        addSocialLoginButtons('socialButtonsContainer');
    }

    showAlert(message, type = 'error') {
        const alertContainer = document.getElementById('alertContainer');
        if (alertContainer) {
            const alert = document.createElement('div');
            alert.className = `alert ${type}`;
            alert.textContent = message;
            alertContainer.innerHTML = '';
            alertContainer.appendChild(alert);
            setTimeout(() => {
                alert.remove();
            }, 5000);
        }
    }

    setButtonLoading(buttonId, isLoading) {
        const button = document.getElementById(buttonId);
        if (button) {
            button.disabled = isLoading;
            if (isLoading) {
                button.innerHTML = `<div class="spinner"></div>`;
            } else {
                button.textContent = this.currentPage === 'login' ? 'تسجيل الدخول' : 'إنشاء الحساب';
            }
        }
    }

    async handleLogin(e) {
        e.preventDefault();
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;

        if (!email || !password) {
            this.showAlert('أدخل البريد الإلكتروني وكلمة المرور');
            return;
        }

        if (password.length < 8) {
            this.showAlert('كلمة المرور يجب أن تكون 8 أحرف على الأقل');
            return;
        }

        this.setButtonLoading('loginBtn', true);
        try {
            await authService.login(email, password);
            this.showAlert('تم تسجيل الدخول بنجاح', 'success');
            setTimeout(() => {
                window.location.href = '/home'; // Redirect to home or dashboard
            }, 1000);
        } catch (error) {
            this.showAlert(error.message);
        } finally {
            this.setButtonLoading('loginBtn', false);
        }
    }

    async handleRegister(e) {
        e.preventDefault();
        const firstName = document.getElementById('firstName').value.trim();
        const lastName = document.getElementById('lastName').value.trim();
        const email = document.getElementById('regEmail').value.trim();
        const password = document.getElementById('regPassword').value;
        const role = document.getElementById('role').value;

        if (!firstName || !lastName || !email || !password) {
            this.showAlert('أكمل جميع الحقول');
            return;
        }

        if (password.length < 8) {
            this.showAlert('كلمة المرور يجب أن تكون 8 أحرف على الأقل');
            return;
        }

        this.setButtonLoading('registerBtn', true);
        try {
            await authService.register(email, password, firstName, lastName, role);
            this.showAlert('تم إنشاء الحساب بنجاح', 'success');
            setTimeout(() => {
                window.location.href = '/home'; // Redirect to home or dashboard
            }, 1000);
        } catch (error) {
            this.showAlert(error.message);
        } finally {
            this.setButtonLoading('registerBtn', false);
        }
    }
}

const ui = new UIManager();

// Helper Functions
function togglePasswordVisibility(inputId) {
    const input = document.getElementById(inputId);
    const type = input.type === 'password' ? 'text' : 'password';
    input.type = type;
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    if (authService.isAuthenticated()) {
        window.location.href = '/home';
    } else {
        ui.showLoginPage();
    }
});
