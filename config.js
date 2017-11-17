module.exports = {
    port: process.env.PORT || 3300,
    secret: process.env.JWT_SECRET || "$$secret-21-12$$11-7-24-30-MLAE$$$",
    db: process.env.MONGODB|| 'mongodb://localhost:27017/seocheck',
    dbLog: process.env.MONGODB|| 'mongodb://localhost:27017/logs'
}