document.addEventListener('DOMContentLoaded', () => {
    loadRequests();
});

function loadRequests() {
    fetch('/admin/requests')
        .then(response => response.json())
        .then(requests => {
            const tableBody = document.getElementById('requests-table');
            tableBody.innerHTML = '';
            requests.forEach(request => {
                const row = `
                    <tr>
                        <td>${request.id}</td>
                        <td>${request.name}</td>
                        <td>${request.phone}</td>
                        <td>
                            <button onclick="deleteRequest(${request.id})">Удалить</button>
                            <button onclick="editRequest(${request.id})">Редактировать</button>
                        </td>
                    </tr>
                `;
                tableBody.innerHTML += row;
            });
        });
}

function deleteRequest(requestId) {
    fetch(`/admin/delete/${requestId}`, { method: 'DELETE' })
        .then(() => loadRequests());
}

function editRequest(requestId) {
    // Реализуйте логику редактирования заявки
    alert(`Редактирование заявки ${requestId}`);
}