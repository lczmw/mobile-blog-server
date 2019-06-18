const model = require('../lib/mysql.js');
const md5 = require('md5');
const { checkLogin } = require('../middlewares');
const moment = require('moment');
const fs = require('fs');

const release = async ctx => {
  let isLogin = checkLogin(ctx);
  if (!isLogin) {
    ctx.body = {
      code: 501,
      message: '请登录'
    };
    return;
  }
  let { title, content } = ctx.request.body;
  if (!title || !content) {
    ctx.body = {
      code: 502,
      message: '缺少必要参数'
    };
    return;
  }

  let { username, id } = ctx.session;
  let time = moment().format('YYYY-MM-DD HH:mm:ss');

  try {
    let result = await model.insertArticle([username, title, content, id, time, username]);
    ctx.body = {
      code: 200,
      message: '发布成功'
    };
  } catch (error) {
    ctx.body = {
      error,
      code: 500
    };
  }
};

const getAll = async ctx => {
  let { pageIndex, pageSize } = ctx.request.body;
  let result = await model.findAllPost(pageIndex, pageSize);
  ctx.body = {
    code: 200,
    data: result
  };
};

module.exports = {
  release,
  getAll
};
