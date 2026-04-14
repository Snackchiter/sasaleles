<script setup>
import useUsers from '../composables/useUsers';
import { useRouter } from 'vue-router';
import { ref, computed } from 'vue';

const router = useRouter();
const { gameList, cart, addToCart, currentUser, getCategories, getCategoryById } = useUsers();

const gamesList = computed(() => gameList.value);

const isInCart = (gameId) => {
    return cart.value.some(item => item.id === gameId);
};

const getQuantity = (gameId) => {
    const item = cart.value.find(item => item.id === gameId);
    return item?.quantity || 0;
};

const searchQuery = ref('');

function addtocart(gameId) {
    if (!currentUser.value) {
        router.push({ name: 'log' });
        return;
    }
    addToCart(gameId);
}

const selectedCategory = ref(null);
const categories = getCategories();

const filteredGames = computed(() => {
    let filtered = gamesList.value;
    if (searchQuery.value.trim()) {
        const query = searchQuery.value.toLowerCase().trim();
        filtered = filtered.filter(game => 
            game.name.toLowerCase().includes(query) ||
            game.description.toLowerCase().includes(query)
        );
    }
    if (selectedCategory.value) {
        filtered = filtered.filter(game => 
            game.categoryId === selectedCategory.value
        );
    }
    return filtered;
});

const getCategoryName = (categoryId) => {
    const category = getCategoryById(categoryId);
    return category ? category.name : 'Без категории';
};

const resetFilters = () => {
    searchQuery.value = '';
    selectedCategory.value = null;
};

const hasActiveFilters = computed(() => {
    return searchQuery.value.trim() || selectedCategory.value;
});

const clearSearch = () => {
    searchQuery.value = '';
};
</script>

<template>
    <div class="catalog-container">
        <h2 class="catalog-title">Каталог игр</h2>
        
        <div class="filters-panel">
            <div class="search-container">
                <div class="search-wrapper">
                    <input type="text" v-model="searchQuery" placeholder="Поиск по названию или описанию..." class="search-input"/>
                    <span v-if="searchQuery" @click="clearSearch" class="clear-search">✖</span>
                    <span class="search-icon">⌕</span>
                </div>
            </div>
            
            <div class="categories-filter">
                <select v-model="selectedCategory" class="category-select">
                    <option :value="null">Все категории</option>
                    <option v-for="category in categories" :key="category.id" :value="category.id">{{ category.name }}</option>
                </select>
            </div>
            
            <button v-if="hasActiveFilters" @click="resetFilters" class="reset-btn">Сбросить фильтры</button>
        </div>
        
        <div class="filter-info">
            <div v-if="hasActiveFilters" class="active-filters">
                <span v-if="searchQuery" class="filter-tag">
                    Поиск: "{{ searchQuery }}"
                    <span @click="searchQuery = ''" class="remove-filter">✖</span>
                </span>
                <span v-if="selectedCategory" class="filter-tag">
                    Категория: {{ getCategoryName(selectedCategory) }}
                    <span @click="selectedCategory = null" class="remove-filter">✖</span>
                </span>
            </div>
            <div class="results-count">
                Найдено: {{ filteredGames.length }} 
                {{ filteredGames.length === 1 ? 'игра' : 
                   filteredGames.length >= 2 && filteredGames.length <= 4 ? 'игры' : 'игр' }}
            </div>
        </div>
        
        <div v-if="filteredGames.length > 0" class="products-wrapper">
            <div class="product-card" v-for="value in filteredGames" :key="value.id">
                <div class="product-image-wrapper">
                    <img class="product-thumbnail" :src="value.img" :alt="value.name">
                    <span class="game-category">{{ getCategoryName(value.categoryId) }}</span>
                </div>
                <div class="product-info">
                    <div class="product-detail-name">{{ value.name }}</div>
                    <div class="product-detail-price">{{ value.digit }} ₽</div>
                </div>
                <div class="product-actions">
                    <button class="view-button" @click="router.push({ name: 'tovar-show', params: { id: value.id } })">Подробнее</button>
                    <button class="add-to-cart-btn" @click="addtocart(value.id)">
                        {{ isInCart(value.id) ? 'В корзине' : '🛒 В корзину' }}
                    </button>
                </div>
                <div v-if="isInCart(value.id)" class="cart-badge">В корзине: {{ getQuantity(value.id) }} шт.</div>
            </div>
        </div>
        
        <div v-else class="no-results">
            <span class="no-results-icon"><img src="/public/homyak.png" alt=""></span>
            <p>По вашему запросу ничего не найдено</p>
            <button @click="resetFilters" class="reset-btn">Сбросить фильтры</button>
        </div>
    </div>
