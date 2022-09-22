import { useEffect } from 'react'
import { Spin } from 'antd'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

NProgress.configure({ showSpinner: false })

type Props = {
  spinning: boolean | undefined
}

const PageLoading: React.FC<Props> = ({ spinning }) => {
  // 增加一个页面加载动画
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
