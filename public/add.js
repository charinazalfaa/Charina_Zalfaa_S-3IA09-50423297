const baseUrl = "http://localhost:3001/transactions";
let editId = null;

const storedData = localStorage.getItem("editData");
if (storedData) {
    const data = JSON.parse(storedData);
    editId = data.id;

    document.getElementById("tanggal").value = data.tanggal.split("T")[0];
    document.getElementById("category").value = data.kategori;
    document.getElementById("type").value = data.jenis;
    document.getElementById("nominal").value = data.nominal;
    document.getElementById("notes").value = data.catatan || "";

    document.getElementById("formTitle").innerText = "Edit Transaction";
}

document
    .getElementById("transactionForm")
    .addEventListener("submit", function (e) {
        e.preventDefault();

        const payload = {
            tanggal: document.getElementById("tanggal").value,
            kategori: document.getElementById("category").value,
            jenis: document.getElementById("type").value,
            nominal: Number(document.getElementById("nominal").value),
            catatan: document.getElementById("notes").value
        };

        if (editId) {
            fetch(`${baseUrl}/${editId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            })
            .then(() => {
                localStorage.removeItem("editData");
                window.location.href = "list.html";
            });

        } else {
            fetch(baseUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            })
            .then(() => {
                window.location.href = "list.html";
            });
        }
    });