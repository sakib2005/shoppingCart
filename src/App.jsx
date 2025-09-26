// App.jsx
import { Box, Heading, Button } from "@chakra-ui/react";
import ProductsList from "./product/ProductsList.jsx";

function App() {
  return (
    <Box p={6} textAlign="center">
      <Heading mb={4}>🛍️ Shopping Cart</Heading>
      <ProductsList />
      <Button mt={6} colorScheme="teal">
        Checkout
      </Button>
    </Box>
  );
}

export default App;
