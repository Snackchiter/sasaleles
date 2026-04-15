<script setup>
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import useUsers from '../composables/useUsers';

const router = useRouter();
const users = useUsers();

const showOrderModal = ref(false);
const lastOrder = ref(null);
const cartItems = computed(() => users.cart.value || []);
const totalAmount = computed(() => users.getCartTotal());
const totalItems = computed(() => users.getCartItemCount());

function decreaseQuantity(item) {
    if (item.quantity > 1) {
        users.updateQuantity(item.id, item.quantity - 1);
    } else {
        users.removeFromCart(item.id);
    }
}

function increaseQuantity(item) {
    users.updateQuantity(item.id, item.quantity + 1);
}

function proceedToCheckout() {
    if (!users.currentUser.value) {
        errorMessage.value = 'Необходимо авторизоваться';
        return;
    }
    if (cartItems.value.length === 0) {
        errorMessage.value = 'Корзина пуста';
        return;
    }
    try {
        const order = users.checkout();
        lastOrder.value = order;
        showOrderModal.value = true;
    } catch (error) {
    }
}

function goToCatalog() {
    router.push('/catalog');
}

function closeModal() {
    showOrderModal.value = false;
    lastOrder.value = null;
}

function continueShopping() {
    closeModal();
    router.push('/catalog');
}

function viewOrders() {
    closeModal();
    router.push('/orders');
}

function clearCart() {
        users.clearCart();
}
</script>

<template>
    <div class="cart-page">
        <div class="cart-container">
            <h1 class="cart-title">Корзина</h1>
            
            <div v-if="cartItems.length === 0" class="empty-state">
                <div class="empty-icon">🛒</div>
                <h2>Корзина пуста</h2>
                <p>Добавьте товары в корзину, чтобы продолжить покупки</p>
                <button @click="viewOrders" class="orders-btn">Мои заказы</button>
                <button @click="goToCatalog" class="catalog-btn">Перейти в каталог</button>
            </div>
            
            <div v-else class="cart-content">
                <div class="cart-items">
                    <div v-for="value in cartItems" :key="value.id" class="cart-item">
                        <div class="item-image-wrapper">
                            <img :src="value.img" :alt="value.name" class="item-image">
                        </div>
                        <div class="item-details">
                            <h3 class="item-name">{{ value.name }}</h3>
                            <div class="item-price">{{ value.digit }} ₽</div>
                        </div>
                        <div class="item-quantity">
                            <button @click="decreaseQuantity(value)" class="quantity-btn">▬</button>
                            <span class="quantity-value">{{ value.quantity }}</span>
                            <button @click="increaseQuantity(value)" class="quantity-btn">✚</button>
                        </div>
                        <div class="item-total">{{ Number(value.digit) * value.quantity }}₽</div>
                        <button @click="removeFromCart(value.id)" class="remove-btn" title="Удалить">✖</button>
                    </div>
                </div>
                
                <div class="cart-summary">
                    <h2 class="summary-title">Итого</h2>
                    <div class="summary-details">
                        <div class="summary-row">
                            <span>Товаров:</span>
                            <span>{{ totalItems }} шт.</span>
                        </div>
                        <div class="summary-row">
                            <span>Сумма:</span>
                            <span>{{ totalAmount }} ₽</span>
                        </div>
                        <div class="summary-divider"></div>
                        <div class="summary-row total">
                            <span>Итого к оплате:</span>
                            <span>{{ totalAmount }} ₽</span>
                        </div>
                    </div>
                    
                    <button @click="proceedToCheckout" class="checkout-btn" :disabled="cartItems.length === 0">Оформить заказ</button>
                    <button @click="clearCart" class="clear-cart-btn">Очистить корзину</button>
                </div>
            </div>
        </div>
        
        <div v-if="showOrderModal" class="modal-overlay" @click.self="closeModal">
            <div class="modal-content">
                <div class="modal-header">
                    <h2>Заказ оформлен! 🎉</h2>
                    <button class="modal-close" @click="closeModal">✖</button>
                </div>
                <div class="modal-body">
                    <p>Ваш заказ <strong>#{{ lastOrder?.id }}</strong> успешно оформлен</p>
                    <p>Сумма заказа: <strong>{{ lastOrder?.total }} ₽</strong></p>
                    <p>Спасибо за покупку!</p>
                </div>
                <div class="modal-footer">
                    <button @click="continueShopping" class="continue-btn">Продолжить покупки</button>
                    <button @click="viewOrders" class="orders-btn">Мои заказы</button>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.cart-page {
    min-height: 100;
    background: #ffffff;
    padding: 30px 20px;
    position: relative;
}

.cart-container {
    size: 80%;
    margin: 0 auto;
}

.cart-title {
    font-size: 32px;
    color: #333333;
    margin-bottom: 30px;
    font-weight: 600;
}

.empty-state {
    text-align: center;
    padding: 80px 20px;
    background: #f5f5f5;
    border-radius: 12px;
}

.empty-icon {
    font-size: 80px;
    margin-bottom: 20px;
    opacity: 0.6;
}

.empty-state h2 {
    font-size: 24px;
    color: #333333;
    margin-bottom: 10px;
}

.empty-state p {
    color: #666666;
    margin-bottom: 30px;
    font-size: 16px;
}

