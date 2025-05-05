document.addEventListener('DOMContentLoaded', function() {
    fetch('/request/user-requests')
        .then(response => response.json())
        .then(requests => {
            const tableBody = document.getElementById('requests-table-body');
            requests.forEach(request => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${new Date(request.date).toLocaleDateString()}</td>
                    <td>${request.time}</td>
                    <td>${request.uslugi?.name || 'Услуга удалена'}</td>
                    <td>${request.amount} руб.</td> <!-- Новая колонка -->
                    <td>${request.status}</td>
                    <td>${request.paymentType === 'cash' ? 'Наличные' : 'Карта'}</td>
                    <td>${request.wish || '-'}</td>
                `;
                tableBody.appendChild(row);
            });
        });
});