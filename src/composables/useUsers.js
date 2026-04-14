import { ref, watch } from "vue";
const categoriesList = [
    { id: 1, name: 'Экшен' },
    { id: 2, name: 'РПГ' },
    { id: 3, name: 'Стратегия' },
    { id: 4, name: 'Симулятор' },
    { id: 5, name: 'Приключения' },
    { id: 6, name: 'Головоломка' },
    { id: 7, name: 'Спорт' },
    { id: 8, name: 'Гонки' }
];
function getCategoryById(categoryId) {
    return categoriesList.find(category => category.id === categoryId);
}
function getCategories() {
    return categoriesList;
}
function loadUsersFromLocalStorage() {
    const savedUsers = localStorage.getItem('users');
    if (savedUsers) {
        return JSON.parse(savedUsers);
    }
    return [];
}

function loadGamesFromLocalStorage() {
    const savedGames = localStorage.getItem('games');
    if (savedGames) {
        return JSON.parse(savedGames);
    }
    return [
        { id: 1, img: 'https://avatars.mds.yandex.net/i?id=ad0f1ccc9336824a735e4bdc50f55a47_l-3560695-images-thumbs&n=13', name: 'Witcher', digit: '2000', description: 'Крутотень', categoryId: 2 },
        { id: 2, img: 'https://avatars.mds.yandex.net/i?id=39c202641ac04f3ea7f28018e3a91ae9662c96af-12422060-images-thumbs&n=13', name: 'Танки онлайн', digit: '100', description: 'Чуть меньше Крутотень', categoryId: 1 },
        { id: 3, img: 'https://i.ytimg.com/vi/cF-mQ7fupbw/maxresdefault.jpg', name: 'Шарарам', digit: '0', description: 'Смешарики всегда крутые', categoryId: 3},
        { id: 4, img: 'https://images.stopgame.ru/games/logos/22664/c560x560/dzwhplEb456Nubk8boMibg/mewgenics-square_2.jpg', name: 'Mewgenics', digit: '1100', description: 'Мяумяумяумяумяумяумяумяумяумяумяумяумяумяумяумяумяумяумяумяумяумяумяумяумяумяумяумяумяумяумяумяумяумяумяумяумяумяумяумяумяумяумяумяумяумяумяумяумяумяумяумяумяумяумяумяумяу', categoryId: 4}
    ];
}

function saveUsersToLocalStorage(users) {
    localStorage.setItem('users', JSON.stringify(users));
}

function saveGamesToLocalStorage(games) {
    localStorage.setItem('games', JSON.stringify(games));
}

function loadOrdersFromLocalStorage() {
    const savedOrders = localStorage.getItem('orders');
    if (savedOrders) {
        return JSON.parse(savedOrders);
    }
    return [];
}

function saveOrdersToLocalStorage(orders) {
    localStorage.setItem('orders', JSON.stringify(orders));
}

const userList = ref(loadUsersFromLocalStorage());
const gameList = ref(loadGamesFromLocalStorage());
const currentUser = ref(null);
const cart = ref([]);

function loadCurrentUserFromStorage() {
    const savedCurrentUser = localStorage.getItem('currentUser');
    if (savedCurrentUser) {
        currentUser.value = JSON.parse(savedCurrentUser);
        loadUserCart(currentUser.value.id);
    }
}

function saveCurrentUserToStorage(user) {
    if (user) {
        localStorage.setItem('currentUser', JSON.stringify(user));
    } else {
        localStorage.removeItem('currentUser');
    }
}

watch(
    () => userList.value,
    (newUsers) => {
        try {
            saveUsersToLocalStorage(newUsers);
        } catch (error) {
            console.error('Ошибка сохранения пользователей:', error);
        }
    },
    { deep: true }
);

watch(
    () => gameList.value,
    (newGames) => {
        try {
            saveGamesToLocalStorage(newGames);
        } catch (error) {
            console.error('Ошибка сохранения игр:', error);
        }
    },
    { deep: true }
);

