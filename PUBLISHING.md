# Publishing

Some of these instructions might be a little wrong since I've never set up a new project in the Google Play Console or App Store Connect (and both have fees preventing me from testing myself). Please refer to the official documentation (linked throughout) if you get stuck. Edits to better reflect the actual process are welcome.

## Important

A Play Console developer account costs a one-time registration fee of **25 USD**

Enrolling in the Apple Developer Program costs an annual fee of **99 USD (149 AUD)**


## Common

### First-time set up
1. Generate icons:
  * `cordova-res android --skip-config --copy`
  * `cordova-res ios --skip-config --copy`
1. Install Capacitor/Cordova plugins:
  * `npx cap update`

### For each release

1. Build the static files:
  * `ionic build --prod`
1. If Capacitor/Cordova plugins have been added/updated:
  * `npx cap sync` (runs `npx cap copy` & `npx cap update`)
1. Else, just copy static files to native platforms:
  * `npx cap copy`


## Android

### First-time set up

1. Create a Play Console developer account [here](https://play.google.com/console/signup)
  * See [Register for a Google Play Developer account](https://support.google.com/googleplay/android-developer/answer/6112435) for instructions
  * **⚠ One-time registration fee of 25 USD ⚠**
1. Create an app [here](https://play.google.com/console/developers/create-new-app)
1. [Generate an upload key and keystore](https://developer.android.com/studio/publish/app-signing#generate-key)
1. Set up the [store listing](https://support.google.com/googleplay/android-developer/answer/9859152#store_listing)
1. [Prepare for review](https://support.google.com/googleplay/android-developer/answer/9859455)
1. [Set up prices](https://support.google.com/googleplay/android-developer/answer/6334373)
1. Continue with the [For each release](#for-each-release) instructions

### For each release

#### Build the app
1. Open Android Studio with `npx cap open android`
1. Set a version for the app in `android/app/build.gradle` (see [Version your app](https://developer.android.com/studio/publish/versioning#appversioning) for more information)

  There are two settings and both should be set:
  * `versionCode` - Positive integer. Increase by 1 for each release
  * `versionName` - Only displayed to users. `<major>.<minor>.<patch>` format

1. `Build > Generate Signed Bundle or APK`
  1. Choose Android App Bundle (this is required for new apps as of August 2021) and click **Next**
  1. Enter the key store path & password
  1. Select the key alias (`upload`) & enter the password (same as key store password)
    * See [Sign your app with your key](https://developer.android.com/studio/publish/app-signing#sign_release) for details
  1. (Optionally) check `Remember passwords`, uncheck `Export encrypted key...`, and click **Next**
  1. Select the build variants (probably only `release`), and click `Finish`
  1. Wait for the Gradle build
  1. Once it's generated, `locate` the bundle for later

#### Release on Play Console
For more detailed instructions on the following section, refer to [Prepare and roll out a release](https://support.google.com/googleplay/android-developer/answer/9859348)
1. Login to the Google Play Console
1. Select the app in the `All apps` list
1. Select `Production` (or a testing track) under the `Release` subheading on the left
1. Select `Create new release` in the top-right
1. Upload the app bundle we generated
1. Fill-out the release details
1. Click `Review release`
1. If there are no errors and you're happy with the release, click `Start rollout`
1. Open App


## iOS

### First-time setup

1. Join the Apple Developer Program [here](https://developer.apple.com/enroll/)
  * See [Enrollment](https://developer.apple.com/support/enrollment/) for instructions
  * **⚠ Annual fee of 99 USD (149 AUD) ⚠**
1. [Add a new app](https://help.apple.com/app-store-connect/#/dev2cd126805) in [App Store Connect](https://appstoreconnect.apple.com/apps)

### For each release

1. Open Xcode with `npx cap open ios`
1. Select the Project Navigator
  * Top left icon (folder), or
  * `View > Navigators > Project`, or
  * Shortcut: `⌘ + 1`
1. Open `App.xcodeproj` (i.e., click `App`)
1. In the `General` tab, set the version numbers (see [Set the version number and build string](https://help.apple.com/xcode/mac/current/#/devba7f53ad4) for details)
  * `Version` is the user-visible version number. Follows the `<major>.<minor>.<patch>` format
  * `Build` is the machine-readable version number. Also follows the `<major>.<minor>.<patch>` format, but unused points can be dropped (e.g., `1` == `1.0.0` and `10.5` == `10.5.0`)
  * Both are used by the App Store for versioning. See [this SO answer](https://stackoverflow.com/a/38009895/15379768)
1. If this is your first time building on this machine, assign a team in the `Signing & Capabilities` tab
  * See [Assign a project to a team](https://help.apple.com/xcode/mac/current/#/dev23aab79b4) for details
1. Set the build destination to `Any iOS Device (arm64)`
  * At the top of the window, or
  * in `Product > Destination`
1. Select `Product > Archive`
1. Wait for the build to finish
1. A new `Archives` window should appear
  * You can also open it at any time with `Window > Organizer`
1. Click `Distribute App`
1. Select `App Store Connect` and click **Next**
1. Select `Upload` and click **Next**
1. Check `Strip Swift symbols` (if present), `Upload your app's symbols`, & `Manage Version and Build Number` and click **Next**
1. Select `Automatically manage signing` and click **Next**
1. Review the summary and click **Upload**
1. Do the rest in [App Store Connect](https://appstoreconnect.apple.com/apps)
1. See [Create a new version](https://help.apple.com/app-store-connect/#/dev480217e79)
