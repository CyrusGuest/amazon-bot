import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPause, faPlay, faSpinner } from '@fortawesome/free-solid-svg-icons'
import styles from '../css/status.module.css'
import api from '../api/api';

const Status = ({ product }) => {
  const [status, setStatus] = useState(product.status);

  const handleStatusChange = async (e) => {
    e.stopPropagation()

    let newStatus = "";
    const oldStatus = status;
    if (status === "Tracking") newStatus = "Not Tracking";
    if (status === "Not Tracking") newStatus = "Tracking";

    try {
      setStatus("Loading");
      const response = await api.put(`/api/v1/products/${status.product_id}`, { ...product, status: newStatus });
      await api.post("/api/v1/tracker", { ...product, status: newStatus });
      if (response.data.status === "success") {
        setStatus(newStatus);
      } else {
        setStatus(oldStatus);
      }
    } catch (error) {
      console.log(error);
    }
  };

  if (status === "Tracking") {
    return (
      <div onClick={e => handleStatusChange(e)} style={{ backgroundColor: "#F23737" }} className={styles.icon_container}>
        <FontAwesomeIcon className={styles.icon} icon={faPause}/>
      </div>
    )
  }
  if (status === "Not Tracking") {
    return (
      <div onClick={handleStatusChange} style={{ backgroundColor: "#1F8A04" }} className={styles.icon_container}>
        <FontAwesomeIcon className={styles.icon} icon={faPlay}/>
      </div>
    )
  }
  if (status === "Loading") {
    return (
      <div onClick={handleStatusChange} style={{ backgroundColor: "#F47500" }} className={styles.icon_container}>
        <FontAwesomeIcon className={styles.icon} icon={faSpinner}/>
      </div>
    )
  }
}

export default Status
