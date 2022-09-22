import { useState, useMemo } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Menu } from 'antd'

import { matchMenuParent } from '@/components/Access/Creater'
import { MenuConfig } from '@/type'

const SideMenu: React.FC<{
  menuConfig: MenuConfig
}> = ({ menuConfig }) => {
  const navigate = useNavigate()

  const { pathname } = useLocation()
  const [selectedKeys, setSelectedKeys] = useState([pathname])

  const defaultOpenKeys = useMemo(
    () =>
      matchMenuParent(menuConfig, pathname).map((i) => {
        return i.path
      }),
    [menuConfig, pathname]
  )

  return (
    <Menu
      theme="dark"
      mode="inline"
      selectedKeys={selectedKeys}
      defaultOpenKeys={defaultOpenKeys}
      onSelect={({ key, keyPath, selectedKeys, domEvent }) => {
        navigate(key)
        setSelectedKeys(selectedKeys)
      }}
      items={menuConfig}
    ></Menu>
  )
}

export default SideMenu
