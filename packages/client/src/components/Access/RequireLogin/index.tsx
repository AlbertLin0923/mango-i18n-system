import { useState, useEffect } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useMount } from 'ahooks'

import PageLoading from '@/components/PageLoading'
import { useUserStore } from '@/store'

const RequireLogin: FC<PropsWithChildren> = () => {
  const {
    tokenPair: { accessToken },
    getUserInfo,
  } = useUserStore()

  const navigate = useNavigate()
  const { pathname } = useLocation()

  const [isReady, setIsReady] = useState<boolean>(false)

  useMount(async () => {
    accessToken && (await getUserInfo())
    setIsReady(true)
  })

  useEffect(() => {
    if (!accessToken) {
      navigate(`/user/login?${encodeURIComponent(window.location.href)}`, {
        replace: true,
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  if (!isReady) {
    return <PageLoading spinning={true} />
  }

  return <Outlet />
}

export default RequireLogin
