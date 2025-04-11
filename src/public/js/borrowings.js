document.addEventListener('DOMContentLoaded', function () {
    const statuses = ['PENDING', 'BORROWING', 'DONE'];

    statuses.forEach(status => {
        fetchRecordsByStatus(status).then(data => {
            renderHTML(status, data);
        });
    });
});


function fetchRecordsByStatus(status) {
    return fetch(`/api/borrowrecords/status/${encodeURIComponent(status)}`)
        .then(response => {
            if (!response.ok) throw new Error(`HTTP error ${response.status}`);
            return response.json();
        })
        .catch(error => {
            console.error(`Error fetching ${status} records:`, error);
            return [];
        });
}

function renderHTML(status, records) {
    const tbody = document.getElementById(`${status}-records`);
    if (!tbody) return;

    tbody.innerHTML = '';

    records.forEach(record => {
        const totalPrice = record.RecordDetails.reduce((sum, detail) => sum + detail.Price, 0);
        const user = record.User || {};
        const row = document.createElement('tr');

        const actions = getActionsByStatus(status, record.RecordId);

        row.innerHTML = `
            <td>${record.RecordId}</td>
            <td>${new Date(record.BorrowDate).toLocaleDateString()}</td>
            <td>${new Date(record.ReturnDate).toLocaleDateString()}</td>
            <td><span class="badge badge-${getBadgeClass(record.Status)}">${record.Status}</span></td>
            <td>${totalPrice.toLocaleString()}₫</td>
            <td>
                <div class="member-info">
                    <span class="font-medium">${user.Username || 'Unknown'}</span>
                </div>
            </td>
            <td class="text-right">
                ${actions}
            </td>
        `;

        tbody.appendChild(row);
    });
}

function getActionsByStatus(status, recordId) {
    switch (status) {
        case 'PENDING':
            return `
                <a href="/dashboard/borrowings/${recordId}">Xem chi tiết</a> |
                <a href="#" onclick="approveRecord(${recordId})">Duyệt</a> |
                <a href="#" onclick="cancelRecord(${recordId})" class="text-danger">Hủy</a>
            `;
        case 'BORROWING':
            return `
                <a href="/dashboard/borrowings/${recordId}">Xem chi tiết</a> |
                <a href="#" onclick="addPenalty(${recordId})">Thêm phiếu phạt</a> |
                <a href="#" onclick="markAsDone(${recordId})">Đánh dấu hoàn thành</a>
            `;
        case 'DONE':
            return `
                <a href="/dashboard/borrowings/${recordId}">Xem chi tiết</a>
            `;
        default:
            return `<a href="/dashboard/borrowings/${recordId}">Xem chi tiết</a>`;
    }
}

async function approveRecord(id) {
    try {
        const response = await fetch(`/api/borrowrecords/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({
                Status: "BORROWING"
            })
        });

        const data = await response.json();

        if (!response.ok) {
            console.error("Lỗi khi duyệt đơn:", data.error || "Không xác định");
            return;
        }

        console.log("Duyệt thành công:", data);
        location.reload();
    } catch (error) {
        console.error("Lỗi kết nối:", error.message);
    }
}


async function cancelRecord(id) {
    const confirmCancel = confirm("Bạn có chắc chắn muốn hủy đơn đặt mượn này không?");
    if (!confirmCancel) return;

    try {
        const response = await fetch(`/api/borrowrecords/${id}`, {
            method: 'DELETE',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem('token')}`
            }
        });

        const result = await response.json();

        if (response.ok) {
            alert("Đơn mượn đã được hủy thành công.");
            location.reload();
        } else {
            alert(`Lỗi: ${result.error || "Không thể hủy đơn mượn"}`);
        }
    } catch (error) {
        console.error("Lỗi khi hủy đơn mượn:", error);
        alert("Đã xảy ra lỗi khi kết nối đến server.");
    }
}


function addPenalty(id) {
    console.log("Thêm phiếu phạt cho record:", id);
}

async function markAsDone(id) {
    try {
        const response = await fetch(`/api/borrowrecords/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({
                Status: "DONE"
            })
        });

        const data = await response.json();

        if (!response.ok) {
            console.error("Lỗi khi duyệt đơn:", data.error || "Không xác định");
            return;
        }

        console.log("Duyệt thành công:", data);
        location.reload();
    } catch (error) {
        console.error("Lỗi kết nối:", error.message);
    }
}

function getBadgeClass(status) {
    switch (status) {
        case 'PENDING': return 'warning';
        case 'BORROWING': return 'info';
        case 'DONE': return 'success';
        default: return 'secondary';
    }
}


