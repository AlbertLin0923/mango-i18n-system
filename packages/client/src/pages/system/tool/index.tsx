import { useState } from 'react'
import { Button, Popconfirm, App, Card } from 'antd'
import { useTranslation } from 'react-i18next'
import { RedoOutlined } from '@ant-design/icons'

import * as API from '@/services/locale'

const Page: FC = () => {
  const { t } = useTranslation()
  const { message } = App.useApp()
  const [loading, setLoading] = useState<boolean>(false)

  return (
    <div className="page-container">
      <Card className="mb-6 w-full" type="inner">
        <Popconfirm
          title="此操作将自动提取仓库的语言包,提取后将覆盖现有的数据,是否继续?"
          onConfirm={async () => {
            setLoading(true)
            const res = await API.updateListByLoadSourceCodeLocale()
            setLoading(false)
            if (res?.success) {
              message.success(t('提取成功'))
            }
          }}
        >
          <Button
            className="h-28 w-full"
            icon={<RedoOutlined />}
            loading={loading}
          >
            {t('提取仓库的语言包到系统中')}
          </Button>
        </Popconfirm>
      </Card>
    </div>
  )
}

export default Page
