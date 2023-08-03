#!/bin/bash

# how-to-use "source ./set-env.sh" or ". ./set-env.sh"

# set the correct JAVA_HOME and ANDROID_SDK_ROOT for your computer
export JAVA_HOME=/Applications/Android\ Studio.app/Contents/jbr/Contents/Home/
export ANDROID_SDK_ROOT=/Users/mchin/Library/Android/sdk

export PATH=$PATH:$ANDROID_SDK_ROOT/platform-tools/
export PATH=$PATH:$ANDROID_SDK_ROOT/cmdline-tools/latest/bin/
export PATH=$PATH:$ANDROID_SDK_ROOT/emulator/

export CORDOVA_ANDROID_GRADLE_DISTRIBUTION_URL=https://services.gradle.org/distributions/gradle-8.1-all.zip

export SKIP_PREFLIGHT_CHECK=true

# Workaround for bug in source-map for Node v18
# See: https://github.com/gatsbyjs/gatsby/issues/35607#issuecomment-1122762324
# & https://github.com/parcel-bundler/parcel/issues/8005#issuecomment-1120149358
node_version="$(nvm version)"
if [[ "$node_version" == "v18."* ]]; then
  export NODE_OPTIONS="--no-experimental-fetch --openssl-legacy-provider"
else
  unset NODE_OPTIONS
fi

# if you want to run "nvm version" in a shell script, you need to "source" nvm.sh like below
# the nvm is a shell function, run "type -a nvm" for details
# . /usr/local/opt/nvm/nvm.sh
# nvm_version
# printf "$(nvm version)"

