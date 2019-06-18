const { routerPrefix } = require('../config');
const Router = require('koa-router');
const router = new Router({
  prefix: routerPrefix
});
const controller = require('../controller/article');

router.post('/article/release', controller.release);
router.post('/article/getAll', controller.getAll);

module.exports = router;
