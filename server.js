const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "home.html"));
});

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "keuangan_db"
});

db.connect(err => {
    if (err) {
        console.error("Database connection failed:", err);
        return;
    }
    console.log("MySQL connected");
});

app.get("/transactions", (req, res) => {
    const sql = "SELECT * FROM transactions ORDER BY tanggal DESC";
    db.query(sql, (err, result) => {
        if (err) {
            res.status(500).json(err);
            return;
        }
        res.json(result);
    });
});

app.get("/transactions/:id", (req, res) => {
    const sql = "SELECT * FROM transactions WHERE id = ?";
    db.query(sql, [req.params.id], (err, result) => {
        if (err) {
            res.status(500).json(err);
            return;
        }
        res.json(result[0]);
    });
});

app.post("/transactions", (req, res) => {
    const { tanggal, kategori, jenis, nominal, catatan } = req.body;

    const sql = `
        INSERT INTO transactions (tanggal, kategori, jenis, nominal, catatan)
        VALUES (?, ?, ?, ?, ?)
    `;

    db.query(
        sql,
        [tanggal, kategori, jenis, Number(nominal), catatan],
        err => {
            if (err) {
                res.status(500).json(err);
                return;
            }
            res.json({ message: "Transaction added successfully" });
        }
    );
});

app.put("/transactions/:id", (req, res) => {
    const { tanggal, kategori, jenis, nominal, catatan } = req.body;

    const sql = `
        UPDATE transactions
        SET tanggal = ?, kategori = ?, jenis = ?, nominal = ?, catatan = ?
        WHERE id = ?
    `;

    db.query(
        sql,
        [tanggal, kategori, jenis, Number(nominal), catatan, req.params.id],
        err => {
            if (err) {
                res.status(500).json(err);
                return;
            }
            res.json({ message: "Transaction updated successfully" });
        }
    );
});

app.delete("/transactions/:id", (req, res) => {
    const sql = "DELETE FROM transactions WHERE id = ?";
    db.query(sql, [req.params.id], err => {
        if (err) {
            res.status(500).json(err);
            return;
        }
        res.json({ message: "Transaction deleted successfully" });
    });
});

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});