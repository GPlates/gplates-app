## Some random notes

- nvm use 18
- source ./set-env.sh
- ionic capacitor add android
- ionic capacitor run android
- ionic capacitor run ios
- npx cap open android
- npx cap serve
- npx cap open ios
- brew install cocoapods

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
