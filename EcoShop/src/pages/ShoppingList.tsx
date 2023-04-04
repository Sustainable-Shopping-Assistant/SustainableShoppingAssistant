import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";

interface IItem {
  _id: string;
  name: string;
  completed: boolean;
}

const ShoppingList: React.FC = () => {
  const { user } = useContext(AuthContext);
  const [items, setItems] = useState<IItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("/items", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setItems(res.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
      }
    };

    fetchItems();
  }, []);

  const handleCheck = async (id: string) => {
    try {
      const item = items.find((item) => item._id === id);
      if (!item) {
        return;
      }
      const res = await axios.put(`/items/${id}`, {
        ...item,
        completed: !item.completed,
      });
      setItems(items.map((item) => (item._id === id ? res.data : item)));
    } catch (err) {
      console.error(err);
    }
  };


  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`/items/${id}`);
      setItems(items.filter((item) => item._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;

    try {
      const res = await axios.post("/items", { name });
      setItems([...items, res.data]);
    } catch (err) {
      console.error(err);
    }
  };

  if (!user) {
    return null; // don't render anything if the user is not authenticated
  }

  return (
    <div>
      <h2>Shopping List</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <ul>
            {items.map((item) => (
              <li key={item._id}>
                <label>
                  <input
                    type="checkbox"
                    checked={item.completed}
                    onChange={() => handleCheck(item._id)}
                  />
                  {item.name}
                </label>
                <button onClick={() => handleDelete(item._id)}>Delete</button>
              </li>
            ))}
          </ul>
          <form onSubmit={handleSubmit}>
            <input type="text" name="name" />
            <button type="submit">Add item</button>
          </form>
        </>
      )}
    </div>
  );
};

export default ShoppingList;
