const Router = require('koa-router');
const router = new Router();
const controller = require('../controller/user')

router.post('/user/register', controller.register)

module.exports = router