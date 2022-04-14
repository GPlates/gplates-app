
#set the correct JAVA_HOME and ANDROID_SDK_ROOT for your computer
export JAVA_HOME=/Library/Java/JavaVirtualMachines/jdk1.8.0_311.jdk/Contents/Home/
export ANDROID_SDK_ROOT=/Users/mchin/Library/Android/sdk

export PATH=$PATH:$ANDROID_SDK_ROOT/platform-tools/
export PATH=$PATH:$ANDROID_SDK_ROOT/cmdline-tools/latest/bin/
export PATH=$PATH:$ANDROID_SDK_ROOT/emulator/

export CORDOVA_ANDROID_GRADLE_DISTRIBUTION_URL=https://services.gradle.org/distributions/gradle-6.9-all.zip

export SKIP_PREFLIGHT_CHECK=true

