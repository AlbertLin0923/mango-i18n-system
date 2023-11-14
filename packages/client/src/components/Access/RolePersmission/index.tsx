import { useSelector } from 'react-redux'

import type { RootState } from '@/store/index'

type RolePersmissionProps = PropsWithChildren<{
  noMatch?: ReactNode
  role: string[] | string
}>

const RolePersmission: FC<RolePersmissionProps> = ({
  children,
  noMatch,
  role,
}) => {
  const { role: userRole } = useSelector(
    (state: RootState) => state.userModel.userInfo,
  )

  if (!role) return children as any

  if (role.includes(userRole)) return children as any

  return noMatch ?? null
}

export default RolePersmission
