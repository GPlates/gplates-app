import React from 'react'

export const setNumber = (
  setter: React.Dispatch<React.SetStateAction<number>>,
  value: string | null | undefined,
  min?: number,
  max?: number
) => {
  const number = Number(value) || 0
  if (number === 0 || number) {
    if (min != null && number < min) {
      setter(min)
    } else if (max != null && number > max) {
      setter(max)
    } else {
      setter(Math.round(number))
    }
  }
}
