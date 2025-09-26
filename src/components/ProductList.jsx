import React, { useEffect, useState } from "react";
import {
  Box,
  Image,
  Text,
  SimpleGrid,
  Spinner,
  Heading,
  Button,
  Badge,
  Flex,
  Input,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  HStack,
  useDisclosure,
} from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
import { FaShoppingCart } from "react-icons/fa";
import CartDrawer from "./CartDrawer";

function ProductList({ cart, setCart }) {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();

  // Fetch products
  useEffect(() => {
    fetch("https://fakestoreapi.com/products")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setFilteredProducts(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching products:", err);
        setLoading(false);
      });
  }, []);

  // Filter products
  useEffect(() => {
    if (searchTerm === "") {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter((product) =>
        product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredProducts(filtered);
    }
  }, [searchTerm, products]);

  // Cart functions
  const addToCart = (product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prevCart, { ...product, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(productId);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const getTotalItems = () =>
    cart.reduce((total, item) => total + item.quantity, 0);

  const getTotalPrice = () =>
    cart.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);

  const ProductCard = ({ product }) => (
    <Box
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      p={4}
      boxShadow="md"
      _hover={{ boxShadow: "xl", transform: "scale(1.02)" }}
      transition="0.2s"
      height="100%"
      display="flex"
      flexDirection="column"
    >
      <Image
        src={product.image}
        alt={product.title}
        boxSize="200px"
        objectFit="contain"
        mx="auto"
        mb={3}
      />
      <Badge colorScheme="green" alignSelf="flex-start" mb={2}>
        {product.category}
      </Badge>
      <Text fontWeight="bold" noOfLines={2} flex="1">
        {product.title}
      </Text>
      <Text color="gray.600" fontSize="sm" noOfLines={3} mt={2} flex="1">
        {product.description}
      </Text>
      <Flex justify="space-between" align="center" mt={3}>
        <Text fontSize="xl" fontWeight="bold" color="teal.500">
          ${product.price}
        </Text>
        <Button
          colorScheme="teal"
          size="sm"
          onClick={() => addToCart(product)}
          leftIcon={<AddIcon />}
        >
          Add to Cart
        </Button>
      </Flex>
      <Text fontSize="xs" color="gray.500" mt={2}>
        Rating: {product.rating?.rate} ⭐ ({product.rating?.count} reviews)
      </Text>
    </Box>
  );

  if (loading) {
    return (
      <Box textAlign="center" mt={10}>
        <Spinner size="xl" />
        <Text mt={2}>Loading products...</Text>
      </Box>
    );
  }

  return (
    <Box p={5} minH="100vh" bg="gray.50">
      {/* Header */}
      <Flex justify="space-between" align="center" mb={6} wrap="wrap">
        <Heading>🛍️ Product Store</Heading>
        <HStack>
          <Input
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            width={["100%", "300px"]}
            mt={[2, 0]}
          />
          <Button
            colorScheme="teal"
            onClick={onOpen}
            leftIcon={<FaShoppingCart />}
            mt={[2, 0]}
          >
            Cart ({getTotalItems()})
          </Button>
        </HStack>
      </Flex>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <Alert status="info" borderRadius="md">
          <AlertIcon />
          <Box>
            <AlertTitle>No products found!</AlertTitle>
            <AlertDescription>
              Try adjusting your search terms.
            </AlertDescription>
          </Box>
        </Alert>
      ) : (
        <SimpleGrid columns={[1, 2, 3, 4]} spacing={6}>
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </SimpleGrid>
      )}

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isOpen}
        onClose={onClose}
        cart={cart}
        updateQuantity={updateQuantity}
        removeFromCart={removeFromCart}
        getTotalItems={getTotalItems}
        getTotalPrice={getTotalPrice}
      />
    </Box>
  );
}

export default ProductList;
