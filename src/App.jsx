import React, { useState } from "react";
import { ChakraProvider } from "@chakra-ui/react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProductList from "./components/ProductList";
import Checkout from "./components/Checkout";

function App() {
  const [cart, setCart] = useState([]);

  return (
    <ChakraProvider>
      <Router>
        <Routes>
          <Route path="/" element={<ProductList cart={cart} setCart={setCart} />} />
          <Route path="/checkout" element={<Checkout cart={cart} />} />
        </Routes>
      </Router>
    </ChakraProvider>
  );
}

export default App;
