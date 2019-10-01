const dotenv = require('dotenv');
const env = process.env.NODE_ENV || 'dev';

if (env === 'dev') {
  dotenv.config({ path: '.env.dev' });
} else {
  dotenv.config({ path: '.env.prod' });
}
