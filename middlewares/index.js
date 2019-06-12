module.exports = {
    isLogin: (ctx) => {
        if (ctx.session) {
            return !!(ctx.session.user)
        } else {
            return false
        }
    }
}