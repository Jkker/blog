export const isExternal = (url) => url && url[0] !== '/'

export const externalLinkProps = {
  target: '_blank',
  rel: 'noopener noreferrer',
}
export const linkProps = (url) => (isExternal(url) ? externalLinkProps : {})

export const isUrl = (url) => {
  if (typeof url !== 'string') return false
  return url.match(/^(http|https):\/\/[^ "]+$/)
}
