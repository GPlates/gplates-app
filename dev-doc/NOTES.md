## Run the app in the simulators

You need Java 11 and Android studio 2021.2.1 or newer.

**Important: You need to export the correct JAVA_HOME and ANDROID_SDK_ROOT in set-env.sh**

The following steps worked on my Macbook Pro.

- `nvm use 18`
- `npm install`
- `source ./set-env.sh`
- `ionic capacitor run android -l --external`
- `ionic capacitor run ios -l --external`

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
- `npx cap sync`
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

⚠ Remember to copy manually the file sql-wasm.wasm from nodes_modules/sql.js/dist/sql-wasm.wasm to the public/assets folder of YOUR_APP

### Firebase Deploy

<https://gplates-app-5e092.web.app> @gplatesearthbyte@gmail.com

#### use chrome inspect to debug android chrome://inspect/#devices

### Change project name in XCode

⚠ DO NOT DO THAT!! The Capacitor hardcoded "App" as the name. If you change the name, some Capacitor commands will not work.

### append "&BGCOLOR=0x0000FF" to WMS request to get a background

### App Store Preview

`ffmpeg -i GPlates-App-preview-age-grid.mp4 -c:v libx264 -profile:v main -level:v 3.1 -c:a copy output.mp4`

`ffprobe -loglevel error -show_streams GPlates-App-preview-age-grid.mp4`
