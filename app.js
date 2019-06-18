const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const session = require('koa-session-minimal');
const MysqlStore = require('koa-mysql-session');
const config = require('./config');
const router = require('koa-router');
const staticCache = require('koa-static-cache');
const app = new Koa();
const cors = require('koa2-cors');
const http = require('http').createServer(app.callback());
const io = require('socket.io')(http);

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
  store: new MysqlStore(sessionMysqlConfig),
  cookie: {
  	httpOnly: false,
  }
}))

app.use(cors({
	credentials: true,
}));
app.use(bodyParser());

//  路由
app.use(require('./router/user.js').routes())
app.use(require('./router/article.js').routes())
// app.use(require('./routers/posts.js').routes())
// app.use(require('./routers/signout.js').routes())

http.listen(config.port)



io.on('connection', function(socket){
  console.log('a user connected');

  socket.on('disconnect', function(){
    console.log('user disconnected');
  });

  socket.on('test message', function(msg){
    console.log('message: ' + msg);
  });
});

console.log(`listening on port ${config.port}`)
