import { useMemo } from 'react'
import { connect, Provider } from 'react-redux'
import { ConfigProvider } from 'antd'

import { filterAccessedRouterConfig } from '@/components/Access/Creater'

import router from './router/index'
import store from './store/index'

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

import 'moment/locale/zh-cn'
import 'moment/locale/id'

import { RootState } from '@/store/index'

const mapState = (state: RootState) => ({
  userModel: state.userModel,
  appModel: state.appModel
})

type StateProps = ReturnType<typeof mapState>
type Props = StateProps

const AppRouter = connect(mapState)(
  ({
    appModel: { selectedLanguage },
    userModel: {
      userInfo: { authList, role }
    }
  }: Props) => {
    const locale = useMemo(() => {
      switch (selectedLanguage) {
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
    }, [selectedLanguage])

    const accessedRouteConfig = useMemo(() => {
      return filterAccessedRouterConfig(authList, role)
    }, [authList, role])

    return <ConfigProvider locale={locale}>{router(accessedRouteConfig)}</ConfigProvider>
  }
)

const App = () => {
  return (
    <Provider store={store}>
      <AppRouter></AppRouter>
    </Provider>
  )
}

export default App
