const { Queue } = require('bullmq');
const Redis = require('ioredis');

const redisConnection = new Redis({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
  }, {
    maxRetriesPerRequest: null,
});
  
const emailQueue = new Queue('emailQueue', {
connection: redisConnection,
});

module.exports = emailQueue;
