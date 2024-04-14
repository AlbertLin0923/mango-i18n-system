import { Suspense, useMemo } from 'react'
import { useNavigate, Outlet } from 'react-router-dom'
import { Layout, Spin } from 'antd'
import { SvgIcon } from '@mango-kit/components'

import { useUserStore, useAppStore } from '@/store'
import PageLoading from '@/components/PageLoading'
import { createMenu, filterAccessedRoute } from '@/router'

import './index.module.scss'

import SideMenu from '../components/SideMenu'
import User from '../components/User'
import Hamburger from '../components/Hamburger'
import Helmet from '../components/Helmet'
import Breadcrumb from '../components/Breadcrumb'
import Footer from '../components/Footer'

const { Sider, Header, Content } = Layout

const BasicLayout: FC = () => {
  const navigate = useNavigate()

  const { userAllowedAuthList, role } = useUserStore((state) => state.userInfo)

  const {
    siderCollapsed,
    publicSystemSetting: { systemTitle },
  } = useAppStore()

  const menuConfig = useMemo(() => {
    return createMenu(filterAccessedRoute(userAllowedAuthList, role))
  }, [userAllowedAuthList, role])

  return (
    <>
      <Helmet />
      <Layout className="layout-container">
        <Header className="layout-header">
          <div
            className="logo-wrapper"
            onClick={() => {
              navigate('/locale')
            }}
          >
            {systemTitle ? (
              systemTitle
            ) : (
              <SvgIcon className="logo" iconClass="logo" />
            )}
          </div>
          <div className="control-wrapper">
            <User />
          </div>
        </Header>
        <Layout className="layout-main">
          <Sider
            className="layout-sider"
            collapsed={siderCollapsed}
            trigger={
              <div className="sider-collapse">
                <Hamburger />
              </div>
            }
            width={220}
            collapsible
          >
            {menuConfig?.length > 0 ? (
              <SideMenu menuConfig={menuConfig} />
            ) : (
              <Spin spinning={true} />
            )}
          </Sider>

          <Content className="layout-wrapper">
            <Breadcrumb />
            <div className="layout-content">
              <Suspense fallback={<PageLoading spinning />}>
                <Outlet />
              </Suspense>
            </div>
            <Footer />
          </Content>
        </Layout>
      </Layout>
    </>
  )
}

export default BasicLayout
