const {ApolloServer,PubSub} = require('apollo-server');
const Query = require('./resolver/Query')
const Mutation = require('./resolver/Mutation')
const Subscription = require('./resolver/Subscription')
const User = require('./resolver/User')
const Post = require('./resolver/Post')
const typeDefs = require('./schema')
// datamodel.prismaファイルから生成されたPrismaインスタンス
const { prisma } = require('./prisma/generated/prisma-client')
//PubSubのインスタンスを作成,サブスクリプションが利用可能に！
const pubsub = new PubSub()

const server = new ApolloServer({
    typeDefs: typeDefs,
    resolvers: {
        Query,
        Mutation,
        Subscription,
        User,
        Post
    },
    context(request) {
        return {
            pubsub,
            prisma,
            request
        }
    },
    introspection: true,
    playground: true,
})

server.listen({port:process.env.PORT|| 4000}).then(({ url, subscriptionsUrl }) => {
    console.log(`🚀 Server ready at ${url}`);
    console.log(`🚀 Subscriptions ready at ${subscriptionsUrl}`);
  });