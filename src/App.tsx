import React from 'react'
/*import { Navigate, Route } from 'react-router-dom' 
for react-router-dom 6, waiting for ionic framework to update*/
import { Redirect, Route } from 'react-router-dom'
import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react'
import { IonReactRouter } from '@ionic/react-router'
import { SQLiteHook, useSQLite } from 'react-sqlite-hook'
import Main from './pages/Main'

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css'

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css'
import '@ionic/react/css/structure.css'
import '@ionic/react/css/typography.css'

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css'
import '@ionic/react/css/float-elements.css'
import '@ionic/react/css/text-alignment.css'
import '@ionic/react/css/text-transformation.css'
import '@ionic/react/css/flex-utils.css'
import '@ionic/react/css/display.css'

/* Theme variables */
import './theme/variables.scss'
import { RecoilRoot } from 'recoil'
import Tutorial from './pages/Tutorial'
import { setSQLiteHook } from './functions/cache'

// Singleton SQLite Hook
export let sqlite: SQLiteHook

setupIonicReact()

/*remove "exact" and replace Redirect with Navigate
for react-router-dom 6, waiting for ionic framework to update*/
const App: React.FC = () => {
  sqlite = useSQLite()
  setSQLiteHook(sqlite)
  return (
    <IonApp>
      <IonReactRouter>
        <IonRouterOutlet>
          <Route exact path="/main">
            <RecoilRoot>
              <Main />
            </RecoilRoot>
          </Route>
          <Route exact path="/tutorial">
            <Tutorial />
          </Route>
          <Route exact path="/">
            <Redirect to="/tutorial" />
          </Route>
        </IonRouterOutlet>
      </IonReactRouter>
    </IonApp>
  )
}

export default App
