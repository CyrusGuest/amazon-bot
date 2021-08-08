import React, { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import styles from '../css/productpage.module.css'
import api from '../api/api'
import { useParams, useHistory } from 'react-router-dom'

const ProductPage = () => {
  const [product, setProduct] = useState("");
  const { id } = useParams();
  let history = useHistory();

  useEffect(() => {
    const fetchData = async () => {
      const response = await api.get(`/api/v1/products/${id}`);

      console.log(response);
      setProduct(response.data.data.product);
    };

    fetchData();
  }, []);

  const handleDirect = () => {
    history.push(`/products/update/${id}`)
  };

  const handleDelete = async () => {
    const response = await api.delete(`/api/v1/products/${id}`);

    history.push("/");
  }

  return (
    <div>
      <Navbar />
      <h1 className={styles.title}>{product.name}</h1>
      <div className={styles.container}>
        <h3 className={styles.name}>{product.name}</h3>
        {product.price === null ? <h5 className={styles.price}>Current Price: <span style={{ color: "#FF0000" }}>Out of stock</span></h5> : <h5 className={styles.price}>Current Price: <span style={{ color: "#1F8A04" }}>{product.price}</span></h5>}
        {product.status === "Tracking" ? <h5 className={styles.status}>Status: <span style={{ color: "#FF0000" }}>{product.status}</span></h5> : <h5 className={styles.status}>Status: <span style={{ color: "#1F8A04" }}>{product.status}</span></h5>}
        {product.max_price === null ? <h5 className={styles.max}>Max Price: <span style={{ color: "#FF0000" }}>No limit</span></h5> : <h5 className={styles.max}>Max Price: <span style={{ color: "#1F8A04" }}>{product.max_price}</span></h5>}
        <button onClick={handleDirect} className={styles.btn}>View URL</button>
        <p onClick={handleDelete} className={styles.delete}>Delete Product</p>
      </div>
    </div>
  )
}

export default ProductPage
