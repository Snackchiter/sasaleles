<script setup>
import { reactive, ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import useUsers from '../composables/useUsers';

const emit = defineEmits(['cancel', 'save']);
const route = useRoute();
const { findUser, editUser, currentUser } = useUsers();

const formData = reactive({
    id: null,
    login: '',
    email: '',
    phone: '',
    country: '',
    newPassword: '',
    confirmPassword: ''
});

const originalUserData = ref(null);

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const loginError = ref('');
const emailError = ref('');
const phoneError = ref('');
const passwordError = ref('');
const error = ref('');
const success = ref('');
const isLoading = ref(false);

onMounted(() => {
    if (currentUser.value) {
        const userId = currentUser.value.id;
        const user = findUser(userId);
        if (user) {
            originalUserData.value = { ...user };
            formData.id = user.id;
            formData.login = user.login || '';
            formData.email = user.email || '';
            formData.phone = user.phone || '';
            formData.country = user.country || '';
        }
    }
});

function validateFields() {
    loginError.value = '';
    emailError.value = '';
    phoneError.value = '';
    passwordError.value = '';

    let isValid = true;
    
    if (formData.login && formData.login !== originalUserData.value?.login) {
        if (formData.login.trim() === '') {
            loginError.value = 'Логин не может быть пустым';
            isValid = false;
        }
    }

    if (formData.email && formData.email !== originalUserData.value?.email) {
        if (formData.email.trim() === '') {
            emailError.value = 'Email не может быть пустым';
            isValid = false;
        } else if (!emailRegex.test(formData.email)) {
            emailError.value = 'Введите корректный email-адрес';
            isValid = false;
        }
    }

    if (formData.phone && !/^[\d\s\+\-\(\)]+$/.test(formData.phone)) {
        phoneError.value = 'Введите корректный номер телефона';
        isValid = false;
    }

    if (formData.newPassword) {
        if (formData.newPassword.length < 6) {
            passwordError.value = 'Пароль должен содержать минимум 6 символов';
            isValid = false;
        } else if (formData.newPassword !== formData.confirmPassword) {
            passwordError.value = 'Пароли не совпадают';
            isValid = false;
        }
    }

    return isValid;
}

function handleSubmit() {
    error.value = '';
    success.value = '';
    
    if (!validateFields()) {
        return;
    }
    
    isLoading.value = true;
    
    try {
        const updatedData = {
            login: formData.login?.trim() || originalUserData.value?.login,
            email: formData.email?.trim() || originalUserData.value?.email,
            phone: formData.phone?.trim() || '',
            country: formData.country?.trim() || ''
        };

        if (formData.newPassword) {
            updatedData.password = formData.newPassword;
        }

        editUser(formData.id, updatedData);
        success.value = 'Профиль успешно обновлен!';
        
        originalUserData.value = { ...originalUserData.value, ...updatedData };
        
        formData.newPassword = '';
        formData.confirmPassword = '';
        
        emit('save', updatedData);
        
        setTimeout(() => {
            emit('cancel');
        }, 1500);
        
    } catch (err) {
        error.value = err.message || 'Ошибка при сохранении профиля';
    } finally {
        isLoading.value = false;
    }
}

function cancelEdit() {
    emit('cancel');
}
</script>

<template>
    <div class="edit-profile-container">
        <div class="edit-header">
            <h2>Редактирование профиля</h2>
            <p class="edit-subtitle">Измените нужные поля и сохраните изменения</p>
        </div>
        
        <div v-if="isLoading" class="loading-overlay">
            <div class="spinner"></div>
        </div>
        
        <form @submit.prevent="handleSubmit" class="edit-form" novalidate>
            <div class="form-group">
                <label class="form-label">
                    <span class="label-icon">👤</span>
                    Логин
                </label>
                <input v-model="formData.login" type="text" :placeholder="originalUserData?.login || 'Введите логин'" :class="{ changed: formData.login !== originalUserData?.login }"/>
                <p v-if="loginError" class="error">{{ loginError }}</p>
                <small v-if="originalUserData?.login" class="hint">Текущий: {{ originalUserData.login }}</small>
            </div>

            <div class="form-group">
                <label class="form-label">
                    <span class="label-icon">📧</span>
                    Email
                </label>
                <input v-model="formData.email" type="email" :placeholder="originalUserData?.email || 'Введите email'" :class="{ changed: formData.email !== originalUserData?.email }"/>
                <p v-if="emailError" class="error">{{ emailError }}</p>
                <small v-if="originalUserData?.email" class="hint">Текущий: {{ originalUserData.email }}</small>
            </div>

            <div class="form-group">
                <label class="form-label">
                    <span class="label-icon">☏</span>
                    Телефон
                </label>
                <input v-model="formData.phone" type="tel" :placeholder="originalUserData?.phone || '+7 (999) 123-45-67'" :class="{ changed: formData.phone !== originalUserData?.phone }"/>
                <p v-if="phoneError" class="error">{{ phoneError }}</p>
                <small v-if="originalUserData?.phone" class="hint">Текущий: {{ originalUserData.phone || 'не указан' }}</small>
            </div>

            <div class="form-group">
                <label class="form-label">
                    <span class="label-icon">🌍</span>
                    Страна
                </label>
                <input v-model="formData.country" type="text" :placeholder="originalUserData?.country || 'Введите страну'" :class="{ changed: formData.country !== originalUserData?.country }"/>
                <small v-if="originalUserData?.country" class="hint">Текущая: {{ originalUserData.country }}</small>
            </div>

            <div class="password-section">
                <h3 class="password-title">
                    <span class="title-icon">🔒︎</span>
                    Смена пароля
                </h3>
                <p class="password-hint">Оставьте поля пустыми, если не хотите менять пароль</p>
                
                <div class="form-group">
                    <label class="form-label">Новый пароль</label>
                    <input v-model="formData.newPassword" type="password" placeholder="Минимум 6 символов"/>
                </div>

                <div class="form-group">
                    <label class="form-label">Подтверждение пароля</label>
                    <input v-model="formData.confirmPassword" type="password" placeholder="Повторите новый пароль" :disabled="!formData.newPassword"/>
                </div>
                <p v-if="passwordError" class="error">{{ passwordError }}</p>
            </div>
            <div class="form-actions">
                <button type="button" @click="cancelEdit" class="cancel-btn">
                    <span class="btn-icon">✖</span>
                    Отмена
                </button>
                <button type="submit" class="save-btn">
                    <span class="btn-icon">🖍</span>
                    {{'Сохранить изменения' }}
                </button>
            </div>
        </form>
    </div>
</template>

<style scoped>
.edit-profile-container {
    max-width: 600px;
    margin: 0 auto;
}

.edit-header {
    text-align: center;
    margin-bottom: 30px;
}

.edit-header h2 {
    font-size: 28px;
    color: #333333;
    margin-bottom: 8px;
    font-weight: 600;
}

.edit-subtitle {
    font-size: 14px;
    color: #666666;
    margin: 0;
}

.edit-form {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.form-group {
    display: flex;
    flex-direction: column;
    gap: 6px;
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

.form-group input.changed {
    border-color: #FF9800;
    background: #fff8e1;
}

.form-group input:disabled {
    background: #f5f5f5;
    color: #999999;
    cursor: not-allowed;
}

.form-group input::placeholder {
    color: #999999;
}

.hint {
    font-size: 13px;
    color: #666666;
    margin-left: 4px;
}

.error {
    color: #f44336;
    font-size: 13px;
    margin: 4px 0 0 4px;
}

.password-section {
    margin-top: 20px;
    padding-top: 20px;
    border-top: 2px solid #e0e0e0;
}

.password-title {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 18px;
    color: #333333;
    margin-bottom: 8px;
}

.title-icon {
    font-size: 20px;
}

.password-hint {
    font-size: 13px;
    color: #666666;
    margin-bottom: 20px;
}

.error-message,
.success-message {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 12px 16px;
    border-radius: 10px;
    font-size: 14px;
}

.error-message {
    background: #ffebee;
    color: #c62828;
    border: 1px solid #ffcdd2;
}

.success-message {
    background: #e8f5e9;
    color: #2e7d32;
    border: 1px solid #c8e6c9;
}

.error-icon,
.success-icon {
    font-size: 18px;
}

.form-actions {
    display: flex;
    gap: 15px;
    margin-top: 20px;
}

.cancel-btn,
.save-btn {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 14px 20px;
    border: none;
    border-radius: 10px;
    font-size: 16px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;
}

.cancel-btn {
    background: #f5f5f5;
    color: #666666;
    border: 1px solid #e0e0e0;
}

.cancel-btn:hover:not(:disabled) {
    background: #eeeeee;
    border-color: #cccccc;
}

.save-btn {
    background: #2196F3;
    color: white;
}

.save-btn:hover:not(:disabled) {
    background: #1976D2;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(33, 150, 243, 0.3);
}

.cancel-btn:disabled,
.save-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.btn-icon {
    font-size: 18px;
}

.loading-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
}

.spinner {
    width: 50px;
    height: 50px;
    border: 4px solid rgba(255, 255, 255, 0.3);
    border-top-color: white;
    border-radius: 50%;
    animation: spin 1s linear infinite;
}

@keyframes spin {
    to { transform: rotate(360deg); }
}

@media (max-width: 500px) {
    .edit-header h2 {
        font-size: 24px;
    }
    
    .form-actions {
        flex-direction: column;
    }
    
    .cancel-btn,
    .save-btn {
        width: 100%;
    }
}
</style>