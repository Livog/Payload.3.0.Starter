interface CookieAttributes {
  value: string
  expires?: Date
  path?: string
  domain?: string
  httponly: boolean
  secure: boolean
  samesite?: 'Lax' | 'Strict' | 'None'
}

interface Cookies {
  [key: string]: CookieAttributes
}

export default function parseCookieString(cookieString: string): Map<string, CookieAttributes> {
  const cookieParts = cookieString.split(/,(?=\s*[^\s=;]+=[^;]*)/)
  const cookies: Cookies = {}

  cookieParts.forEach((part) => {
    const parts = part.split(';').map((p) => p.trim())
    const [firstNameValue, ...attrs] = parts
    const [name, value] = firstNameValue.split('=')

    const attributes = attrs.reduce(
      (acc: Partial<CookieAttributes>, attr) => {
        const [attrName, attrValue] = attr.split('=')
        const key = attrName.trim().toLowerCase()

        switch (key) {
          case 'expires':
            acc.expires = attrValue ? new Date(decodeURIComponent(attrValue)) : undefined
            break
          case 'path':
          case 'domain':
            acc[key] = decodeURIComponent(attrValue)
            break
          case 'samesite':
            if (['Lax', 'Strict', 'None'].includes(attrValue)) {
              acc.samesite = attrValue as 'Lax' | 'Strict' | 'None'
            }
            break
          case 'httponly':
          case 'secure':
            acc[key] = true
            break
        }

        return acc
      },
      {
        value: decodeURIComponent(value),
        httponly: false,
        secure: false
      } as Partial<CookieAttributes>
    )

    cookies[decodeURIComponent(name)] = attributes as CookieAttributes
  })

  return new Map(Object.entries(cookies))
}
