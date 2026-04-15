<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import useUsers from '../composables/useUsers';

const emit = defineEmits(['edit']);
const router = useRouter();
const { logout, currentUser} = useUsers();

function handleLogout() {
    logout();
    router.push({ name: 'log' });
}
const curruser = computed(()=>{
    return currentUser.value.login
})
const isAuthenticated = computed(() => {
    return currentUser.value && currentUser.value.login;
});
</script>

<template>    
    <div class="profile-info">
        <template v-if="isAuthenticated">
            <div class="profile-header">
                <div class="user-info">
                    <div class="user-avatar">{{ curruser.charAt(0).toUpperCase() }}</div>
                    <div class="user-details">
                        <h2>{{ curruser }}</h2>
                    </div>
                </div>
                <div class="profile-actions">
                    <button @click="emit('edit')" class="edit-btn">
                        <span class="btn-icon">🖍</span>
                        <span>Редактировать</span>
                    </button>
                    <button @click="handleLogout" class="logout-btn">
                        <span class="btn-icon">➜]</span>
                        <span>Выход</span>
                    </button>
                </div>
            </div>

            <div class="user-data">
                <h3 class="section-title">Личные данные</h3>
                <div class="data-grid">
                    <div class="data-item">
                        <span class="data-icon">🧍</span>
                        <div class="data-content">
                            <span class="data-label">Логин</span>
                            <span class="data-value">{{ currentUser.login }}</span>
                        </div>
                    </div>
                    <div class="data-item">
                        <span class="data-icon">✉︎</span>
                        <div class="data-content">
                            <span class="data-label">Email</span>
                            <span class="data-value">{{ currentUser.email }}</span>
                        </div>
                    </div>
                    <div class="data-item">
                        <span class="data-icon">☏</span>
                        <div class="data-content">
                            <span class="data-label">Телефон</span>
                            <span class="data-value">{{ currentUser.phone || 'Не указано' }}</span>
                        </div>
                    </div>
                    <div class="data-item">
                        <span class="data-icon">🌍</span>
                        <div class="data-content">
                            <span class="data-label">Страна</span>
                            <span class="data-value">{{ currentUser.country || 'Не указано' }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </template>
        
        <template v-else>
            <div class="guest-state">
                <div class="guest-avatar">🧍</div>
                <h3>Гость</h3>
                <p>Войдите в аккаунт, чтобы получить доступ ко всем возможностям</p>
                <button @click="router.push('/log')" class="login-btn">
                    <span class="btn-icon">🔒︎</span>
                    <span>Войти</span>
                </button>
            </div>
        </template>
    </div>
</template>

<style scoped>
.profile-info {
    width: 100%;
}

.profile-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 25px;
    margin-bottom: 25px;
    border-bottom: 2px solid #e0e0e0;
}

.user-info {
    display: flex;
    align-items: center;
    gap: 20px;
}

.user-avatar {
    width: 70px;
    height: 70px;
    background: linear-gradient(135deg, #2196F3, #1976D2);
    color: white;
    font-size: 32px;
    font-weight: 600;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    box-shadow: 0 4px 12px rgba(33, 150, 243, 0.3);
}

.user-details h2 {
    font-size: 26px;
    color: #333333;
    margin: 0 0 5px 0;
    font-weight: 600;
}

.user-role {
    display: inline-block;
    padding: 4px 12px;
    background: #e3f2fd;
    color: #1976D2;
    font-size: 13px;
    font-weight: 500;
    border-radius: 20px;
}

.profile-actions {
    display: flex;
    gap: 10px;
}

.edit-btn,
.logout-btn,
.login-btn {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 18px;
    border: none;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;
}

.edit-btn {
    background: #2196F3;
    color: white;
}

.edit-btn:hover {
    background: #1976D2;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(33, 150, 243, 0.3);
}

.logout-btn {
    background: transparent;
    color: #f44336;
    border: 2px solid #f44336;
}

.logout-btn:hover {
    background: #f44336;
    color: white;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(244, 67, 54, 0.3);
}

.btn-icon {
    font-size: 16px;
}

.user-data {
    padding: 10px 0;
}

.section-title {
    font-size: 20px;
    color: #333333;
    margin-bottom: 20px;
    font-weight: 600;
}

.data-grid {
    display: grid;
    gap: 15px;
}

.data-item {
    display: flex;
    align-items: center;
    gap: 15px;
    padding: 15px 20px;
    background: white;
    border-radius: 12px;
    border: 1px solid #e0e0e0;
    transition: all 0.3s ease;
}

.data-item:hover {
    border-color: #2196F3;
    box-shadow: 0 2px 8px rgba(33, 150, 243, 0.1);
}

.data-icon {
    font-size: 24px;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #f5f5f5;
    border-radius: 10px;
}

.data-content {
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.data-label {
    font-size: 13px;
    color: #666666;
}

.data-value {
    font-size: 16px;
    color: #333333;
    font-weight: 500;
}

.data-value.empty {
    color: #999999;
    font-weight: normal;
}
.guest-state {
    text-align: center;
    padding: 40px 20px;
}

.guest-avatar {
    width: 80px;
    height: 80px;
    margin: 0 auto 20px;
    background: #f5f5f5;
    color: #999999;
    font-size: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    border: 2px dashed #cccccc;
}

.guest-state h3 {
    font-size: 24px;
    color: #333333;
    margin-bottom: 10px;
}

.guest-state p {
    color: #666666;
    margin-bottom: 25px;
}

.login-btn {
    margin: 0 auto;
    background: #2196F3;
    color: white;
    padding: 12px 30px;
}

.login-btn:hover {
    background: #1976D2;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(33, 150, 243, 0.3);
}
</style>