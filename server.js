require("dotenv").config();
const express = require("express");
const mysql = require("mysql2");
const { Sequelize, DataTypes } = require("sequelize");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

db.connect(err => {
    if (err) throw err;
    console.log("Connected to MySQL Database");
});

// ORM Sequelize Setup
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: "mysql"
});

const User = sequelize.define("User", {
    username: { type: DataTypes.STRING, allowNull: false },
    password: { type: DataTypes.STRING, allowNull: false }
}, { timestamps: false });


// 🚨 1. Metode Tidak Aman (String Concatenation)
app.post("/login-unsafe", (req, res) => {
    const { username, password } = req.body;

    const start = process.hrtime();
    const query = `SELECT * FROM users WHERE username = '${username}' AND password = '${password}'`;

    db.query(query, (err, results) => {
        const end = process.hrtime(start);
        const execTime = (end[0] * 1000) + (end[1] / 1e6); // Convert to milliseconds
        
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: results.length > 0 ? "Login successful" : "Invalid credentials", executionTime: `${execTime.toFixed(3)} ms`, data: results });
    });
});

// ⚠️ 2. Metode Kurang Aman (Escaping Input)
app.post("/login-escaped", (req, res) => {
    const { username, password } = req.body;

    const start = process.hrtime();
    const safeUsername = mysql.escape(username);
    const safePassword = mysql.escape(password);
    const query = `SELECT * FROM users WHERE username = ${safeUsername} AND password = ${safePassword}`;

    db.query(query, [username, password], (err, results) => {
        const end = process.hrtime(start);
        const execTime = (end[0] * 1000) + (end[1] / 1e6);

        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: results.length > 0 ? "Login successful" : "Invalid credentials", executionTime: `${execTime.toFixed(3)} ms`, data: results });
    });
});

// ✅ 3. Metode Sangat Aman (Parameterized Query)
app.post("/login-secure", (req, res) => {
    const { username, password } = req.body;

    const start = process.hrtime();
    const query = "SELECT * FROM users WHERE username = ? AND password = ?";

    db.query(query, [username, password], (err, results) => {
        const end = process.hrtime(start);
        const execTime = (end[0] * 1000) + (end[1] / 1e6);

        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: results.length > 0 ? "Login successful" : "Invalid credentials", executionTime: `${execTime.toFixed(3)} ms`, data: results });
    });
});

// 🟢 4. Metode Aman (ORM Sequelize)
app.post("/login-orm", async (req, res) => {
    const { username, password } = req.body;

    const start = process.hrtime();
    try {
        const user = await User.findOne({ where: { username, password } });
        const end = process.hrtime(start);
        const execTime = (end[0] * 1000) + (end[1] / 1e6);

        res.json({ message: user ? "Login successful" : "Invalid credentials", executionTime: `${execTime.toFixed(3)} ms`, data: user });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(3000, () => console.log("Server running on port 3000"));
