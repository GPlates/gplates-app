# GPlates Education Ionic App

## Run the app in the simulators

**Important: You need to export the correct JAVA_HOME and ANDROID_SDK_ROOT in set-env.sh**

The following steps worked on my Macbook Pro.

- `nvm use 16`
- `npm install`
- `source ./set-env.sh`
- `ionic capacitor run android`
- `ionic capacitor run ios`

## Serve as a web page

- `npm install -g serve`
- `serve -s build`

## Deploy on Android device

- `npx cap open android`
- choose your device and click the "run" button in Android Studio

## Deploy on ios device

- `ionic capacitor copy ios`
- Add an account with your Apple ID and choose the team under "signing&capabilities" in XCode
- `ionic capacitor run ios -l --external`
- On your ios device, go to "Settings > General > Device Management" to trust the developer

## Some random notes

* nvm use 16
* source ./set-env.sh
* ionic capacitor add android
* ionic capacitor run android
* ionic capacitor run ios
* npx cap open android
* npx cap serve
* npx cap open ios

#### use chrome inspect to debug android chrome://inspect/#devices

`convert output.png -resize 1000x1000 -background Black -gravity center -extent 2000x2000 out.png`

Use xcode to change icon and splash image.

## Framework candidates

#### Cordova

https://cordova.apache.org

* WebView-based
* time-saving, easier to maintain and cost-effective

#### Ionic

https://ionicframework.com

* based on Cordova and support moden frameworks, such as React, Angular, Vue.

#### React Native

https://reactnative.dev

* not web-based
* learning curve???
* work with cesiumjs??? https://github.com/CesiumGS/cesium/issues/7629#issuecomment-531862873


## 3D globe candidates

#### Cesiumjs

https://cesium.com/platform/cesiumjs/

* We already have experience with it. Easy to find support.

#### globe.gl

https://globe.gl

* small, unfamiliar, hard to find help


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


