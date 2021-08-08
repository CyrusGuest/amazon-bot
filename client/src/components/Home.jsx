import styles from '../css/home.module.css';
import React from 'react'
import Products from './Products';

const Home = () => {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Products</h1>
      <Products className={styles.products_container} />
    </div>
  )
}

export default Home
