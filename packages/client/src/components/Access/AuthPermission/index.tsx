import { useSelector } from 'react-redux'

import type { RootState } from '@/store'

type AuthPermissionProps = PropsWithChildren<{
  noMatch?: ReactNode
  auth: number | string
}>

export const AuthPermission: FC<AuthPermissionProps> = ({
  children,
  noMatch,
  auth,
}) => {
  const { userAllowedAuthList } = useSelector(
    (state: RootState) => state.userModel.userInfo,
  )

  if (!auth) return children as any

  if (userAllowedAuthList.includes(auth)) return children as any

  return noMatch ?? null
}

export default AuthPermission
