import { Navigate, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'

import type { RootState } from '@/store'

type RequireAuthProps = PropsWithChildren<{
  auth?: number | string
  role?: string | string[]
  redirect?: string
}>

const RequireAuth: FC<RequireAuthProps> = ({
  auth,
  role,
  redirect,
  children,
}) => {
  const { userAllowedAuthList = [], role: userRole } = useSelector(
    (state: RootState) => state.userModel.userInfo,
  )
  const { pathname } = useLocation()

  if (redirect && pathname !== redirect) {
    return <Navigate to={redirect} replace />
  }

  const hasPermission =
    (!auth || userAllowedAuthList.includes(Number(auth))) &&
    (!role || role.includes(userRole))

  if (!hasPermission) {
    return <Navigate to="/not-access-page" replace />
  }

  return children as ReactNode
}

export default RequireAuth
