module.exports = {
    checkLogin: (ctx) => {
        if (ctx.session) {
            return !!(ctx.session.username)
        } else {
            return false
        }
    }
}