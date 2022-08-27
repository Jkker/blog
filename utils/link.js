export const isExternal = url => url && url[0] !== '/'

export const externalLinkProps = {
  target: '_blank',
  rel: 'noopener noreferrer'
}
export const linkProps = url => (isExternal(url) ? externalLinkProps : {})