watch(
    () => currentUser.value,
    (newCurrentUser) => {
        try {
            saveCurrentUserToStorage(newCurrentUser);
        } catch (error) {
            console.error('Ошибка сохранения текущего пользователя:', error);
        }
    },
    { deep: true }
);

function getMaxId() {
    const maxId = userList.value.reduce((max, user) => Math.max(max, user.id), 0);
    return maxId + 1;
}

function getMaxGameId() {
    const maxGameId = gameList.value.reduce((max, game) => Math.max(max, game.id), 0);
    return maxGameId + 1;
}

function addUser(newUser) {
    const newId = getMaxId();
    userList.value.push({ 
        ...newUser, 
        id: newId, 
        img: newUser.img || '', 
        cart: [], 
        role: newUser.role !== undefined ? newUser.role : 0 // ← роль по умолчанию 0
    });
}

function addGame(newGame) {
    const newGameId = getMaxGameId();
    gameList.value.push({ ...newGame, id: newGameId, img: newGame.img || '',  categoryId: newGame.categoryId || 1 });
}

function editGame(gameId, newData) {
    const game = gameList.value.find((game) => game.id === gameId);
    if (game) {
        if (newData.name !== undefined) {
            game.name = newData.name;
            game.digit = newData.digit;
            game.description = newData.description;
            game.categoryId = newData.categoryId;
            if (newData.img) game.img = newData.img;
        }
    }
}

function editUser(userId, newData) {
    const user = userList.value.find((user) => user.id === userId);
    if (user) {
        if (newData.login !== undefined) {
            user.login = newData.login;
            user.email = newData.email;
            user.phone = newData.phone;
            user.country = newData.country;
            if (newData.password) user.password = newData.password;
            if (newData.role !== undefined) user.role = newData.role; // ← возможность изменить роль
        }
    }
}

function findUser(userId) {
    return userList.value.find((user) => user.id === userId);
}

function findGame(gameId) {
    return gameList.value.find((game) => game.id === gameId);
}

function delUser(userId) {
    const userIndex = userList.value.findIndex((user) => user.id === userId);
    if (userIndex !== -1) {
        userList.value.splice(userIndex, 1);
    }
}

function delGame(gameId) {
    const gameIndex = gameList.value.findIndex((game) => game.id === gameId);
    if (gameIndex !== -1) {
        gameList.value.splice(gameIndex, 1);
    }
}

function getUserRole() {
    return currentUser.value?.role || 0;
}

function isAdmin() {
    return currentUser.value?.role === 1;
}

function changeUserRole(userId, newRole) {
    if (!isAdmin()) {
        console.error('Недостаточно прав для изменения роли');
        return false;
    }
    
    const user = findUser(userId);
    if (user) {
        user.role = newRole;
        if (currentUser.value && currentUser.value.id === userId) {
            currentUser.value.role = newRole;
        }
        return true;
    }
    return false;
}

const I = ref(Number(localStorage.getItem('role')) || 0);
function changerole() {
    if (currentUser.value) {
        currentUser.value.role = currentUser.value.role === 0 ? 1 : 0;
        const user = findUser(currentUser.value.id);
        if (user) {
            user.role = currentUser.value.role;
        }
    }
    I.value = I.value === 0 ? 1 : 0;
    localStorage.setItem('role', I.value);
    return I;
}

function login(login, password) {
    const user = userList.value.find(u => u.login === login && u.password === password);
    if (user) {
        if (user.role === undefined) {
            user.role = 0;
        }
        currentUser.value = user;
        loadUserCart(user.id);
    }
    return user;
}

function logout() {
    if (currentUser.value) {
        saveUserCart(currentUser.value.id);
    }
    currentUser.value = null;
    cart.value = [];
}

