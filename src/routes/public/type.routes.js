const express = require('express');
const router = express.Router();
const { typeController } = require('../../controllers/index');

router.get('/', typeController.getAllTypes);

module.exports = router;