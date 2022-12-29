import { useMemo, Suspense } from 'react'
import { Layout, Spin } from 'antd'
import { useTranslation, TFunction } from 'react-i18next'
import { connect } from 'react-redux'
import { Outlet } from 'react-router-dom'

import SideMenu from './components/SideMenu'
import GlobalHeader from './components/GlobalHeader'
import PageLoading from '@/components/PageLoading'
import WaterMark from '@/components/WaterMark'

import { filterAccessedRouterConfig } from '@/components/Access/Creater'

import styles from './index.module.less'

import { RootState } from '@/store/index'
import { RouterItem, RouterConfig, MenuConfig } from '@/type'

const { Header, Sider, Content } = Layout

const mapState = (state: RootState) => ({
  userModel: state.userModel,
  appModel: state.appModel
})

type StateProps = ReturnType<typeof mapState>

type Props = React.PropsWithChildren<StateProps>

const createMenu = (accessedRouterConfig: RouterConfig, t: TFunction<'translation', undefined>) => {
  const loop = (_routerConfig: RouterConfig, parentPath = ''): MenuConfig => {
    if (!_routerConfig) {
      return []
    }

    return _routerConfig
      .filter((item) => !item.hideInMenu)
      .map((item: RouterItem) => {
        if (item?.children?.length) {
          if (item?.children?.length === 1 && item?.children?.[0]?.showParentMenu) {
            const _path =
              item.path === '/'
                ? `/${item.children[0].path}`
                : parentPath === ''
                ? `${item.path}/${item.children[0].path}`
                : `${parentPath}/${item.path}/${item.children[0].path}`

            return {
              key: _path,
              path: _path,
              icon: item?.children?.[0]?.icon ?? null,
              label: t(item.children[0].name)
            }
          } else {
            const _path = parentPath === '' ? `${item.path}` : `${parentPath}/${item.path}`

            return {
              key: _path,
              path: _path,
              icon: item?.icon ?? null,
              label: t(item.name),
              children: loop(item.children, _path)
            }
          }
        } else {
          const _path = parentPath === '' ? `${item.path}` : `${parentPath}/${item.path}`
          return {
            key: _path,
            path: _path,
            icon: item?.icon ?? null,
            label: t(item.name)
          }
        }
      })
  }

  return loop(accessedRouterConfig)
}

const BasicLayout: React.FC<Props> = ({ appModel, userModel }) => {
  const { t } = useTranslation()
  const {
    sider: { opened }
  } = appModel

  const {
    userInfo: { username, role, authList }
  } = userModel

  const menuConfig = useMemo(() => {
    return createMenu(filterAccessedRouterConfig(authList, role), t)
  }, [authList, role, t])

  return (
    <WaterMark content={username}>
      <Layout className={styles['app-layout']}>
        <Sider
          className={styles['app-sider']}
          trigger={null}
          width={300}
          collapsible
          collapsed={opened}
        >
          <div className={styles['app-sider-title']}>{t('翻译系统')}</div>
          {menuConfig?.length > 0 ? (
            <SideMenu menuConfig={menuConfig} />
          ) : (
            <Spin spinning={true}></Spin>
          )}
        </Sider>

        <Layout className={styles['app-container']}>
          <Header className={styles['app-header']}>
            <GlobalHeader menuConfig={menuConfig} />
          </Header>
          <Content className={styles['app-main']}>
            <Suspense fallback={<PageLoading spinning></PageLoading>}>
              <Outlet />
            </Suspense>
          </Content>
        </Layout>
      </Layout>
    </WaterMark>
  )
}

export default connect(mapState)(BasicLayout)
