<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import useUsers from '../composables/useUsers';

const router = useRouter();
const { gameList, delGame, delUser, userList } = useUsers();
const showUsersModal = ref(false);

const openUsersModal = () => {
    showUsersModal.value = true;
};

const closeUsersModal = () => {
    showUsersModal.value = false;
};
</script>

<template>
    <div class="admin-panel">
        <div class="admin-panel-buttons">
            <button class="add-button" @click="router.push({name: 'add'})">✚ Добавить игру</button>
            <button class="users-button" @click="openUsersModal">👥 Список пользователей ({{ userList.length }})</button>
        </div>
    </div>
    
    <div class="products-wrapper">
        <div class="product-card" v-for="value in gameList" :key="value.id">
            <div class="product-image-wrapper">
                <img class="product-thumbnail" :src="value.img" :alt="value.name">
                <span class="product-id">ID: {{ value.id }}</span>
            </div>
            <div class="product-info">
                <div class="product-detail-name">{{ value.name }}</div>
                <div class="product-detail-price">{{ value.digit }} ₽</div>
            </div>
            <div class="product-actions">
                <button class="view-button" @click="router.push({ name: 'tovar-show', params: { id: value.id } })">👁 Просмотр</button>
                <button class="edit-button" @click="router.push({ name: 'tovar-edit', params: { id: value.id } })">🖍 Изменить</button>
                <button class="delete-button" @click="delGame(value.id)">✖ Удалить</button>
            </div>
        </div>
    </div>
    
    <div v-if="gameList.length < 1" class="nettovarov">
        <p>Нет доступных игр</p>
        <button class="add-first-game" @click="router.push({name: 'add'})">Добавить первую игру</button>
    </div>

    <!-- Модальное окно для списка пользователей -->
    <div v-if="showUsersModal" class="modal-overlay" @click="closeUsersModal">
        <div class="modal-content" @click.stop>
            <div class="modal-header">
                <h2>Список пользователей</h2>
                <button class="modal-close" @click="closeUsersModal">✖</button>
            </div>
            <div class="modal-body">
                <div v-if="userList.length > 0" class="users-list">
                    <div class="user-card" v-for="value in userList" :key="value.id">
                        <div class="user-info">
                            <div class="user-id">ID: {{ value.id }}</div>
                            <div class="user-login">{{ value.login }}</div>
                            <div class="user-mail">{{ value.mail }}</div>
                        </div>
                        <div class="user-actions">
                            <button 
                                class="delete-user-button" 
                                :disabled="value.role === 1"
                                @click="delUser(value.id)">
                                ✖ Удалить
                            </button>
                            <div v-if="value.role === 1" class="protected-badge">
                                Админ
                            </div>
                        </div>
                    </div>
                </div>
                <div v-else class="no-users">
                    <p>Нет зарегистрированных пользователей</p>
                </div>
            </div>
            <div class="modal-footer">
                <button class="close-modal-btn" @click="closeUsersModal">Закрыть</button>
            </div>
        </div>
    </div>
</template>

<style scoped>
.admin-panel {
    padding: 20px;
    margin-bottom: 20px;
    background: #ffffff;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.admin-panel-buttons {
    display: flex;
    gap: 15px;
    flex-wrap: wrap;
}

.add-button {
    padding: 12px 24px;
    background: #2196F3;
    color: white;
    border: none;
    border-radius: 6px;
    font-size: 16px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 2px 4px rgba(33, 150, 243, 0.2);
}

.add-button:hover {
    background: #1976D2;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(33, 150, 243, 0.3);
}

.users-button {
    padding: 12px 24px;
    background: #2b89d6;
    color: white;
    border: none;
    border-radius: 6px;
    font-size: 16px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 2px 4px rgba(156, 39, 176, 0.2);
}

.users-button:hover {
    background: #7B1FA2;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(156, 39, 176, 0.3);
}

.products-wrapper {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 25px;
    padding: 20px 0;
}

.product-card {
    background: #f5f5f5;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    transition: all 0.3s ease;
    display: flex;
    flex-direction: column;
}

.product-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
}

.product-image-wrapper {
    position: relative;
    width: 100%;
    height: 200px;
    overflow: hidden;
}

.product-thumbnail {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
}

.product-card:hover .product-thumbnail {
    transform: scale(1.05);
}

.product-id {
    position: absolute;
    top: 10px;
    left: 10px;
    background: rgba(33, 150, 243, 0.9);
    color: white;
    padding: 4px 10px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 500;
}

