const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const sanitize = require('mongo-sanitize');
const expressWinston = require('express-winston');
const aqp = require('api-query-params');
const router = require('./routes/createRouter')();

module.exports = ({ database, logger }) => express()
  .use(expressWinston.logger({
    winstonInstance: logger,
    msg: '{{res.statusCode}} {{req.method}} {{req.url}} {{res.responseTime}}ms',
    meta: false,
  }))
  .use(cors())
  .use(bodyParser.urlencoded({ extended: true }))
  .use(bodyParser.json())
  .use((req, res, next) => {
    req.base = `${req.protocol}://${req.get('host')}`;
    req.logger = logger;
    req.body = sanitize(req.body),
    req.query = aqp(sanitize(req.query)),
    req.params = sanitize(req.params),
    req.db = database;
    return next();
  })
  // .use(express.static('./public'))
  .use('/api', router)
  .use((error, req, res, next) => {
    console.log(error);
    res.status(error.status || 500).json({ error })
  });