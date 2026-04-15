<script setup>
import { ref } from 'vue';
import useUsers from '../composables/useUsers';
import LichkabShow from './lichkabshow.vue';
import LichkabEdit from './lichkabedit.vue';

const { currentUser } = useUsers();
const isEditing = ref(false);

function startEdit() {
    isEditing.value = true;
}

function cancelEdit() {
    isEditing.value = false;
}

function saveEdit() {
    isEditing.value = false;
}
</script>

<template>
    <div class="profile-container">
        <div class="profile-header">
            <h1 class="profile-title">Личный кабинет</h1>
            <p class="profile-subtitle">Управляйте своими данными и настройками</p>
        </div>
        
        <div class="profile-content">
            <LichkabShow v-if="!isEditing" :user="currentUser" @edit="startEdit"/>
            <LichkabEdit v-else :user="currentUser" @cancel="cancelEdit" @save="saveEdit"/>
        </div>
    </div>
</template>

<style scoped>
.profile-container {
    max-width: 800px;
    margin: 0 auto;
    padding: 30px 20px;
    background: #ffffff;
}

.profile-header {
    text-align: center;
    margin-bottom: 40px;
}

.profile-title {
    font-size: 36px;
    color: #333333;
    margin-bottom: 10px;
    font-weight: 700;
}

.profile-subtitle {
    font-size: 16px;
    color: #666666;
    margin: 0;
}

.profile-content {
    background: #f5f5f5;
    border-radius: 16px;
    padding: 30px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
}


</style>