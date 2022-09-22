import { Space } from 'antd'

import Hamburger from './components/Hamburger'
import Breadcrumb from './components/Breadcrumb'
import User from './components/User'
import SelectLang from '@/components/SelectLang'

import { MenuConfig } from '@/type'

const GlobalHeader: React.FC<{
  menuConfig: MenuConfig
}> = ({ menuConfig }) => {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '64px',
        background: '#fff'
      }}
    >
      <Space style={{ flex: 1 }}>
        <Hamburger></Hamburger>
        <Breadcrumb menuConfig={menuConfig}></Breadcrumb>
      </Space>

      <Space style={{ marginRight: '20px' }} size="large">
        <User />
        <SelectLang />
      </Space>
    </div>
  )
}

export default GlobalHeader
