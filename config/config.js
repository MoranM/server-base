module.exports = {
    port: process.env.PORT || 3300,
    secret: process.env.JWT_SECRET || "----your_secret_key-----",
    db: process.env.MONGODB|| 'mongodb://localhost:27017/seocheck',
    dbLog: process.env.MONGODB|| 'mongodb://localhost:27017/logs'

}