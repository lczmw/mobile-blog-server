const Koa = require('koa');
const path = require('path');
const bodyParser = require('koa-body');
const session = require('koa-session-minimal');
const MysqlStore = require('koa-mysql-session');
const config = require('./config');
const app = new Koa();
const cors = require('koa2-cors');
// const http = require('http').createServer(app.callback());
// const io = require('socket.io')(http);
const static = require('koa-static');

// session存储配置
const sessionMysqlConfig = {
  user: config.database.USERNAME,
  password: config.database.PASSWORD,
  database: config.database.DATABASE,
  host: config.database.HOST
};

// 配置session中间件
app.use(
  session({
    key: 'USER_SID',
    store: new MysqlStore(sessionMysqlConfig),
    cookie: {
      httpOnly: false
    }
  })
);

app.use(
  cors({
    credentials: true
  })
);
app.use(
  bodyParser({
    multipart: true,
    formidable: {
      uploadDir: path.join(__dirname, config.uploadPath), // 设置文件上传目录
      keepExtensions: true, // 保持文件的后缀
      maxFieldsSize: 2 * 1024 * 1024, // 文件上传大小
      onFileBegin: (name, file) => {
        // 文件上传前的设置
        // console.log(`name: ${name}`);
        // console.log(file);
      }
    }
  })
);

app.use(static(path.join(__dirname, config.staticPath)));

//  路由
app.use(require('./router/user.js').routes());
app.use(require('./router/article.js').routes());
// app.use(require('./routers/posts.js').routes())
// app.use(require('./routers/signout.js').routes())

app.listen(config.port);

// io.on('connection', function(socket) {
//   console.log('a user connected');

//   socket.on('disconnect', function() {
//     console.log('user disconnected');
//   });

//   socket.on('test message', function(msg) {
//     console.log('message: ' + msg);
//   });
// });

console.log(`listening on port ${config.port}`);
