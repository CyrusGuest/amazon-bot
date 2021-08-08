import React from 'react'
import styles from '../css/price.module.css';

const Price = ({ product }) => {
  if (product.price === null) {
    return <h2 className={styles.price}>Current Price: <span style={{ color: "#F23737" }} >Out of stock</span></h2>
  }
  if (product.price <= product.max_price) {
    return <h2 className={styles.price}>Current Price: <span style={{ color: "#F47500" }} >{product.price}</span></h2>
  }
  return <h2 className={styles.price}>Current Price: <span style={{ color: "#1F8A04" }} >{product.price}</span></h2>
}

export default Price
