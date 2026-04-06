import { React } from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


/* ================= LOGIN PAGE ================= */
function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
      });

      const { token, user } = res.data;

      // Save token + role
      localStorage.setItem("token", token);
      localStorage.setItem("role", user.role);

      // Redirect based on role
      if (user.role === "admin") {
        navigate("/admin");
      } else if (user.role === "user") {
        navigate("/stores");
      } else if (user.role === "store_owner") {
        navigate("/owner");
      }

    } catch (err) {
      alert("Login failed");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Login</h2>

      <input
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      />
      <br /><br />

      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />
      <br /><br />

      <button onClick={handleLogin}>Login</button>
    </div>
  );
}

/* ================= USER STORES PAGE ================= */
function UserStores() {
  const [stores, setStores] = useState([]);
  const [ratings, setRatings] = useState({}); // store_id → rating

  const token = localStorage.getItem("token");

  // Fetch stores
  const fetchStores = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/stores", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setStores(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  // Handle dropdown change
  const handleRatingChange = (store_id, value) => {
    setRatings((prev) => ({
      ...prev,
      [store_id]: Number(value),
    }));
  };

  // Submit rating
  const rateStore = async (store_id) => {
    try {
      const rating = ratings[store_id] || 5; // default

      await axios.post(
        "http://localhost:5000/api/ratings",
        {
          store_id,
          rating,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Rated successfully ⭐");
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchStores();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Stores</h2>

      {stores.map((store) => (
        <div
          key={store.id}
          style={{
            border: "1px solid #ccc",
            padding: "10px",
            margin: "10px",
          }}
        >
          <h3>{store.name}</h3>
          <p>{store.address}</p>

          {/* Rating dropdown */}
          <select
            onChange={(e) =>
              handleRatingChange(store.id, e.target.value)
            }
          >
            <option value={1}>1 ⭐</option>
            <option value={2}>2 ⭐</option>
            <option value={3}>3 ⭐</option>
            <option value={4}>4 ⭐</option>
            <option value={5}>5 ⭐</option>
          </select>

          <br /><br />

          <button onClick={() => rateStore(store.id)}>
            Submit Rating
          </button>
        </div>
      ))}
    </div>
  );
}

/* ================= ADMIN ================= */

function AdminDashboard() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [stores, setStores] = useState([]);

  const token = localStorage.getItem("token");

  // Fetch stores
  const fetchStores = async () => {
    const res = await axios.get("http://localhost:5000/api/stores", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setStores(res.data);
  };

  // Add store
  const addStore = async () => {
    await axios.post(
      "http://localhost:5000/api/stores",
      { name, email, address, owner_id: null },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    alert("Store added ✅");
    setName("");
    setEmail("");
    setAddress("");

    fetchStores();
  };


  const deleteStore = async (id) => {
    await axios.delete(`http://localhost:5000/api/stores/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    alert("Store deleted ❌");
    fetchStores();
  };

  useEffect(() => {
    fetchStores();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Admin Dashboard</h2>

      <h3>Add Store</h3>

      <input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
      <br /><br />
      <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <br /><br />
      <input placeholder="Address" value={address} onChange={(e) => setAddress(e.target.value)} />
      <br /><br />

      <button onClick={addStore}>Add Store</button>

      <hr />

      <h3>All Stores</h3>

      {stores.map((store) => (
        <div key={store.id} style={{ border: "1px solid gray", margin: "10px", padding: "10px" }}>
          <h4>{store.name}</h4>
          <p>{store.address}</p>

          <button onClick={() => deleteStore(store.id)}>
            Delete ❌
          </button>
        </div>
      ))}
    </div>
  );
}

/* ================= OWNER ================= */

function OwnerDashboard() {
  const [data, setData] = useState(null);

  const token = localStorage.getItem("token");

  const fetchDashboard = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/store-owner/dashboard",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setData(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (!data) return <h2>Loading...</h2>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>Store Owner Dashboard</h2>

      <h3>Store: {data.store}</h3>
      <h4>Average Rating: {data.average_rating}</h4>

      <h3>Users Who Rated:</h3>

      {data.ratings.length === 0 ? (
        <p>No ratings yet</p>
      ) : (
        data.ratings.map((user, index) => (
          <div
            key={index}
            style={{
              border: "1px solid gray",
              padding: "10px",
              margin: "10px",
            }}
          >
            <p>Name: {user.name}</p>
            <p>Email: {user.email}</p>
            <p>Rating: {user.rating} ⭐</p>
          </div>
        ))
      )}
    </div>
  );
}

/* ================= APP ================= */
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/stores" element={<UserStores />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/owner" element={<OwnerDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;