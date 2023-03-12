import Keyv from 'keyv'
import { KeyvFile } from 'keyv-file'
import { isDev } from './config'

const db = new Keyv({
  // use file store in dev
  store: isDev
    ? new KeyvFile({
        filename: 'data/cache.json', // file name
      })
    : undefined,
  ttl: 1000 * 60 * 60 * 1, // 1 hour,
})

export default db
