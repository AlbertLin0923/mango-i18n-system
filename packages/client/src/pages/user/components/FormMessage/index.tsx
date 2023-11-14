import { Alert } from 'antd'

const FormMessage: FC<{
  content: string
}> = ({ content }) => (
  <Alert
    message={content}
    style={{
      marginBottom: 24,
    }}
    type="error"
    showIcon
  />
)

export default FormMessage
