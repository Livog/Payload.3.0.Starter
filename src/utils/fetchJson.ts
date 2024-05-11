export type FetchOptions = RequestInit

const fetchJson = async (input: string | URL | Request, options?: FetchOptions, timeout?: number): Promise<any> => {
  if (!options) options = {}
  if (typeof timeout === 'number') {
    options.signal ??= AbortSignal.timeout(timeout)
  }
  options.headers ??= {}
  // @ts-ignore
  options.headers['Content-Type'] = 'application/json'
  const response = await fetch(input, options)
  if (!response.ok) {
    throw new Error(`Fetch failed with status: ${response.status} ${input}`)
  }
  return await response.json()
}

export default fetchJson
