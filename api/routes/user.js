const express = require('express');
const router = express.Router();

const UserController = require('../controllers/user');
const checkAuth = require('../middleware/check-auth');

router.post('/:userId/plant', checkAuth, UserController.user_add_myplant);

router.get('/:userId/plant', checkAuth, UserController.user_get_all_myplant);

router.patch('/:userId/plant/:plantId', checkAuth, UserController.user_harvest_myplant);

module.exports = router;