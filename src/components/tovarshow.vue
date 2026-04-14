<script setup>
import { computed } from 'vue';
import useUsers from '../composables/useUsers';
import { useRoute, useRouter } from 'vue-router';

const router = useRouter();
const games = useUsers();
const route = useRoute();
const gamesList = computed(() => games.gameList.value);
const game = computed(() => games.findGame(Number(route.params.id)));

const getCategoryName = (categoryId) => {
    const category = games.getCategoryById(categoryId);
    return category ? category.name : 'Без категории';
};
const currentGame = computed(() => {
    return gamesList.value.find(game => game.id === parseInt(route.params.id));
});

const isInCart = (gameId) => {
    return games.cart.value.some(item => item.id === gameId);
};

const getQuantity = (gameId) => {
    const item = games.cart.value.find(item => item.id === gameId);
    return item?.quantity || 0;
};
const goToProduct = (id) => {
    router.push({ name: 'tovar-show', params: { id: id } });
};

function addtocart(gameId) {
    if (!games.currentUser.value) {
        router.push({ name: 'log' });
        return;
    }
    games.addToCart(gameId);
}

const samecategory = computed(() => {
    if (!currentGame.value?.categoryId) return [];
    
    return gamesList.value
        .filter(game => game.categoryId === currentGame.value.categoryId && game.id !== currentGame.value.id)
        .slice(0, 6);
});
</script>

<template>
    <div class="product-page">
        <button class="back-btn" @click="router.push({ name: 'catalog' })">
            <span class="back-icon">←</span>
            Назад в каталог
        </button>
        
        <div class="product-details" v-if="game">
            <div class="product-header">
                <button class="edit-btn" v-if="games.isAdmin()" @click="router.push({ name: 'tovar-edit', params: { id: game.id } })">
                    <span class="edit-icon">🖍</span>
                    Редактировать
                </button>
            </div>
            
            <div class="product-content">
                <div class="product-image-wrapper">
                    <img class="product-image" :src="game.img" :alt="game.name">
                    <span class="product-category">{{ getCategoryName(game.categoryId) }}</span>
                </div>
                
                <div class="product-info">
                    <h1 class="product-name">{{ game.name }}</h1>
                    <div class="product-price">{{ game.digit }} ₽</div>
                    
                    <div class="product-description">
                        <h3 class="description-title">Описание</h3>
                        <p>{{ game.description }}</p>
                    </div>
                    
                    <div class="product-actions">
                        <button class="cart-btn" @click="addtocart(game.id)">
                            <span class="cart-icon">🛒</span>
                            {{'В корзину' }}
                        </button>
                        
                        <div v-if="isInCart(game.id)" class="cart-info">
                            <span class="cart-check">✓</span>
                            В корзине: {{ getQuantity(game.id) }} шт.
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <div v-else class="not-found">
            <span class="not-found-icon"><img src="/public/homyak.png" alt=""></span>
            <h2>Товар не найден</h2>
            <button class="back-catalog-btn" @click="router.push({ name: 'catalog' })">Вернуться в каталог</button>
        </div>

        <!-- Похожие игры -->
        <div v-if="samecategory.length > 0" class="similar-games-section">
            <div class="section-header">
                <h2 class="similar-title">Похожие игры</h2>
                <div class="similar-count">Найдено: {{ samecategory.length }}</div>
            </div>
            
            <div class="similar-games-grid">
                <div v-for="value in samecategory" :key="value.id" class="similar-game-card">
                    <div class="similar-game-image-wrapper">
                        <img :src="value.img" :alt="value.name" class="similar-game-image">
                        <span class="similar-game-category">{{ getCategoryName(value.categoryId) }}</span>
                    </div>
                    <div class="similar-game-info">
                        <h3 class="similar-game-name">{{ value.name }}</h3>
                        <p class="similar-game-price">{{ value.digit }} ₽</p>
                        <button @click="goToProduct(value.id)" class="similar-game-btn">
                            Подробнее
                            <span class="btn-arrow">→</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.product-page {
    max-width: 1100px;
    margin: 0 auto;
    padding: 30px 20px;
}

.back-btn {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 10px 18px;
    background: #f5f5f5;
    color: #333333;
    border: 1px solid #e0e0e0;
    border-radius: 10px;
    font-size: 15px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;
    margin-bottom: 25px;
}

.back-btn:hover {
    background: #eeeeee;
    border-color: #cccccc;
    transform: translateX(-3px);
}

.back-icon {
    font-size: 18px;
}

.product-details {
    background: #f5f5f5;
    border-radius: 20px;
    overflow: hidden;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
    margin-bottom: 50px;
}

.product-header {
    padding: 20px 25px;
    display: flex;
    justify-content: flex-end;
    border-bottom: 1px solid #e0e0e0;
}

.edit-btn {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 20px;
    background: #FF9800;
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 15px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;
}

.edit-btn:hover {
    background: #F57C00;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(255, 152, 0, 0.3);
}

.edit-icon {
    font-size: 16px;
}

.product-content {
    grid-template-columns: 1fr 1fr;
    gap: 40px;
    padding: 30px;
}

.product-image-wrapper {
    position: relative;
    border-radius: 16px;
    overflow: hidden;
}

.product-image {
    width: 100%;
    height: 100%;
    max-height: 450px;
    object-fit: cover;
    border-radius: 16px;
}

