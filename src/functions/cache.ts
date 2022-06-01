import { SQLiteDBConnection } from '@capacitor-community/sqlite'

// https://github.com/capacitor-community/sqlite/blob/c7cc541568e6134e77c0c1c5fa03f7a79b1f9150/docs/Ionic-React-Usage.md
// TODO: Don't send another request for a URL if we're still waiting on the previous one (create db entry with empty data?)

export class CachingService {
  constructor(private db: SQLiteDBConnection) {}

  // Store request data
  // ttl = time to live (in seconds). Values <= 0 will be ignored (data will live forever)
  cacheRequest(url: string, data: any, ttl?: number): Promise<any> {
    console.log('Caching request...')
    if (ttl != null && ttl > 0) {
      ttl = new Date().getTime() + ttl * 1000
    } else {
      ttl = undefined
    }

    const command = 'INSERT INTO cache (url, data, ttl) VALUES (?, ?, ?)'
    const values = [url, data, ttl]
    return this.db.run(command, values)
  }

  // Try to load cached data
  async getCachedRequest(url: string): Promise<any> {
    console.log('Getting cached request...')
    const currentTime = new Date().getTime()
    let data
    const ret = await this.db.query('SELECT * FROM cache WHERE url == ?', [url])
    const value = ret.values && ret.values[0]

    if (value && (value.ttl == null || value.ttl >= currentTime)) {
      data = value.data
    } else {
      await this.db.run('DELETE FROM cache WHERE url == ?', [url])
      data = await this.getBlobAsString(url)
      await this.cacheRequest(url, data)
    }

    const blob = await (await fetch(data)).blob()
    return URL.createObjectURL(blob)
  }

  //  SQLite Capacitor doesn't support blobs, so we have to convert to string (base64)
  //  https://github.com/capacitor-community/sqlite/issues/266
  async getBlobAsString(url: string) {
    return await fetch(url)
      .then((res) => res.blob())
      .then(
        (blob) =>
          new Promise((resolve, reject) => {
            const reader = new FileReader()
            reader.onloadend = () => resolve(reader.result)
            reader.onerror = reject
            return reader.readAsDataURL(blob)
          })
      )
  }

  // Remove all cached data & files
  clearCachedData() {
    return this.db.run(`DELETE FROM cache`)
  }

  // Example to remove one cached URL
  invalidateCacheEntry(url: string) {
    return this.db.run('DELETE FROM cache WHERE url == ?', [url])
  }
}
