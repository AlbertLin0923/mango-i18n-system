import React from 'react'
import { connect } from 'react-redux'

import { RootState } from '@/store/index'

const mapState = (state: RootState) => ({
  userModel: state.userModel
})

type StateProps = ReturnType<typeof mapState>

type IProps = {
  noMatch?: JSX.Element
  role: Array<string> | string
}

type RolePersmissionProps = React.PropsWithChildren<StateProps & IProps>

const RolePersmission: React.FC<RolePersmissionProps> = (props) => {
  const { userModel, children, noMatch, role } = props

  const {
    userInfo: { role: userRole }
  } = userModel

  if (!role) return children as any

  if (role.includes(userRole)) return children as any

  return noMatch ?? null
}

export default connect(mapState)(RolePersmission)
