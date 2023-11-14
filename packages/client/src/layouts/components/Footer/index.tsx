import { Layout } from 'antd'

import './index.module.scss'

const Footer: FC = () => {
  return (
    <Layout.Footer className="layout-footer">
      <div className="copyright-info">
        Open-source MIT Licensed | Copyright © 2022-present
      </div>
    </Layout.Footer>
  )
}

export default Footer