function register(user) {
    if (userList.value.some(u => u.email === user.email)) {
        throw new Error('Пользователь с таким email уже существует');
    }
    
    if (userList.value.some(u => u.login === user.login)) {
        throw new Error('Пользователь с таким логином уже существует');
    }
    
    const newId = getMaxId();
    const newUser = {
        ...user,
        id: newId,
        img: user.img || '',
        cart: [],
        role: 0
    };
    
    currentUser.value = newUser;
    userList.value.push(newUser);
    cart.value = [];
    return newUser;
}
function addToCart(gameId) {
    const gameItem = findGame(Number(gameId));
    if (!gameItem) {
        return;
    }
    const existingItem = cart.value.find(item => item.id === gameItem.id);
    if (existingItem) {
        existingItem.quantity = (existingItem.quantity || 1) + 1;
    } else {
        cart.value.push({
            id: gameItem.id,
            name: gameItem.name,
            img: gameItem.img,
            digit: gameItem.digit,
            description: gameItem.description,
            quantity: 1
        });
    }
    if (currentUser.value) {
        saveUserCart(currentUser.value.id);
    }
}

function removeFromCart(gameId) {
    const index = cart.value.findIndex(item => item.id === gameId);
    if (index !== -1) {
        cart.value.splice(index, 1);
        if (currentUser.value) {
            saveUserCart(currentUser.value.id);
        }
    }
}

function updateQuantity(gameId, newQuantity) {
    const item = cart.value.find(item => item.id === gameId);
    if (!item) {
        return;
    }
    if (newQuantity <= 0) {
        removeFromCart(gameId);
    } else {
        item.quantity = newQuantity;
        if (currentUser.value) {
            saveUserCart(currentUser.value.id);
        }
    }
}

function clearCart() {
    cart.value = [];
    if (currentUser.value) {
        saveUserCart(currentUser.value.id);
    }
}

function getCartTotal() {
    return cart.value.reduce((total, item) => {
        const price = Number(item.digit) || 0;
        const quantity = Number(item.quantity) || 0;
        return total + (price * quantity);
    }, 0);
}

function getCartItemCount() {
    return cart.value.reduce((count, item) => {
        const quantity = Number(item.quantity) || 0;
        return count + quantity;
    }, 0);
}

function saveUserCart(userId) {
    const user = findUser(userId);
    if (user) {
        user.cart = cart.value.map(item => ({
            ...item,
            digit: String(item.digit),
            quantity: Number(item.quantity)
        }));
        const index = userList.value.findIndex(u => u.id === userId);
        if (index !== -1) {
            userList.value[index] = { ...user };
        }
    }
}

function loadUserCart(userId) {
    const user = findUser(userId);
    if (user && user.cart && Array.isArray(user.cart)) {
        const result = [];
        user.cart.forEach(item => {
            result.push({
                ...item,
                digit: String(item.digit || '0'),
                quantity: Number(item.quantity) || 1
            });
        });
        cart.value = result; 
    } else {
        cart.value = [];
    }
}

function checkout() {
    if (!currentUser.value) {
        throw new Error('Необходимо авторизоваться');
    }
    
    if (cart.value.length === 0) {
        throw new Error('Корзина пуста');
    }
    
    const order = {
        id: Date.now(),
        userId: currentUser.value.id,
        items: JSON.parse(JSON.stringify(cart.value)),
        total: getCartTotal(),
        date: new Date().toISOString(),
        status: 'pending'
    };
    
    const orders = loadOrdersFromLocalStorage();
    orders.push(order);
    saveOrdersToLocalStorage(orders);
    clearCart();
    return order;
}

function getUserOrders() {
    if (!currentUser.value) {
        return [];
    }
    const orders = loadOrdersFromLocalStorage();
    return orders.filter(order => order.userId === currentUser.value.id);
}

loadCurrentUserFromStorage();

export default function useUsers() {
    return { 
        getCategories,
        getCategoryById,
        categoriesList,
        userList, 
        gameList,
        addGame,
        editGame,
        findGame,
        delGame,
        addUser, 
        editUser, 
        findUser, 
        delUser, 
        changerole, 
        I,
        currentUser,
        login,
        logout,
        register,
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        getCartItemCount,
        checkout,
        getUserOrders,
        // ✅ Новые функции для работы с ролями
        getUserRole,
        isAdmin,
        changeUserRole
    };
}