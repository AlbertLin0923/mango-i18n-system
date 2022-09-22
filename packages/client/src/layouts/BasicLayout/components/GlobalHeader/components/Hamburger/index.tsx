import { connect } from 'react-redux'
import { MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons'
import styles from './index.module.less'

import { RootState, Dispatch } from '@/store/index'

const mapState = (state: RootState) => ({
  siderOpened: state.appModel.sider.opened
})

const mapDispatch = (dispatch: Dispatch) => ({
  toggleSiderOpened: () => dispatch.appModel.toggleSiderOpened()
})

type StateProps = ReturnType<typeof mapState>
type DispatchProps = ReturnType<typeof mapDispatch>

type Props = StateProps & DispatchProps

const Hamburger: React.FC<Props> = ({ siderOpened, toggleSiderOpened }) => {
  return (
    <div
      className={styles['hamburger']}
      onClick={() => {
        toggleSiderOpened()
      }}
    >
      {siderOpened ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
    </div>
  )
}

export default connect(mapState, mapDispatch)(Hamburger)
