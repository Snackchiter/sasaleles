<script setup>
import { computed, ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import useUsers from '../composables/useUsers';

const router = useRouter();
const { getUserOrders} = useUsers();

const orders = ref([]);
const selectedOrder = ref(null);
const showModal = ref(false);


function loadOrders() {
    try {
        orders.value = getUserOrders();
        orders.value.sort((a, b) => new Date(b.date) - new Date(a.date));
    } catch (error) {
    }
}

loadOrders()

function formatDate(dateString) {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    }).format(date);
}


function openOrderDetails(order) {
    selectedOrder.value = order;
    showModal.value = true;
}

function closeModal() {
    showModal.value = false;
    selectedOrder.value = null;
}

function goToCatalog() {
    router.push({ name: 'catalog' });
}
</script>

<template>
    <div class="orders-container">
        <div class="orders-header">
            <button class="back-btn" @click="router.push({ name: 'lichkab-show' })">
                <span class="back-icon">←</span>
                Назад в профиль
            </button>
            <h1 class="orders-title">Мои заказы</h1>
        </div>
        <div v-if="orders.length === 0" class="empty-state">
            <div class="empty-icon">📦</div>
            <h2>У вас пока нет заказов</h2>
            <p>Перейдите в каталог, чтобы выбрать игры</p>
            <button @click="goToCatalog" class="catalog-btn">Перейти в каталог</button>
        </div>
        
        <div v-else class="orders-list">
            <div class="orders-stats">
                <span class="stats-text">Всего заказов: {{ orders.length }}</span>
            </div>
            
            <div class="order-card" v-for="order in orders" :key="order.id">
                <div class="order-header">
                    <div class="order-info">
                        <span class="order-id">Заказ #{{ order.id }}</span>
                        <span class="order-date">{{ formatDate(order.date) }}</span>
                    </div>
                    <div class="order-status" >
                        {{ 'Выполнен' }}
                    </div>
                </div>
                
                <div class="order-body">
                    <div class="order-items-preview">
                        <div class="preview-images">
                            <img v-for="item in order.items.slice(0, 3)" :key="item.id":src="item.img" :alt="item.name" class="preview-image"/>
                            <span v-if="order.items.length > 3" class="more-items"> +{{ order.items.length - 3 }}</span>
                        </div>
                        <div class="preview-names">{{ order.items.slice(0, 2).map(i => i.name).join(', ') }}
                            <span v-if="order.items.length > 2">и ещё {{ order.items.length - 2 }}</span>
                        </div>
                    </div>
                    
                    <div class="order-summary">
                        <div class="order-total">
                            <span class="total-label">Сумма:</span>
                            <span class="total-value">{{ order.total }} ₽</span>
                        </div>
                        <div class="order-count">
                            <span class="count-label">Товаров:</span>
                            <span class="count-value">{{ order.items.length }} шт.</span>
                        </div>
                    </div>
                </div>
                
                <div class="order-footer">
                    <button @click="openOrderDetails(order)" class="details-btn">
                        Подробнее о заказе
                    </button>
                </div>
            </div>
        </div>
        <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
            <div class="modal-content">
                <div class="modal-header">
                    <h2>Заказ #{{ selectedOrder?.id }}</h2>
                    <button class="modal-close" @click="closeModal">✕</button>
                </div>
                
                <div class="modal-body">
                    <div class="order-meta">
                        <div class="meta-item">
                            <span class="meta-label">Дата заказа:</span>
                            <span class="meta-value">{{ formatDate(selectedOrder?.date) }}</span>
                        </div>
                        <div class="meta-item">
                            <span class="meta-label">Статус:</span>
                            <span class="meta-value status-badge">
                                {{ 'Выполнен'}}
                            </span>
                        </div>
                    </div>
                    
                    <div class="order-items-full">
                        <h3>Товары в заказе</h3>
                        <div class="items-list">
                            <div class="order-item" v-for="item in selectedOrder?.items" :key="item.id">
                                <img :src="item.img" :alt="item.name" class="item-image">
                                <div class="item-details">
                                    <span class="item-name">{{ item.name }}</span>
                                    <span class="item-price">{{ item.digit }} ₽</span>
                                </div>
                                <div class="item-quantity">
                                    <span class="quantity-badge">{{ item.quantity }} шт.</span>
                                </div>
                                <div class="item-total">
                                    {{ Number(item.digit) * item.quantity }} ₽
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="order-total-full">
                        <span class="total-label">Итого:</span>
                        <span class="total-value">{{ selectedOrder?.total }} ₽</span>
                    </div>
                </div>
                
                <div class="modal-footer">
                    <button @click="closeModal" class="close-btn">Закрыть</button>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.orders-container {
    max-width: 900px;
    margin: 0 auto;
    padding: 30px 20px;
}

.orders-header {
    display: flex;
    align-items: center;
    gap: 20px;
    margin-bottom: 30px;
    flex-wrap: wrap;
}

.back-btn {
    display: flex;
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
}

.back-btn:hover {
    background: #eeeeee;
    border-color: #cccccc;
    transform: translateX(-3px);
}

.back-icon {
    font-size: 18px;
}

.orders-title {
    font-size: 32px;
    color: #333333;
    margin: 0;
    font-weight: 600;
}


