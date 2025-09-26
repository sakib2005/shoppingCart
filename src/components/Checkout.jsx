import React from "react";
import {
  Box,
  Heading,
  Text,
  VStack,
  HStack,
  Divider,
  Input,
  Button,
  FormControl,
  FormLabel,
  Select,
  Flex,
} from "@chakra-ui/react";

function Checkout({ cart, getTotalPrice }) {
  return (
    <Box p={10} minH="100vh" bg="gray.50">
      <Heading mb={6}>🧾 Checkout</Heading>

      <Flex direction={["column", "row"]} gap={10}>
        {/* Order Summary */}
        <Box flex="1" bg="white" p={6} borderRadius="lg" shadow="md">
          <Heading size="md" mb={4}>
            Order Summary
          </Heading>
          <VStack spacing={4} align="stretch">
            {cart.map((item) => (
              <HStack key={item.id} justify="space-between">
                <Text noOfLines={1}>
                  {item.title} × {item.quantity}
                </Text>
                <Text fontWeight="bold">${(item.price * item.quantity).toFixed(2)}</Text>
              </HStack>
            ))}
            <Divider />
            <HStack justify="space-between" fontWeight="bold">
              <Text>Total:</Text>
              <Text color="teal.600">${getTotalPrice()}</Text>
            </HStack>
          </VStack>
        </Box>

        {/* Shipping Details */}
        <Box flex="1" bg="white" p={6} borderRadius="lg" shadow="md">
          <Heading size="md" mb={4}>
            Shipping Details
          </Heading>
          <VStack spacing={4} align="stretch">
            <FormControl>
              <FormLabel>Full Name</FormLabel>
              <Input placeholder="John Doe" />
            </FormControl>
            <FormControl>
              <FormLabel>Email</FormLabel>
              <Input type="email" placeholder="johndoe@email.com" />
            </FormControl>
            <FormControl>
              <FormLabel>Address</FormLabel>
              <Input placeholder="123 Main St, City, Country" />
            </FormControl>
            <FormControl>
              <FormLabel>Payment Method</FormLabel>
              <Select>
                <option value="credit">Credit Card</option>
                <option value="paypal">PayPal</option>
                <option value="cod">Cash on Delivery</option>
              </Select>
            </FormControl>
            <Button colorScheme="teal" size="lg" mt={4}>
              Place Order
            </Button>
          </VStack>
        </Box>
      </Flex>
    </Box>
  );
}

export default Checkout;
