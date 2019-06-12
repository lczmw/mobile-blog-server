const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const session = require('koa-session-minimal');
const MysqlStore = require('koa-mysql-session');
const config = require('./config');
const router = require('koa-router')
const staticCache = require('koa-static-cache')
const app = new Koa()


// session存储配置
const sessionMysqlConfig= {
  user: config.database.USERNAME,
  password: config.database.PASSWORD,
  database: config.database.DATABASE,
  host: config.database.HOST,
}

// 配置session中间件
app.use(session({
  key: 'USER_SID',
  store: new MysqlStore(sessionMysqlConfig)
}))

app.use(bodyParser());

//  路由
app.use(require('./router/user.js').routes())
// app.use(require('./routers/signup.js').routes())
// app.use(require('./routers/posts.js').routes())
// app.use(require('./routers/signout.js').routes())

app.listen(config.port)

console.log(`listening on port ${config.port}`)
