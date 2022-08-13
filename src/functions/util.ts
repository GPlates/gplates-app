export const timeout = async (time: number) => {
  await new Promise((resolve) => setTimeout(resolve, time))
}
