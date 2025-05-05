document.addEventListener('DOMContentLoaded', () => {
    const products = [
        {
            name: "Вклады | Ставка от 24% годовых",
            imageUrl: "https://www.finam.ru/Images/u/newsonline/scheduledNews/202012/80.jpg",
            description: "Выгодные условия для долгосрочных вкладов"
        },
        {
            name: "Кредиты | Ставка от 12% годовых",
            imageUrl: "https://avatars.mds.yandex.net/i?id=055a1f158eeeeab760c65e95dde20f0b7f12a04e-4669930-images-thumbs&n=13",
            description: "Быстрое оформление кредита онлайн"
        }
    ];

    function createProductCard(product) {
        const card = document.createElement('div');
        card.className = 'product-card';
        
        card.innerHTML = `
            <img src="${product.imageUrl}" 
                 alt="${product.name}" 
                 class="product-image"
                 loading="lazy"
                 onerror="this.onerror=null;this.src='fallback.jpg'">
            <h3>${product.name}</h3>
            <p>${product.description}</p>
        `;

        return card;
    }

    function renderProducts() {
        const container = document.getElementById('productContainer');
        if (!container) return;

        container.innerHTML = '';
        products.forEach(product => {
            container.appendChild(createProductCard(product));
        });
    }

    // Инициализация
    renderProducts();
});
// Чат поддержки
const chatToggle = document.querySelector('.chat-toggle');
const chatWindow = document.querySelector('.chat-window');
const closeChat = document.querySelector('.close-chat');
const chatInput = document.querySelector('.chat-input input');
const sendBtn = document.querySelector('.send-btn');
const chatMessages = document.querySelector('.chat-messages');

// Открыть/закрыть чат
chatToggle.addEventListener('click', () => {
    chatWindow.classList.add('active');
});

closeChat.addEventListener('click', () => {
    chatWindow.classList.remove('active');
});

// Отправка сообщения
function addMessage(text, isUser = true) {
    const now = new Date();
    const messageTime = {
        date: now.toLocaleDateString('ru-RU', { month: 'long', day: 'numeric' }),
        time: now.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
    };

    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', isUser ? 'user' : 'support');
    
    const senderInfo = !isUser 
        ? `<div class="message-sender">Специалист технической поддержки</div>` 
        : '';

    messageDiv.innerHTML = `
        <div class="message-header">
            <div class="message-date">${messageTime.date}</div>
            ${senderInfo}
        </div>
        <div class="message-content">
            <div class="message-text">${text}</div>
            <div class="message-time">${messageTime.time}</div>
        </div>
    `;

    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}
// В обработчике открытия чата
chatToggle.addEventListener('click', () => {
    chatWindow.classList.add('active');
    addMessage('Доброго времени суток! Чем мы можем вам помочь?', false);
});
sendBtn.addEventListener('click', () => {
    const message = chatInput.value.trim();
    if (message) {
        addMessage(message, true);
        
        // Имитация ответа поддержки
        setTimeout(() => {
            addMessage('Благодарим за обращение! Наш специалист ответит вам в ближайшее время.', false);
        }, 1000);
        
        chatInput.value = '';
    }
});

// Отправка по Enter
chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendBtn.click();
    }
});
// Прогресс-строка
window.addEventListener('scroll', () => {
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    document.querySelector('.progress-bar').style.width = scrolled + '%';
});
// Cookie-уведомление
function checkCookieConsent() {
    if (!localStorage.getItem('cookiesAccepted')) {
        document.querySelector('.cookie-consent').style.display = 'flex';
    }
}
// Сохранение истории чата
function saveChatHistory() {
    localStorage.setItem('chatHistory', chatMessages.innerHTML);
}

function loadChatHistory() {
    const history = localStorage.getItem('chatHistory');
    if (history) chatMessages.innerHTML = history;
}

// Инициализация
document.addEventListener('DOMContentLoaded', () => {
    loadChatHistory();
    checkCookieConsent();
    initializeCalculator();
});