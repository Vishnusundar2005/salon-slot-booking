const Service = require('../models/Service');

// @desc    Get all active services
// @route   GET /api/services
// @access  Public
const getAllServices = async (req, res) => {
  try {
    const services = await Service.find({ isActive: true });
    res.json(services);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single service by ID
// @route   GET /api/services/:id
// @access  Public
const getServiceById = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) return res.status(404).json({ message: 'Service not found' });
    res.json(service);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new service
// @route   POST /api/services
// @access  Private/Admin
const createService = async (req, res) => {
  try {
    const { name, description, price, duration, category } = req.body;
    const service = await Service.create({ name, description, price, duration, category });
    res.status(201).json(service);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update a service
// @route   PUT /api/services/:id
// @access  Private/Admin
const updateService = async (req, res) => {
  try {
    const service = await Service.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!service) return res.status(404).json({ message: 'Service not found' });
    res.json(service);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete (soft-delete) a service
// @route   DELETE /api/services/:id
// @access  Private/Admin
const deleteService = async (req, res) => {
  try {
    const service = await Service.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );
    if (!service) return res.status(404).json({ message: 'Service not found' });
    res.json({ message: 'Service deactivated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getAllServices, getServiceById, createService, updateService, deleteService };
