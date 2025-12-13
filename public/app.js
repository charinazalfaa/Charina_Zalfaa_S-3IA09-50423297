const baseUrl = "http://localhost:3001/transactions";
let allData = [];

// FORMAT RUPIAH
function formatRp(value) {
    return "Rp " + Number(value).toLocaleString("id-ID");
}

function loadData() {
    fetch(baseUrl)
        .then(res => res.json())
        .then(data => {
            allData = data;
            renderTable(data);
            renderSummary(data);
        })
        .catch(err => console.error(err));
}

function renderTable(data) {
    const tbody = document.getElementById("dataBody");
    tbody.innerHTML = "";

    if (data.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" style="text-align:center;color:#6b7280;">
                    No data found
                </td>
            </tr>
        `;
        return;
    }

    data.forEach(item => {
        tbody.innerHTML += `
            <tr>
                <td>${item.id}</td>
                <td>${item.tanggal.split("T")[0]}</td>
                <td>${item.kategori}</td>
                <td>${item.jenis === "pemasukan" ? "Income" : "Expense"}</td>
                <td>${formatRp(item.nominal)}</td>
                <td>${item.catatan || "-"}</td>
                <td>
                    <button class="edit-btn" onclick="editData(${item.id})">Edit</button>
                    <button class="delete-btn" onclick="deleteData(${item.id})">Delete</button>
                </td>
            </tr>
        `;
    });
}

function renderSummary(data) {
    let income = 0;
    let expense = 0;

    data.forEach(item => {
        const amount = Number(item.nominal);
        if (item.jenis === "pemasukan") income += amount;
        if (item.jenis === "pengeluaran") expense += amount;
    });

    const balance = income - expense;

    document.getElementById("totalIncome").innerText = formatRp(income);
    document.getElementById("totalExpense").innerText = formatRp(expense);
    document.getElementById("balance").innerText = formatRp(balance);
}

function applyFilter() {
    const start = document.getElementById("startDate").value;
    const end = document.getElementById("endDate").value;

    let filtered = [...allData];

    if (start) {
        const startDate = new Date(start);
        filtered = filtered.filter(item => new Date(item.tanggal) >= startDate);
    }

    if (end) {
        const endDate = new Date(end);
        endDate.setHours(23, 59, 59, 999);
        filtered = filtered.filter(item => new Date(item.tanggal) <= endDate);
    }

    renderTable(filtered);
    renderSummary(filtered);
}

function deleteData(id) {
    if (!confirm("Are you sure?")) return;

    fetch(`${baseUrl}/${id}`, { method: "DELETE" })
        .then(() => loadData());
}

function editData(id) {
    fetch(`${baseUrl}/${id}`)
        .then(res => res.json())
        .then(data => {
            localStorage.setItem("editData", JSON.stringify(data));
            window.location.href = "add.html";
        });
}

loadData();