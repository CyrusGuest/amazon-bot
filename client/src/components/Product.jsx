import Status from './Status';
import Price from './Price';
import React from 'react'
import styles from '../css/product.module.css';
import { useHistory } from 'react-router';

const Product = ({ product }) => {
  let history = useHistory();

  const handleRedirect = () => {
    history.push(`/products/${product.product_id}`);
  };

  if (product.status === "Tracking") {
    return (
      <div onClick={handleRedirect} className={styles.container}>
        <Status product={product} />
        <h3 className={styles.name}>{product.name}</h3>
        <Price product={product}/>
      </div>
  )};
  if (product.status === "Not Tracking") {
    return (
      <div onClick={handleRedirect} className={styles.container}>
        <Status product={product} />
        <h3 className={styles.name}>{product.name}</h3>
        <Price product={product}/>
      </div>
  )};
  if (product.status === "Loading") {
    return (
      <div onClick={handleRedirect} className={styles.container}>
        <Status product={product} /> 
        <h3 className={styles.name}>{product.name}</h3>
        <Price product={product}/>
      </div>
  )};
}

export default Product
