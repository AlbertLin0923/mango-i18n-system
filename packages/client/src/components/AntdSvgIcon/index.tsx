import React from 'react'
import Icon from '@ant-design/icons'
import SvgIcon, { SvgIconProps } from '@/components/SvgIcon'

const AntdSvgIcon: React.FC<SvgIconProps> = (props) => {
  return (
    <Icon
      component={() => {
        return <SvgIcon {...props}></SvgIcon>
      }}
    />
  )
}

export default AntdSvgIcon
