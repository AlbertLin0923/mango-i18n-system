import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useLocation, useNavigate, Outlet } from 'react-router-dom'
import { Spin } from 'antd'

import type { RootState } from '@/store/index'

const NotRequireLogin: FC = () => {
  const {
    tokenPair: { accessToken },
  } = useSelector((state: RootState) => state.userModel)
  const location = useLocation()
  const navigate = useNavigate()
  const { pathname } = location

  const [isReady, setIsReady] = useState<boolean>(false)

  useEffect(() => {
    setIsReady(true)
  }, [])

  useEffect(() => {
    if (pathname.startsWith('/user') && accessToken) {
      navigate(`/mall`, { replace: true })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  if (!isReady) {
    return <Spin spinning={true} />
  }

  return <Outlet />
}

export default NotRequireLogin
