import { SQLiteDBConnection } from '@capacitor-community/sqlite'

// https://github.com/capacitor-community/sqlite/blob/c7cc541568e6134e77c0c1c5fa03f7a79b1f9150/docs/Ionic-React-Usage.md

export class CachingService {
  constructor(private db: SQLiteDBConnection) {}

  // Store request data
  // ttl = time to live (in seconds). Values <= 0 will be ignored (data will live forever)
  cacheRequest(url: string, data: any, ttl?: number): Promise<any> {
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
    const currentTime = new Date().getTime()
    let data
    const ret = await this.db.query('SELECT * FROM cache WHERE url == ?', [url])
    const value = ret.values && ret.values[0]

    //if the cache has a success hit.
    if (value && (value.ttl == null || value.ttl >= currentTime)) {
      data = value.data
      const blob = await (await fetch(data)).blob()
      return URL.createObjectURL(blob)
    } else {
      //if cache does not hit, get the data from url and insert into cache
      await this.db.run('DELETE FROM cache WHERE url == ?', [url])
      let blob: Blob = await this.getBlob(url)
      data = await this.convertBlobToDataURL(blob)
      //it is possible that the return data is invalid
      if (data) {
        await this.cacheRequest(url, data)
        return URL.createObjectURL(blob)
      } else {
        //invalid return data, for example url returns "Could not find layer"
        return ''
      }
    }
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

  //fetch url and return a blob
  async getBlob(url: string) {
    let res = await fetch(url)
    let blob = await res.blob()
    return blob
  }

  //convert a blob to data URL
  convertBlobToDataURL(blob: Blob) {
    return new Promise((resolve, reject) => {
      if (blob.type.startsWith('image')) {
        const reader = new FileReader()
        reader.onloadend = () => resolve(reader.result)
        reader.onerror = reject
        reader.readAsDataURL(blob)
      } else {
        resolve(null)
      }
    })
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
