const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const getUserId = require('../options/getUserId');

const Mutation = {
    createPost(parent, args, { prisma,request}, info) {
      const userId = getUserId(request)
      // console.log(userId) 投稿するユーザーのID
      // データベースにデータを追加
      return prisma.createPost({
          ...args.data,
          postedUser: {
              connect: {
                  id: userId
              }
         }
       });
  },
  async updatePost(parent, args, { prisma,request }, info) {
      const { id } = args
      // データベース内のデータの内容を更新
      return prisma.updatePost({
          where:{
              id: id,
          },
          data:{
              ...args.data,
          }
      })
  },
  async deletePost(parent, args, { pubsub,prisma,request }, info) {
      const { id } = args
      // データベースから該当のデータを削除
      return prisma.deletePost({
          id: id
      })
  },
      async createUser(parent, args, { prisma }, info) {
          const { data: { email, name, password } } = args;
          const user = await prisma.createUser({
            email,
            name,
            // bcryptでパスワードをハッシュ化
            password: bcrypt.hashSync(password, 10)
          });
        return {
            user,
            // サーバーがJWTトークンを発行
            token: jwt.sign(user.id, process.env.JWT_SECRET)
        }
    },
    async login(parent, args, { prisma }, info) {
      const { data: { email, password } } = args;
      // メールアドレスと照合
      const [ user ] = await prisma.users({
       where: {
         email
       }
     })
     if (!user) throw new Error('Unable to Login');
      // パスワードと照合
     const isMatch = bcrypt.compareSync(password, user.password);
     if (!isMatch) throw new Error('Unable to Login');
     return {
         user,
         token : jwt.sign(user.id, process.env.JWT_SECRET)
      };
    },
  }
  
  module.exports = Mutation