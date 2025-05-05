// Инициализация слайдера
const swiper = new Swiper('.swiper-container', {
    loop: true,
    pagination: {
        el: '.swiper-pagination',
        clickable: true,
    },
    breakpoints: {
        640: { slidesPerView: 1 },
        768: { slidesPerView: 2 },
        1024: { slidesPerView: 3 }
    }
});

// Игровая логика
let gameState = {
    missedPayments: 0,
    totalDebt: 0,
    basePayment: 0
};

function toggleGameMode() {
    const gameContent = document.getElementById('gameContent');
    gameContent.classList.toggle('hidden');
    if (!gameContent.classList.contains('hidden')) {
        calculateBasePayment();
    }
}

function calculateBasePayment() {
    // Расчет базового платежа из калькулятора
    const amount = parseFloat(document.getElementById('amount').value);
    const term = parseFloat(document.getElementById('term').value);
    gameState.basePayment = (amount / term).toFixed(2);
}

function missPayment() {
    gameState.missedPayments++;
    gameState.totalDebt += gameState.basePayment * 1.5; // Штраф 50%
    
    updateGameDisplay();
    showPenaltyEffect();
}

function updateGameDisplay() {
    document.getElementById('missedPayments').textContent = gameState.missedPayments;
    document.getElementById('totalDebt').textContent = `${gameState.totalDebt.toFixed(2)} ₽`;
}

function showPenaltyEffect() {
    const penaltyEffect = document.getElementById('penaltyEffect');
    penaltyEffect.innerHTML = `
        <i class="bi bi-exclamation-triangle"></i>
        <h4>Штраф! +${(gameState.basePayment * 0.5).toFixed(2)} ₽</h4>
        <p>Ваш долг растет!</p>
    `;
    setTimeout(() => penaltyEffect.innerHTML = '', 2000);
}

// Модальное окно
function showProductDetails(product) {
    const products = {
        mortgage: {
            title: 'Ипотечная программа',
            content: 'Ставка от 8.9%, срок до 30 лет...'
        }
    };
    
    document.getElementById('modalTitle').textContent = products[product].title;
    document.getElementById('modalBody').innerHTML = products[product].content;
    document.getElementById('modalOverlay').classList.remove('hidden');
}

function closeModal() {
    document.getElementById('modalOverlay').classList.add('hidden');
}

// Инициализация
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.calculator-section input').forEach(input => {
        input.addEventListener('input', calculateLoan);
    });
});