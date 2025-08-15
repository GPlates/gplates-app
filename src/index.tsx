import React from 'react'
import {
  defineCustomElements as jeepSqlite,
  JSX as LocalJSX,
} from 'jeep-sqlite/loader'
import { HTMLAttributes } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import { CachingService } from './functions/cache'
import reportWebVitals from './reportWebVitals'
import * as serviceWorkerRegistration from './serviceWorkerRegistration'

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

jeepSqlite(window)

window.addEventListener('DOMContentLoaded', async () => {
  let o = new CachingService('db_main')
  await o.init()

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
})
