import {
  SQLiteDBConnection,
  CapacitorSQLite,
  SQLiteConnection,
} from '@capacitor-community/sqlite'
import { Capacitor } from '@capacitor/core'
import RotationModel from './rotationModel'
import { buildAnimationURL } from './util'
import { canDownload, presentDataAlert } from './network'
import { Preferences } from '@capacitor/preferences'
import { SQLiteHook } from 'react-sqlite-hook'
import { DEBUG } from './settings'

// https://github.com/capacitor-community/sqlite/blob/c7cc541568e6134e77c0c1c5fa03f7a79b1f9150/docs/Ionic-React-Usage.md

export let cachingServant: CachingService
export const setCachingServant = (s: CachingService) => {
  cachingServant = s
}

let sqlite: SQLiteHook
export const setSQLiteHook = (s: SQLiteHook) => {
  sqlite = s
}

export class CachingService {
  private db: SQLiteDBConnection | null = null

  constructor(private dbName: string) {
    cachingServant = this
  }

  hasPresented = false

  // Store request data
  // ttl = time to live (in seconds). Values <= 0 will be ignored (data will live forever)
  cacheRequest(url: string, data: any, ttl?: number): Promise<any> {
    if (ttl != null && ttl > 0) {
      ttl = new Date().getTime() + ttl * 1000
    } else {
      ttl = undefined
    }

    const command =
      'INSERT INTO cache (url, data, ttl) VALUES (?, ?, ?) ON CONFLICT (url) DO NOTHING;'
    const values = [url, data, ttl]
    return this.db!.run(command, values)
  }

