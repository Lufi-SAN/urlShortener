import { z } from 'zod'

export const userShortURIDataSchema = z.object({
    original_uri: z.string().trim().transform(val => { 
  if (!val) return null
  const lower = val.toLowerCase()

  if (lower.startsWith("/")) {
    if (lower.startsWith("//") && !lower.startsWith("///")) {
        return new URL("https:" + val).href
    } else return null
  } else { 
    if (lower.startsWith("http://") || lower.startsWith("https://")) {
      return new URL(val).href
    } else return new URL("https://" + val).href
  }
}).pipe(z.url({
  protocol: /^https?$/,
  hostname: z.regexes.domain
})),
    is_private: z.boolean(),
    expires_at: z.string().trim().transform(val => {
  if (!val) return null
  let userDate = new Date(val) 
  const minDate = new Date(Date.now() + (60 * 60 * 1000))

  if (userDate < minDate) return null
  return userDate.toISOString()
}).pipe(z.iso.datetime())
})

export type userShortURIData = z.infer<typeof userShortURIDataSchema>