import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { Navigate } from 'react-router-dom'

import { Spin } from 'antd'

import { RootState } from '@/store/index'

const mapState = (state: RootState) => ({
  userModel: state.userModel
})

type StateProps = ReturnType<typeof mapState>

type Props = React.PropsWithChildren<StateProps>

const RequireLogin: React.FC<Props> = (props) => {
  const [isReady, setIsReady] = useState<boolean>(false)

  useEffect(() => {
    setIsReady(true)
  }, [])

  const { userModel, children } = props
  const {
    tokenPair: { accessToken }
  } = userModel

  if (!isReady) {
    return <Spin spinning={true} />
  }

  if (!accessToken && window.location.pathname !== '/login') {
    return <Navigate to={`/login?${encodeURIComponent(window.location.href)}`} />
  }

  return children as React.ReactElement
}

export default connect(mapState)(RequireLogin)