.catalog-btn {
    padding: 14px 32px;
    background: #2196F3;
    color: white;
    border: none;
    border-radius: 8px;
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

.cart-content {
    display: grid;
    grid-template-columns: 1fr 350px;
    gap: 30px;
}

.cart-items {
    display: flex;
    flex-direction: column;
    gap: 15px;
}

.cart-item {
    display: grid;
    grid-template-columns: 100px 1fr 130px 100px 50px;
    align-items: center;
    gap: 15px;
    padding: 15px;
    background: #f5f5f5;
    border-radius: 12px;
    transition: all 0.3s ease;
}

.cart-item:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.item-image-wrapper {
    width: 100px;
    height: 100px;
    border-radius: 8px;
    overflow: hidden;
}

.item-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
}

.cart-item:hover .item-image {
    transform: scale(1.05);
}

.item-details {
    display: flex;
    flex-direction: column;
    gap: 5px;
}

.item-name {
    font-size: 16px;
    font-weight: 600;
    color: #333333;
    margin: 0;
}

.item-price {
    font-size: 14px;
    color: #666666;
}

.item-quantity {
    display: flex;
    align-items: center;
    gap: 8px;
}

.quantity-btn {
    width: 32px;
    height: 32px;
    border: none;
    background: white;
    color: #333333;
    border-radius: 6px;
    font-size: 18px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
}

.quantity-btn:hover {
    background: #2196F3;
    color: white;
}

.quantity-value {
    min-width: 30px;
    text-align: center;
    font-weight: 600;
    color: #333333;
}

.item-total {
    font-size: 18px;
    font-weight: bold;
    color: #2196F3;
    text-align: right;
}

.remove-btn {
    width: 40px;
    height: 40px;
    border: none;
    background: transparent;
    font-size: 20px;
    cursor: pointer;
    transition: all 0.3s ease;
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.remove-btn:hover {
    background: #ffebee;
    color: #f44336;
    transform: scale(1.1);
}

.cart-summary {
    background: #f5f5f5;
    border-radius: 12px;
    padding: 25px;
    height: fit-content;
    position: sticky;
    top: 20px;
}

.summary-title {
    font-size: 22px;
    color: #333333;
    margin-bottom: 20px;
    font-weight: 600;
}

.summary-details {
    margin-bottom: 25px;
}

.summary-row {
    display: flex;
    justify-content: space-between;
    padding: 10px 0;
    color: #666666;
    font-size: 15px;
}

.summary-row.total {
    font-size: 20px;
    font-weight: bold;
    color: #333333;
}

.summary-divider {
    height: 1px;
    background: #e0e0e0;
    margin: 15px 0;
}

.checkout-btn {
    width: 100%;
    padding: 14px;
    background: #2196F3;
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    margin-bottom: 12px;
}

.checkout-btn:hover:not(:disabled) {
    background: #1976D2;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(33, 150, 243, 0.3);
}

.checkout-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.clear-cart-btn {
    width: 100%;
    padding: 12px;
    background: transparent;
    color: #666666;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    font-size: 14px;
    cursor: pointer;
    transition: all 0.3s ease;
}

.clear-cart-btn:hover {
    background: #ffebee;
    color: #f44336;
    border-color: #f44336;
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
    z-index: 1000;
    animation: fadeIn 0.3s ease;
}

.modal-content {
    background: white;
    border-radius: 16px;
    max-width: 450px;
    width: 90%;
    animation: slideUp 0.3s ease;
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
    width: 32px;
    height: 32px;
    border: none;
    background: transparent;
    font-size: 20px;
    cursor: pointer;
    border-radius: 50%;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
}

.modal-close:hover {
    background: #f5f5f5;
    color: #f44336;
}

.modal-body {
    padding: 25px;
    text-align: center;
}

.modal-body p {
    margin: 10px 0;
    color: #666666;
    font-size: 16px;
}

.modal-body strong {
    color: #2196F3;
    font-size: 18px;
}

.modal-footer {
    display: flex;
    gap: 10px;
    padding: 20px 25px;
    border-top: 1px solid #e0e0e0;
}

.continue-btn,
.orders-btn {
    flex: 1;
    padding: 12px;
    border: none;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;
}

.continue-btn {
    background: #2196F3;
    color: white;
}

.continue-btn:hover {
    background: #1976D2;
}

.orders-btn {
    background: #FF9800;
    color: white;
}

.orders-btn:hover {
    background: #F57C00;
}

.error-toast {
    position: fixed;
    bottom: 30px;
    right: 30px;
    background: #f44336;
    color: white;
    padding: 15px 20px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    gap: 15px;
    box-shadow: 0 4px 12px rgba(244, 67, 54, 0.3);
    animation: slideIn 0.3s ease;
    z-index: 1001;
}

.toast-close {
    width: 24px;
    height: 24px;
    border: none;
    background: rgba(255, 255, 255, 0.2);
    color: white;
    border-radius: 50%;
    cursor: pointer;
    font-size: 18px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.3s ease;
}

.toast-close:hover {
    background: rgba(255, 255, 255, 0.3);
}

@keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
}

@keyframes slideUp {
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@keyframes slideIn {
    from {
        opacity: 0;
        transform: translateX(100%);
    }
    to {
        opacity: 1;
        transform: translateX(0);
    }
}
</style>