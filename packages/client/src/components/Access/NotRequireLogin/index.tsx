import { useState, useEffect } from 'react'
import { useLocation, useNavigate, Outlet } from 'react-router-dom'
import { Spin } from 'antd'
import { useMount } from 'ahooks'

import { useUserStore } from '@/store'

const NotRequireLogin: FC = () => {
  const { accessToken } = useUserStore((state) => state.tokenPair)
  const location = useLocation()
  const navigate = useNavigate()
  const { pathname } = location

  const [isReady, setIsReady] = useState<boolean>(false)

  useMount(() => {
    setIsReady(true)
  })

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
