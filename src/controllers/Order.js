const OrderModel = require('../models/Order');

const mockPayment = async ({ user_id, total_price, paymentMode }) => {
  await new Promise(resolve => setTimeout(resolve, 500)); // Simulated delay
  return {
    success: true,
    transactionId: `MOCK-${Date.now()}`,
    message: 'Payment processed successfully via mock gateway'
  };
};

exports.create = async (req, res) => {
  try {
    const { user_id, product_id, address_id, unit, total_price, status, paymentMode } = req.body;

    // Step 1: Mock payment
    const paymentResult = await mockPayment({ user_id, total_price, paymentMode });

    if (!paymentResult.success) {
      return res.status(402).json({ message: 'Payment failed', ...paymentResult });
    }

    // Step 2: Create order via model
    const newOrder = await OrderModel.create({
      user_id,
      product_id,
      address_id,
      unit,
      total_price,
      status,
      paymentMode
    });

    res.status(201).json({
      ...newOrder,
      paymentStatus: 'success',
      transactionId: paymentResult.transactionId
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating order, please try again later' });
  }
};

exports.updateById = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedOrder = await OrderModel.updateById(id, req.body);

    if (!updatedOrder) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.status(200).json(updatedOrder);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating order, please try again later' });
  }
};

exports.getByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const orders = await OrderModel.getByUserId(userId);
    res.status(200).json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error getting orders, please try again later' });
  }
};

exports.getAll = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const result = await OrderModel.getAll(parseInt(page), parseInt(limit));
    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error getting orders, please try again later' });
  }
};

exports.getSalesSummary = async (req, res) => {
  try {
    const summary = await OrderModel.getSalesSummary();
    res.status(200).json(summary);
  } catch (error) {
    console.error('Error fetching sales summary:', error);
    res.status(500).json({ message: 'Error fetching sales summary' });
  }
};
