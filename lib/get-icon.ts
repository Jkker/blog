import { isUrl } from '@/utils/link'
import { mapImageUrl } from '@/lib/map-image-url'

const getIcon = (icon, block) => {
  if (!icon) return null

  if (icon.length === 1) {
    return icon
  }
  if (isUrl(icon)) {
    return mapImageUrl(icon, block)
  }
  return icon
}

export default getIcon
