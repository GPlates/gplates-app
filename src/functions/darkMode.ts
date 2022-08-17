import { StatusBar, Style } from '@capacitor/status-bar'
import { Capacitor } from '@capacitor/core'

export const matchDarkMode = window.matchMedia('(prefers-color-scheme: dark)')
const darkModeListener = () => {
  setDarkMode.apply(matchDarkMode.matches)
}

export const setDarkMode = (darkMode = 'auto') => {
  const apply = (isDark: boolean) => {
    document.body.classList.toggle('dark', isDark)
  }

  if (darkMode === 'auto') {
    apply(matchDarkMode.matches)
    matchDarkMode.addEventListener('change', darkModeListener)
  } else {
    apply(darkMode === 'dark')
  }
}

export const statusBarListener = () => {
  setStatusBarTheme.apply(matchDarkMode.matches)
}

export const setStatusBarTheme = (darkMode = 'auto') => {
  const apply = (isDark: boolean) => {
    StatusBar.setBackgroundColor({ color: isDark ? '#000000' : '#FFFFFF' })
    StatusBar.setStyle({ style: isDark ? Style.Dark : Style.Light })
  }

  if (Capacitor.getPlatform() !== 'web') {
    if (darkMode === 'auto') {
      apply(matchDarkMode.matches)
      matchDarkMode.addEventListener('change', statusBarListener)
    } else {
      apply(darkMode === 'dark')
    }
  }
}
