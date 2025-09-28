import {
  Box,
  Heading,
  VStack,
  HStack,
  Text,
  Image,
  Divider,
  Button,
  Card,
  CardBody,
  Grid,
  GridItem,
  Badge,
  useBreakpointValue,
} from "@chakra-ui/react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { FaCreditCard, FaShoppingBag, FaChartPie } from "react-icons/fa";
import { generateBill } from "./generateBill";
// Improved color palette with better accessibility
const COLORS = [
  "#3182CE",
  "#38A169",
  "#D69E2E",
  "#E53E3E",
  "#805AD5",
  "#DD6B20",
  "#319795",
];

// Custom legend with improved styling
const RenderLegend = ({ payload }) => (
  <VStack align="start" spacing={2} p={3} bg="gray.50" borderRadius="md">
    {payload.map((entry, index) => (
      <HStack key={`item-${index}`} spacing={2}>
        <Box w={3} h={3} bg={entry.color} borderRadius="sm" />
        <Text fontSize="sm" fontWeight="medium">
          {entry.value}
        </Text>
        <Badge colorScheme="gray" fontSize="xs">
          {entry.payload.value} items
        </Badge>
      </HStack>
    ))}
  </VStack>
);

const RenderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
}) => {
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.3;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="black" // changed to black
      textAnchor="middle"
      dominantBaseline="central"
      fontSize="11"
      fontWeight="bold"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

// Custom tooltip
const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <Card variant="elevated" p={2}>
        <Text fontWeight="bold">{payload[0].name}</Text>
        <Text color="blue.600">{payload[0].value} items</Text>
        <Text fontSize="sm" color="gray.600">
          {((payload[0].value / payload[0].payload.total) * 100).toFixed(1)}% of
          order
        </Text>
      </Card>
    );
  }
  return null;
};

export default function Checkout({ cart }) {
  const chartSize = useBreakpointValue({ base: 250, md: 300 });
  const isMobile = useBreakpointValue({ base: true, md: false });

  const categoryData = Object.values(
    cart.reduce((acc, item) => {
      acc[item.category] = acc[item.category] || {
        name: item.category,
        value: 0,
        total: cart.reduce((sum, i) => sum + i.quantity, 0),
      };
      acc[item.category].value += item.quantity;
      return acc;
    }, {})
  );

  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <Box p={{ base: 4, md: 6 }} maxW="6xl" mx="auto">
      {/* Header Section */}
      <VStack spacing={3} align="start" mb={6}>
        <HStack spacing={3}>
          <Box p={2} bg="blue.100" borderRadius="lg">
            <FaShoppingBag color="#3182CE" />
          </Box>
          <Heading size="lg" color="gray.700">
            Order Summary
          </Heading>
        </HStack>
        <Text color="gray.600" fontSize="lg">
          Review your {totalItems} item{totalItems !== 1 ? "s" : ""} before
          payment
        </Text>
      </VStack>

      <Grid templateColumns={{ base: "1fr", lg: "2fr 1fr" }} gap={6}>
        <GridItem>
          <Card variant="elevated" mb={6}>
            <CardBody>
              <VStack align="stretch" spacing={4}>
                {cart.map((item, index) => (
                  <Box key={index}>
                    <HStack spacing={4} align="start">
                      <Image
                        src={item.image}
                        alt={item.title}
                        boxSize="70px"
                        objectFit="contain"
                        borderRadius="lg"
                        border="1px solid"
                        borderColor="gray.200"
                        p={1}
                      />
                      <VStack align="start" spacing={1} flex={1}>
                        <Text fontWeight="semibold" noOfLines={2}>
                          {item.title}
                        </Text>
                        <Badge colorScheme="blue" variant="subtle">
                          {item.category}
                        </Badge>
                        <Text fontSize="sm" color="gray.600">
                          Quantity: {item.quantity}
                        </Text>
                      </VStack>
                      <VStack align="end" spacing={1}>
                        <Text fontWeight="bold" color="blue.600">
                          ${(item.price * item.quantity).toFixed(2)}
                        </Text>
                        <Text fontSize="sm" color="gray.500">
                          ${item.price.toFixed(2)} each
                        </Text>
                      </VStack>
                    </HStack>
                    {index < cart.length - 1 && <Divider mt={4} />}
                  </Box>
                ))}
              </VStack>
            </CardBody>
          </Card>
        </GridItem>

        <GridItem>
          <VStack spacing={6}>
            {/* Chart Card */}
            <Card variant="elevated" w="full">
              <CardBody>
                <VStack spacing={5}>
                  <HStack spacing={2} color="gray.600">
                    <FaChartPie />
                    <Text fontWeight="semibold">Category Breakdown</Text>
                  </HStack>

                  <Box w="full" h={chartSize}>
                    <ResponsiveContainer>
                      <PieChart>
                        <Pie
                          data={categoryData}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          outerRadius={isMobile ? 80 : 100}
                          innerRadius={isMobile ? 40 : 60}
                          labelLine={false}
                          label={RenderCustomizedLabel}
                        >
                          {categoryData.map((_, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={COLORS[index % COLORS.length]}
                            />
                          ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                        {!isMobile && <Legend content={RenderLegend} />}
                      </PieChart>
                    </ResponsiveContainer>
                  </Box>
                </VStack>
              </CardBody>
            </Card>

            {/* Payment Card */}
            <Card variant="elevated" w="full">
              <CardBody>
                <VStack spacing={4}>
                  <VStack spacing={2} w="full">
                    <HStack justify="space-between" w="full">
                      <Text>Subtotal ({totalItems} items)</Text>
                      <Text>${total.toFixed(2)}</Text>
                    </HStack>
                    <HStack justify="space-between" w="full">
                      <Text>Shipping</Text>
                      <Text color="green.500">Free</Text>
                    </HStack>
                    <HStack justify="space-between" w="full">
                      <Text>Tax</Text>
                      <Text>${(total * 0.08).toFixed(2)}</Text>
                    </HStack>
                    <Divider />
                    <HStack
                      justify="space-between"
                      w="full"
                      fontSize="lg"
                      fontWeight="bold"
                    >
                      <Text>Total</Text>
                      <Text color="blue.600">${(total * 1.08).toFixed(2)}</Text>
                    </HStack>
                  </VStack>
                  <Button
                    colorScheme="blue"
                    size="lg"
                    w="full"
                    leftIcon={<FaCreditCard />}
                    mt={2}
                    onClick={() => generateBill(cart, total, totalItems)} // call here
                  >
                    Pay ${(total * 1.08).toFixed(2)}
                  </Button>

                  <Text fontSize="xs" color="gray.500" textAlign="center">
                    By completing your purchase you agree to our terms of
                    service
                  </Text>
                </VStack>
              </CardBody>
            </Card>
          </VStack>
        </GridItem>
      </Grid>
    </Box>
  );
}
