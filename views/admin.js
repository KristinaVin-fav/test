document.addEventListener('DOMContentLoaded', function() {
    let allRequests = []; // Сохраняем все заявки для фильтрации
    
    // Загрузка данных
    function loadRequests() {
        fetch('/request/admin/requests')
            .then(response => {
                if (!response.ok) throw new Error('Ошибка загрузки данных');
                return response.json();
            })
            .then(requests => {
                allRequests = requests;
                renderTable(requests);
            })
            .catch(error => showError(error.message));
    }

    // Рендер таблицы
    function renderTable(requests) {
        const tableBody = document.getElementById('admin-requests-table-body');
        tableBody.innerHTML = requests.map(request => `
            <tr data-id="${request.id}">
                <td>${request.id}</td>
                <td>${request.date}</td>
                <td>${request.address}</td>
                <td>${request.time}</td>
                <td>${request.uslugi?.name || ''}</td>
                <td>${request.amount}</td>
                <td><span class="status-badge ${getStatusClass(request.status)}">${request.status}</span></td>
                <td>${request.paymentType}</td>
                <td>${request.wish || ''}</td>
                <td>${request.user_id || ''}</td>
                <td>
                    <button class="btn btn-danger btn-sm delete-request" data-id="${request.id}">Удалить</button>
                    <button class="btn btn-primary btn-sm edit-request" data-id="${request.id}">Редактировать</button>
                </td>
            </tr>
        `).join('');
    }

    // Обработчики событий
    document.addEventListener('click', async (event) => {
        try {
            if (event.target.classList.contains('delete-request')) {
                await handleDelete(event.target.dataset.id);
            }
            if (event.target.classList.contains('edit-request')) {
                await handleEdit(event.target.dataset.id);
            }
        } catch (error) {
            showError(error.message);
        }
    });

    // Удаление заявки
    async function handleDelete(requestId) {
        if (!confirm('Вы уверены, что хотите удалить заявку?')) return;
        
        const response = await fetch(`/request/admin/requests/${requestId}`, { 
            method: 'DELETE' 
        });
        
        if (!response.ok) throw new Error('Ошибка удаления');
        loadRequests(); // Перезагружаем данные вместо location.reload()
    }

    // Редактирование заявки
    async function handleEdit(requestId) {
        try {
            const response = await fetch(`/request/admin/requests/${requestId}`);
            if (!response.ok) throw new Error('Заявка не найдена');
            
            const request = await response.json();
            fillEditForm(request);
            $('#editRequestModal').modal('show');
        } catch (error) {
            throw new Error(`Ошибка загрузки: ${error.message}`);
        }
    }

    // Заполнение формы редактирования
    function fillEditForm(request) {
        document.getElementById('edit-status').value = request.status;
        document.getElementById('edit-reason').value = request.cancelReason || '';
        document.getElementById('edit-comment').value = request.comment || '';
        document.getElementById('modal-id').textContent = request.id;
    }

  // Сохранение изменений
document.getElementById('save-changes').addEventListener('click', async () => {
    try {
        const requestId = document.getElementById('modal-id').textContent;
        const status = document.getElementById('edit-status').value;
        const cancelReason = document.getElementById('edit-reason').value;
        const comment = document.getElementById('edit-comment').value;

        const response = await fetch(`/request/admin/requests/${requestId}`, {
            method: 'PATCH', // Исправлено с PUT на PATCH
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status, cancelReason, comment })
        });
        
        // Проверка типа контента
        const contentType = response.headers.get('content-type');
        if (!contentType?.includes('application/json')) {
            const text = await response.text();
            throw new Error(`Ожидался JSON, но получен: ${text.slice(0, 100)}...`);
        }
        
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Ошибка сохранения');
        
        $('#editRequestModal').modal('hide');
        loadRequests();
    } catch (error) {
        console.error('Full error:', error);
        showError(error.message);
    }
});

    // Вспомогательные функции
    function getStatusClass(status) {
        const classes = {
            'в работе': 'status-inwork',
            'выполнено': 'status-done',
            'отменено': 'status-cancelled'
        };
        return classes[status.toLowerCase()] || '';
    }

    function showError(message) {
        const alert = document.createElement('div');
        alert.className = 'alert alert-danger alert-dismissible fade show';
        alert.innerHTML = `
            ${message}
            <button type="button" class="close" data-dismiss="alert">
                <span>&times;</span>
            </button>
        `;
        document.querySelector('.admin-container').prepend(alert);
    }

    // Инициализация
    loadRequests();
});