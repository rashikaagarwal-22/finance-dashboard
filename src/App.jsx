import React, { useState, useMemo } from "react";
import "./styles.css";

const initialData = [
  { id: 1, date: "2026-03-01", amount: 5000, category: "Salary", type: "income" },
  { id: 2, date: "2026-03-02", amount: 1200, category: "Food", type: "expense" },
  { id: 3, date: "2026-03-03", amount: 800, category: "Shopping", type: "expense" },
  { id: 4, date: "2026-03-04", amount: 2000, category: "Freelance", type: "income" }
];

export default function App() {
  const [transactions, setTransactions] = useState(initialData);
  const [role, setRole] = useState("viewer");
  const [search, setSearch] = useState("");
  const [darkMode, setDarkMode] = useState(false);

  const income = useMemo(() => transactions.filter(t => t.type === "income").reduce((a, b) => a + b.amount, 0), [transactions]);
  const expenses = useMemo(() => transactions.filter(t => t.type === "expense").reduce((a, b) => a + b.amount, 0), [transactions]);
  const balance = income - expenses;

  const filtered = transactions.filter(t => t.category.toLowerCase().includes(search.toLowerCase()));

  const highestCategory = useMemo(() => {
    const map = {};
    transactions.forEach(t => {
      if (t.type === "expense") {
        map[t.category] = (map[t.category] || 0) + t.amount;
      }
    });
    return Object.keys(map).reduce((a, b) => map[a] > map[b] ? a : b, "None");
  }, [transactions]);

  const addTransaction = () => {
    const newTx = {
      id: Date.now(),
      date: "2026-03-10",
      amount: 1000,
      category: "Misc",
      type: "expense"
    };
    setTransactions([...transactions, newTx]);
  };

  return (
    <div className={`app ${darkMode ? "dark" : ""}`}>
      <header>
        <h1>Finance Dashboard</h1>
        <div className="controls">
          <select onChange={(e) => setRole(e.target.value)}>
            <option value="viewer">Viewer</option>
            <option value="admin">Admin</option>
          </select>
          <button onClick={() => setDarkMode(!darkMode)}>
            {darkMode ? "Light Mode" : "Dark Mode"}
          </button>
        </div>
      </header>

      {/* Summary */}
      <div className="cards">
        <div className="card">
          <h3>Total Balance</h3>
          <p>₹{balance}</p>
        </div>
        <div className="card">
          <h3>Income</h3>
          <p>₹{income}</p>
        </div>
        <div className="card">
          <h3>Expenses</h3>
          <p>₹{expenses}</p>
        </div>
      </div>

      {/* Insights */}
      <div className="insights">
        <h2>Insights</h2>
        <p>Highest Spending Category: {highestCategory}</p>
        <p>Net Savings: ₹{balance}</p>
      </div>

      {/* Transactions */}
      <div className="transactions">
        <div className="top-bar">
          <input
            type="text"
            placeholder="Search category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {role === "admin" && (
            <button onClick={addTransaction}>Add Transaction</button>
          )}
        </div>

        {filtered.length === 0 ? (
          <p>No transactions found.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Category</th>
                <th>Type</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(tx => (
                <tr key={tx.id}>
                  <td>{tx.date}</td>
                  <td>{tx.category}</td>
                  <td>{tx.type}</td>
                  <td className={tx.type === "income" ? "green" : "red"}>
                    ₹{tx.amount}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

