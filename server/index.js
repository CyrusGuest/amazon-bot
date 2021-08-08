require("dotenv").config();
const { startNewTracker, stopTracker } = require("./bot");
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const db = require("./db");
const app = express();
const port = process.env.PORT;

// Middleware
app.use(morgan("dev"));
app.use(cors());
app.use(express.json());

// Product API Routes

let trackers = [];

app.get("/api/v1/products", async (req, res) => {
  try {
    const products = await db.query("SELECT * FROM products");
    res.status(200).json({
      status: "success",
      results: products.rows.length,
      data: {
        products: products.rows,
      },
    });
  } catch (err) {
    console.log(err);
  }
});

app.get("/api/v1/products/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const product = await db.query(
      "SELECT * FROM products WHERE product_id = $1",
      [id]
    );
    res.status(200).json({
      status: "success",
      results: product.rows.length,
      data: {
        product: product.rows[0],
      },
    });
  } catch (err) {
    console.log(err);
  }
});

app.post("/api/v1/products", async (req, res) => {
  const product = req.body;
  try {
    const { rows } = await db.query(
      "INSERT INTO products (name, url, price, max_price, status) VALUES ($1, $2, $3, $4, $5) returning *",
      [
        product.name,
        product.url,
        product.price,
        product.max_price,
        product.status,
      ]
    );
    res.status(201).json({
      status: "success",
      results: rows.length,
      data: {
        product: rows[0],
      },
    });
  } catch (err) {
    console.log(err);
  }
});

app.put("/api/v1/products/:id", async (req, res) => {
  const product = req.body;
  try {
    const { rows } = await db.query(
      "UPDATE products SET name = $1, url = $2, price = $3, max_price = $4, status = $5 WHERE product_id = $6 returning *",
      [
        product.name,
        product.url,
        product.price,
        product.max_price,
        product.status,
        product.product_id,
      ]
    );
    res.status(200).json({
      status: "success",
      results: rows.length,
      data: {
        product: rows[0],
      },
    });
  } catch (err) {
    console.log(err);
  }
});

app.delete("/api/v1/products/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await db.query("DELETE FROM products WHERE product_id = $1", [id]);
    res.status(200).json({
      status: "success",
    });
  } catch (err) {
    console.log(err);
  }
});

app.post("/api/v1/tracker", async (req, res) => {
  const product = req.body;

  if (product.status === "Tracking") {
    const tracker = await startNewTracker(
      product.url,
      product.max_price,
      product.product_id
    );
    trackers.push({ url: product.url, tracker });
    res.status(200).json({
      status: "success",
    });
  }

  if (product.status === "Not Tracking") {
    const tracker = trackers.filter((tracker) => tracker.url === product.url);
    stopTracker(tracker[0].tracker);
    res.status(200).json({
      status: "success",
    });
  }
});

app.listen(port, () => {
  console.log(`SERVER LISTENING ON PORT ${port}`);
});
