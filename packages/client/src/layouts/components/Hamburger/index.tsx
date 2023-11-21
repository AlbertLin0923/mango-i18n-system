import { useSelector, useDispatch } from 'react-redux'
import { MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons'

import './index.module.scss'

import type { RootState, Dispatch } from '@/store'

const Hamburger: FC = () => {
  const siderCollapsed = useSelector(
    (state: RootState) => state.appModel.siderCollapsed,
  )
  const dispatch = useDispatch<Dispatch>()

  return (
    <div
      className="hamburger-container"
      onClick={() => {
        dispatch.appModel.changeSiderCollapsed(!siderCollapsed)
      }}
    >
      {siderCollapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
    </div>
  )
}

export default Hamburger
