import dict from '@/data/Slots-2022sp.json'

export default async function getRoomByBuilding(req, res) {
  const { building } = req.query
  res.json(dict[building])
}
