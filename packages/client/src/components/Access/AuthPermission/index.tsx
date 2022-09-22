import React from 'react'
import { connect } from 'react-redux'

import { RootState } from '@/store/index'

const mapState = (state: RootState) => ({
  userModel: state.userModel
})
type StateProps = ReturnType<typeof mapState>

type IProps = {
  noMatch?: JSX.Element
  auth: number | string
}

type AuthPermissionProps = React.PropsWithChildren<StateProps & IProps>

export const AuthPermission: React.FC<AuthPermissionProps> = (props) => {
  const { userModel, children, noMatch, auth } = props

  const {
    userInfo: { authList }
  } = userModel

  if (!auth) return children as any

  if (authList.includes(auth)) return children as any

  return noMatch ?? null
}

export default connect(mapState)(AuthPermission)
