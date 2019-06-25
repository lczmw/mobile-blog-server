const { routerPrefix } = require('../config');
const Router = require('koa-router');
const router = new Router({
  prefix: routerPrefix
});
const controller = require('../controller/user');

router.post('/user/register', controller.register);
router.post('/user/login', controller.login);
router.post('/user/auth', controller.auth);
router.post('/user/getLoginInfo', controller.getLoginInfo);
router.post('/user/logout', controller.logout);

module.exports = router;
