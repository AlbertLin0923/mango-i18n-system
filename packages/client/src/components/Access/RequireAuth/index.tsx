import { Navigate, useLocation } from 'react-router-dom'
import { connect } from 'react-redux'

import { RootState } from '@/store/index'

const mapState = (state: RootState) => ({
  userModel: state.userModel
})
type StateProps = ReturnType<typeof mapState>

type RequireAuthProps = {
  auth?: number | string
  role?: string | string[]
  redirect?: string
}

type Props = React.PropsWithChildren<StateProps & RequireAuthProps>

const RequireAuth: React.FC<Props> = (props) => {
  const { auth, role, redirect, userModel, children } = props
  const {
    userInfo: { authList = [], role: userRole }
  } = userModel

  const { pathname } = useLocation()

  if (redirect && pathname !== redirect) {
    return <Navigate to={redirect} replace />
  }

  const hasPermission =
    (!auth || authList.includes(Number(auth))) && (!role || role.includes(userRole))

  if (!hasPermission) {
    return <Navigate to="/notAccessPage" replace />
  }

  return children as React.ReactElement
}

export default connect(mapState)(RequireAuth)
