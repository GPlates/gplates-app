
#set the correct JAVA_HOME and ANDROID_SDK_ROOT for your computer
export JAVA_HOME=/Library/Java/JavaVirtualMachines/jdk1.8.0_311.jdk/Contents/Home/
export ANDROID_SDK_ROOT=/Users/mchin/Library/Android/sdk

export PATH=$PATH:$ANDROID_SDK_ROOT/platform-tools/
export PATH=$PATH:$ANDROID_SDK_ROOT/cmdline-tools/latest/bin/
export PATH=$PATH:$ANDROID_SDK_ROOT/emulator/

export CORDOVA_ANDROID_GRADLE_DISTRIBUTION_URL=https://services.gradle.org/distributions/gradle-6.9-all.zip

export SKIP_PREFLIGHT_CHECK=true

# Workaround for bug in source-map for Node v18
# See: https://github.com/gatsbyjs/gatsby/issues/35607#issuecomment-1122762324
# & https://github.com/parcel-bundler/parcel/issues/8005#issuecomment-1120149358
export NODE_OPTIONS=--no-experimental-fetch
