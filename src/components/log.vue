<script setup>
import { ref } from 'vue';
import useUsers from '../composables/useUsers';
import { useRouter } from 'vue-router';

const router = useRouter();
const { login } = useUsers();

const loginValue = ref('');
const password = ref('');
const error = ref('');
const logerror = ref('');
const passerror = ref('');

function validateForm() {
    let isValid = true;
    logerror.value = '';
    passerror.value = '';
    error.value = '';

    if (!loginValue.value.trim()) {
        logerror.value = 'Введите логин';
        isValid = false;
    }

    if (!password.value.trim()) {
        passerror.value = 'Введите пароль';
        isValid = false;
    }
    return isValid;
}

function handleSubmit() {
    if (!validateForm()) {
        return;
    }

    try {
        const user = login(loginValue.value, password.value);
        if (user) {
            router.push({ name: 'glavnaya' });
        } else {
            error.value = 'Неверный логин или пароль';
        }
    } catch (err) {
        error.value = err.message;
    }
}
</script>

<template>
    <div class="login-container">
        <div class="login-card">
            <div class="login-header">
                <div class="login-icon"><img src="/public/drill.png" alt="" height="90px"></div>
                <h3>Вход в аккаунт</h3>
                <p class="login-subtitle">Добро пожаловать обратно!</p>
            </div>
            
            <form novalidate @submit.prevent="handleSubmit" class="login-form">
                <div class="form-group">
                    <label class="form-label">
                        <span class="label-icon">🧍</span>
                        Логин
                    </label>
                    <input v-model="loginValue" type="text" placeholder="Введите логин">
                    <span v-if="logerror" class="error-message">{{ logerror }}</span>
                </div>
                
                <div class="form-group">
                    <label class="form-label">
                        <span class="label-icon">🔒︎</span>
                        Пароль
                    </label>
                    <input v-model="password" type="password" placeholder="Введите пароль">
                    <span v-if="passerror" class="error-message">{{ passerror }}</span>
                </div>
                
                <div v-if="error" class="error general-error">  
                    {{ error }}
                </div>
                
                <button type="submit" class="login-btn">
                    <span>Войти</span>
                </button>
                
                <div class="register-link">
                    Нет аккаунта? 
                    <RouterLink to="/reg">Зарегистрироваться</RouterLink>
                </div>
            </form>
        </div>
    </div>
</template>

<style scoped>
.login-icon {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 20px;
}

.login-icon img {
    width: auto;
    height: 90px;
    display: block;
}
.login-container {
    min-height: calc(100vh - 200px);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 30px 20px;
    background: #ffffff;
}

.login-card {
    max-width: 420px;
    width: 100%;
    background: #f5f5f5;
    border-radius: 20px;
    padding: 40px;
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
}

.login-header {
    text-align: center;
    margin-bottom: 35px;
}

.login-icon {
    font-size: 48px;
    margin-bottom: 15px;
}

.login-header h3 {
    font-size: 28px;
    color: #333333;
    margin-bottom: 8px;
    font-weight: 600;
}

.login-subtitle {
    font-size: 15px;
    color: #666666;
    margin: 0;
}

.login-form {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.form-group {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.form-label {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 15px;
    font-weight: 500;
    color: #333333;
}

.label-icon {
    font-size: 18px;
}

.form-group input {
    padding: 14px 16px;
    border: 2px solid #e0e0e0;
    border-radius: 12px;
    font-size: 15px;
    color: #333333;
    background: white;
    transition: all 0.3s ease;
}

.form-group input:focus {
    outline: none;
    border-color: #2196F3;
    box-shadow: 0 0 0 3px rgba(33, 150, 243, 0.1);
}

.form-group input::placeholder {
    color: #999999;
}

.form-group input:disabled {
    background: #f5f5f5;
    cursor: not-allowed;
    opacity: 0.7;
}

.error-message {
    color: #c62828;
    font-size: 13px;
    margin-top: 4px;
    padding-left: 4px;
}

.general-error {
    margin-top: -10px;
}

.login-btn {
    padding: 14px 20px;
    background: #2196F3;
    color: white;
    border: none;
    border-radius: 12px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    margin-top: 10px;
}

.login-btn:hover:not(:disabled) {
    background: #1976D2;
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(33, 150, 243, 0.3);
}

.login-btn:disabled {
    opacity: 0.7;
    cursor: not-allowed;
}


.register-link {
    text-align: center;
    font-size: 14px;
    color: #666666;
    margin-top: 5px;
}

.register-link a {
    color: #2196F3;
    text-decoration: none;
    font-weight: 500;
    transition: color 0.3s ease;
}

.register-link a:hover {
    color: #1976D2;
    text-decoration: underline;
}

.error {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 12px 16px;
    background: #ffebee;
    color: #c62828;
    border-radius: 10px;
    font-size: 14px;
    margin: 0;
    border: 1px solid #ffcdd2;
}

.error-icon {
    font-size: 18px;
}

@keyframes spin {
    to { transform: rotate(360deg); }
}
</style>