import { useUserStore } from '@/store'

const RolePersmission: FC<
  PropsWithChildren<{
    noMatch?: ReactNode
    role: string[] | string
  }>
> = ({ children, noMatch, role }) => {
  const { role: userRole } = useUserStore((state) => state.userInfo)

  if (!role) return children as any

  if (role.includes(userRole)) return children as any

  return noMatch ?? null
}

export default RolePersmission
