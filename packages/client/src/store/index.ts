import { init } from '@rematch/core'
import loadingPlugin from '@rematch/loading'
import updatedPlugin from '@rematch/updated'

import appModel from './models/appModel'
import userModel from './models/userModel'

import type { Models, RematchDispatch, RematchRootState } from '@rematch/core'
import type { ExtraModelsFromLoading } from '@rematch/loading'
import type { ExtraModelsFromUpdated } from '@rematch/updated'

export interface RootModel extends Models<RootModel> {
  appModel: typeof appModel
  userModel: typeof userModel
}

export type FullModel = ExtraModelsFromLoading<RootModel> &
  ExtraModelsFromUpdated<RootModel>

export const models: RootModel = {
  appModel,
  userModel,
}

const store = init<RootModel, FullModel>({
  models: models,
  plugins: [loadingPlugin(), updatedPlugin()],
})

export type Store = typeof store
export type Dispatch = RematchDispatch<RootModel>
export type RootState = RematchRootState<RootModel, FullModel>

export default store
