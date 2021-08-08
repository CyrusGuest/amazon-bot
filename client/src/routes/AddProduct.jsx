import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import Navbar from '../components/Navbar'
import styles from '../css/addproduct.module.css'
import api from '../api/api'

const AddProduct = () => {
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [max_price, setMax_price] = useState(null);
  let history = useHistory();
 
  const handleAddProduct = async (e) => {
    e.preventDefault();

    if (!name || !url) return alert("Please fill out all required fields");

    const product = { name, url, max_price: max_price, status: "Not Tracking" }

    const result = await api.post("/api/v1/products", product);

    history.push("/");
  };

  return (
    <div>
      <Navbar />
      <h1 className={styles.title}>Add Product</h1>
      <div className={styles.container}>
        <form onSubmit={(e) => handleAddProduct(e)}>
          <input value={name} onChange={(e) => setName(e.target.value)} className={styles.name} type="text" name="name" id="name" placeholder="Product name" />
          <input value={url} onChange={(e) => setUrl(e.target.value)} className={styles.url} type="text" name="url" id="url" placeholder="Product URL" />
          <input value={max_price} onChange={(e) => setMax_price(parseInt(e.target.value))} className={styles.max} type="number" name="max" id="max" placeholder="Max purchase price" />
          <button className={styles.btn} type="submit">Submit</button>
        </form>
      </div>
    </div>
  )
}

export default AddProduct
