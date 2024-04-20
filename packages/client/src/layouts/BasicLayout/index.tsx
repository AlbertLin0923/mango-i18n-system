import { Suspense, useMemo } from 'react'
import { useNavigate, Outlet } from 'react-router-dom'
import { Layout, Spin } from 'antd'
import { SvgIcon } from '@mango-kit/components'

import { useUserStore, useAppStore } from '@/store'
import { createMenu, filterAccessedRoute } from '@/router'
import PageLoading from '@/components/PageLoading'

import SideMenu from '../components/SideMenu'
import User from '../components/User'
import Hamburger from '../components/Hamburger'
import Helmet from '../components/Helmet'
import Breadcrumb from '../components/Breadcrumb'
import Footer from '../components/Footer'

const { Sider, Header, Content } = Layout

const BasicLayout: FC = () => {
  const navigate = useNavigate()

  const { authList, role } = useUserStore((state) => state.userInfo)

  const {
    siderCollapsed,
    publicSystemSetting: { systemTitle },
  } = useAppStore()

  const menuConfig = useMemo(() => {
    return createMenu(filterAccessedRoute(authList, role))
  }, [authList, role])

  return (
    <>
      <Helmet />
      <Layout className="h-screen w-screen">
        <Header className="z-3 fixed left-0 top-0 flex h-16 w-screen items-center justify-between bg-white px-6 py-0">
          <div
            className="block cursor-pointer"
            onClick={() => {
              navigate('/locale')
            }}
          >
            {systemTitle ? (
              systemTitle
            ) : (
              <SvgIcon className="block h-[30px] w-[200px]" iconClass="logo" />
            )}
          </div>
          <div className="flex items-center">
            <User />
          </div>
        </Header>
        <Layout className="mt-16">
          <Sider
            className="rounded-md bg-white shadow-md"
            collapsed={siderCollapsed}
            theme="light"
            trigger={
              <div className="flex h-full w-full items-center border-t border-solid border-zinc-200 bg-white px-6">
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

          <Content className="flex h-[calc(100vh-64px)] w-full flex-col overflow-y-auto px-4 py-0">
            <Breadcrumb />
            <div className="w-full flex-auto">
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
