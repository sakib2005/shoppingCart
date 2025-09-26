import React from "react";
import {
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  VStack,
  Text,
  Box,
  Flex,
  Button,
  Image,
  IconButton,
  HStack,
} from "@chakra-ui/react";
import { AddIcon, MinusIcon, DeleteIcon } from "@chakra-ui/icons";
import { useNavigate } from "react-router-dom";

const CartDrawer = ({
  isOpen,
  onClose,
  cart,
  updateQuantity,
  removeFromCart,
  getTotalItems,
  getTotalPrice,
}) => {
  const navigate = useNavigate();
  const CartItem = ({ item }) => (
    <Flex
      justify="space-between"
      align="center"
      p={3}
      borderBottom="1px"
      borderColor="gray.200"
    >
      <Image
        src={item.image}
        alt={item.title}
        boxSize="50px"
        objectFit="contain"
      />
      <Box flex="1" ml={3}>
        <Text fontWeight="medium" noOfLines={1}>
          {item.title}
        </Text>
        <Text color="teal.600" fontWeight="bold">
          ${item.price}
        </Text>
      </Box>
      <HStack>
        <IconButton
          icon={<MinusIcon />}
          size="xs"
          onClick={() => updateQuantity(item.id, item.quantity - 1)}
        />
        <Text mx={2}>{item.quantity}</Text>
        <IconButton
          icon={<AddIcon />}
          size="xs"
          onClick={() => updateQuantity(item.id, item.quantity + 1)}
        />
        <IconButton
          icon={<DeleteIcon />}
          size="xs"
          colorScheme="red"
          onClick={() => removeFromCart(item.id)}
          ml={2}
        />
      </HStack>
    </Flex>
  );

  return (
    <Drawer isOpen={isOpen} placement="right" onClose={onClose} size="md">
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader borderBottomWidth="1px">
          Shopping Cart ({getTotalItems()} items)
        </DrawerHeader>
        <DrawerBody>
          {cart.length === 0 ? (
            <Text textAlign="center" mt={10} color="gray.500">
              Your cart is empty
            </Text>
          ) : (
            <VStack align="stretch" spacing={4}>
              {cart.map((item) => (
                <CartItem key={item.id} item={item} />
              ))}
              <Box borderTop="2px" borderColor="gray.200" pt={4}>
                <Flex justify="space-between" fontWeight="bold" fontSize="xl">
                  <Text>Total:</Text>
                  <Text color="teal.600">${getTotalPrice()}</Text>
                </Flex>
                <Button
                  colorScheme="green"
                  size="lg"
                  w="100%"
                  mt={4}
                  onClick={() => {
                    onClose(); // close drawer
                    navigate("/checkout"); // go to checkout page
                  }}
                >
                  Checkout
                </Button>
              </Box>
            </VStack>
          )}
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};

export default CartDrawer;
