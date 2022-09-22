import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import { Form, Modal, Input, Select, Alert, message } from 'antd'

import * as API from '../../../services/locale'
import { AddLocaleParamsType, UpdateLocaleParamsType } from '../../../services/locale'
import { findStub } from '../../../utils/index'

export type LocaleModalProps = React.PropsWithChildren<{
  localeDictWithLabel: Array<any>
  moduleList: Array<string>
  type: 'add' | 'modify'
  visible: boolean
  data: Record<string, string>
  onClose: () => void
  onResetTableList: () => void
}>

const LocaleModal: React.FC<LocaleModalProps> = (props) => {
  const { localeDictWithLabel, moduleList, type, visible, data, onClose, onResetTableList } = props

  const localeDictWithLabelWithoutZh = localeDictWithLabel.filter((i) => i.value !== 'zh-CN')

  const [form] = Form.useForm()
  const { t } = useTranslation()

  const [submitLoading, setSubmitLoading] = useState<boolean>(false)

  const addLocale = async (values: AddLocaleParamsType) => {
    const { success } = await API.addLocale(values)
    setSubmitLoading(false)
    if (success) {
      message.success(t('新增成功'))
      onClose()
      onResetTableList()
    }
  }

  const updateLocale = async (values: UpdateLocaleParamsType) => {
    const { success } = await API.updateLocale(values)
    setSubmitLoading(false)
    if (success) {
      message.success(t('修改成功'))
      onClose()
      onResetTableList()
    }
  }

  const handleFormSubmit = async () => {
    try {
      const values = await form.validateFields()
      let delivery: Record<string, string> = {}
      localeDictWithLabel
        .map((i) => i.value)
        .concat('modules')
        .forEach((key) => {
          if (key === 'modules') {
            delivery[key] = values[key] ? values[key].join(',') : ''
          } else {
            delivery[key] = values[key] ? values[key].trim() : ''
          }
        })

      if (type === 'add') {
        const result = await confirmSubmit(delivery)
        console.log('result', result)
        if (result) {
          setSubmitLoading(true)
          addLocale(delivery as AddLocaleParamsType)
        } else {
          return Promise.reject(false)
        }
      } else {
        delivery = { ...delivery, 'zh-CN': data['zh-CN'] }
        const result = await confirmSubmit(delivery)
        console.log('result', result)
        if (result) {
          setSubmitLoading(true)
          updateLocale(delivery as UpdateLocaleParamsType)
        } else {
          return Promise.reject(false)
        }
      }
    } catch (error) {
      console.log(error)
    }
  }

  const confirmSubmit = async (delivery: Record<string, string>): Promise<boolean> => {
    const stub = findStub(delivery['zh-CN'])
    console.log('stub', stub)
    if (!stub) {
      return Promise.resolve(true)
    } else {
      const errorLocale = localeDictWithLabel.filter(({ label, value }) =>
        stub.some((it) => delivery[value] !== '' && !delivery[value].includes(it))
      )

      if (errorLocale.length > 0) {
        const errorLocale_arr_node = () => (
          <div>
            {errorLocale.map(({ label, value }) => {
              return (
                <p
                  key={label}
                  style={{
                    border: '1px solid #fff'
                  }}
                >
                  {label} : {delivery[value]}
                </p>
              )
            })}
          </div>
        )
        const stub_arr_node = stub.map((i, index) => {
          return (
            <span
              key={i + index}
              style={{
                padding: '5px 10px',
                border: '1px solid #fff',
                backgroundColor: '#5ed534',
                color: '#fff',
                margin: '0 5px',
                borderRadius: '6px'
              }}
            >
              {i}
            </span>
          )
        })
        return new Promise((resolve, reject) => {
          Modal.confirm({
            title: '翻译错误',
            icon: <ExclamationCircleOutlined />,
            width: 800,
            content: (
              <div style={{ padding: '10px 0px' }}>
                <div style={{ lineHeight: '2', height: '40px' }}>
                  系统检测到该词条中含有{stub_arr_node}
                  等占位符，翻译时，无须翻译占位符内容，保持原样即可
                </div>
                <div style={{ lineHeight: '2', height: '40px' }}>
                  例如: 中文词条:{' '}
                  <span
                    style={{
                      padding: '5px 10px',
                      border: '1px solid #fff',
                      backgroundColor: '#108ee9',
                      color: '#fff',
                      marginRight: '5px',
                      borderRadius: '5px'
                    }}
                  >
                    你好，{'{{name}}'}
                  </span>
                  只需翻译为 :
                  <span
                    style={{
                      padding: '5px 10px',
                      border: '1px solid #fff',
                      backgroundColor: '#108ee9',
                      color: '#fff',
                      marginRight: '5px',
                      borderRadius: '5px'
                    }}
                  >
                    Hello,{'{{name}}'}
                  </span>
                </div>

                <div style={{ marginTop: '25px' }}>
                  <p>
                    <span
                      style={{
                        padding: '5px 10px',
                        border: '1px solid #fff',
                        backgroundColor: '#ff4d4f',
                        color: '#fff',
                        marginRight: '5px',
                        borderRadius: '5px'
                      }}
                    >
                      以下词条可能翻译有误:
                    </span>
                  </p>
                  {errorLocale_arr_node()}
                </div>
              </div>
            ),
            okText: '去修改',
            cancelText: '忽略这个问题，继续提交',
            onOk: () => {
              reject(false)
            },
            onCancel: () => {
              resolve(true)
            }
          })
        })
      } else {
        return Promise.resolve(true)
      }
    }
  }

  useEffect(() => {
    const formatInitialValue: Record<string, any> = {}

    data &&
      Object.entries(data).forEach(([key, value]) => {
        if (key === 'modules') {
          if (value && value.split(',')?.length > 0) {
            formatInitialValue[key] = value.split(',')
          } else {
            formatInitialValue[key] = []
          }
        } else {
          formatInitialValue[key] = value
        }
      })

    form && form.setFieldsValue(formatInitialValue)
  }, [form, data])

  return (
    <Modal
      title={type === 'add' ? t('新增字段') : t('修改字段')}
      width="50vw"
      forceRender
      visible={visible}
      onOk={() => {
        handleFormSubmit()
      }}
      onCancel={() => {
        onClose()
        form.resetFields()
      }}
      confirmLoading={submitLoading}
    >
      <Form layout="vertical" autoComplete="off" form={form}>
        <Form.Item shouldUpdate noStyle>
          {() => {
            const str = form.getFieldValue('zh-CN') || ''
            const stub = findStub(str)
            if (!stub) {
              return false
            } else {
              const r = stub.map((i, index) => {
                return (
                  <span
                    key={i + index}
                    style={{
                      padding: '5px 10px',
                      border: '1px solid #fff',
                      backgroundColor: '#5ed534',
                      color: '#fff',
                      margin: '0 5px',
                      borderRadius: '6px'
                    }}
                  >
                    {i}
                  </span>
                )
              })
              return (
                <Alert
                  style={{ marginBottom: '20px' }}
                  message={
                    <div style={{ padding: '10px 20px' }}>
                      <div style={{ lineHeight: '2', height: '40px' }}>
                        注意: 系统检测到该词条中含有{r}
                        等占位符，翻译时，无须翻译占位符内容，保持原样即可
                      </div>
                      <div style={{ lineHeight: '2', height: '40px' }}>
                        例如: 中文词条:{' '}
                        <span
                          style={{
                            padding: '5px 10px',
                            border: '1px solid #fff',
                            backgroundColor: '#108ee9',
                            color: '#fff',
                            marginRight: '5px',
                            borderRadius: '5px'
                          }}
                        >
                          你好，{'{{name}}'}
                        </span>
                        只需翻译为 :
                        <span
                          style={{
                            padding: '5px 10px',
                            border: '1px solid #fff',
                            backgroundColor: '#108ee9',
                            color: '#fff',
                            marginRight: '5px',
                            borderRadius: '5px'
                          }}
                        >
                          Hello,{'{{name}}'}
                        </span>
                      </div>
                    </div>
                  }
                  type="info"
                  showIcon
                />
              )
            }
          }}
        </Form.Item>

        {type === 'modify' ? (
          <Form.Item label={`zh-CN (简体中文)`} shouldUpdate>
            {() => {
              return (
                <span style={{ padding: '4px 11px', border: '1px solid #ccc' }}>
                  {form.getFieldValue('zh-CN')}
                </span>
              )
            }}
          </Form.Item>
        ) : (
          <Form.Item
            name="zh-CN"
            label={`zh-CN (简体中文)`}
            rules={[
              {
                required: true,
                message: '请输入简体中文翻译'
              },
              {
                validator: (_, value) => {
                  if (value && !String(value).trim())
                    return Promise.reject(new Error(t('请输入简体中文翻译')))
                  return Promise.resolve()
                }
              }
            ]}
          >
            <Input.TextArea
              rows={2}
              showCount
              allowClear
              maxLength={1000}
              placeholder="请输入简体中文翻译"
              style={{ width: '100%' }}
            />
          </Form.Item>
        )}

        {localeDictWithLabelWithoutZh.map((item) => (
          <Form.Item name={item.value} label={item.label} key={item.value}>
            <Input.TextArea
              rows={2}
              showCount
              allowClear
              maxLength={1000}
              placeholder={`请输入翻译`}
              style={{ width: '100%' }}
            />
          </Form.Item>
        ))}

        <Form.Item name="modules" label={t('请选择字段所属模块名,支持多选')}>
          <Select
            showSearch
            mode="multiple"
            allowClear
            style={{ width: '100%' }}
            placeholder="字段所属模块名称"
            maxTagCount="responsive"
            optionFilterProp="children"
            filterOption={(input, option) =>
              (String(option?.children) ?? '').toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
          >
            {moduleList.length &&
              moduleList.map((item) => {
                return (
                  <Select.Option value={item} key={item}>
                    {item}
                  </Select.Option>
                )
              })}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default LocaleModal
