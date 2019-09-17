const mongoose = require('mongoose');
const dotenv = require('dotenv');
const env = process.env.NODE_ENV || 'dev';

if (env === 'dev') {
  dotenv.config({ path: '.env.dev' });
} else {
  dotenv.config({ path: '.env.prod' });
}

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGO_DB_URI, {
  useNewUrlParser:true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
});
