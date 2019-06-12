const model = require('../lib/mysql.js');
const md5 = require('md5')
const { isLogin } = require('../middlewares')
const moment = require('moment');
const fs = require('fs')

const register = async ( ctx, next ) => {
	let { name, password } = ctx.request.body;
	let user = await model.findDataCountByName(name);
	
	if (user[0].count > 1) {
		console.log(123123)
		ctx.body = {
			code: 500,
            message: '用户存在',
		}
		
	} else {
		let result = await model.insertData([name, md5(password), moment().format('YYYY-MM-DD HH:mm:ss')]);
		console.log(`result:${result}`)
		if (result) {
			ctx.body = {
	            code: 200,
	            message: '注册成功'
	        };
		}else {
			ctx.body = {
	            code: 500,
	            message: '注册失败'
	        };
		}
	}
	

}

module.exports = {
	register
}