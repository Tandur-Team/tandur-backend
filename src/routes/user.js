const express = require('express');
const router = express.Router();

const UserController = require('../controllers/user');
const checkAuth = require('../middleware/check-auth');

router.post('/signup', UserController.user_signup);

router.post('/login', UserController.user_login);

router.get('/', checkAuth, UserController.user_get_all);

router.get('/:userId', checkAuth, UserController.user_get_detail);

router.post('/:userId/plant', checkAuth, UserController.user_add_myplant);

router.get('/:userId/plant', checkAuth, UserController.user_get_all_myplant);

router.get('/:userId/plant/:plantId', checkAuth, UserController.user_get_myplant_detail);

router.patch('/:userId/plant/:plantId', checkAuth, UserController.user_harvest_myplant);

module.exports = router;