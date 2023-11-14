import Icon from '@ant-design/icons'
import { SvgIcon } from '@mango-kit/components'

import type { SvgIconProps } from '@mango-kit/components'

const AntdSvgIcon: FC<SvgIconProps> = (props) => {
  return (
    <Icon
      component={() => {
        return <SvgIcon {...props} />
      }}
    />
  )
}

export default AntdSvgIcon
