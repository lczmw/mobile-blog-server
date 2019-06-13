const Router = require('koa-router');
const router = new Router();
const controller = require('../controller/user')

router.post('/user/register', controller.register);
router.post('/user/login', controller.login);
router.post('/user/auth', controller.auth);

module.exports = router