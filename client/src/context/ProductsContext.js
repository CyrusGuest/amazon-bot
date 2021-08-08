import React, { useState, createContext } from "react";

export const ProductsContext = createContext();

export const ProductsContextProvider = (props) => {
  const [products, setProducts] = useState([]);

  const addProductFunc = (product) => {
    setProducts([...products, product]);
  };

  const deleteProductFunc = (id) => {
    setProducts(
      products.filter((product) => {
        return product.product_id !== id;
      })
    );
  };

  return (
    <ProductsContext.Provider
      value={{
        products,
        setProducts,
        addProductFunc,
        deleteProductFunc,
      }}
    >
      {props.children}
    </ProductsContext.Provider>
  );
};
