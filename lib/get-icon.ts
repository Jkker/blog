import notionIcons from '@/data/notionIcons.json'
import { isUrl } from '@/utils/link'
import { mapImageUrl } from '@/lib/map-image-url'

const NotionIconRegex = /\/icons\/(.+)\.svg/

const getNotionIcon = (str: string) => {
  const iconStr = str.match(NotionIconRegex)?.[1]
  if (!iconStr) return null
  try {
    const [name, color] = iconStr?.split('_')

    const darkIcon = notionIcons[name]?.dark?.[color].replace(
      /fill=".+"/,
      "fill='currentColor'"
    )

    return darkIcon
  } catch (err) {
    console.error("Couldn't find icon", iconStr, err)
    return null
  }
}

const getIcon = (icon, block) => {
  if (!icon) return null

  if (icon.length === 1) {
    return icon
  }
  if (isUrl(icon)) {
    return mapImageUrl(icon, block)
  }
  return getNotionIcon(icon) ?? icon
}

export default getIcon
