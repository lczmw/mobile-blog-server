const model = require('../lib/mysql.js');
const { checkLogin } = require('../middlewares');
const moment = require('moment');
const fs = require('fs');
const path = require('path');
const config = require('../config');

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
    let result = await model.insertArticle([username, title, content, id, time]);
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

  result.forEach(item => {
    if (!moment(item.moment).isBefore(moment(), 'day')) {
      //发表时间不是今天
      item.moment = moment(item.moment).format('HH:mm:ss');
    }

    if (item.avatar) {
      item.avatar = `${config.staticOrigin}${item.avatar}`;
    } else {
      item.avatar = `${config.staticOrigin}${config.defaultAvatar}`;
    }
  });
  ctx.body = {
    code: 200,
    data: result
  };
};

const getDetail = async ctx => {
  let { id } = ctx.request.body;
  if (!id) {
    ctx.body = {
      code: 502,
      message: '缺少必要参数'
    };
    return;
  }

  try {
    let posts = await model.findPostById(id);
    let post = posts[0];
    if (post.avatar) {
      post.avatar = `${config.staticOrigin}${post.avatar}`;
    } else {
      post.avatar = `${config.staticOrigin}${config.defaultAvatar}`;
    }
    if (!moment(post.moment).isBefore(moment(), 'day')) {
      //发表时间不是今天
      post.moment = moment(post.moment).format('HH:mm:ss');
    }
    let data = {
      ...post
    };
    ctx.body = {
      data,
      code: 200
    };
  } catch (error) {
    ctx.body = {
      code: 500,
      message: '查询错误'
    };
  }
};

const getComments = async ctx => {
  let { id } = ctx.request.body;
  if (!id) {
    ctx.body = {
      code: 502,
      message: '缺少必要参数'
    };
    return;
  }

  try {
    let comments = await model.findCommentById(id);
    comments.map(item => {
      item.avatar = item.avatar ? `${config.staticOrigin}${item.avatar}` : `${config.staticOrigin}${config.defaultAvatar}`;
      if (!moment(item.moment).isBefore(moment(), 'day')) {
        //发表时间不是今天
        item.moment = moment(item.moment).format('HH:mm:ss');
      }
    });
    ctx.body = {
      code: 200,
      data: comments
    };
  } catch (error) {
    ctx.body = {
      code: 500,
      message: '查询错误'
    };
  }
};

const comment = async ctx => {
  let isLogin = checkLogin(ctx);
  if (!isLogin) {
    ctx.body = {
      code: 501,
      message: '请登录'
    };
    return;
  }
  let { content, id } = ctx.request.body;
  if (!content || !id) {
    ctx.body = {
      code: 502,
      message: '缺少必要参数'
    };
    return;
  }

  try {
    let floor = await model.findCommentMaxFloorByPostid([id]);
    let max = floor[0].max;
    let nextMax = max ? max + 1 : 1;
    await model.insertComment([content, moment().format('YYYY-MM-DD HH:mm:ss'), ctx.session.id, id, nextMax]);
    ctx.body = {
      code: 200,
      message: '发表成功'
    };
  } catch (error) {
    ctx.body = {
      code: 500,
      message: '查询错误'
    };
  }
};

module.exports = {
  release,
  getAll,
  getDetail,
  getComments,
  comment
};
