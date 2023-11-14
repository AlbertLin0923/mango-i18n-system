import { useSelector, useDispatch } from 'react-redux'
import { MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons'

import styles from './index.module.scss'

import type { RootState, Dispatch } from '@/store/index'

const Hamburger: FC = () => {
  const siderCollapsed = useSelector(
    (state: RootState) => state.userModel.siderCollapsed,
  )
  const dispatch = useDispatch<Dispatch>()
  return (
    <div
      className={styles['hamburger-container']}
      onClick={() => {
        dispatch.userModel.changeSiderCollapsed(!siderCollapsed)
      }}
    >
      {siderCollapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
    </div>
  )
}

export default Hamburger
