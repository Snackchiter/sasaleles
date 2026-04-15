<script setup>
import { reactive, ref, onMounted } from 'vue';
import useUsers from '../composables/useUsers';

const emit = defineEmits(['cancel', 'save']);
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
    if (!validateFields()) {
        return;
    } 
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
        originalUserData.value = { ...originalUserData.value, ...updatedData };
        
        formData.newPassword = '';
        formData.confirmPassword = '';
        
        emit('save', updatedData);
    } catch (err) {
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
        <form @submit.prevent="handleSubmit" class="edit-form" novalidate>
            <div class="form-group">
                <label class="form-label">
                    <span class="label-icon">👤</span>
                    Логин
                </label>
                <input v-model="formData.login" type="text" :placeholder="originalUserData?.login || 'Введите логин'" />
                <p v-if="loginError" class="error">{{ loginError }}</p>
                <small v-if="originalUserData?.login" class="hint">Текущий: {{ originalUserData.login }}</small>
            </div>

            <div class="form-group">
                <label class="form-label">
                    <span class="label-icon">📧</span>
                    Email
                </label>
                <input v-model="formData.email" type="email" :placeholder="originalUserData?.email || 'Введите email'"/>
                <p v-if="emailError" class="error">{{ emailError }}</p>
                <small v-if="originalUserData?.email" class="hint">Текущий: {{ originalUserData.email }}</small>
            </div>

            <div class="form-group">
                <label class="form-label">
                    <span class="label-icon">☏</span>
                    Телефон
                </label>
                <input v-model="formData.phone" type="tel" :placeholder="originalUserData?.phone || '+7 (999) 123-45-67'" />
                <p v-if="phoneError" class="error">{{ phoneError }}</p>
                <small v-if="originalUserData?.phone" class="hint">Текущий: {{ originalUserData.phone || 'не указан' }}</small>
            </div>

            <div class="form-group">
                <label class="form-label">
                    <span class="label-icon">🌍</span>
                    Страна
                </label>
                <input v-model="formData.country" type="text" :placeholder="originalUserData?.country || 'Введите страну'" />
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


.error-message {
    background: #ffebee;
    color: #c62828;
    border: 1px solid #ffcdd2;
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

</style>