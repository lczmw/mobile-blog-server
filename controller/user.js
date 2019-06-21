const model = require('../lib/mysql.js');
const config = require('../config');
const md5 = require('md5');
const { checkLogin } = require('../middlewares');
const moment = require('moment');
const fs = require('fs');
const path = require('path');

const register = async (ctx, next) => {
  let { name, password } = ctx.request.body;
  let files = ctx.request.files;
  if (!name || !password || JSON.stringify(files) === '{}') {
    ctx.body = {
      code: 502,
      message: '缺少必要参数'
    };
    return;
  }

  let user = await model.findDataCountByName(name);

  if (user[0].count > 0) {
    ctx.body = {
      code: 500,
      message: '用户存在'
    };
  } else {
    let { avatar } = ctx.request.files;
    let rootPath = path.resolve(__dirname, '..', config.staticPath);
    let avatarPath = (avatar.path || '').replace(rootPath, '');

    let result = await model.insertData([name, md5(password), avatarPath, moment().format('YYYY-MM-DD HH:mm:ss')]);
    //console.dir(`result:${JSON.stringify(result)}`)
    if (result) {
      ctx.body = {
        code: 200,
        message: '注册成功'
      };
    } else {
      ctx.body = {
        code: 500,
        message: '注册失败'
      };
    }
  }
};

const login = async ctx => {
  let { name, password } = ctx.request.body;

  if (!name || !password) {
    ctx.body = {
      code: 500,
      message: '缺少必要参数'
    };
    return;
  }

  let user = await model.findUserByName(name);

  // console.log(JSON.stringify(user))
  // console.log(user.length)
  if (user.length > 0 && md5(password) === user[0]['pass']) {
    ctx.session = {
      username: user[0]['name'],
      id: user[0]['id']
    };
    ctx.body = {
      code: 200,
      message: '登录成功'
    };
  } else {
    ctx.body = {
      code: 500,
      message: '用户名或密码错误'
    };
  }
};

const auth = async ctx => {
  let isLogin = checkLogin(ctx);
  if (isLogin) {
    ctx.body = {
      code: 200,
      data: {}
    };
  } else {
    ctx.body = {
      code: 500,
      data: {}
    };
  }
};

module.exports = {
  register,
  login,
  auth
};
