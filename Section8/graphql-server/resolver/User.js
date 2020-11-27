const getUserId = require('../options/getUserId');

const User = {
    // type Userでリレーションをしたpostsフィールドの情報取得
    posts(parent, args, { prisma,request }, info) {
            return prisma.user({ id: parent.id }).posts()
     }
}

module.exports = User;