.catalog-btn {
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

.catalog-btn:hover {
    background: #1976D2;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(33, 150, 243, 0.3);
}

.orders-stats {
    margin-bottom: 20px;
}

.stats-text {
    font-size: 15px;
    color: #666666;
}

.orders-list {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.order-card {
    background: #f5f5f5;
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    transition: all 0.3s ease;
}

.order-card:hover {
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

.order-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 18px 22px;
    border-bottom: 1px solid #e0e0e0;
}

.order-info {
    display: flex;
    flex-direction: column;
    gap: 5px;
}

.order-id {
    font-size: 18px;
    font-weight: 600;
    color: #333333;
}

.order-date {
    font-size: 14px;
    color: #666666;
}

.order-status {
    padding: 6px 14px;
    border-radius: 30px;
    font-size: 14px;
    font-weight: 500;
}

.status-pending {
    background: #fff3e0;
    color: #f57c00;
}

.status-processing {
    background: #e3f2fd;
    color: #1976D2;
}

.status-completed {
    background: #e8f5e9;
    color: #2e7d32;
}

.status-cancelled {
    background: #ffebee;
    color: #c62828;
}

.order-body {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 18px 22px;
    flex-wrap: wrap;
    gap: 20px;
}

.order-items-preview {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.preview-images {
    display: flex;
    align-items: center;
}

.preview-image {
    width: 50px;
    height: 50px;
    object-fit: cover;
    border-radius: 8px;
    border: 2px solid white;
    margin-left: -8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.preview-image:first-child {
    margin-left: 0;
}

.more-items {
    width: 50px;
    height: 50px;
    background: #2196F3;
    color: white;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    font-weight: 600;
    margin-left: -8px;
    border: 2px solid white;
}

.preview-names {
    font-size: 14px;
    color: #666666;
}

.order-summary {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 8px;
}

.order-total {
    display: flex;
    align-items: center;
    gap: 15px;
}

.total-label {
    font-size: 14px;
    color: #666666;
}

.total-value {
    font-size: 24px;
    font-weight: bold;
    color: #2196F3;
}

.order-count {
    font-size: 14px;
    color: #666666;
}

.order-footer {
    padding: 18px 22px;
    border-top: 1px solid #e0e0e0;
}

.details-btn {
    padding: 10px 20px;
    background: transparent;
    color: #2196F3;
    border: 2px solid #2196F3;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;
}

.details-btn:hover {
    background: #2196F3;
    color: white;
}

.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
}

.modal-content {
    background: white;
    border-radius: 20px;
    max-width: 700px;
    width: 100%;
    max-height: 90vh;
    overflow: hidden;
    display: flex;
    flex-direction: column;
}

.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 25px;
    border-bottom: 1px solid #e0e0e0;
}

.modal-header h2 {
    margin: 0;
    font-size: 22px;
    color: #333333;
}

.modal-close {
    width: 35px;
    height: 35px;
    border: none;
    background: #f5f5f5;
    color: #666666;
    border-radius: 50%;
    font-size: 20px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
}

.modal-close:hover {
    background: #f44336;
    color: white;
}

.modal-body {
    padding: 25px;
    overflow-y: auto;
}

.order-meta {
    display: flex;
    gap: 30px;
    margin-bottom: 25px;
    padding-bottom: 20px;
    border-bottom: 1px solid #e0e0e0;
}

.meta-item {
    display: flex;
    flex-direction: column;
    gap: 5px;
}

.meta-label {
    font-size: 13px;
    color: #666666;
}

.meta-value {
    font-size: 16px;
    font-weight: 500;
    color: #333333;
}

.status-badge {
    display: inline-block;
    padding: 4px 12px;
    border-radius: 30px;
    font-size: 14px;
}

.order-items-full h3 {
    font-size: 18px;
    color: #333333;
    margin-bottom: 15px;
}

.items-list {
    display: flex;
    flex-direction: column;
    gap: 15px;
    margin-bottom: 25px;
}

.order-item {
    display: flex;
    align-items: center;
    gap: 15px;
    padding: 12px;
    background: #f5f5f5;
    border-radius: 12px;
}

.item-image {
    width: 60px;
    height: 60px;
    object-fit: cover;
    border-radius: 8px;
}

.item-details {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 5px;
}

.item-name {
    font-weight: 500;
    color: #333333;
}

.item-price {
    font-size: 14px;
    color: #666666;
}

.item-quantity {
    margin-right: 15px;
}

.quantity-badge {
    padding: 4px 12px;
    background: #e0e0e0;
    border-radius: 30px;
    font-size: 14px;
    color: #333333;
}

.item-total {
    font-size: 18px;
    font-weight: bold;
    color: #2196F3;
    min-width: 90px;
    text-align: right;
}

.order-total-full {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 0 0;
    border-top: 2px solid #e0e0e0;
}

.order-total-full .total-label {
    font-size: 18px;
    color: #333333;
}

.order-total-full .total-value {
    font-size: 28px;
    font-weight: bold;
    color: #2196F3;
}

.modal-footer {
    padding: 20px 25px;
    border-top: 1px solid #e0e0e0;
    display: flex;
    justify-content: flex-end;
}

.close-btn {
    padding: 12px 30px;
    background: #2196F3;
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 16px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;
}

.close-btn:hover {
    background: #1976D2;
}
</style>