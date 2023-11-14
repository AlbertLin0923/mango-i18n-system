import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Form, Input, Progress, Popover } from 'antd'

import MangoRegExp from '@/utils/regExp'

type MangoPasswordProps = {
  widthLabel?: boolean
  label?: string
}

const MangoPassword: FC<MangoPasswordProps> = ({
  widthLabel = false,
  label,
}) => {
  const { t } = useTranslation()
  const [popoverVisible, setPopoverVisible] = useState<boolean>(false)

  const passwordStrengthMap = {
    success: {
      text: t('强'),
      percent: 100,
    },
    normal: {
      text: t('中'),
      percent: 70,
    },
    exception: {
      text: t('弱'),
      percent: 30,
    },
  }

  return (
    <>
      <Popover
        content={
          <Form.Item
            shouldUpdate={(prevValues, curValues) =>
              prevValues?.['password'] !== curValues?.['password']
            }
            noStyle
          >
            {(form) => {
              const { password } = form.getFieldsValue(['password'])
              const passwordStrengthStatus =
                MangoRegExp.isPasswordStrongly(password)

              return (
                popoverVisible && (
                  <div style={{ padding: '5px 10px' }}>
                    <div>
                      <span>{t('强度：')}</span>
                      <span>
                        {passwordStrengthMap[passwordStrengthStatus]['text']}
                      </span>
                    </div>
                    <Progress
                      percent={
                        passwordStrengthMap[passwordStrengthStatus]['percent']
                      }
                      showInfo={false}
                      status={passwordStrengthStatus}
                    />
                    <div style={{ marginTop: 10 }}>
                      <span>
                        {t(
                          '请输入 8-20 位密码，必须包含字母、数字、符号中至少2种',
                        )}
                      </span>
                    </div>
                  </div>
                )
              )
            }}
          </Form.Item>
        }
        open={popoverVisible}
        placement="right"
      >
        <Form.Item
          label={widthLabel ? label || t('密码') : null}
          name="password"
          normalize={(value: any) => {
            return value.trim()
          }}
          rules={[
            {
              required: true,
              message: t('请输入密码'),
            },
            {
              min: 8,
              message: t('密码最小长度为8'),
            },
            {
              max: 20,
              message: t('密码最大长度为20'),
            },
            () => ({
              validator(_, value) {
                if (!value) {
                  setPopoverVisible(false)
                  return Promise.resolve()
                } else {
                  setPopoverVisible(true)
                  if (!MangoRegExp.isPassword(value)) {
                    return Promise.reject(
                      new Error(
                        t(
                          '请输入 8-20 位密码，必须包含字母、数字、符号中至少2种',
                        ),
                      ),
                    )
                  } else {
                    return Promise.resolve()
                  }
                }
              },
            }),
          ]}
        >
          <Input.Password
            maxLength={20}
            placeholder={t('请输入密码')}
            allowClear
            onBlur={() => {
              setPopoverVisible(false)
            }}
          />
        </Form.Item>
      </Popover>
      <Form.Item
        dependencies={['password']}
        name="repeatPassword"
        normalize={(value: any) => {
          return value.trim()
        }}
        rules={[
          {
            required: true,
            message: t('请再次输入密码'),
          },
          {
            min: 8,
            message: '密码最小长度为8',
          },
          {
            max: 20,
            message: '密码最大长度为20',
          },
          (_form) => ({
            validator(_, value) {
              if (!value || _form.getFieldValue('password') === value) {
                return Promise.resolve()
              }
              return Promise.reject(new Error(t('两次输入密码不匹配')))
            },
          }),
        ]}
      >
        <Input.Password maxLength={20} placeholder={t('请再次输入密码')} />
      </Form.Item>
    </>
  )
}

export default MangoPassword
