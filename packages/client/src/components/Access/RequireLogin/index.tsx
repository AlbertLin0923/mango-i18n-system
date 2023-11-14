import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { Spin } from 'antd'

import type { RootState, Dispatch } from '@/store/index'

const RequireLogin: FC<PropsWithChildren> = () => {
  const {
    tokenPair: { accessToken },
  } = useSelector((state: RootState) => state.userModel)
  const dispatch = useDispatch<Dispatch>()

  const navigate = useNavigate()
  const { pathname } = useLocation()

  const [isReady, setIsReady] = useState<boolean>(false)

  useEffect(() => {
    setIsReady(true)
    accessToken && dispatch.userModel.getUserInfo()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!accessToken) {
      navigate(`/user/login?${encodeURIComponent(window.location.href)}`, {
        replace: true,
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  if (!isReady) {
    return <Spin spinning={true} />
  }

  return <Outlet />
}

export default RequireLogin
