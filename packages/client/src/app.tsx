import { useState, useMemo } from 'react'
import { useSelector, useDispatch, Provider } from 'react-redux'
import { useAsyncEffect } from 'ahooks'
import { HelmetProvider } from 'react-helmet-async'
import { ConfigProvider, App as AntdApp } from 'antd'
import { browserSupportDetecter } from '@mango-kit/utils'
import 'dayjs/locale/zh-cn'
import 'dayjs/locale/en'
import zh_CN from 'antd/es/locale/zh_CN'
import en_US from 'antd/es/locale/en_US'
import id_ID from 'antd/es/locale/id_ID'
import vi_VN from 'antd/es/locale/vi_VN'
import ms_MY from 'antd/es/locale/ms_MY'
import es_ES from 'antd/es/locale/es_ES'
import fr_FR from 'antd/es/locale/fr_FR'
import fr_BE from 'antd/es/locale/fr_BE'
import it_IT from 'antd/es/locale/it_IT'
import pl_PL from 'antd/es/locale/pl_PL'
import de_DE from 'antd/es/locale/de_DE'

import store from '@/store'
import {
  constantRouterConfig,
  createRouter,
  filterAccessedRoute,
} from '@/router'

import type { RootState, Dispatch } from '@/store'
import type { MessageInstance } from 'antd/es/message/interface'
import type { ModalStaticFunctions } from 'antd/es/modal/confirm'
import type { NotificationInstance } from 'antd/es/notification/interface'

let message: MessageInstance
let notification: NotificationInstance
let modal: Omit<ModalStaticFunctions, 'warn'>

const AppRouter: FC = () => {
  const { userAllowedAuthList, role } = useSelector(
    (state: RootState) => state.userModel.userInfo,
  )
  const language = useSelector((state: RootState) => state.appModel.language)
  const dispatch = useDispatch<Dispatch>()

  const [isbrowserSupportDetecterDone, setIsBrowserSupportDetecterDone] =
    useState<boolean>()

  const locale = useMemo(() => {
    switch (language) {
      case 'zh-CN':
        return zh_CN
      case 'en-US':
        return en_US
      case 'id-ID':
        return id_ID
      case 'vi-VN':
        return vi_VN
      case 'ms-MY':
        return ms_MY
      case 'es-ES':
        return es_ES
      case 'fr_FR':
        return fr_FR
      case 'fr_BE':
        return fr_BE
      case 'it_IT':
        return it_IT
      case 'pl_PL':
        return pl_PL
      case 'de_DE':
        return de_DE
      default:
        return zh_CN
    }
  }, [language])

  const accessedRouteConfig = useMemo(() => {
    return filterAccessedRoute(userAllowedAuthList, role)
  }, [userAllowedAuthList, role])

  useAsyncEffect(async () => {
    await browserSupportDetecter()
    await dispatch.appModel.getPublicSetting()
    setIsBrowserSupportDetecterDone(true)
  }, [])

  return (
    isbrowserSupportDetecterDone && (
      <ConfigProvider locale={locale}>
        <AntdApp>
          <FeedbackWrapper>
            {createRouter(constantRouterConfig, accessedRouteConfig)}
          </FeedbackWrapper>
        </AntdApp>
      </ConfigProvider>
    )
  )
}

const App: FC = () => {
  return (
    <Provider store={store}>
      <HelmetProvider>
        <AppRouter />
      </HelmetProvider>
    </Provider>
  )
}

export const FeedbackWrapper: FC<PropsWithChildren<any>> = ({ children }) => {
  const staticFunction = AntdApp.useApp()
  message = staticFunction.message
  modal = staticFunction.modal
  notification = staticFunction.notification
  return children
}

export { message, notification, modal }

export default App
