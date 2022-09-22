import { FC } from 'react'
import { Button, Result } from 'antd'
import { useNavigate } from 'react-router-dom'

const NoAccessPage: FC = () => {
  let navigate = useNavigate()

  return (
    <Result
      status="403"
      title="NOT ACCESS"
      subTitle="Sorry, you are not authorized to access this page."
      extra={
        <Button type="primary" onClick={() => navigate('/home')}>
          Back Home
        </Button>
      }
    />
  )
}

export default NoAccessPage
