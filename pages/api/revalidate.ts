import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Check for secret to confirm this is a valid request
  if (req.query.secret !== process.env.REVALIDATE_SECRET) {
    return res.status(401).send('Invalid token')
  }
  console.log('🔁 Revalidating', req.query.path)

  try {
    await res.revalidate(req.query.path as string)
    return res.send(`Successfully revalidated ${req.query.path}`)
  } catch (err) {
    // If there was an error, Next.js will continue
    // to show the last successfully generated page
    return res.status(500).send('Error revalidating')
  }
}
