const Mutation = {
    createPost(parent, args, { db, pubsub }, info) {
        const postNumTotal = String(db.posts.length + 1)
        const post = {
            id: postNumTotal,
            ...args.data
        }

        //模擬データベース更新
        db.posts.push(post)
        //サブスクリプション着火、トピック名とデータを指定
        pubsub.publish('post', { 
                post: {
                    mutation: 'CREATED',
                    data: post
                }
             })
        return post
    },
    updatePost(parent, args, { db, pubsub }, info) {
        const { id, data } = args
        const post = db.posts.find((post) => post.id === id)
        if (!post) {
            throw new Error('Post not found')
        }

        if (typeof data.title === 'string' && typeof data.author === 'string') {
            //模擬データベース更新
            post.title = data.title
            post.author = data.author
            //サブスクリプション着火、トピック名とデータを指定
            pubsub.publish('post', {
            post: {
                mutation: 'UPDATED',
                data: post
            }
        })
        }

        return post
    },
    deletePost(parent, args, { db, pubsub }, info) {
        const post = db.posts.find((post) => post.id === args.id)
        const postIndex = db.posts.findIndex((post) => post.id === args.id)

        if (postIndex === -1) {
            throw new Error('Post not found')
        }
        //模擬データベース更新
        db.posts.splice(postIndex, 1)
        //サブスクリプション着火、トピック名とデータを指定
        pubsub.publish('post', {
                post: {
                    mutation: 'DELETED',
                    data: post
                }
            })
        return post
    },
}

module.exports  = Mutation