<script setup>
import useUsers from '../composables/useUsers';
import { useRouter } from 'vue-router';

const router = useRouter();
const { gameList, delGame } = useUsers();
</script>

<template>
    <div class="admin-panel">
        <button class="add-button" @click="router.push({name: 'add'})">✚ Добавить игру</button>
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
</template>

<style scoped>
.admin-panel {
    padding: 20px;
    margin-bottom: 20px;
    background: #ffffff;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
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

.empty-icon {
    font-size: 64px;
    display: block;
    margin-bottom: 20px;
    opacity: 0.5;
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

@media (max-width: 768px) {
    .products-wrapper {
        grid-template-columns: 1fr;
        gap: 15px;
    }
    
    .product-image-wrapper {
        height: 180px;
    }
    
    .product-detail-name {
        font-size: 16px;
    }
    
    .product-detail-price {
        font-size: 18px;
    }
}
</style>