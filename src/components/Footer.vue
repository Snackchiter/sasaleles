<template>
    <footer class="footer">
        <div class="footer-content">
            <div class="footer-section">
                <h3 class="footer-title">SnackStore</h3>
                <p class="footer-description">Лучшие игры по доступным ценам</p>
            </div>  
            <div class="footer-section">
                <h4 class="footer-subtitle">Контакты</h4>
                <div class="footer-links">
                    <a href="mailto:support@gamestore.ru" class="footer-link">support@Snackstore.ru</a>
                    <a href="tel:+78001234567" class="footer-link">8 (800) 123-45-67</a>
                </div>
            </div>
            
            <div class="footer-section">
                <h4 class="footer-subtitle">Мы в соцсетях</h4>
                <div class="social-links">
                    <a href="#" class="social-link" title="Telegram"><img src="/public/telegram.png" height="30px" alt=""></a>
                    <a href="#" class="social-link" title="Discord"><img src="/public/discord.png" alt="" height="30px"></a>
                    <a href="#" class="social-link" title="Youtube"><img src="/public/youtube.png" alt="" height="30px"></a>
                </div>
            </div>
        </div>
        
        <div class="footer-bottom">
            <p>&copy; 2026 GameStore. Все права защищены.</p>
        </div>
    </footer>
</template>

<style scoped>
.footer {
    background: #1a1a1a;
    margin-top: auto;
}

.footer-content {
    max-width: 1200px;
    margin: 0 auto;
    padding: 50px 20px 30px;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 40px;
}

.footer-section {
    display: flex;
    flex-direction: column;
    gap: 15px;
}

.footer-title {
    font-size: 24px;
    color: #2196F3;
    margin: 0 0 5px 0;
    font-weight: 600;
}

.footer-description {
    color: #999999;
    font-size: 14px;
    line-height: 1.6;
    margin: 0;
}

.footer-subtitle {
    font-size: 16px;
    color: #ffffff;
    margin: 0 0 5px 0;
    font-weight: 500;
}

.footer-links {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.footer-link {
    color: #999999;
    text-decoration: none;
    font-size: 14px;
    transition: all 0.3s ease;
    display: inline-block;
    width: fit-content;
}

.footer-link:hover {
    color: #2196F3;
    transform: translateX(5px);
}

.social-links {
    display: flex;
    gap: 15px;
}

.social-link {
    width: 40px;
    height: 40px;
    background: #333333;
    color: white;
    text-decoration: none;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    font-size: 20px;
    transition: all 0.3s ease;
}

.social-link:hover {
    background: #2196F3;
    transform: translateY(-3px);
    box-shadow: 0 4px 12px rgba(33, 150, 243, 0.3);
}

.footer-bottom {
    border-top: 1px solid #333333;
    padding: 20px;
    text-align: center;
}

.footer-bottom p {
    color: #666666;
    font-size: 13px;
    margin: 0;
}

/* Адаптивность */
@media (max-width: 768px) {
    .footer-content {
        grid-template-columns: 1fr;
        gap: 30px;
        text-align: center;
        padding: 40px 20px 20px;
    }
    
    .footer-links {
        align-items: center;
    }
    
    .footer-link {
        width: auto;
    }
    
    .footer-link:hover {
        transform: translateX(0) translateY(-2px);
    }
    
    .social-links {
        justify-content: center;
    }
}

@media (max-width: 480px) {
    .footer-title {
        font-size: 20px;
    }
    
    .footer-subtitle {
        font-size: 15px;
    }
    
    .social-link {
        width: 35px;
        height: 35px;
        font-size: 18px;
    }
}
</style>