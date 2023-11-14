import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Menu } from 'antd'

import { getFullRoutePath } from '@/router'

import type { MenuProps } from 'antd'
import type { RouterConfigTreeItem } from '@/router'

const SideMenu: FC<{
  menuConfig: RouterConfigTreeItem[]
}> = ({ menuConfig }) => {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const [selectedKeys, setSelectedKeys] = useState<string[]>([pathname])
  const [openKeys, setOpenKeys] = useState<string[]>([])

  const handleSelect: MenuProps['onSelect'] = ({ key, selectedKeys }) => {
    navigate(key)
    setSelectedKeys(selectedKeys)
  }

  const handleOpenChange: MenuProps['onOpenChange'] = (openKeys) => {
    setOpenKeys(openKeys)
  }

  useEffect(() => {
    setSelectedKeys([pathname])
    const _openKeys = getFullRoutePath(pathname).map((i) => {
      return i.path
    })
    setOpenKeys(_openKeys)
  }, [pathname, menuConfig])

  return (
    <Menu
      items={menuConfig}
      mode="inline"
      openKeys={openKeys}
      selectedKeys={selectedKeys}
      onOpenChange={handleOpenChange}
      onSelect={handleSelect}
    />
  )
}

export default SideMenu
