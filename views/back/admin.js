document.addEventListener('DOMContentLoaded', function() {
    fetch('/request/admin/requests') // Исправленный URL
        .then(response => {
            if (!response.ok) throw new Error('Ошибка сети');
            return response.json();
        })
        .then(requests => {
            const tableBody = document.getElementById('admin-requests-table-body');
            tableBody.innerHTML = '';

            requests.forEach(request => {
                const row = `
                    <tr>
                        <td>${request.id}</td>
                        <td>${request.date}</td>
                        <td>${request.adress}</td>
                        <td>${request.time}</td>
                        <td>${request.Usluga?.name || '—'}</td> <!-- Исправлено название -->
                        <td>${Number(request.amount).toFixed(2)} руб.</td> <!-- Проверка типа -->
                        <td>${request.status}</td>
                        <td>${request.paymentType === 'card' ? 'Карта' : 'Наличные'}</td>
                        <td>${request.user_id}</td>
                        <td>
                            <button class="btn btn-danger btn-sm delete-request" data-id="${request.id}">Удалить</button>
                        </td>
                    </tr>
                `;
                tableBody.insertAdjacentHTML('beforeend', row);
            });
        })
        .catch(error => {
            console.error('Ошибка:', error);
            alert('Не удалось загрузить заявки');
        });
});


document.addEventListener('click', function(event) {
    if (event.target.classList.contains('delete-request')) {
        const requestId = event.target.dataset.id;
        fetch(`/request/admin/requests/${requestId}`, { method: 'DELETE' })
            .then(response => response.json())
            .then(data => {
                console.log(data.message);
                location.reload();
            });
    }
});

document.addEventListener('click', function(event) {
    if (event.target.classList.contains('edit-request')) {
        const requestId = event.target.dataset.id;
        fetch(`/request/admin/requests/${requestId}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Заявка не найдена');
                }
                return response.json();
            })
            .then(request => {
                document.getElementById('status').value = request.status;
                document.getElementById('cancelReason').value = request.cancelReason || '';
                document.getElementById('requestId').value = request.id;
                $('#editRequestModal').modal('show');
            })
            .catch(error => {
                console.error(error);
                alert('Произошла ошибка при загрузке заявки');
            });
    }
});

document.getElementById('saveRequestButton').addEventListener('click', function() {
    const requestId = document.getElementById('requestId').value;
    const status = document.getElementById('status').value;
    const cancelReason = document.getElementById('cancelReason').value;
    fetch(`/request/admin/requests/${requestId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status, cancelReason })
    })
    .then(response => response.json())
    .then(data => {
        console.log(data.message);
        $('#editRequestModal').modal('hide');
        location.reload();
    });
});