</template>

<style scoped>
.catalog-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 30px 20px;
    background: #ffffff;
}

.catalog-title {
    font-size: 32px;
    color: #333333;
    margin-bottom: 30px;
    font-weight: 600;
}

/* Панель фильтров */
.filters-panel {
    display: flex;
    gap: 15px;
    margin-bottom: 20px;
    flex-wrap: wrap;
    align-items: center;
}

.search-container {
    flex: 2;
    min-width: 250px;
}

.search-wrapper {
    position: relative;
    display: flex;
    align-items: center;
}

.search-input {
    width: 100%;
    padding: 12px 45px 12px 18px;
    border: 2px solid #e0e0e0;
    border-radius: 30px;
    font-size: 15px;
    transition: all 0.3s ease;
    background-color: white;
    color: #333333;
}

.search-input:focus {
    outline: none;
    border-color: #2196F3;
    box-shadow: 0 0 0 3px rgba(33, 150, 243, 0.1);
}

.search-input::placeholder {
    color: #999999;
}

.search-icon {
    position: absolute;
    right: 18px;
    color: #999999;
    font-size: 18px;
    pointer-events: none;
}

.clear-search {
    position: absolute;
    right: 45px;
    color: #999999;
    cursor: pointer;
    font-size: 18px;
    padding: 5px;
    transition: color 0.3s;
    z-index: 1;
    display: flex;
    align-items: center;
    justify-content: center;
}

.clear-search:hover {
    color: #333333;
}

.categories-filter {
    flex: 1;
    min-width: 180px;
}

.category-select {
    width: 100%;
    padding: 12px 18px;
    border: 2px solid #e0e0e0;
    border-radius: 30px;
    font-size: 15px;
    background-color: white;
    color: #333333;
    cursor: pointer;
    transition: all 0.3s ease;
}

.category-select:focus {
    outline: none;
    border-color: #2196F3;
    box-shadow: 0 0 0 3px rgba(33, 150, 243, 0.1);
}

.reset-btn {
    padding: 12px 24px;
    background: #FF9800;
    color: white;
    border: none;
    border-radius: 30px;
    font-size: 15px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;
    white-space: nowrap;
}

.reset-btn:hover {
    background: #F57C00;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(255, 152, 0, 0.3);
}

/* Информация о фильтрах */
.filter-info {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 25px;
    flex-wrap: wrap;
    gap: 15px;
}

.active-filters {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
}

.filter-tag {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 6px 14px;
    background: #e3f2fd;
    border-radius: 30px;
    font-size: 14px;
    color: #1976D2;
}

.remove-filter {
    cursor: pointer;
    font-size: 16px;
    opacity: 0.7;
    transition: opacity 0.3s;
}

.remove-filter:hover {
    opacity: 1;
}

.results-count {
    color: #666666;
    font-size: 14px;
}

/* Сетка товаров */
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
    position: relative;
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

.product-info {
    padding: 18px 15px 10px;
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
    font-size: 22px;
    font-weight: bold;
    color: #2196F3;
}

.product-actions {
    padding: 10px 15px 15px;
    display: flex;
    gap: 10px;
}

.view-button {
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

.view-button:hover {
    background: #2196F3;
    color: white;
}

.add-to-cart-btn {
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

.add-to-cart-btn:hover {
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

/* Нет результатов */
.no-results {
    text-align: center;
    padding: 80px 20px;
    background: #f5f5f5;
    border-radius: 12px;
}

.no-results-icon {
    font-size: 64px;
    display: block;
    margin-bottom: 20px;
}

.no-results p {
    font-size: 18px;
    color: #666666;
    margin-bottom: 25px;
}

/* Адаптивность */
@media (max-width: 768px) {
    .catalog-container {
        padding: 20px 15px;
    }
    
    .catalog-title {
        font-size: 26px;
    }
    
    .filters-panel {
        flex-direction: column;
        align-items: stretch;
    }
    
    .search-container,
    .categories-filter {
        width: 100%;
    }
    
    .filter-info {
        flex-direction: column;
        align-items: flex-start;
    }
    
    .products-wrapper {
        grid-template-columns: 1fr;
        gap: 15px;
    }
    
    .product-image-wrapper {
        height: 180px;
    }
}
</style>