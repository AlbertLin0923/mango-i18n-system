import { Outlet } from 'react-router-dom'

const BasicLayout: FC = () => {
  return (
    <div className="h-full w-full">
      <Outlet />
    </div>
  )
}

export default BasicLayout
