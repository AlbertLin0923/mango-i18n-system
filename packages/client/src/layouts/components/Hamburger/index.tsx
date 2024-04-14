import { MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons'

import { useAppStore } from '@/store'

import './index.module.scss'

const Hamburger: FC = () => {
  const { siderCollapsed, changeSiderCollapsed } = useAppStore()

  return (
    <div
      className="hamburger-container"
      onClick={() => {
        changeSiderCollapsed(!siderCollapsed)
      }}
    >
      {siderCollapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
    </div>
  )
}

export default Hamburger
