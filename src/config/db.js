const mongoose = require("mongoose")

function connectDB() {
    if (!process.env.MONGO_URI) {
        throw new Error("MONGO_URI is not defined in environment variables")
    }

    mongoose.connect(process.env.MONGO_URI)
        .then((conn) => {
            console.log(`✅ MongoDB Connected`)
            console.log(`Host: ${conn.connection.host}`)
            console.log(`DB Name: ${conn.connection.name}`)
        })
        .catch((error) => {
            console.error("❌ Database connection failed:")
            console.error(error.message)
            process.exit(1)
        })
}

module.exports = connectDB
