<script setup>
import { useRouter } from 'vue-router';
import { computed } from 'vue';
import useUsers from '../composables/useUsers';

const router = useRouter();
const users = useUsers();

const isAuthenticated = computed(() => {
    return users.currentUser.value && users.currentUser.value.login;
});

const handleLogout = () => {
    users.logout();
    router.push({ name: 'glavnaya' });
};
</script>

<template>
    <header class="header">
        <div class="header-container">
            <div class="logo" @click="router.push({ name: 'glavnaya' })">
                <span class="logo-icon"><img src="/public/drill.png" alt="" height="90px"></span>
                <span class="logo-text">SnackStore</span>
            </div>
            
            <nav class="nav">
                <button class="nav-link" @click="router.push({ name: 'glavnaya' })">Главная</button>
                <button class="nav-link" @click="router.push({ name: 'catalog' })">Каталог</button>
                <button class="nav-link cart-link" @click="router.push({ name: 'cart' })">
                    <span class="cart-icon">🛒</span>
                    <span>Корзина</span>
                    <span v-if="users.getCartItemCount() > 0" class="cart-badge">{{ users.getCartItemCount() }}</span>
                </button>
            </nav>
            
            <div class="user-actions">
                <button v-if="users.isAdmin()" class="admin-btn" @click="router.push({ name: 'admin' })">
                    <span class="admin-icon">⚙️</span>
                    <span>Админ</span>
                </button>
                
                <button class="profile-btn" @click="router.push({ name: 'lichkab-show' })">
                    <span class="profile-icon">🧍</span>
                    <span>Профиль</span>
                </button>
                
                <button v-if="!isAuthenticated" class="login-btn" @click="router.push({ name: 'log' })">
                    <span class="login-icon">🔒︎</span>
                    <span>Вход</span>
                </button>
                
                <button v-else class="logout-btn" @click="handleLogout">
                    <span class="logout-icon">➜]</span>
                    <span>Выход</span>
                </button>
            </div>
        </div>
    </header>
</template>

<style scoped>
.header {
    background: #1a1a1a;
    position: sticky;
    top: 0;
    z-index: 100;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.header-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    min-height: 70px;
}

.logo {
    display: flex;
    align-items: center;
    gap: 12px;
    cursor: pointer;
    transition: opacity 0.3s ease;
}

.logo:hover {
    opacity: 0.8;
}

.logo-icon {
    display: flex;
    align-items: center;
    line-height: 1;
}

.logo-icon img {
    height: 40px;
    width: auto;
    display: block;
}

.logo-text {
    font-size: 24px;
    font-weight: 700;
    color: #2196F3;
    letter-spacing: 0.5px;
}



.nav {
    display: flex;
    gap: 5px;
}

.nav-link {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 10px 16px;
    background: transparent;
    color: #ffffff;
    border: none;
    border-radius: 8px;
    font-size: 15px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;
    white-space: nowrap;
}

.nav-link:hover {
    background: rgba(33, 150, 243, 0.1);
    color: #2196F3;
}

.cart-link {
    position: relative;
}

.cart-icon {
    font-size: 18px;
}

.cart-badge {
    position: absolute;
    top: 2px;
    right: 2px;
    background: #FF9800;
    color: white;
    font-size: 11px;
    font-weight: 600;
    min-width: 18px;
    height: 18px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 9px;
    padding: 0 5px;
}


.user-actions {
    display: flex;
    gap: 8px;
}

.admin-btn,
.profile-btn,
.login-btn,
.logout-btn {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 10px 16px;
    border: none;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;
    white-space: nowrap;
}

.admin-btn {
    background: #FF9800;
    color: white;
}

.admin-btn:hover {
    background: #F57C00;
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(255, 152, 0, 0.3);
}

.admin-icon {
    font-size: 16px;
}

.profile-btn {
    background: transparent;
    color: #ffffff;
    border: 1px solid #444444;
}

.profile-btn:hover {
    background: rgba(255, 255, 255, 0.05);
    border-color: #2196F3;
    color: #2196F3;
}

.profile-icon {
    font-size: 16px;
}

.login-btn {
    background: #2196F3;
    color: white;
}

.login-btn:hover {
    background: #1976D2;
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(33, 150, 243, 0.3);
}

.login-icon {
    font-size: 16px;
}

.logout-btn {
    background: transparent;
    color: #ff5252;
    border: 1px solid #ff5252;
}

.logout-btn:hover {
    background: #ff5252;
    color: white;
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(255, 82, 82, 0.3);
}

.logout-icon {
    font-size: 16px;
}
</style>