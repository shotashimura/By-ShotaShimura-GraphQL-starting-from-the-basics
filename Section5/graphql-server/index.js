const {ApolloServer,PubSub} = require('apollo-server');
const Query = require('./resolver/Query')
const Mutation = require('./resolver/Mutation')
const Subscription = require('./resolver/Subscription')
const typeDefs = require('./schema')
const db = require('./db')
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
    },
    context: {
        prisma,
        pubsub,
        db
    }
})

server.listen().then(({ url, subscriptionsUrl }) => {
    console.log(`🚀 Server ready at ${url}`);
    console.log(`🚀 Subscriptions ready at ${subscriptionsUrl}`);
  });