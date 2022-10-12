# GPlates App

The “GPlates-in-schools” program is funded by [AuScope](https://www.auscope.org.au/), comprising a GPlates app with integrated lesson plans, to provide an Earth Science-focused education engagement initiative.

## How to contribute code

- Open an issue
- Create a new branch for the issue
- Work on the new branch
- Create a pull request for code review and merge
- Remove the branch

## Run the app in the simulators

You need Java 11 and Android studio 2021.2.1 or newer.

**Important: You need to export the correct JAVA_HOME and ANDROID_SDK_ROOT in set-env.sh**

The following steps worked on my Macbook Pro.

- `nvm use 16`
- `npm install`
- `source ./set-env.sh`
- `ionic capacitor run android`
- `ionic capacitor run ios`

## Serve as a web page

- `npm start`/`ionic serve`

or

- `npm install -g serve`
- `serve -s build`

## Deploy on Android device

- `ionic build --prod`
- `npx cap sync`
- `npx cap open android`
- choose your device and click the "run" button in Android Studio

Or

- Run `ionic capacitor run android` and select your device

## Deploy on ios device

- `ionic capacitor copy ios`
- install pods (see below for notes on how to install CocoaPods): `cd ios/App/; pod install; cd ../..`
- Open XCode with `npx cap open ios`
- Add an account with your Apple ID and choose the team under "signing&capabilities" in XCode
  <img width="800" alt="add account" src="https://user-images.githubusercontent.com/2688316/167048512-49d68826-ff34-4b48-8a89-45f6ae194f04.png">
  <img width="800" alt="select team" src="https://user-images.githubusercontent.com/2688316/167048695-05d4bc9c-eb0f-4c6a-a109-b0f02c43a281.png">
  If you get a profile error, select the device can fix the error.
  <img width="800" alt="select device" src="https://user-images.githubusercontent.com/2688316/167048749-1cda74f4-4551-4a70-b431-f515d3ec4bf8.png">

- Run the app in XCode or run this command `ionic capacitor run ios -l --external`
- On your ios device, go to "Settings > General > Device Management" to trust the developer

### CocoaPods on macs

CocoaPods is required to create the 'ios/App/Pods' folder, and the XCode build will fail without this.

You can try `sudo gem install cocoapods` to install [CocoaPods](https://cocoapods.org) on your Mac. However, this [**does not**](https://github.com/CocoaPods/CocoaPods/issues/11056) work on an M1 chip.

To install CocoaPods on an [M1](https://stackoverflow.com/questions/64901180/how-to-run-cocoapods-on-apple-silicon-m1) mac, use HomeBrew: `brew install cocoapods`

### Upgrade @capacitor-community/sqlite

**Important:**
⚠ Remember to copy manually the file sql-wasm.wasm from nodes_modules/sql.js/dist/sql-wasm.wasm to the public/assets folder of YOUR_APP

### Firebase Deploy

<https://gplates-app-5e092.web.app> @gplatesearthbyte@gmail.com

## Some random notes

- nvm use 16
- source ./set-env.sh
- ionic capacitor add android
- ionic capacitor run android
- ionic capacitor run ios
- npx cap open android
- npx cap serve
- npx cap open ios
- brew install cocoapods

#### use chrome inspect to debug android chrome://inspect/#devices

`convert output.png -resize 1000x1000 -background Black -gravity center -extent 2000x2000 out.png`

Use [cordova-res](https://www.npmjs.com/package/cordova-res) to generate icon and splash images.

## Framework candidates

#### Cordova

https://cordova.apache.org

- WebView-based
- time-saving, easier to maintain and cost-effective

#### Ionic

https://ionicframework.com

- based on Cordova and support moden frameworks, such as React, Angular, Vue.

#### React Native

https://reactnative.dev

- not web-based
- learning curve???
- work with cesiumjs??? https://github.com/CesiumGS/cesium/issues/7629#issuecomment-531862873

## 3D globe candidates

#### Cesiumjs

https://cesium.com/platform/cesiumjs/

- We already have experience with it. Easy to find support.

#### globe.gl

https://globe.gl

- small, unfamiliar, hard to find help

#### Use the following command to extent/resize image

resize the gplates-logo-3152x2732.png to 1000x1000 and put the resized image at the center of a 2732x2732 canvas.

`convert gplates-logo-3152x2732.png -resize 1000x1000 -background 'rgba(0,0,0,0)' -gravity center -extent 2732x2732 splash.png`

`convert gplates-logo-3152x2732.png -resize 1024x1024 -background 'rgba(0,0,0,0)' -gravity center -extent 1024x1024 icon.png`

`convert gplates-logo-3152x2732.png -resize 200 -background 'rgba(0,0,0,0)' -gravity center -extent 432x432 icon-background.png`

`cordova-res ios --skip-config --copy`

`cordova-res android --skip-config --copy`

`npm run build`

`npm start`

#### GeoServer

https://github.com/michaelchin/docker-geoserver

http://localhost:8600/geoserver/web/

`docker-compose -f docker-compose-build.yml up -d --build`
