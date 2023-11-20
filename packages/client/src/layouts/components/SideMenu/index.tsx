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
  const [selectedKeyList, setSelectedKeyList] = useState<string[]>([pathname])
  const [openKeyList, setOpenKeyList] = useState<string[]>([])

  const handleSelect: MenuProps['onSelect'] = ({ key, selectedKeys }) => {
    navigate(key)
    setSelectedKeyList(selectedKeys)
  }

  const handleOpenChange: MenuProps['onOpenChange'] = (openKeys) => {
    setOpenKeyList(openKeys)
  }

  useEffect(() => {
    setSelectedKeyList([pathname])
    const _openKeys = getFullRoutePath(pathname).map((i) => {
      return i.path
    })
    setOpenKeyList(_openKeys)
  }, [pathname, menuConfig])

  return (
    <Menu
      items={menuConfig}
      mode="inline"
      openKeys={openKeyList}
      selectedKeys={selectedKeyList}
      onOpenChange={handleOpenChange}
      onSelect={handleSelect}
    />
  )
}

export default SideMenu
