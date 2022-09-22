import React from 'react'
import { isExternal } from '@/utils/index'
import './style.less'

export interface SvgIconProps {
  iconClass: string
  className?: string
}

const SvgIcon: React.FC<SvgIconProps> = (props) => {
  const { iconClass, className, ...restProps } = props

  const _isExternal = isExternal(iconClass)
  const iconName = `#icon-${iconClass}`

  const svgClass = className ? 'svg-icon ' + className : 'svg-icon'

  const styleExternalIcon = {
    mask: `url(${iconClass}) no-repeat 50% 50%`,
    '-webkit-mask': `url(${iconClass}) no-repeat 50% 50%`
  }

  return (
    <>
      {_isExternal ? (
        <div style={styleExternalIcon} className="svg-external-icon svg-icon" {...restProps}></div>
      ) : (
        <svg className={svgClass} aria-hidden="true" {...restProps}>
          <use href={iconName} />
        </svg>
      )}
    </>
  )
}

export default SvgIcon
