const Query = {
  users: async (root, args, { prisma}, info) => { 
      try {
          return prisma.users();
        } catch (error) {
          throw error;
        }
  },
  posts(parent, args, { db }, info) {
      if (!args.query) {
          return db.post
      }else{
          return db.posts.filter((post) => {
          const isTitleMatch = post.title.toLowerCase().includes(args.query.toLowerCase())
          const isAuthorMatch = post.author.toLowerCase().includes(args.query.toLowerCase())
          return isTitleMatch || isAuthorMatch
      })
         }
        }
}

module.exports  = Query