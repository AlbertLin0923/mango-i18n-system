import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { Outlet } from 'react-router-dom'

import { RootState, Dispatch } from '@/store/index'

const mapState = (state: RootState) => ({
  userModel: state.userModel
})

const mapDispatch = (dispatch: Dispatch) => ({
  getUserInfo: () => dispatch.userModel.getUserInfo()
})

type StateProps = ReturnType<typeof mapState>

type DispatchProps = ReturnType<typeof mapDispatch>

type Props = StateProps & DispatchProps

const RouterGuard: React.FC<Props> = (props) => {
  const { getUserInfo } = props

  useEffect(() => {
    getUserInfo()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return <Outlet />
}

export default connect(mapState, mapDispatch)(RouterGuard)
