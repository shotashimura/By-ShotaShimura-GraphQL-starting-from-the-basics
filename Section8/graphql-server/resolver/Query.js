const Query = {
        users: async (root, args, { prisma }, info) => {
            try {
                // Userテーブルの中身を全て取得
                return prisma.users();
              } catch (error) {
                throw error;
              }
        },
        posts(parent, args, { prisma }, info) {
            try {
              // Postテーブルの中身を全て取得
              return prisma.posts();
            } catch (error) {
              throw error;
            }
        }
    }

module.exports  = Query