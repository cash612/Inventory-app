import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [items, setItems] = useState(() => {
    return JSON.parse(localStorage.getItem('inventory')) || [];
  });
  const [form, setForm] = useState({ name: '', box: '', qty: '', sold: '' });

  useEffect(() => {
    localStorage.setItem('inventory', JSON.stringify(items));
  }, [items]);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const addItem = () => {
    if (!form.name || !form.qty) return alert('Item name and quantity required');
    const qty = parseInt(form.qty) || 0;
    const sold = parseInt(form.sold) || 0;
    const after = qty - sold;
    const status = after > 0 ? "Open" : "Closed";

    setItems([...items, {
      id: Date.now(),
      name: form.name,
      box: form.box,
      qty,
      sold,
      after,
      status
    }]);
    setForm({ name: '', box: '', qty: '', sold: '' });
  };

  const updateSold = (id, soldValue) => {
    const sold = parseInt(soldValue) || 0;
    setItems(items.map(item =>
      item.id === id
        ? { ...item, sold, after: item.qty - sold, status: (item.qty - sold) > 0 ? "Open" : "Closed" }
        : item
    ));
  };

  const deleteItem = (id) => setItems(items.filter(item => item.id !== id));

  const totalBoxes = items.length;
  const totalItems = items.reduce((acc, item) => acc + item.qty, 0);
  const totalRemaining = items.reduce((acc, item) => acc + item.after, 0);
  const openCount = items.filter(item => item.status === 'Open').length;
  const closedCount = items.filter(item => item.status === 'Closed').length;

  return (
    <div className="container">
      <h1>Inventory Stock Manager</h1>

      <div className="summary">
        <div>Total Boxes: {totalBoxes}</div>
        <div>Total Items: {totalItems}</div>
        <div>Remaining Qty: {totalRemaining}</div>
        <div>Open: {openCount} | Closed: {closedCount}</div>
      </div>

      <div className="form">
        <input name="name" placeholder="Item" value={form.name} onChange={handleChange} />
        <input name="box" placeholder="Box No." value={form.box} onChange={handleChange} />
        <input name="qty" type="number" placeholder="Qty" value={form.qty} onChange={handleChange} />
        <input name="sold" type="number" placeholder="Sold" value={form.sold} onChange={handleChange} />
        <button onClick={addItem}>Add</button>
      </div>

      <table>
        <thead>
          <tr>
            <th>Item</th><th>Box</th><th>Qty</th><th>Sold</th><th>After</th><th>Status</th><th>Action</th>
          </tr>
        </thead>
        <tbody>
          {items.map(item => (
            <tr key={item.id}>
              <td>{item.name}</td>
              <td>{item.box}</td>
              <td>{item.qty}</td>
              <td>
                <input type="number" value={item.sold} onChange={e => updateSold(item.id, e.target.value)} />
              </td>
              <td>{item.after}</td>
              <td>{item.status}</td>
              <td><button onClick={() => deleteItem(item.id)}>Delete</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
