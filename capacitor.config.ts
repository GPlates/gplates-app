import { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
  appId: 'earthbyte.gplates.edu',
  appName: 'GPlates',
  webDir: 'build',
  server: {
    cleartext: true,
    androidScheme: 'https',
  },
  plugins: {
    SplashScreen: {
      launchAutoHide: false,
    },
  },
}
export default config
