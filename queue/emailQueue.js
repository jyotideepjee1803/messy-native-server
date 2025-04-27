const { Queue } = require('bullmq');
const Redis = require('ioredis');

const redisConnection = new Redis(process.env.REDIS_URL, {
    maxRetriesPerRequest: null,
});
  
const emailQueue = new Queue('emailQueue', {
connection: redisConnection,
});

module.exports = emailQueue;
