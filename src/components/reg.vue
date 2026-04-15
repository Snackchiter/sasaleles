<script setup>
import { ref } from 'vue';
import useUsers from '../composables/useUsers';
import { useRouter } from 'vue-router';

const router = useRouter();
const users = useUsers();

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const login = ref('');
const email = ref('');
const phone = ref('');
const country = ref('');
const password = ref('');
const error = ref('');

const loginError = ref('');
const emailError = ref('');
const passwordError = ref('');

function validateFields() {
    loginError.value = '';
    emailError.value = '';
    passwordError.value = '';

    let isValid = true;

    if (!login.value || login.value.trim() === '') {
        loginError.value = 'Пожалуйста, введите логин';
        isValid = false;
    } else if (users.userList.value.some(u => u.email === email.value)) {
    loginError.value = 'Пользователь с такой почтой существует'
    isValid = false
    }
    else if (users.userList.value.some(u => u.login === login.value)) {
      loginError.value = 'Пользователь с таким логином существует'
      isValid = false
    }

    if (!email.value || email.value.trim() === '') {
        emailError.value = 'Пожалуйста, введите email';
        isValid = false;
    } else if (!emailRegex.test(email.value)) {
        emailError.value = 'Введите корректный email-адрес';
        isValid = false;
    }

    if (!password.value || password.value.trim() === '') {
        passwordError.value = 'Пожалуйста, введите пароль';
        isValid = false;
    }
    return isValid;
}

function handleSubmit() {
    error.value = '';

    if (!validateFields()) {
        return;
    }

    try {
        users.register({
            login: login.value.trim(),
            email: email.value.trim(),
            password: password.value.trim(),
            phone: phone.value ? phone.value.trim() : '',
            country: country.value ? country.value.trim() : ''
        });
        router.push({ name: 'glavnaya' });
    } catch (err) {
        error.value = err.message;
    }
}
</script>

<template>
    <div class="register-container">
        <div class="register-card">
            <div class="register-header">
                <h3>Регистрация</h3>
                <p class="register-subtitle">Создайте аккаунт для доступа ко всем возможностям</p>
            </div>

            <form @submit.prevent="handleSubmit" novalidate class="register-form">
                <div class="form-group">
                    <label class="form-label">
                        <span class="label-icon">🧍</span>
                        Логин
                    </label>
                    <input v-model="login" type="text" placeholder="Придумайте логин"/>
                    <p v-if="loginError" class="field-error">{{ loginError }}</p>
                </div>

                <div class="form-group">
                    <label class="form-label">
                        <span class="label-icon">✉︎</span>
                        Почта
                    </label>
                    <input v-model="email" type="email" placeholder="example@mail.ru"/>
                    <p v-if="emailError" class="field-error">{{ emailError }}</p>
                </div>

                <div class="form-row">
                    <div class="form-group">
                        <label class="form-label">
                            <span class="label-icon">🌍</span>
                            Страна
                        </label>
                        <input v-model="country" type="text" placeholder="Россия" />
                    </div>

                    <div class="form-group">
                        <label class="form-label">
                            <span class="label-icon">☏</span>
                            Телефон
                        </label>
                        <input v-model="phone" type="tel" placeholder="+7 (999) 123-45-67" />
                    </div>
                </div>

                <div class="form-group">
                    <label class="form-label">
                        <span class="label-icon">🔒︎</span>
                        Пароль
                    </label>
                    <input v-model="password" type="password">
                    <p v-if="passwordError" class="field-error">{{ passwordError }}</p>
                </div>


                <button type="submit" class="register-btn">Зарегистрироваться</button>

                <div class="login-link">
                    Есть аккаунт? 
                    <RouterLink to="/log">Войти</RouterLink>
                </div>
            </form>
        </div>
    </div>
</template>

<style scoped>
.register-container {
    min-height: calc(100vh - 200px);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 30px 20px;
    background: #ffffff;
}

.register-card {
    max-width: 500px;
    width: 100%;
    background: #f5f5f5;
    border-radius: 20px;
    padding: 40px;
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
}

.register-header {
    text-align: center;
    margin-bottom: 35px;
}

.register-icon {
    font-size: 48px;
    margin-bottom: 15px;
}

.register-header h3 {
    font-size: 28px;
    color: #333333;
    margin-bottom: 8px;
    font-weight: 600;
}

.register-subtitle {
    font-size: 14px;
    color: #666666;
    margin: 0;
}

.register-form {
    display: flex;
    flex-direction: column;
    gap: 18px;
}

.form-group {
    display: flex;
    flex-direction: column;
    gap: 6px;
}

.form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 15px;
}

.form-label {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;
    font-weight: 500;
    color: #333333;
}

.label-icon {
    font-size: 18px;
}

.form-group input {
    padding: 12px 16px;
    border: 2px solid #e0e0e0;
    border-radius: 10px;
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

.form-group input.error {
    border-color: #f44336;
}

.form-group input.error:focus {
    box-shadow: 0 0 0 3px rgba(244, 67, 54, 0.1);
}

.form-group input::placeholder {
    color: #999999;
}

.form-group input:disabled {
    background: #f5f5f5;
    cursor: not-allowed;
    opacity: 0.7;
}

.field-error {
    color: #f44336;
    font-size: 13px;
    margin: 4px 0 0 4px;
}

.form-error {
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

.register-btn {
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

.register-btn:hover:not(:disabled) {
    background: #1976D2;
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(33, 150, 243, 0.3);
}

.register-btn:disabled {
    opacity: 0.7;
    cursor: not-allowed;
}

.login-link {
    text-align: center;
    font-size: 14px;
    color: #666666;
    margin-top: 5px;
}

.login-link a {
    color: #2196F3;
    text-decoration: none;
    font-weight: 500;
    transition: color 0.3s ease;
}

.login-link a:hover {
    color: #1976D2;
    text-decoration: underline;
}
</style>