import styles from '../css/navbar.module.css';
import React from 'react'
import { useHistory } from 'react-router-dom';

const Navbar = () => {
  let history = useHistory();

  const redirectToHome = (e) => {
    e.preventDefault();

    history.push('/');
  }

  const redirectToAddProduct = (e) => {
    e.preventDefault();

    history.push('/add-product');
  }

  return (
    <div className={styles.header}>
      <h1>Amazon Bot</h1>

      <ul className={styles.nav}>
        <li><a onClick={(e) => redirectToHome(e)} href="home">Home</a></li>
        <li><a onClick={(e) => redirectToAddProduct(e)} href="add-product">Add Product</a></li>
      </ul>
    </div>
  )
}

export default Navbar
