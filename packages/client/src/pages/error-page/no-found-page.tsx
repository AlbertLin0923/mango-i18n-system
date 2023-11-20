import { Button, Result } from 'antd'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

const NoFoundPage: FC = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()

  return (
    <Result
      extra={
        <Button type="primary" onClick={() => navigate('/')}>
          {t('回到首页')}
        </Button>
      }
      status="404"
      subTitle={t('抱歉，您访问的页面不存在')}
      title={t('页面不存在')}
    />
  )
}

export default NoFoundPage
