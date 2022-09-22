import { useMemo } from 'react'
import { Breadcrumb as AntBreadcrumb } from 'antd'
import { useTranslation } from 'react-i18next'
import { Link, useLocation } from 'react-router-dom'
import { matchMenuParent } from '@/components/Access/Creater'
import { MenuConfig } from '@/type'

const Breadcrumb: React.FC<{
  menuConfig: MenuConfig
}> = ({ menuConfig }) => {
  const { t } = useTranslation()
  const location = useLocation()
  const { pathname } = location

  const menuArr = useMemo(
    () => matchMenuParent(menuConfig, pathname, true).reverse(),
    [menuConfig, pathname]
  )

  const breadcrumbItems = [
    <AntBreadcrumb.Item key="home">
      <Link to="/home">{t('首页')}</Link>
    </AntBreadcrumb.Item>
  ].concat(
    menuArr.map((item) => (
      <AntBreadcrumb.Item key={item.path}>
        <Link to={item.path}>{t(item.label)}</Link>
      </AntBreadcrumb.Item>
    ))
  )

  return <AntBreadcrumb>{breadcrumbItems}</AntBreadcrumb>
}

export default Breadcrumb
