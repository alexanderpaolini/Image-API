import { Canvas, loadImage } from 'skia-canvas'

import { Router } from 'express'

import { API } from '../structures/API'

interface CardRequest {
  color: string
  level: string
  xp: string
  maxxp: string
  picture: string
  tag: string
  usertag: string
}

interface LeaderboardUser {
  pfp: string
  tag: string
  level: string
  rank: string
}

export default function (this: API, router: Router): void {
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  router.post('/card', async (req, res) => {
    let { color, level, xp, maxxp, picture, tag, usertag } = req.body as CardRequest

    const str = 'rank.' + color + level + xp + maxxp + picture + tag + usertag

    const hasImage = await this.cache.redis.exists(str)
    if (hasImage) {
      const image = await this.cache.redis.getBuffer(str)
      await this.cache.redis.expire(str, this.config.ttl.rank)

      res.contentType('image/png')
      res.status(200)
      res.send(image)
      return
    }

    const canvas = new Canvas(850, 250)
    const ctx = canvas.getContext('2d')

    // Fill the background
    ctx.fillStyle = '#23272A'
    ctx.fillRect(0, 0, 1000, 250)

    // Draw the outline
    ctx.lineWidth = 45
    ctx.strokeStyle = '#2C2F33'
    ctx.strokeRect(0, 0, canvas.width, canvas.height)

    // Write the level info
    ctx.font = '26px sans-serif'
    ctx.fillStyle = '#ffffff'
    ctx.fillText(`Level: ${level}  XP: ${xp} / ${maxxp}`, 275, canvas.height / 2)

    // Write the tag
    ctx.font = 'normal 32px sans-serif'
    ctx.fillStyle = '#ffffff'
    while (ctx.measureText(usertag).width > 530) usertag = `${usertag.slice(0, -4)}...`
    ctx.fillText(`${usertag}`, 275, canvas.height / 3.5)

    // Wrote the user's name
    ctx.font = 'bold 32px sans-serif'
    ctx.fillStyle = color
    while (ctx.measureText(tag).width > 530) tag = `${tag.slice(0, -4)}...`
    ctx.fillText(tag, 275, canvas.height / 1.35)

    const percentage = Math.floor(Number(xp) / Number(maxxp) * 100) / 100

    const arcLength = percentage * 2 * Math.PI
    const totalLength = arcLength - (Math.PI / 2)

    ctx.lineWidth = 35

    // XP Circle BG
    ctx.strokeStyle = '#2C2F33'
    ctx.beginPath()
    ctx.arc(125, 125, 85, 1.5 * Math.PI, 1.51 * Math.PI, true)
    ctx.stroke()

    // XP Circle
    ctx.strokeStyle = color
    ctx.beginPath()
    ctx.arc(125, 125, 86, 1.5 * Math.PI, totalLength, false)
    ctx.stroke()

    // User Picture
    ctx.beginPath()
    ctx.arc(125, 125, 85, 0, Math.PI * 2, true)
    ctx.closePath()
    ctx.clip()

    // Load the avatar
    ctx.fillStyle = '#36393f'
    ctx.fill()

    try {
      const buffer = await this.cache.getAvatar(picture)
      const avatar = await loadImage(buffer)

      ctx.drawImage(avatar, 33, 32, 185, 185)
    } catch { }

    const buffer = canvas.toBuffer('image/png')

    res.contentType('image/png')
    res.status(200)
    res.send(buffer)

    // Cache the image
    await this.cache.cacheImage(str, buffer)
  })

  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  router.post('/leaderboard', async (req, res) => {
    const users: LeaderboardUser[] = req.body.data
    if (users.length > 8) users.length = 8

    const str = 'leaderboard.' + JSON.stringify(users)

    const cachedLeaderboard = await this.cache.getImage(str)
    if (cachedLeaderboard) {
      res.status(200)
      res.contentType('image/png')
      res.send(cachedLeaderboard)
      return
    }

    // Create the canvas
    const canvas = new Canvas(800, 1250)
    const ctx = canvas.getContext('2d')

    // Background
    ctx.fillStyle = '#23272A'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Cool Thing
    ctx.lineWidth = 45
    ctx.strokeStyle = '#2C2F33'
    ctx.strokeRect(0, 0, canvas.width, canvas.height)

    // Leaderboard
    ctx.font = 'bold 88px sans-serif'
    ctx.fillStyle = '#ffffff'
    ctx.fillText('Leaderboard', 80, 175)

    let diff = 100
    for (const user of users) {
      try {
        // Do the canvas image
        try {
          const buffer = await this.cache.getAvatar(user.pfp)
          const avatar = await loadImage(buffer)

          ctx.drawImage(avatar, 82, 175 + diff - 40, 100, 100)
        } catch { /* Voiding */ }

        // Fill the user tag
        ctx.fillStyle = '#ffffff'
        ctx.font = 'bold 36px sans-serif'
        while (ctx.measureText(user.tag).width > 510) user.tag = `${user.tag.slice(0, -4)}...`
        ctx.fillText(user.tag, 122 + 84, 175 + diff)

        // Fil the level and rank
        ctx.fillStyle = '#d4d4d4'
        ctx.font = 'normal 32px sans-serif'
        ctx.fillText(`Level: ${user.level}`, 122 + 84, 175 + diff + 50)
        ctx.fillText(`Rank: ${user.rank}`, 317 + 84, 175 + diff + 50)
      } catch { /* Voiding */ }

      // Increase the difference
      diff = diff + 120
    }

    const buffer = canvas.toBuffer('image/png')

    res.contentType('image/png')
    res.status(200)
    res.send(buffer)

    // Cache the image
    await this.cache.cacheImage(str, buffer)
  })
}
