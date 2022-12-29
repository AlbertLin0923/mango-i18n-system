import { init, Models, RematchDispatch, RematchRootState } from '@rematch/core'
import loadingPlugin, { ExtraModelsFromLoading } from '@rematch/loading'
import updatedPlugin, { ExtraModelsFromUpdated } from '@rematch/updated'
import persistPlugin from '@rematch/persist'
import storage from 'redux-persist/lib/storage'

import appModel, { appModelPersistConfig } from './models/appModel'
import userModel, { userModelPersistConfig } from './models/userModel'

export interface RootModel extends Models<RootModel> {
  userModel: typeof userModel
  appModel: typeof appModel
}

export type FullModel = ExtraModelsFromLoading<RootModel> & ExtraModelsFromUpdated<RootModel>

export const models: RootModel = { userModel, appModel }

const store = init<RootModel, FullModel>({
  models: models,
  plugins: [
    loadingPlugin(),
    updatedPlugin(),
    persistPlugin(
      { key: 'mango-i18n-system', storage: storage }
      // {
      //   appModel: appModelPersistConfig,
      //   userModel: userModelPersistConfig
      // }
    )
  ]
})

export type Store = typeof store
export type Dispatch = RematchDispatch<RootModel>
export type RootState = RematchRootState<RootModel, FullModel>

export default store
