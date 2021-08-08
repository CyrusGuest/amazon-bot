import Main from "./routes/Main";
import AddProduct from "./routes/AddProduct";
import ProductPage from "./routes/ProductPage";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { ProductsContextProvider } from "./context/ProductsContext";
import "./App.css";
import UpdateProduct from "./routes/UpdateProduct";

function App() {
  return (
    <ProductsContextProvider>
      <div className="App">
        <Router>
          <Switch>
            <Route exact path="/" component={Main} />
            <Route exact path="/add-product" component={AddProduct} />
            <Route exact path="/products/:id" component={ProductPage} />
            <Route
              exact
              path="/products/update/:id"
              component={UpdateProduct}
            />
          </Switch>
        </Router>
      </div>
    </ProductsContextProvider>
  );
}

export default App;
