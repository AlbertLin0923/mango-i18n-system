import { useUserStore } from '@/store'

export const AuthPermission: FC<
  PropsWithChildren<{
    noMatch?: ReactNode
    auth: number | string
  }>
> = ({ children, noMatch, auth }) => {
  const { userAllowedAuthList } = useUserStore((state) => state.userInfo)

  if (!auth) return children as any

  if (userAllowedAuthList.includes(auth)) return children as any

  return noMatch ?? null
}

export default AuthPermission
