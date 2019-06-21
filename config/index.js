const config = {
  // 启动端口
  port: 3000,
  // 数据库配置
  database: {
    DATABASE: 'mobile_blog',
    USERNAME: 'root',
    PASSWORD: 'sbtx6666',
    PORT: '3306',
    HOST: 'localhost'
  },

  routerPrefix: '/blog',
  uploadPath: 'static/upload',
  staticPath: 'static',
  staticOrigin: 'http://localhost:3000',
  defaultAvatar: '/images/default_avatar.jpg'
};

module.exports = config;
