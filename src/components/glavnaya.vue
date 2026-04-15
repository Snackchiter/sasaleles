<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import useUsers from '../composables/useUsers';

const router = useRouter();
const games = useUsers();

const gamesList = computed(() => games.gameList.value);

const topGames = computed(() => {
    return [...gamesList.value].sort((a, b) => b.digit - a.digit).slice(0, 3);
});

const getCategoryName = (categoryId) => {
    const category = games.getCategoryById(categoryId);
    return category ? category.name : 'Без категории';
};

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

const isAuthenticated = computed(() => {
    return games.currentUser.value && games.currentUser.value.login;
});

function addtocart(gameId) {
    if (!games.currentUser.value) {
        router.push({ name: 'log' });
        return;
    }
    games.addToCart(gameId);
}
</script>

<template>
    <div class="app">
        <main class="main section-content">
            <section class="hero">
                <h1>Лучшие игры</h1>
                <button @click="router.push({ name: 'catalog' });" class="btn btn-cta">Начать покупку</button>
            </section>

            <section class="featured-section">
                <div class="section-header">
                    <h2>Популярные товары</h2>
                    <div class="results-count">
                        Топ {{ topGames.length }} игр
                    </div>
                </div>
                
                <div v-if="topGames.length > 0" class="products-wrapper">
                    <div class="product-card" v-for="game in topGames" :key="game.id">
                        <div class="product-image-wrapper">
                            <img class="product-thumbnail" :src="game.img" :alt="game.name">
                            <span class="game-category">{{ getCategoryName(game.categoryId) }}</span>
                            <span class="price-badge">Топ</span>
                        </div>
                        <div class="product-info">
                            <h3 class="product-name">{{ game.name }}</h3>
                            <p class="product-price">{{ game.digit }} ₽</p>
                            <p class="product-description">{{ game.description }}</p>
                        </div>
                        <div class="product-actions">
                            <button class="view-btn" @click="goToProduct(game.id)">Подробнее</button>
                            <button v-if="isAuthenticated" @click="addtocart(game.id)" class="cart-btn">🛒 В корзину</button>
                        </div>
                        <div v-if="isInCart(game.id)" class="cart-badge">В корзине: {{ getQuantity(game.id) }} шт.</div>
                    </div>
                </div>
                
                <div v-else class="nettovarov">
                    <p>Нет доступных игр</p>
                </div>
            </section>

            <section class="featured-section">
                <h2>Специальные предложения</h2>
                <div class="promo-cards">
                    <div class="promo-card">
                        <h3>Скидка до 50%</h3>
                        <p>На все игры в этом месяце! Успейте приобрести.</p>
                        <button @click="router.push({ name: 'catalog' });" class="promo-btn">Смотреть акции</button>
                    </div>
                    <div class="promo-card">
                        <h3>Бонус за первую покупку</h3>
                        <p>Получите 500 бонусов при регистрации и первую покупку.</p>
                        <button @click="router.push({ name: 'reg' });" class="promo-btn">Зарегистрироваться</button>
                    </div>
                </div>
            </section>
        </main>
    </div>
</template>

<style scoped>
.app {
    background: #ffffff;
}

.main {
    max-width: 1200px;
    margin: 0 auto;
    padding: 30px 20px;
}

.hero {
    text-align: center;
    padding: 60px 20px;
    background-image: url(https://media1.tenor.com/m/ZZaiMKvs_BQAAAAC/ultrakill-v1.gif);
    background-repeat: no-repeat;
    background-size: 100%;
    background-position: 10%;
    border-radius: 20px;
    margin-bottom: 50px;
}

.hero h1 {
    font-size: 48px;
    color: #3dbeed;
    margin-bottom: 20px;
    font-weight: 700;
}

.btn-cta {
    padding: 16px 40px;
    background: #2196F3;
    color: white;
    border: none;
    border-radius: 40px;
    font-size: 18px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 4px 12px rgba(33, 150, 243, 0.3);
}

.btn-cta:hover {
    background: #1976D2;
    transform: translateY(-3px);
    box-shadow: 0 8px 20px rgba(33, 150, 243, 0.4);
}


.featured-section {
    margin-bottom: 60px;
}

.featured-section h2 {
    font-size: 32px;
    color: #333333;
    margin-bottom: 25px;
    font-weight: 600;
}

.section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 25px;
    flex-wrap: wrap;
    gap: 20px;
}

.section-header h2 {
    margin-bottom: 0;
}

.results-count {
    color: #666666;
    font-size: 14px;
    background: #f5f5f5;
    padding: 8px 16px;
    border-radius: 20px;
}


.products-wrapper {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 25px;
}

.product-card {
    background: #f5f5f5;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    transition: all 0.3s ease;
    display: flex;
    flex-direction: column;
}

.product-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
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

.game-category {
    position: absolute;
    top: 12px;
    right: 12px;
    background: #2196F3;
    color: white;
    padding: 5px 12px;
    border-radius: 30px;
    font-size: 12px;
    font-weight: 500;
}

.price-badge {
    position: absolute;
    bottom: 12px;
    left: 12px;
    background: linear-gradient(135deg, #FFD700, #FFA500);
    color: #333;
    padding: 5px 12px;
    border-radius: 30px;
    font-size: 12px;
    font-weight: bold;
    box-shadow: 0 2px 8px rgba(0,0,0,0.2);
}

.product-info {
    padding: 18px 15px 10px;
    flex: 1;
}

.product-name {
    font-size: 18px;
    font-weight: 600;
    color: #333333;
    margin: 0 0 8px 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.product-price {
    font-size: 22px;
    font-weight: bold;
    color: #2196F3;
    margin: 0 0 8px 0;
}

.product-description {
    font-size: 14px;
    color: #666666;
    line-height: 1.5;
    margin: 0;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.product-actions {
    padding: 10px 15px 15px;
    display: flex;
    gap: 10px;
}

.view-btn {
    flex: 1;
    padding: 10px;
    background: transparent;
    color: #2196F3;
    border: 2px solid #2196F3;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;
}

.view-btn:hover {
    background: #2196F3;
    color: white;
}

.cart-btn {
    flex: 1;
    padding: 10px;
    background: #2196F3;
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;
}

.cart-btn:hover {
    background: #1976D2;
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(33, 150, 243, 0.3);
}

.cart-badge {
    padding: 8px 15px;
    background: #e8f5e9;
    color: #4CAF50;
    font-size: 13px;
    font-weight: 500;
    text-align: center;
    border-top: 1px solid #c8e6c9;
}

.promo-cards {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 25px;
}

.promo-card {
    background: #f5f5f5;
    border-radius: 12px;
    padding: 30px;
    text-align: center;
    transition: all 0.3s ease;
}

.promo-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
}

.promo-card h3 {
    font-size: 22px;
    color: #333333;
    margin-bottom: 15px;
}

.promo-card p {
    color: #666666;
    margin-bottom: 20px;
    line-height: 1.6;
}

.promo-btn {
    padding: 12px 24px;
    background: #2196F3;
    color: white;
    border: none;
    border-radius: 30px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;
}

.promo-btn:hover {
    background: #1976D2;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(33, 150, 243, 0.3);
}

.nettovarov {
    text-align: center;
    padding: 60px 20px;
    background: #f5f5f5;
    border-radius: 12px;
}

.nettovarov p {
    font-size: 18px;
    color: #666666;
    margin-bottom: 20px;
}
</style>