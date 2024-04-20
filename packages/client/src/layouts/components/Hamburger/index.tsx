import { MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons'

import { useAppStore } from '@/store'

const Hamburger: FC = () => {
  const { siderCollapsed, changeSiderCollapsed } = useAppStore()

  return (
    <div
      className="cursor-pointer text-lg text-zinc-700 transition-all "
      onClick={() => {
        changeSiderCollapsed(!siderCollapsed)
      }}
    >
      {siderCollapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
    </div>
  )
}

export default Hamburger
