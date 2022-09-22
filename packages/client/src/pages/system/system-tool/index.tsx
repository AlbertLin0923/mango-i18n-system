import React, { useState } from 'react'
import { Button, Popconfirm, message, Card } from 'antd'
import { useTranslation } from 'react-i18next'
import * as API from '../../../services/locale'

import { RedoOutlined } from '@ant-design/icons'

import styles from './index.module.less'

const SystemTool: React.FC<{}> = () => {
  const { t } = useTranslation()

  const [loading, setLoading] = useState<boolean>(false)

  const handleFinish = async () => {
    setLoading(true)
    const res = await API.updateListByLoadSourceCodeLocale()
    setLoading(false)
    if (res?.success) {
      message.success(t('提取成功'))
    }
  }

  return (
    <div>
      <Card type="inner" className={styles.card}>
        <Popconfirm
          onConfirm={() => handleFinish()}
          title="此操作将自动提取仓库的语言包,提取后将覆盖现有的数据,是否继续?"
        >
          <Button icon={<RedoOutlined />} className={styles.btn} loading={loading}>
            {t('提取仓库的语言包到系统中')}
          </Button>
        </Popconfirm>
      </Card>
    </div>
  )
}

export default SystemTool
