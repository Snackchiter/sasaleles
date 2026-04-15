<script setup>
import { reactive, computed } from 'vue';
import useUsers from '../composables/useUsers';
import { useRouter } from 'vue-router';

const router = useRouter()
const games = useUsers()

const game = reactive({
    name: '',
    digit: '',
    description: '',
    categoryId: '',
    img: ''
})

const checkimage = computed(() => {
    return game.img !== undefined && game.img !== ''
})

function handleImageUpload(e) {
    const file = e.target.files[0]
    if (file) {
        const reader = new FileReader()
        reader.onload = (e) => {
            game.img = e.target.result
        }
        reader.readAsDataURL(file)
    }
}

const isFormValid = computed(() => {
    return game.name.trim() !== '' && !isNaN(game.digit) && game.digit !== '' && game.description.trim() !== '' && checkimage.value && game.categoryId !== '';
})

const categories = games.getCategories();

function add() {
    games.addGame({
        img: game.img,
        name: game.name,
        digit: game.digit,
        description: game.description,
        categoryId: game.categoryId
    })
    router.push({name: 'admin'})
}
</script>

<template>
    <div class="add-game-container">
        <h2 class="page-title">Добавление новой игры</h2>
        
        <div class="upload-section">
            <label class="upload-label" for="fileInput">
                <span class="upload-icon">🖼️</span>
                <span>Выберите изображение</span>
            </label>
            <input id="fileInput" class="file-input" type="file" accept="image/jpeg,image/png,image/jpg" @change="handleImageUpload">
            <div v-if="game.img" class="image-preview">
                <img :src="game.img" alt="Предпросмотр">
                <button type="button" class="remove-image" @click="game.img = ''">✖</button>
            </div>
            <div v-else class="upload-placeholder">
                <span>🗁 JPEG или PNG</span>
            </div>
        </div>
        
        <div class="form-section">
            <div class="form-group">
                <label class="form-label">Название игры</label>
                <input class="form-input" type="text" v-model="game.name" placeholder="Введите название">
                <span v-if="!game.name.trim()" class="error-text">Обязательное поле</span>
            </div>
            
            <div class="form-group">
                <label class="form-label">Цена (₽)</label>
                <input class="form-input" type="text" v-model="game.digit" placeholder="Введите цену">
                <span v-if="!game.digit.trim()" class="error-text">Введите цену</span>
                <span v-if="isNaN(game.digit) && game.digit !== ''" class="error-text">Введите только число</span>
            </div>
            
            <div class="form-group">
                <label class="form-label">Категория</label>
                <select v-model="game.categoryId" class="form-select">
                    <option :value="null" disabled>Выберите категорию</option>
                    <option v-for="category in categories" :key="category.id" :value="category.id">{{ category.name }}</option>
                </select>
                <span v-if="!game.categoryId" class="error-text">Выберите категорию</span>
            </div>
            
            <div class="form-group">
                <label class="form-label">Описание</label>
                <textarea class="form-textarea" v-model="game.description" placeholder="Введите описание" rows="4"></textarea>
                <span v-if="!game.description.trim()" class="error-text">Обязательное поле</span>
            </div>
            
            <div class="form-actions">
                <button class="btn-cancel" @click="router.push({name: 'admin'})">Отмена</button>
                <button class="btn-submit" @click="add" :disabled="!isFormValid">Добавить игру</button>
            </div>
        </div>
    </div>
</template>

<style scoped>
.add-game-container {
    max-width: 600px;
    margin: 0 auto;
    padding: 30px 20px;
}

.page-title {
    font-size: 28px;
    color: #333333;
    margin-bottom: 30px;
    text-align: center;
    font-weight: 600;
}

.upload-section {
    background: #f5f5f5;
    border-radius: 8px;
    padding: 20px;
    margin-bottom: 30px;
    text-align: center;
    border: 2px dashed #cccccc;
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
    border-radius: 6px;
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
    max-width: 200px;
    max-height: 200px;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
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
    background: #f5f5f5;
    border-radius: 8px;
    padding: 25px;
}

.form-group {
    margin-bottom: 20px;
}

.form-label {
    display: block;
    margin-bottom: 8px;
    color: #333333;
    font-weight: 500;
    font-size: 14px;
}

.form-input,
.form-select,
.form-textarea {
    width: 100%;
    padding: 12px 15px;
    border: 2px solid #e0e0e0;
    border-radius: 6px;
    font-size: 14px;
    color: #333333;
    background: white;
    transition: all 0.3s ease;
    box-sizing: border-box;
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

.error-text {
    display: block;
    margin-top: 5px;
    color: #FF9800;
    font-size: 12px;
}

.form-actions {
    display: flex;
    gap: 15px;
    margin-top: 30px;
}

.btn-cancel,
.btn-submit {
    flex: 1;
    padding: 12px 24px;
    border: none;
    border-radius: 6px;
    font-size: 16px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;
}

.btn-cancel {
    background: #f5f5f5;
    color: #666666;
    border: 1px solid #e0e0e0;
}

.btn-cancel:hover {
    background: #eeeeee;
}

.btn-submit {
    background: #2196F3;
    color: white;
}

.btn-submit:hover:not(:disabled) {
    background: #1976D2;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(33, 150, 243, 0.3);
}

.btn-submit:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}
</style>