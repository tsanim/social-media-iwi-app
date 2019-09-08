module.exports = {
    development: {
        port: process.env.PORT || 9999,
        mongoUrl: 'mongodb://tsanio:0876703532@cluster0-shard-00-00-p2zvs.mongodb.net:27017,cluster0-shard-00-01-p2zvs.mongodb.net:27017,cluster0-shard-00-02-p2zvs.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true&w=majority',
        defaultUserImage: '5d752dd7492b893b84223fd4'
    },
    production: {
        port: process.env.PORT,
        mongoUrl: process.env.PROD_MONGODB,
        defaultUserImage: '5d752dd7492b893b84223fd4'
    }
}