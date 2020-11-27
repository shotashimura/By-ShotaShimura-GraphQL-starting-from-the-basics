const Post = {
    // type PostでリレーションをしたpostedUserフィールドの情報取得
    postedUser(parent, args, { prisma,request }, info) {
            return prisma.post({ id: parent.id }).postedUser()
          }
}

module.exports = Post;