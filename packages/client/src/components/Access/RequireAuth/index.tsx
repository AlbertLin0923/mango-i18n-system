import { Navigate, useLocation } from 'react-router-dom'

import { useUserStore } from '@/store'

const RequireAuth: FC<
  PropsWithChildren<{
    auth?: number | string
    role?: string | string[]
    redirect?: string
  }>
> = ({ auth, role, redirect, children }) => {
  const { authList = [], role: userRole } = useUserStore(
    (state) => state.userInfo,
  )
  const { pathname } = useLocation()

  if (redirect && pathname !== redirect) {
    return <Navigate to={redirect} replace />
  }

  const hasPermission =
    (!auth || authList.includes(Number(auth))) &&
    (!role || role.includes(userRole))

  if (!hasPermission) {
    return <Navigate to="/not-access-page" replace />
  }

  return children as ReactNode
}

export default RequireAuth
