import React, { useEffect, useState, useMemo } from "react";
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
  VStack,
  useDisclosure,
  Card,
  CardBody,
  InputGroup,
  InputLeftElement,
  Select,
  IconButton,
  Stack,
  Tag,
  TagLabel,
  Container,
  useToast,
} from "@chakra-ui/react";
import { AddIcon, SearchIcon, StarIcon } from "@chakra-ui/icons";
import { FaShoppingCart, FaHeart, FaRegHeart } from "react-icons/fa";
import CartDrawer from "./CartDrawer";

function ProductList({ cart, setCart }) {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("default");
  const [wishlist, setWishlist] = useState(new Set());
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch("https://fakestoreapi.com/products");
        const data = await response.json();
        setProducts(data);
        setFilteredProducts(data);
      } catch (err) {
        console.error("Error fetching products:", err);
        toast({
          title: "Error loading products",
          description: "Please try again later",
          status: "error",
          duration: 3000,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [toast]);

  // Get unique categories
  const categories = useMemo(() => {
    const uniqueCategories = [...new Set(products.map(product => product.category))];
    return uniqueCategories.sort();
  }, [products]);

  useEffect(() => {
    let filtered = products;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter((product) =>
        product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Category filter
    if (selectedCategory !== "all") {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    // Sorting
    switch (sortBy) {
      case "price-low":
        filtered = [...filtered].sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        filtered = [...filtered].sort((a, b) => b.price - a.price);
        break;
      case "rating":
        filtered = [...filtered].sort((a, b) => b.rating.rate - a.rating.rate);
        break;
      case "name":
        filtered = [...filtered].sort((a, b) => a.title.localeCompare(b.title));
        break;
      default:
        break;
    }

    setFilteredProducts(filtered);
  }, [searchTerm, selectedCategory, sortBy, products]);

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

    toast({
      title: "Added to cart!",
      description: `${product.title}`,
      status: "success",
      duration: 2000,
      isClosable: true,
    });
  };

  const toggleWishlist = (productId) => {
    setWishlist(prev => {
      const newWishlist = new Set(prev);
      if (newWishlist.has(productId)) {
        newWishlist.delete(productId);
      } else {
        newWishlist.add(productId);
      }
      return newWishlist;
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

  const ProductCard = ({ product }) => {
    const isInWishlist = wishlist.has(product.id);
    
    return (
      <Card
        variant="elevated"
        height="100%"
        transition="all 0.3s"
        _hover={{ 
          transform: "translateY(-4px)",
          boxShadow: "xl",
        }}
        position="relative"
      >
        <CardBody p={4}>
          {/* Wishlist Button */}
          <IconButton
            icon={isInWishlist ? <FaHeart color="red" /> : <FaRegHeart />}
            position="absolute"
            top={2}
            right={2}
            aria-label="Add to wishlist"
            variant="ghost"
            colorScheme="red"
            onClick={() => toggleWishlist(product.id)}
            zIndex={1}
          />

          {/* Product Image */}
          <Box position="relative" mb={3}>
            <Image
              src={product.image}
              alt={product.title}
              boxSize="200px"
              objectFit="contain"
              mx="auto"
              borderRadius="lg"
              p={2}
              bg="white"
            />
            <Badge 
              colorScheme="blue" 
              position="absolute" 
              top={2} 
              left={2}
              variant="solid"
            >
              {product.category}
            </Badge>
          </Box>

          {/* Product Info */}
          <VStack align="start" spacing={2} flex="1">
            <Text fontWeight="bold" noOfLines={2} fontSize="md" lineHeight="short">
              {product.title}
            </Text>
            
            {/* Rating */}
            <HStack spacing={1}>
              {[...Array(5)].map((_, i) => (
                <StarIcon
                  key={i}
                  color={i < Math.round(product.rating.rate) ? "yellow.400" : "gray.300"}
                  boxSize={3}
                />
              ))}
              <Text fontSize="sm" color="gray.600">
                ({product.rating.count})
              </Text>
            </HStack>

            <Text 
              color="gray.600" 
              fontSize="sm" 
              noOfLines={3} 
              flex="1"
              lineHeight="short"
            >
              {product.description}
            </Text>

            {/* Price and Add to Cart */}
            <Flex justify="space-between" align="center" w="full" mt="auto">
              <VStack align="start" spacing={0}>
                <Text fontSize="xl" fontWeight="bold" color="blue.600">
                  ${product.price}
                </Text>
                {product.price > 100 && (
                  <Tag size="sm" colorScheme="green" variant="subtle">
                    <TagLabel>Free Shipping</TagLabel>
                  </Tag>
                )}
              </VStack>
              <Button
                colorScheme="blue"
                size="sm"
                onClick={() => addToCart(product)}
                leftIcon={<AddIcon />}
                variant="solid"
              >
                Add
              </Button>
            </Flex>
          </VStack>
        </CardBody>
      </Card>
    );
  };

  // Loading Skeleton (simplified)
  if (loading) {
    return (
      <Container maxW="container.xl" py={8}>
        <VStack spacing={8}>
          <Flex justify="space-between" align="center" w="full" wrap="wrap" gap={4}>
            <Heading size="lg">🛍️ Product Store</Heading>
            <Spinner size="lg" />
          </Flex>
          <SimpleGrid columns={[1, 2, 3, 4]} spacing={6} w="full">
            {[...Array(8)].map((_, i) => (
              <Card key={i} height="400px">
                <CardBody>
                  <Spinner />
                  <Text mt={4}>Loading product...</Text>
                </CardBody>
              </Card>
            ))}
          </SimpleGrid>
        </VStack>
      </Container>
    );
  }

  return (
    <Box minH="100vh" bg="gray.50" py={6}>
      <Container maxW="container.xl">
        {/* Header Section */}
        <VStack spacing={6} mb={8}>
          <Flex justify="space-between" align="center" w="full" wrap="wrap" gap={4}>
            <VStack align="start" spacing={1}>
              <Heading size="xl" color="blue.700">
                🛍️ Product Store
              </Heading>
              <Text color="gray.600">
                Discover {products.length} amazing products
              </Text>
            </VStack>
            
            <HStack spacing={3}>
              <Button
                colorScheme="blue"
                onClick={onOpen}
                leftIcon={<FaShoppingCart />}
                variant="solid"
                size="lg"
              >
                Cart ({getTotalItems()}) • ${getTotalPrice()}
              </Button>
            </HStack>
          </Flex>

          {/* Filters Section */}
          <Card variant="filled" w="full" bg="white">
            <CardBody>
              <Stack direction={['column', 'row']} spacing={4} align="flex-end">
                <VStack align="start" flex={1}>
                  <Text fontWeight="medium">Search Products</Text>
                  <InputGroup>
                    <InputLeftElement>
                      <SearchIcon color="gray.400" />
                    </InputLeftElement>
                    <Input
                      placeholder="Search by name, description, or category..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      variant="filled"
                    />
                  </InputGroup>
                </VStack>

                <VStack align="start">
                  <Text fontWeight="medium">Category</Text>
                  <Select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    variant="filled"
                    minW="150px"
                  >
                    <option value="all">All Categories</option>
                    {categories.map(category => (
                      <option key={category} value={category}>
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </option>
                    ))}
                  </Select>
                </VStack>

                <VStack align="start">
                  <Text fontWeight="medium">Sort By</Text>
                  <Select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    variant="filled"
                    minW="150px"
                  >
                    <option value="default">Default</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="rating">Highest Rated</option>
                    <option value="name">Name A-Z</option>
                  </Select>
                </VStack>
              </Stack>
            </CardBody>
          </Card>
        </VStack>

        {/* Results Info */}
        <Flex justify="space-between" align="center" mb={6}>
          <Text color="gray.600">
            Showing {filteredProducts.length} of {products.length} products
          </Text>
          {(searchTerm || selectedCategory !== "all") && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("all");
                setSortBy("default");
              }}
            >
              Clear filters
            </Button>
          )}
        </Flex>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <Alert status="info" borderRadius="md" variant="subtle">
            <AlertIcon />
            <Box>
              <AlertTitle>No products found!</AlertTitle>
              <AlertDescription>
                Try adjusting your search terms or category filter.
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
      </Container>
    </Box>
  );
}

export default ProductList;