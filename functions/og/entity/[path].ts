import type { AddressResponse, CharactersResponse, Characters } from '../../types/concurrent'
import { sanitizeHtml } from '../../lib/sanitize'

const CACHE_TTL_SECONDS = 21600

export const onRequest: PagesFunction = async (context) => {
    const cacheUrl = new URL(context.request.url)

    const cacheKey = new Request(cacheUrl.toString(), context.request)

    // Cloudflare Workersの@CacheStorageタイプはcaches.defaultがあるが、ブラウザのCacheStorageはcaches.defaultがないのでエラーが出る
    // @ts-ignore
    const cache = caches.default

    let response = await cache.match(cacheKey)

    if (!response) {
        console.log(`[entity, cache not found]`)

        const { path } = context.params
        const ccid = path

        const host = await fetch(`https://hub.concurrent.world/api/v1/address/${ccid}`)
            .then((response) => response.json<AddressResponse>())
            .then((data) => data.content)

        const characters: Characters = await fetch(
            `https://${host}/api/v1/characters?author=${ccid}&schema=https%3A%2F%2Fraw.githubusercontent.com%2Ftotegamma%2Fconcurrent-schemas%2Fmaster%2Fcharacters%2Fprofile%2F0.0.2.json`
        )
            .then((res) => res.json<CharactersResponse>())
            .then((data) => JSON.parse(data.content[0].payload).body as Characters)

        const username = sanitizeHtml(characters.username)
        const avatar = sanitizeHtml(characters.avatar)

        const description = sanitizeHtml(characters.description)

        const responseBody = `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <meta property="og:title" content="${username} on Concurrent">
    <meta property="og:description" content="${description}">
    <meta property="og:image" content="${avatar}">
    <meta property="twitter:card" content="summary">
  </head>
</html>`

        response = new Response(responseBody, {
            headers: {
                'Content-Type': 'text/html',
                'Cache-Control': `s-maxage=${CACHE_TTL_SECONDS}`
            }
        })

        context.waitUntil(cache.put(cacheKey, response.clone()))
    } else {
        console.log(`[entity, cache found]`)
    }

    return response
}