import env from 'dotenv'

import { RedisOptions } from 'ioredis'

env.config()

const config = {
  ttl: {
    rank: 15 * 1000,
    leaderboard: 15 * 1000 * 60,
    avatar: 15 * 1000 * 60
  },

  api: {
    port: process.env.NODE_ENV === 'production' ? 6962 : 6969
  },

  discord: {
    token: process.env.DISCORD_TOKEN as string
  },

  redis: {
    host: '127.0.0.1',
    port: 6379
  } as RedisOptions
}

export default config