.product-category {
    position: absolute;
    top: 15px;
    right: 15px;
    background: #2196F3;
    color: white;
    padding: 6px 14px;
    border-radius: 30px;
    font-size: 14px;
    font-weight: 500;
}

.product-info {
    display: flex;
    flex-direction: column;
}

.product-name {
    font-size: 32px;
    color: #333333;
    margin: 0 0 15px 0;
    font-weight: 700;
}

.product-price {
    font-size: 36px;
    font-weight: bold;
    color: #2196F3;
    margin-bottom: 25px;
}

.product-description {
    margin-bottom: 30px;
}

.description-title {
    font-size: 18px;
    color: #333333;
    margin-bottom: 12px;
    font-weight: 600;
}

.product-description p {
    font-size: 16px;
    color: #666666;
    line-height: 1.7;
    margin: 0;
}

.product-actions {
    margin-top: auto;
}

.cart-btn {
    width: 100%;
    padding: 16px 24px;
    background: #2196F3;
    color: white;
    border: none;
    border-radius: 12px;
    font-size: 18px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
}

.cart-btn:hover:not(:disabled) {
    background: #1976D2;
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(33, 150, 243, 0.3);
}

.cart-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.cart-icon {
    font-size: 22px;
}

.cart-info {
    margin-top: 15px;
    padding: 12px 16px;
    background: #e8f5e9;
    color: #2e7d32;
    border-radius: 10px;
    font-size: 15px;
    font-weight: 500;
    display: flex;
    align-items: center;
    gap: 8px;
}

.cart-check {
    font-size: 18px;
}

.not-found {
    text-align: center;
    padding: 80px 20px;
    background: #f5f5f5;
    border-radius: 20px;
}

.not-found-icon {
    font-size: 80px;
    display: block;
    margin-bottom: 20px;
}

.not-found h2 {
    font-size: 28px;
    color: #333333;
    margin-bottom: 25px;
}

.back-catalog-btn {
    padding: 14px 32px;
    background: #2196F3;
    color: white;
    border: none;
    border-radius: 10px;
    font-size: 16px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;
}

.back-catalog-btn:hover {
    background: #1976D2;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(33, 150, 243, 0.3);
}

/* Похожие игры */
.similar-games-section {
    margin-top: 50px;
    padding-top: 30px;
    border-top: 2px solid #f0f0f0;
}

.section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30px;
    flex-wrap: wrap;
    gap: 15px;
}

.similar-title {
    font-size: 28px;
    color: #333333;
    font-weight: 600;
    margin: 0;
    position: relative;
    padding-left: 15px;
}

.similar-title::before {
    content: '';
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 4px;
    height: 24px;
    background: #2196F3;
    border-radius: 2px;
}

.similar-count {
    color: #666666;
    font-size: 14px;
    background: #f5f5f5;
    padding: 6px 14px;
    border-radius: 20px;
}

.similar-games-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 25px;
}

.similar-game-card {
    background: #f5f5f5;
    border-radius: 12px;
    overflow: hidden;
    transition: all 0.3s ease;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.similar-game-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.similar-game-image-wrapper {
    position: relative;
    width: 100%;
    height: 180px;
    overflow: hidden;
}

.similar-game-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
}

.similar-game-card:hover .similar-game-image {
    transform: scale(1.05);
}

.similar-game-category {
    position: absolute;
    top: 10px;
    right: 10px;
    background: rgba(33, 150, 243, 0.9);
    color: white;
    padding: 4px 10px;
    border-radius: 20px;
    font-size: 11px;
    font-weight: 500;
}

.similar-game-info {
    padding: 15px;
}

.similar-game-name {
    font-size: 16px;
    font-weight: 600;
    color: #333333;
    margin: 0 0 8px 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.similar-game-price {
    font-size: 20px;
    font-weight: bold;
    color: #2196F3;
    margin: 0 0 12px 0;
}

.similar-game-btn {
    width: 100%;
    padding: 10px 15px;
    background: white;
    color: #2196F3;
    border: 2px solid #2196F3;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
}

.similar-game-btn:hover {
    background: #2196F3;
    color: white;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(33, 150, 243, 0.2);
}

.btn-arrow {
    transition: transform 0.3s ease;
}

.similar-game-btn:hover .btn-arrow {
    transform: translateX(3px);
}

@media (max-width: 800px) {
    .product-content {
        grid-template-columns: 1fr;
        gap: 25px;
        padding: 20px;
    }
    
    .product-name {
        font-size: 26px;
    }
    
    .product-price {
        font-size: 30px;
    }
    
    .similar-title {
        font-size: 24px;
    }
    
    .similar-games-grid {
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
        gap: 20px;
    }
}

@media (max-width: 500px) {
    .product-page {
        padding: 20px 15px;
    }
    
    .product-header {
        padding: 15px 20px;
    }
    
    .product-content {
        padding: 20px 15px;
    }
    
    .product-name {
        font-size: 22px;
    }
    
    .product-price {
        font-size: 26px;
    }
    
    .cart-btn {
        padding: 14px 20px;
        font-size: 16px;
    }
    
    .similar-title {
        font-size: 20px;
    }
    
    .similar-games-grid {
        grid-template-columns: 1fr;
    }
    
    .similar-game-image-wrapper {
        height: 200px;
    }
}
</style>