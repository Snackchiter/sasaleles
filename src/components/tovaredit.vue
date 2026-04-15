<script setup>
import { reactive, computed, ref } from 'vue';
import useUsers from '../composables/useUsers';
import { useRoute, useRouter } from 'vue-router';

const games = useUsers();
const route = useRoute();
const router = useRouter();

const currentGame = computed(() => games.findGame(Number(route.params.id)));
const categories = games.getCategories();

const game = reactive({
    name: '',
    digit: '',
    description: '',
    img: '',
    categoryId: ''
});

if (currentGame.value) {
    game.name = currentGame.value.name;
    game.digit = currentGame.value.digit;
    game.description = currentGame.value.description;
    game.img = currentGame.value.img;
    game.categoryId = currentGame.value.categoryId;
}

const checkimage = computed(() => {
    return game.img !== undefined && game.img !== '';
});

function handleImageUpload(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            game.img = e.target.result;
        };
        reader.readAsDataURL(file);
    }
}

const isFormValid = computed(() => {
    return game.name.trim() !== '' && 
           !isNaN(game.digit) && 
           game.digit !== '' && 
           game.description.trim() !== '' && 
           game.categoryId !== '' &&
           checkimage.value;
});

function edit() {
    games.editGame(Number(route.params.id), {
        name: game.name.trim(),
        digit: game.digit.trim(),
        description: game.description.trim(),
        img: game.img,
        categoryId: game.categoryId
    });
    router.push({ name: 'tovar-show', params: { id: route.params.id } });
}
</script>

<template>
    <div class="edit-game-container">
        <div class="edit-header">
            <button class="back-btn" @click="router.push({ name: 'tovar-show', params: { id: route.params.id } })">
                <span class="back-icon">←</span>
                Назад к товару
            </button>
            <h2 class="edit-title">Редактирование игры</h2>
        </div>
        
        <div class="edit-card">
            <div class="upload-section">
                <label class="upload-label">
                    <span class="upload-icon">🖼️</span>
                    <span>Загрузить изображение</span>
                </label>
                <input class="file-input" type="file" accept="image/jpeg,image/png,image/jpg" @change="handleImageUpload">
                <div v-if="game.img" class="image-preview">
                    <img :src="game.img" alt="Предпросмотр">
                    <button class="remove-image" @click="game.img = ''">✖</button>
                </div>
                <div v-else class="upload-placeholder">
                    <span>🗁 JPEG или PNG</span>
                </div>
            </div>

            <div class="form-section">
                <div class="form-group">
                    <label class="form-label">
                        Название игры
                    </label>
                    <input class="form-input" type="text" v-model="game.name" placeholder="Введите название">
                    <span v-if="!game.name.trim()" class="error-text">Обязательное поле</span>
                </div>
                
                <div class="form-group">
                    <label class="form-label">Цена (₽)</label>
                    <input class="form-input" type="text" v-model="game.digit" placeholder="Введите цену">
                    <span v-if="isNaN(game.digit) && game.digit !== ''" class="error-text">Введите только число</span>
                </div>
                
                <div class="form-group">
                    <label class="form-label">
                        <span class="label-icon">🗁</span>
                        Категория
                    </label>
                    <select v-model="game.categoryId" class="form-select">
                        <option :value="null" disabled>Выберите категорию</option>
                        <option v-for="category in categories" :key="category.id" :value="category.id">
                            {{ category.name }}
                        </option>
                    </select>
                    <span v-if="!game.categoryId" class="error-text">Выберите категорию</span>
                </div>
                
                <div class="form-group">
                    <label class="form-label">
                        <span class="label-icon">🖍</span>
                        Описание
                    </label>
                    <textarea class="form-textarea" v-model="game.description" placeholder="Введите описание" rows="4"></textarea>
                    <span v-if="!game.description.trim()" class="error-text">Обязательное поле</span>
                </div>
            </div>

            <div class="form-actions">
                <button class="cancel-btn" @click="router.push({ name: 'tovar-show', params: { id: route.params.id } })">
                    Отмена
                </button>
                <button class="save-btn" @click="edit()" :disabled="!isFormValid">
                    Сохранить изменения
                </button>
            </div>
        </div>
    </div>
</template>

<style scoped>
.edit-game-container {
    max-width: 700px;
    margin: 0 auto;
    padding: 30px 20px;
}

.edit-header {
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

.edit-title {
    font-size: 28px;
    color: #333333;
    margin: 0;
    font-weight: 600;
}

.edit-card {
    background: #f5f5f5;
    border-radius: 20px;
    padding: 30px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
}

.upload-section {
    background: white;
    border-radius: 12px;
    padding: 20px;
    margin-bottom: 25px;
    text-align: center;
    border: 2px dashed #e0e0e0;
    transition: border-color 0.3s ease;
}

.upload-section:hover {
    border-color: #2196F3;
}

.upload-label {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 12px 24px;
    background: #2196F3;
    color: white;
    border-radius: 8px;
    cursor: pointer;
    font-weight: 500;
    transition: all 0.3s ease;
    margin-bottom: 15px;
}

.upload-label:hover {
    background: #1976D2;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(33, 150, 243, 0.3);
}

.upload-icon {
    font-size: 20px;
}

.file-input {
    display: none;
}

.image-preview {
    position: relative;
    display: inline-block;
    margin-top: 15px;
}

.image-preview img {
    max-width: 250px;
    max-height: 200px;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.remove-image {
    position: absolute;
    top: -10px;
    right: -10px;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    background: #FF9800;
    color: white;
    border: none;
    cursor: pointer;
    font-size: 18px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
}

.remove-image:hover {
    background: #F57C00;
    transform: scale(1.1);
}

.upload-placeholder {
    padding: 30px;
    color: #999999;
    font-size: 14px;
}

.form-section {
    display: flex;
    flex-direction: column;
    gap: 20px;
    margin-bottom: 25px;
}

.form-group {
    display: flex;
    flex-direction: column;
    gap: 8px;
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

.form-input,
.form-select,
.form-textarea {
    padding: 12px 16px;
    border: 2px solid #e0e0e0;
    border-radius: 10px;
    font-size: 15px;
    color: #333333;
    background: white;
    transition: all 0.3s ease;
}

.form-input:focus,
.form-select:focus,
.form-textarea:focus {
    outline: none;
    border-color: #2196F3;
    box-shadow: 0 0 0 3px rgba(33, 150, 243, 0.1);
}

.form-input::placeholder,
.form-textarea::placeholder {
    color: #999999;
}

.form-select {
    cursor: pointer;
}

.form-textarea {
    resize: vertical;
    min-height: 100px;
}

.error-text {
    color: #f44336;
    font-size: 13px;
    margin-left: 4px;
}

.form-actions {
    display: flex;
    gap: 15px;
    padding-top: 10px;
}

.cancel-btn,
.save-btn {
    flex: 1;
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

.cancel-btn:hover {
    background: #eeeeee;
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

.save-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}
</style>