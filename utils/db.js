const mongoose = require('mongoose')
      keys     = require('config');

const Mockgoose = require('mockgoose').Mockgoose;
const mockgoose = new Mockgoose(mongoose);

const db = keys.get('mongoURI');

const connectDevDB = async () => {
    try {
        mockgoose.prepareStorage().then(function() {
            mongoose.connect(db, {
                useNewUrlParser: true,
                useCreateIndex: true,
                useUnifiedTopology: true,
                useFindAndModify: false
            });
        });
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
}

const connectDB = async () => {
    try {
        await mongoose.connect(db, {
            useNewUrlParser: true,
            useCreateIndex: true,
            useUnifiedTopology: true,
            useFindAndModify: false
        });
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
};

const disconnectDB = async () => {
    try {
        if(mongoose.connection.readyState !== 0) {
            await mockgoose.helper.reset();
            await mongoose.disconnect();
        }
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
};

module.exports = { connectDevDB, connectDB, disconnectDB };