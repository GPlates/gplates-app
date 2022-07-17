import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import * as serviceWorkerRegistration from './serviceWorkerRegistration'
import reportWebVitals from './reportWebVitals'
import {
  defineCustomElements as jeepSqlite,
  applyPolyfills,
  JSX as LocalJSX,
} from 'jeep-sqlite/loader'
import { HTMLAttributes } from 'react'
import { Capacitor } from '@capacitor/core'
import {
  CapacitorSQLite,
  SQLiteConnection,
  SQLiteDBConnection,
} from '@capacitor-community/sqlite'

// https://github.com/capacitor-community/sqlite/blob/c7cc541568e6134e77c0c1c5fa03f7a79b1f9150/docs/Ionic-React-Usage.md

type StencilToReact<T> = {
  [P in keyof T]?: T[P] &
    Omit<HTMLAttributes<Element>, 'className'> & {
      class?: string
    }
}

declare global {
  export namespace JSX {
    interface IntrinsicElements
      extends StencilToReact<LocalJSX.IntrinsicElements> {}
  }
}

applyPolyfills().then(() => {
  jeepSqlite(window)
})
window.addEventListener('DOMContentLoaded', async () => {
  const platform = Capacitor.getPlatform()
  const sqlite: SQLiteConnection = new SQLiteConnection(CapacitorSQLite)
  try {
    if (platform === 'web') {
      const jeepEl = document.createElement('jeep-sqlite')
      document.body.appendChild(jeepEl)
      await customElements.whenDefined('jeep-sqlite')
      await sqlite.initWebStore()
    }
    const ret = await sqlite.checkConnectionsConsistency()
    const isConn = (await sqlite.isConnection('db_main')).result

    // Set up the schema of the database
    let db: SQLiteDBConnection
    if (ret.result && isConn) {
      db = await sqlite.retrieveConnection('db_main')
    } else {
      db = await sqlite.createConnection('db_main', false, 'no-encryption', 1)
    }

    await db.open()
    let query = `
    CREATE TABLE IF NOT EXISTS cache (
      url STRING PRIMARY KEY NOT NULL,
      data BLOB NOT NULL,
      ttl NUMBER
    );
    `

    await db.execute(query)
    await db.close()
    await sqlite.closeConnection('db_main')

    // Initialise App
    const container = document.getElementById('root')
    const root = createRoot(container!)
    root.render(<App />)

    // If you want your app to work offline and load faster, you can change
    // unregister() to register() below. Note this comes with some pitfalls.
    // Learn more about service workers: https://cra.link/PWA
    serviceWorkerRegistration.unregister()

    // If you want to start measuring performance in your app, pass a function
    // to log results (for example: reportWebVitals(console.log))
    // or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
    reportWebVitals()
  } catch (err) {
    console.log(`Error: ${err}`)
    throw new Error(`Error: ${err}`)
  }
})