.product-info {
    padding: 15px;
    flex: 1;
}

.product-detail-name {
    font-size: 18px;
    font-weight: 600;
    color: #333333;
    margin-bottom: 8px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.product-detail-price {
    font-size: 20px;
    font-weight: bold;
    color: #2196F3;
}

.product-actions {
    padding: 15px;
    display: flex;
    flex-direction: column;
    gap: 8px;
    border-top: 1px solid #e0e0e0;
}

.view-button,
.edit-button,
.delete-button {
    padding: 10px 15px;
    border: none;
    border-radius: 6px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;
    width: 100%;
}

.view-button {
    background: #2196F3;
    color: white;
}

.view-button:hover {
    background: #1976D2;
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(33, 150, 243, 0.3);
}

.edit-button {
    background: #FF9800;
    color: white;
}

.edit-button:hover {
    background: #F57C00;
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(255, 152, 0, 0.3);
}

.delete-button {
    background: #f5f5f5;
    color: #666666;
    border: 1px solid #e0e0e0;
}

.delete-button:hover {
    background: #ffebee;
    color: #f44336;
    border-color: #f44336;
    transform: translateY(-1px);
}

.nettovarov {
    text-align: center;
    padding: 60px 20px;
    background: #f5f5f5;
    border-radius: 12px;
    margin: 20px 0;
}

.nettovarov p {
    font-size: 18px;
    color: #666666;
    margin-bottom: 20px;
}

.add-first-game {
    padding: 12px 24px;
    background: #2196F3;
    color: white;
    border: none;
    border-radius: 6px;
    font-size: 16px;
    cursor: pointer;
    transition: all 0.3s ease;
}

.add-first-game:hover {
    background: #1976D2;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(33, 150, 243, 0.3);
}


.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.7);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
    animation: fadeIn 0.3s ease;
}

.modal-content {
    background: white;
    border-radius: 12px;
    width: 90%;
    max-width: 600px;
    max-height: 80vh;
    display: flex;
    flex-direction: column;
    animation: slideIn 0.3s ease;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}


.modal-header {
    padding: 20px 25px;
    border-bottom: 2px solid #f0f0f0;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.modal-header h2 {
    margin: 0;
    font-size: 24px;
    color: #333;
}

.modal-close {
    background: none;
    border: none;
    font-size: 32px;
    cursor: pointer;
    color: #999;
    transition: all 0.3s ease;
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
}

.modal-close:hover {
    background: #f5f5f5;
    color: #333;
}

.modal-body {
    padding: 20px 25px;
    overflow-y: auto;
    flex: 1;
}

.users-list {
    display: flex;
    flex-direction: column;
    gap: 15px;
}

.user-card {
    background: #f8f9fa;
    border-radius: 8px;
    padding: 15px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    transition: all 0.3s ease;
    border: 1px solid #e9ecef;
}

.user-card:hover {
    background: #f1f3f5;
    transform: translateX(4px);
}

.user-info {
    flex: 1;
}

.user-id {
    font-size: 12px;
    color: #6c757d;
    margin-bottom: 4px;
}

.user-login {
    font-size: 18px;
    font-weight: 600;
    color: #333;
    margin-bottom: 4px;
}

.user-mail {
    font-size: 14px;
    color: #6c757d;
}

.user-actions {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 5px;
}

.delete-user-button {
    padding: 8px 16px;
    background: #dc3545;
    color: white;
    border: none;
    border-radius: 6px;
    font-size: 14px;
    cursor: pointer;
    transition: all 0.3s ease;
}

.delete-user-button:hover:not(:disabled) {
    background: #c82333;
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(220, 53, 69, 0.3);
}

.delete-user-button:disabled {
    background: #cccccc;
    cursor: not-allowed;
    opacity: 0.6;
}

.protected-badge {
    font-size: 12px;
    color: #ff9800;
    background: #fff3e0;
    padding: 4px 8px;
    border-radius: 12px;
    display: inline-block;
}

.no-users {
    text-align: center;
    padding: 40px;
    color: #999;
}

.modal-footer {
    padding: 15px 25px;
    border-top: 1px solid #f0f0f0;
    display: flex;
    justify-content: flex-end;
}

.close-modal-btn {
    padding: 10px 20px;
    background: #6c757d;
    color: white;
    border: none;
    border-radius: 6px;
    font-size: 14px;
    cursor: pointer;
    transition: all 0.3s ease;
}

.close-modal-btn:hover {
    background: #5a6268;
    transform: translateY(-1px);
}
</style>