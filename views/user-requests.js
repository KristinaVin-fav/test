// user-requests.js
document.addEventListener('DOMContentLoaded', function() {
    const backButton = document.getElementById("back-button");
    const refreshBtn = document.getElementById("refresh-btn");
    const loadingIndicator = document.getElementById("loading-indicator");
    const errorMessage = document.getElementById("error-message");
    const emptyState = document.getElementById("empty-state");
    const filterItems = document.querySelectorAll(".filter-item");
    
    // Инициализация
    loadRequests();
    
    // Обработчики событий
    backButton.addEventListener("click", () => {
        window.location.href = "request.html";
    });
    
    refreshBtn.addEventListener("click", loadRequests);
    
    filterItems.forEach(item => {
        item.addEventListener("click", function(e) {
            e.preventDefault();
            filterItems.forEach(i => i.classList.remove("active"));
            this.classList.add("active");
            filterRequests(this.dataset.filter);
        });
    });
    
    // Загрузка данных
    function loadRequests() {
        showLoading();
        
        fetch('/request/user-requests')
            .then(response => {
                if (!response.ok) throw new Error('Ошибка загрузки данных');
                return response.json();
            })
            .then(requests => {
                if (requests.length === 0) {
                    showEmptyState();
                } else {
                    renderTable(requests);
                    hideEmptyState();
                }
                hideLoading();
            })
            .catch(error => {
                showError(error.message);
                hideLoading();
            });
    }
    
    // Рендер таблицы
    function renderTable(requests) {
        const tableBody = document.getElementById("requests-table-body");
        tableBody.innerHTML = requests.map(request => `
            <tr data-status="${request.status.toLowerCase()}">
                <td data-label="Дата">${formatDate(request.date)}</td>
                <td data-label="Адрес">${request.address}</td>
                <td data-label="Время">${request.time}</td>
                <td data-label="Услуга">${request.uslugi?.name || 'Услуга удалена'}</td>
                <td data-label="Сумма">${formatCurrency(request.amount)}</td>
                <td data-label="Статус"><span class="status-badge ${getStatusClass(request.status)}">${request.status}</span></td>
                <td data-label="Оплата">${getPaymentType(request.paymentType)}</td>
                <td data-label="Пожелания">${request.wish || '-'}</td>
            </tr>
        `).join('');
    }
    
    // Фильтрация заявок
    function filterRequests(status) {
        const rows = document.querySelectorAll("#requests-table-body tr");
        
        rows.forEach(row => {
            if (status === 'all' || row.dataset.status === status.toLowerCase()) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        });
        
        // Проверка на пустой результат фильтрации
        const visibleRows = document.querySelectorAll("#requests-table-body tr:not([style*='display: none'])");
        if (visibleRows.length === 0) {
            showEmptyState("Нет заявок с выбранным статусом");
        } else {
            hideEmptyState();
        }
    }
    
    // Вспомогательные функции
    function formatDate(dateString) {
        const options = { day: 'numeric', month: 'long', year: 'numeric' };
        return new Date(dateString).toLocaleDateString('ru-RU', options);
    }
    
    function formatCurrency(amount) {
        return new Intl.NumberFormat('ru-RU', { 
            style: 'currency', 
            currency: 'RUB',
            minimumFractionDigits: 0
        }).format(amount);
    }
    
    function getStatusClass(status) {
        const statusMap = {
            'новая': 'status-new',
            'в работе': 'status-inwork',
            'выполнено': 'status-done',
            'отменено': 'status-cancelled'
        };
        return statusMap[status.toLowerCase()] || '';
    }
    
    function getPaymentType(type) {
        return type === 'cash' ? 
            '<i class="fas fa-money-bill-wave mr-1"></i>Наличные' : 
            '<i class="fas fa-credit-card mr-1"></i>Карта';
    }
    
    function showLoading() {
        loadingIndicator.classList.remove("d-none");
        errorMessage.classList.add("d-none");
    }
    
    function hideLoading() {
        loadingIndicator.classList.add("d-none");
    }
    
    function showError(message) {
        document.getElementById("error-text").textContent = message;
        errorMessage.classList.remove("d-none");
    }
    
    function showEmptyState(message) {
        if (message) {
            emptyState.querySelector("h4").textContent = message;
        }
        emptyState.classList.remove("d-none");
        document.querySelector(".table-responsive").classList.add("d-none");
    }
    
    function hideEmptyState() {
        emptyState.classList.add("d-none");
        document.querySelector(".table-responsive").classList.remove("d-none");
    }
});