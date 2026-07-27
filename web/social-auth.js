// Google Sign-In Configuration
const GOOGLE_CLIENT_ID = '215370690483-ucqa59t97ggffu4l0ahr0ingrp6cp7io.apps.googleusercontent.com'; // Web Client ID

// Facebook SDK Configuration
const FACEBOOK_APP_ID = '1368671672021765';

class SocialAuthService {
    async loginWithGoogle() {
        try {
            // This is a placeholder - in real app, use Google Sign-In button
            // For web, you need to use Google's official SDK
            const response = await fetch(`${API_BASE_URL}/auth/social/google`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    idToken: 'GOOGLE_ID_TOKEN',
                    accessToken: 'GOOGLE_ACCESS_TOKEN',
                    email: 'user@example.com',
                    displayName: 'User Name',
                }),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'فشل تسجيل الدخول عبر Google');
            }

            const data = await response.json();
            localStorage.setItem('accessToken', data.accessToken);
            localStorage.setItem('refreshToken', data.refreshToken);
            localStorage.setItem('user', JSON.stringify(data.user));
            return data;
        } catch (error) {
            throw error;
        }
    }

    async loginWithFacebook() {
        try {
            const response = await fetch(`${API_BASE_URL}/auth/social/facebook`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    accessToken: 'FACEBOOK_ACCESS_TOKEN',
                    email: 'user@example.com',
                    displayName: 'User Name',
                    pictureUrl: 'PICTURE_URL',
                }),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'فشل تسجيل الدخول عبر Facebook');
            }

            const data = await response.json();
            localStorage.setItem('accessToken', data.accessToken);
            localStorage.setItem('refreshToken', data.refreshToken);
            localStorage.setItem('user', JSON.stringify(data.user));
            return data;
        } catch (error) {
            throw error;
        }
    }
}

const socialAuthService = new SocialAuthService();

// Add Social Login buttons to UI
function addSocialLoginButtons(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const socialButtonsHTML = `
        <div class="social-divider">
            <span>أو سجل باستخدام</span>
        </div>
        <div class="social-buttons">
            <button type="button" class="social-btn google-btn" onclick="handleGoogleLogin()">
                <span class="google-icon">🔷</span>
                <span>Google</span>
            </button>
            <button type="button" class="social-btn facebook-btn" onclick="handleFacebookLogin()">
                <span class="facebook-icon">f</span>
                <span>Facebook</span>
            </button>
        </div>
    `;

    container.insertAdjacentHTML('beforeend', socialButtonsHTML);
}

async function handleGoogleLogin() {
    try {
        ui.showAlert('جاري تسجيل الدخول عبر Google...', 'info');
        const result = await socialAuthService.loginWithGoogle();
        ui.showAlert('تم تسجيل الدخول بنجاح', 'success');
        setTimeout(() => {
            window.location.href = '/home';
        }, 1000);
    } catch (error) {
        ui.showAlert(error.message);
    }
}

async function handleFacebookLogin() {
    try {
        ui.showAlert('جاري تسجيل الدخول عبر Facebook...', 'info');
        const result = await socialAuthService.loginWithFacebook();
        ui.showAlert('تم تسجيل الدخول بنجاح', 'success');
        setTimeout(() => {
            window.location.href = '/home';
        }, 1000);
    } catch (error) {
        ui.showAlert(error.message);
    }
}
