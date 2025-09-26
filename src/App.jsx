import React, { useState } from "react";
import { ChakraProvider } from "@chakra-ui/react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProductList from "./components/ProductList";
import Checkout from "./components/Checkout";

function App() {
  const [cart, setCart] = useState([]);

  const getTotalPrice = () => {
    return cart
      .reduce((total, item) => total + item.price * item.quantity, 0)
      .toFixed(2);
  };

  return (
    <ChakraProvider>
      <Router>
        <Routes>
          <Route
            path="/"
            element={<ProductList cart={cart} setCart={setCart} />}
          />
          <Route
            path="/checkout"
            element={<Checkout cart={cart} getTotalPrice={getTotalPrice} />}
          />
        </Routes>
      </Router>
    </ChakraProvider>
  );
}

export default App;
