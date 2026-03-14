const express = require('express');
const router = express.Router();
const {
  getAllServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
} = require('../controllers/serviceController');
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');

router.get('/', getAllServices);
router.get('/:id', getServiceById);
router.post('/', protect, adminOnly, createService);
router.put('/:id', protect, adminOnly, updateService);
router.delete('/:id', protect, adminOnly, deleteService);

module.exports = router;
