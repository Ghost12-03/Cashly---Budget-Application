const express = require("express");
const path = require("path");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public"))); // Serve HTML/CSS/JS

let budget = 0;
let expenses = [];
let currentId = 0;

// ========== API ROUTES ==========

// Get budget and expenses
app.get("/api/data", (req, res) => {
    res.json({ budget, expenses });
});

// Set budget
app.post("/api/budget", (req, res) => {
    const { amount } = req.body;
    if (amount < 0) {
        return res.status(400).json({ error: "Budget must be >= 0" });
    }
    budget = amount;
    res.json({ budget });
});

// Add expense
app.post("/api/expenses", (req, res) => {
    const { title, amount } = req.body;
    if (!title || amount < 0) {
        return res.status(400).json({ error: "Invalid expense data" });
    }
    const newExpense = {
        id: currentId++,
        title,
        amount
    };
    expenses.push(newExpense);
    res.json(newExpense);
});

// Delete expense
app.delete("/api/expenses/:id", (req, res) => {
    const id = parseInt(req.params.id);
    expenses = expenses.filter(exp => exp.id !== id);
    res.json({ success: true });
});

// Edit expense
app.put("/api/expenses/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const { title, amount } = req.body;

    const index = expenses.findIndex(exp => exp.id === id);
    if (index === -1) return res.status(404).json({ error: "Not found" });

    expenses[index] = { id, title, amount };
    res.json(expenses[index]);
});

// ========== START SERVER ==========
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
