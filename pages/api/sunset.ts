const handler = async (req: any, res: any) => {
  const { lat = '', lng = '', h = '' } = req.query
  const url = `${process.env.API_SERVER_BASE_URL}/sunset/duration?lat=${lat}&lng=${lng}&h=${h}`
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'x-forwarded-for': req.headers['x-forwarded-for'],
    },
  })
  const data = await response.json()
  res.json(data)
}

export default handler
