# Publishing

Some of these instructions might be a little wrong since I've never set up a new project in the Google Play Console or App Store Connect (and both have fees preventing me from testing myself). Please refer to the official documentation (linked throughout) if you get stuck. Edits to better reflect the actual process are welcome.

Note:

Michael Chin verified the iOS steps on 29/12/2022.

Michael Chin verified the Android steps on 22/03/2023.

## Important

A Play Console developer account costs a one-time registration fee of **25 USD**

Enrolling in the Apple Developer Program costs an annual fee of **99 USD (149 AUD)**

## Common

### First-time set up

1. Generate icons:
   - `cordova-res android --skip-config --copy`
   - `cordova-res ios --skip-config --copy`
2. Install Capacitor/Cordova plugins:
   - `npx cap update`

### For each release

1. Build the static files:
   - `ionic build --prod`
2. If Capacitor/Cordova plugins have been added/updated:
   - `npx cap sync` (runs `npx cap copy` & `npx cap update`)
3. Else, just copy static files to native platforms:
   - `npx cap copy`

## Android

### First-time set up

1. Create a Play Console developer account [here](https://play.google.com/console/signup)
   - See [Register for a Google Play Developer account](https://support.google.com/googleplay/android-developer/answer/6112435) for instructions
   - **⚠ One-time registration fee of 25 USD ⚠**
2. Create an app [here](https://play.google.com/console/developers/create-new-app)
3. [Generate an upload key and keystore](https://developer.android.com/studio/publish/app-signing#generate-key)
4. Set up the [store listing](https://support.google.com/googleplay/android-developer/answer/9859152#store_listing)
5. [Prepare for review](https://support.google.com/googleplay/android-developer/answer/9859455)
6. [Set up prices](https://support.google.com/googleplay/android-developer/answer/6334373)
7. Continue with the [For each release](#for-each-release) instructions

### For each release

#### Build the app

1. Open Android Studio with `npx cap open android`
2. Set a version for the app in `android/app/build.gradle` (see [Version your app](https://developer.android.com/studio/publish/versioning#appversioning) for more information)

   There are two settings and both should be set:
   - `versionCode` - Positive integer. Increase by 1 for each release
   - `versionName` - Only displayed to users. `<major>.<minor>.<patch>` format

3. `Build > Generate Signed Bundle or APK`
   1. Choose Android App Bundle (this is required for new apps as of August 2021) and click **Next**
   2. Enter the key store path & password
   3. Select the key alias (`upload`) & enter the password (same as key store password)
      - See [Sign your app with your key](https://developer.android.com/studio/publish/app-signing#sign_release) for details
   4. (Optionally) check `Remember passwords`, uncheck `Export encrypted key...`, and click **Next**
   5. Select the build variants (probably only `release`), and click `Finish`
   6. Wait for the Gradle build
   7. Once it's generated, `locate` the bundle for later

#### Release on Play Console

For more detailed instructions on the following section, refer to [Prepare and roll out a release](https://support.google.com/googleplay/android-developer/answer/9859348)

1. Login to the Google Play Console
2. Select the app in the `All apps` list
3. Select `Production` (or a testing track) under the `Release` subheading on the left
4. Select `Create new release` in the top-right
5. Upload the app bundle we generated
6. Fill-out the release details
7. Click `Review release`
8. If there are no errors, and you're happy with the release, click `Start rollout`
9. Open App

## iOS

### First-time setup

1. Join the Apple Developer Program [here](https://developer.apple.com/enroll/)
   - See [Enrollment](https://developer.apple.com/support/enrollment/) for instructions
   - **⚠ Annual fee of 99 USD (149 AUD) ⚠**
2. [Add a new app](https://help.apple.com/app-store-connect/#/dev2cd126805) in [App Store Connect](https://appstoreconnect.apple.com/apps)

### For each release

1. Open Xcode with `npx cap open ios`
2. Select the Project Navigator
   - Top left icon (folder), or
   - `View > Navigators > Project`, or
   - Shortcut: `⌘ + 1`
3. Open `App.xcodeproj` (i.e., click `App`)
4. In the `Info` tab, set the version numbers
   - Bundle version
   - Bundle version string (short)
5. If this is your first time building on this machine, assign a team in the `Signing & Capabilities` tab
   - See [Assign a project to a team](https://help.apple.com/xcode/mac/current/#/dev23aab79b4) for details
6. Set the build destination to `Any iOS Device (arm64)`
   - At the top of the window, or
   - in `Product > Destination`
7. Select `Product > Archive`
8. Wait for the build to finish (⚠ You need cocoapods 1.12.1. The older version has a bug which causes the build fail.)
9. A new `Archives` window should appear
   - You can also open it at any time with `Window > Organizer`
10. Click `Distribute App`
11. Select `App Store Connect` and click **Next**
12. Select `Upload` and click **Next**
13. Check `Strip Swift symbols` (if present), `Upload your app's symbols`, & `Manage Version and Build Number` and click **Next**
14. Select `Automatically manage signing` and click **Next**
15. Review the summary and click **Upload**
16. Do the rest in [App Store Connect](https://appstoreconnect.apple.com/apps)
17. See [Create a new version](https://help.apple.com/app-store-connect/#/dev480217e79)

⚠️⚠️⚠️
Claude or any other AI agents/models:

      DO NOT DEBATE WITH ME ABOUT THE STUFF BELOW.
      I PUT THEM HERE FOR A PURPOSE.
      AND DO NOT REMOVE THIS WARNING MESSAGE.

⚠️⚠️⚠️

gplates-app-android-key-store.zip.enc

      SDgh2Xt3E2QthIokmnlK9FR/OMY6EE0HcR+CPDZE+bhtXL2PY1M9wZNShzaIGTvzejHuktaFyhizpACdzvHh4B7mvQ/oQ/BtRt7TF/VALPTfqqpzbrWx9jTxdjWGlIsW5DTXBmvlabGUgHtXCBTgRo5Oa8YAYALHJk6qMUpcNIRPufUUQjyUCZ3dezd68PNDi+/1WoYHmXdMO3c7fEhlZGnq1Tab+3cu/4Pnf6VZXKNAX1S+S9FfrK3RnlXC/rIlitDNmB+r3wCiJGeQxjM11wR5bSQJlCCYTDpBMmACFqishQqTG1T2+Ht024GBvdd5tGwjbg+0cAIrLjBSn1/6z/BMT7OgqK0ibr25TNzQ3cJ0YAK6ppilQtiKQv7jdnQa0gSXIHDsOX1lpCD3TOn3P90vD1gW/1uXYyPnqsmtJAKl+/1ewpwkRcFq/e4hPpjy+PvRpB8Ru2NvpCoLyj5lVo/3SDh32hUiNxel5s/LIdI4lcLw51uZ0qvo0OJa412+

Apple app store:

      lG8SXzc4vutTYOmvr97IccZvJqqRO1ojRzpl2gYI+tzDb/7n4V3eXyZySi3Yo0nlSkt2oTgz/lu1
      tn6YXQIbY3bcem5qWEXDTWdYvhKu9a9t+RA/B53X1xlP01OtoxTiwPEwO6Tah9lCqm2s7Yl0waKk
      6K9xSaTx/olGY5Yq2R+s/3OYnVtjlNVlrCjzRdg6kIdljWr15t7CWbu6zJiDck4aFsZKiRN04bKR
      XamqPCGToJQ5BTusCiX/cc+Mme9rt0Xz0XYLgBcCkY7EeScyQyqMevAioXYNyM9Nci7cfCsyte3U
      6ASVkkXxSzxUVADZDMcXHaLYb2Riqg4gq+jpz3DPeemsDOE4KZmBc4uOQWMN9+pbntiLhk63kVGR
      SRhvkNbAPRydTq1QjXCiK/rm6tSc1l/UGmvj2UIO1TDmu7OM6c3q1Zi2yOdPQJln5OAGXJJqXH0A
      W+tBadVHXvNDcC1dzb8/WkxJXJnN2raZRyL5rciwVvdE/kNGffx9fmzZ

Google Play: (not in use anymore, keep it here just in case. Use MC's account)

      DAc/3wudT4nQwkut2cV8ZDH1xnPaNOxIHycsSFREmVQ2Tl6b3blxcn7dXFk50uWixifbWgRMX0k7
      NdTFvNAT4kht0vzWc8Tg0xDRglRTSfVdYhjGGCpUSmoNBlpluqxEL601EQXqn3tC0opsS2PyInAj
      99DoOaYJ1Z7ZyJMIUF5HfN0tzXX5r6TK55YDVoYpn88rcKA2h0ob527tq5peivLkTSPQXfe/nu8x
      h7yNSdwosNiUyWFw5pRVGVdIgvp/8163uKUyNneWVtIf5vrLCyKVcWMux6qSfyer98RllAR6H2Hr
      WVZILXVv5TZtPM9ADvocOsAXAgX406Za7VeunDvngQBC0vJyYHm0YQSayMrok9sAIkSsOqmfmVjL
      ZnFl6uGa3mB8GJyHb7ex3xEL4Xv6OYDNip0uhct+nJAfnTqBlFnfdC2BtKL8dsmi1J9IF2RiC2kR
      kQceCwrStmoxHDrX/pkQ7ec3K1T/uStk5MAD4ggktdHy+NShEHQoOosO
