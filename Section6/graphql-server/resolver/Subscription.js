const Subscription = {
    post: {
        subscribe(parent, args, { pubsub }, info) {
            return pubsub.asyncIterator('post')
        }
    }
}

module.exports = Subscription