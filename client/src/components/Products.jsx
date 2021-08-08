import Product from './Product'
import React, { useEffect, useContext } from 'react'
import styles from '../css/products.module.css'
import api from '../api/api';
import { ProductsContext } from '../context/ProductsContext';

const Products = () => {
  const { products, setProducts } = useContext(ProductsContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get("/api/v1/products");
        setProducts(response.data.data.products);
      } catch (error) {
        console.log(error)
      }
    };
    
    fetchData();
  }, [])

  return (
    <div className={styles.products_container}>
      {products.map(product => <Product product={product} />)};
    </div>
  )
}

export default Products
