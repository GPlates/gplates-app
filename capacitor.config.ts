import { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
  appId: 'earthbyte.gplates.edu',
  appName: 'GPlates In Schools',
  webDir: 'build',
  bundledWebRuntime: false,
  server: {
    cleartext: true,
  },
  plugins: {
    SplashScreen: {
      launchAutoHide: false,
    },
  },
}

export default config
