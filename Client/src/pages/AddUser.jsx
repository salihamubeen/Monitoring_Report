import React, { useState, useEffect } from 'react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL + '/users';

const AddUser = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState('');

  const fetchUsers = async () => {
    try {
      const res = await fetch(API_BASE_URL);
      const data = await res.json();
      if (data.success) setUsers(data.users);
      else setUsers([]);
    } catch {
      setUsers([]);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleAddUser = async (e) => {
    e.preventDefault();
    setMessage('');
    if (!username || !password) {
      setMessage('Username and password are required');
      return;
    }
    try {
      const res = await fetch(`${API_BASE_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (data.success) {
        setMessage('User added successfully');
        setUsername('');
        setPassword('');
        fetchUsers();
      } else {
        setMessage(data.error || 'Failed to add user');
      }
    } catch {
      setMessage('Failed to add user');
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-xl font-bold mb-4">Add User</h2>
      {message && <div className="mb-2 text-green-600">{message}</div>}
      <form onSubmit={handleAddUser} className="mb-6">
        <div className="mb-4">
          <label className="block mb-1 text-gray-700">Username</label>
          <input type="text" value={username} onChange={e => setUsername(e.target.value)} className="w-full px-3 py-2 border rounded" required />
        </div>
        <div className="mb-4">
          <label className="block mb-1 text-gray-700">Password</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full px-3 py-2 border rounded" required />
        </div>
        <button type="submit" className="w-full bg-[#5bc0ee] text-white py-2 rounded hover:bg-[#2494be]">Add User</button>
      </form>
      <h3 className="text-lg font-semibold mb-2">Existing Users</h3>
      <div className="grid gap-3">
        {users.length === 0 && <div className="text-gray-500">No users added yet.</div>}
        {users.map((u, idx) => (
          <div key={idx} className="flex items-center gap-3 bg-[#f4f8fb] rounded shadow-sm px-4 py-2">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#5bc0ee] text-white font-bold text-lg">
              {u.username.charAt(0).toUpperCase()}
            </div>
            <div className="font-medium text-gray-800">{u.username}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AddUser; 