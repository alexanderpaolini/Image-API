import { Router } from 'express'

import { Snowflake } from 'discord-rose'

import { API } from '../structures/API'

export default function (this: API, router: Router): void {
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  router.get<{ id: Snowflake }>('/:id', async (req, res) => {
    const userId = req.params.id

    // The string to check for redis
    const redisStr = `avatars.${userId}`
    const hasAvatar = await this.redis.exists(redisStr)

    // Check if redis has it
    if (hasAvatar) {
      res.status(200)
      res.contentType('application/json')
      res.send({
        avatar: await this.redis.get(redisStr)
      })
      return
    }

    // Make the request
    const user = await this.discord.users.get(userId)
      .catch(() => null)

    // Server error if no request
    if (!user) {
      res.status(500)
      res.send('Internal Server Error')
      return
    }

    // Calculate the URL
    const avatarUrl = user.avatar
      ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}`
      : `https://cdn.discordapp.com/embed/avatars/${Number(user.discriminator) % 5}`

    // Cache it
    await this.redis.set(redisStr, avatarUrl, 'EX', 900)

    // Send the avatar
    res.status(200)
    res.contentType('application/json')
    res.send({
      avatar: avatarUrl
    })
  })
}