  // Try to load cached data
  async getCachedRequest(url: string): Promise<any> {
    const currentTime = new Date().getTime()
    let data
    const ret = await this.db!.query('SELECT * FROM cache WHERE url == ?', [
      url,
    ])
    const value = ret.values && ret.values[0]

    //if the cache has a success hit.
    if (value && (value.ttl == null || value.ttl >= currentTime)) {
      data = value.data
      const blob = await (await fetch(data)).blob()
      return URL.createObjectURL(blob)
    } else {
      //if cache does not hit, get the data from url and insert into cache
      await this.db!.run('DELETE FROM cache WHERE url == ?', [url])
      const blob: Blob | undefined = await this.getBlob(url)
      data = await this.convertBlobToDataURL(blob)
      //it is possible that the return data is invalid
      if (blob && data) {
        this.cacheRequest(url, data)
        //TODO: on "web" platform, you need to saveToStore. otherwise the DB is in memory
        //await sqlite.saveToStore('db_main') //LOOK HERE
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
    // TODO: Get from recoil store
    const downloadOnCellular = await Preferences.get({
      key: 'networkSettings',
    }).then((res) => {
      if (res?.value) return JSON.parse(res.value).downloadOnCellular
    })
    if (await canDownload(downloadOnCellular)) {
      let res = await fetch(url)
      return await res.blob()
    } else if (!this.hasPresented) {
      await presentDataAlert()
      return
    }
  }

  //convert a blob to data URL
  convertBlobToDataURL(blob?: Blob) {
    if (blob) {
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
  }

  // Remove all cached data & files
  clearCachedData() {
    this.db!.run(`DELETE FROM cache`)
  }

  //
  print() {
    //this.db.getUrl().then((data) => console.log(data))
    this.db!.query('SELECT * FROM cache').then((data) => console.log(data))
  }

  // insert the data from URL into cache
  async cacheURL(url: string) {
    let exist = await this.checkExist(url)
    //console.log(`exist: ${exist}`)
    if (!exist) {
      this.getBlob(url)
        .then((blob) => this.convertBlobToDataURL(blob))
        .then((data) => {
          if (data) {
            //console.log(`insert ${url}`)
            this.cacheRequest(url, data, -1)
          } else {
            console.log('warning cacheURL: the data from this url is empty')
          }
        })
        .catch((error) => {
          console.log(error) //handle the promise rejection
        })
    }
  }

  // Example to remove one cached URL
  invalidateCacheEntry(url: string) {
    return this.db!.run('DELETE FROM cache WHERE url == ?', [url])
  }

  //clean up
  async cleanup() {
    await this.saveToWebStore()
    await this.db!.close()
    await sqlite.closeConnection(this.dbName)
  }

  //on "web" platform, save the DB data to disk
  async saveToWebStore() {
    const platform = Capacitor.getPlatform()
    //on "web" platform, you need to saveToStore. otherwise the DB is in memory
    //save to indexedDB on disk
    if (platform === 'web') {
      await sqlite.saveToStore(this.dbName)
    }
  }

  //
  async cacheLayer(model: RotationModel, wmsUrl: string, layerName: string) {
    let rowNum = await this.getCount(layerName)
    //check if the layer has been cached.
    if (rowNum < model.times.length) {
      let url = buildAnimationURL(wmsUrl, layerName)
      let count = 0
      //console.log('caching ' + layerName)
      model.times.forEach((time) => {
        //console.log('caching ' + String(time))
        count += 1
        setTimeout(() => {
          cachingServant.cacheURL(url.replace('{{time}}', String(time)))
        }, count * 1000)
      })
    }
  }

  //
  async checkExist(url: string) {
    let ret = await this.db!.query('SELECT 1 FROM cache WHERE url == ?', [url])
    //console.log('check exist!')
    //console.log(ret)
    return ret.values?.length === 0 ? false : true
  }

  //get the number of rows which the URLs contains the "keyword"
  async getCount(keyword: string = '') {
    let ret: any
    if (keyword.length === 0) {
      ret = await this.db!.query('SELECT COUNT(*) as num FROM cache')
    } else {
      let idx = keyword.indexOf('{{time}}')
      ret = await this.db!.query(
        "SELECT COUNT(*) as num FROM cache WHERE url LIKE '%" +
          keyword.slice(0, idx - 1) +
          "%'"
        //"SELECT COUNT(*) as num FROM cache WHERE url LIKE '%paleo-topo-images:paleo-topo-image-{{time}}-Ma%'"
      )
    }
    //console.log(ret)
    if (ret && ret.values && ret.values.length > 0) {
      return ret.values[0]['num']
    } else return 0
  }

  //must be called after new CachingService('db_main')
  async init() {
    const platform = Capacitor.getPlatform()
    const sqlite: SQLiteConnection = new SQLiteConnection(CapacitorSQLite)
    try {
      if (platform === 'web') {
        const jeepEl = document.createElement('jeep-sqlite')
        document.body.appendChild(jeepEl)
        await customElements.whenDefined('jeep-sqlite')
        const jeepSqliteEl = document.querySelector('jeep-sqlite')
        if (jeepSqliteEl != null) {
          await sqlite.initWebStore()
        }
      }
      const ret = await sqlite.checkConnectionsConsistency()
      const isConn = (await sqlite.isConnection(this.dbName, false)).result

      // Set up the schema of the database
      let db: SQLiteDBConnection
      if (ret.result && isConn) {
        db = await sqlite.retrieveConnection(this.dbName, false)
      } else {
        db = await sqlite.createConnection(
          this.dbName,
          false,
          'no-encryption',
          1,
          false
        )
      }

      await db.open()

      let query = `CREATE TABLE IF NOT EXISTS cache (
      url STRING PRIMARY KEY NOT NULL,
      data BLOB NOT NULL,
      ttl NUMBER);`
      await db.execute(query)

      this.db = db
      //await db.close()
      //await sqlite.closeConnection(this.dbName)
      if (DEBUG) console.log('DEBUG: cache DB has been initialized!')

      //on "web" platform, you need to saveToStore. otherwise the DB is in memory
      //save to indexedDB on disk
      if (platform === 'web') {
        setInterval(() => {
          sqlite.saveToStore(this.dbName)
        }, 10 * 1000)
      }
    } catch (err: any) {
      console.log(`Error: ${err}`)
      throw new Error(`Error: ${err}`)
    }
  }

  //
  getDBName() {
    return this.dbName
  }

  //return a Map, for example {"layer-1":1000, "layer-2":20}
  async getLayerCountMap() {
    const layerCount = new Map<string, number>()

    const ret = await this.db!.query('SELECT url FROM cache ')
    let layersLeadingString = 'layers='
    ret.values?.forEach((value) => {
      //cut out the layers string
      let firstIndex = value.url.indexOf(layersLeadingString)
      if (firstIndex < 0) {
        //ivalid url
        console.log(`Warning: invalid url: ${value.url}`)
        return
      } else {
        firstIndex += layersLeadingString.length // get rid of 'layers='
      }

      let secondIndex = value.url.indexOf('&', firstIndex)
      if (secondIndex < 0) {
        //ivalid url
        console.log(`Warning: invalid url: ${value.url}`)
        return
      }

      //separate the workspace name and layer names
      let workspaceName = ''
      let layers = ''
      value.url
        .slice(firstIndex, secondIndex)
        .split(',')
        .forEach((layer: string) => {
          let layerName = ''
          let layerSplit = layer.split(':')
          if (layerSplit.length === 1) {
            layerName = layerSplit[0]
          } else if (layerSplit.length > 1) {
            workspaceName = layerSplit[0]
            layerName = layerSplit[1]
          }
          let m = layerName.match(/\d+(?=\D*$)/g) //find the last number in layer name
          if (m) {
            layers += layerName.slice(0, layerName.lastIndexOf(m[0]) - 1) + ','
          } else {
            layers += layerName + ','
          }
        })

      //count the number for each  workspacename+layers
      //basically, this group cache entries into groups
      let keyStr = workspaceName + ':' + layers.slice(0, -1)
      let num = layerCount.get(keyStr)
      if (num) {
        layerCount.set(keyStr, num + 1)
      } else {
        layerCount.set(keyStr, 1)
      }
    })
    //console.log(layerCount)
    return layerCount
  }

  //
  purge(layers: string, callback: Function) {
    console.log(`purging ${layers}`)
    let queryStr = ''
    let workspaceAndLayers = layers.split(',')
    workspaceAndLayers.forEach((keyword) => {
      if (queryStr.length === 0) {
        queryStr += "url LIKE '%" + keyword + "%'"
      } else {
        queryStr += " AND url LIKE '%" + keyword + "%'"
      }
    })

    queryStr = 'DELETE FROM cache WHERE ' + queryStr
    console.log(queryStr)
    this.db!.run(queryStr).then(async (ret) => {
      console.log(ret)
      callback()
      //enable the code below for web page
      /*
      const platform = Capacitor.getPlatform()
      if (platform === 'web') {
        await sqlite.saveToStore(this.dbName)
      }
      */
    })
  }

  //
  async getAllUrls() {
    const ret = await this.db!.query('SELECT url FROM cache ')
    return ret.values?.map((value) => value)
  }
  //
}
