import { FC } from 'react'
import { Button, Result } from 'antd'
import { useNavigate } from 'react-router-dom'

const NoFoundPage: FC = () => {
  let navigate = useNavigate()

  return (
    <Result
      status="404"
      title="NOT FOUND"
      subTitle="Sorry, the page you visited does not exist."
      extra={
        <Button type="primary" onClick={() => navigate('/home')}>
          Back Home
        </Button>
      }
    />
  )
}

export default NoFoundPage
