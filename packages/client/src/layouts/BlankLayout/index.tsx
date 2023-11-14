import { Outlet } from 'react-router-dom'

import './index.module.scss'

const BasicLayout: FC = () => {
  return (
    <div className="layout-container">
      <Outlet />
    </div>
  )
}

export default BasicLayout
