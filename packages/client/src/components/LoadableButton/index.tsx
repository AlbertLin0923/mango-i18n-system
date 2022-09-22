import React, { useState } from 'react'
import { Button, ButtonProps } from 'antd'

export type LoadableButtonProps = Omit<ButtonProps, 'loading'>

const LoadableButton: React.FC<LoadableButtonProps> = (props) => {
  const { onClick, ...restProps } = props
  const [loading, setLoading] = useState(false)

  return (
    <Button
      {...restProps}
      loading={loading}
      onClick={async (event) => {
        setLoading(true)
        try {
          onClick && (await onClick(event))
        } catch (err) {
          console.error(err)
        }
        setLoading(false)
      }}
    />
  )
}

export default LoadableButton
