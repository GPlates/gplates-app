import { Storage } from '@ionic/storage'

const store = new Storage()
store.create().then(async (storage) => {
  await storage.set('test', { name: 'gplates', id: 123 })
  const test = await storage.get('test')
  console.log(test)
  console.log('ionic storage has been created!')
})

export default store
