const CLOUDFLARE_API_TOKEN = process.env.CLOUDFLARE_API_TOKEN
const CLOUDFLARE_ZONE_ID = process.env.CLOUDFLARE_ZONE_ID

if (!CLOUDFLARE_API_TOKEN || !CLOUDFLARE_ZONE_ID) {
  console.warn('Cloudflare API token or zone ID is not set.')
}

export const purgeCache = async (urls: string[]) => {
  if (!CLOUDFLARE_API_TOKEN || !CLOUDFLARE_ZONE_ID) {
    console.warn('Cloudflare API token or zone ID is not set. Skipping cache purge.')
    return
  }

  const endpoint = `https://api.cloudflare.com/client/v4/zones/${CLOUDFLARE_ZONE_ID}/purge_cache`

  const body = JSON.stringify({
    files: urls
  })

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${CLOUDFLARE_API_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: body
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Failed to purge cache for URLs: ${errorText}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error(`Error purging cache for URLs:`, error)
    return null
  }
}
