import Keyv from 'keyv'
import { KeyvFile } from 'keyv-file'
import { isDev } from './config'

let db: Keyv

if (isDev) {
  db = new Keyv({
    store: new KeyvFile({
      filename: 'cache.json', // file name
      expiredCheckDelay: 1 * 3600 * 1000, // ms, check and remove expired data in each ms
      writeDelay: 100, // ms, batch write to disk in a specific duration, enhance write performance.
    }),
  })
} else {
  db = new Keyv()
}

export default db
