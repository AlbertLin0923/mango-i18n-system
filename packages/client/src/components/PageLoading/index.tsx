import { useEffect } from 'react'
import { Spin } from 'antd'
import NProgress from 'nprogress'

import './index.scss'

NProgress.configure({ showSpinner: false })

const PageLoading: FC<{ spinning: boolean | undefined }> = ({ spinning }) => {
  useEffect(() => {
    NProgress.start()
    return () => {
      NProgress.done()
    }
  }, [])

  return (
    <div style={{ paddingTop: 100, textAlign: 'center' }}>
      <Spin size="large" spinning={spinning} />
    </div>
  )
}

export default PageLoading
