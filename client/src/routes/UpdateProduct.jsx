import React, { useState, useEffect } from 'react'
import styles from '../css/updateproduct.module.css'
import api from '../api/api'
import { useParams, useHistory } from 'react-router-dom'

const UpdateProduct = () => {
  const [product, setProduct] = useState({});
  const { id } = useParams();
  let history = useHistory();

  useEffect(() => {
    const fetchData = async () => {
      const response = await api.get(`/api/v1/products/${id}`);

      setProduct(response.data.data.product);
    };

    fetchData();
  }, []);

  const handleRedirect = () => {
    history.push(`/products/${product.product_id}`);
  };

  const handleUrlUpdate = async () => {
    const response = await api.put(`/api/v1/products/${id}`, product);
    console.log(response);

    handleRedirect();
  };

  return (
    <div>
      <h1 className={styles.title}>{product.name}</h1>
      <form className={styles.form}>
        <input value={product.url} onChange={(e) => setProduct({...product, url: e.target.value})} className={styles.url} type="text" name="url" id="url" placeholder="URL"/>
      </form>
      <button onClick={handleUrlUpdate} className={styles.btn}>Update</button>
      <a onClick={handleRedirect} className={styles.back}>Go back</a>
    </div>
  )
}

export default UpdateProduct
