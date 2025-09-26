import React, { useEffect, useState } from "react";
import {
  ChakraProvider,
  Box,
  Image,
  Text,
  SimpleGrid,
  Spinner,
  Heading,
} from "@chakra-ui/react";

function ProductsList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://fakestoreapi.com/products")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching products:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <Box textAlign="center" mt={10}>
        <Spinner size="xl" />
        <Text mt={2}>Loading products...</Text>
      </Box>
    );
  }

  return (
    <ChakraProvider>
      <Box p={5}>
        <Heading mb={6} textAlign="center">
          🛍️ Product List
        </Heading>
        <SimpleGrid columns={[1, 2, 3, 4]} spacing={6}>
          {products.map((product) => (
            <Box
              key={product.id}
              borderWidth="1px"
              borderRadius="lg"
              overflow="hidden"
              p={4}
              boxShadow="md"
              _hover={{ boxShadow: "xl", transform: "scale(1.02)" }}
              transition="0.2s"
            >
              <Image
                src={product.image}
                alt={product.title}
                boxSize="200px"
                objectFit="contain"
                mx="auto"
              />
              <Text fontWeight="bold" mt={3} noOfLines={2}>
                {product.title}
              </Text>
              <Text color="gray.600" fontSize="sm" noOfLines={3} mt={2}>
                {product.description}
              </Text>
              <Text mt={3} fontSize="lg" fontWeight="semibold" color="teal.500">
                ${product.price}
              </Text>
            </Box>
          ))}
        </SimpleGrid>
      </Box>
    </ChakraProvider>
  );
}

export default ProductsList;
