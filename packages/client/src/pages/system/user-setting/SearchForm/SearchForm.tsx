import React from 'react'
import { useTranslation } from 'react-i18next'
import { Form, Row, Col, Input, Select, Space, Button, DatePicker } from 'antd'
import { SearchOutlined, RetweetOutlined } from '@ant-design/icons'

import moment, { Moment } from 'moment'

import { SearchOptionsType } from '../index'

const { Option } = Select
const { RangePicker } = DatePicker

export type SearchFormProps = React.PropsWithChildren<{
  searchOptions: SearchOptionsType
  onSubmit: (values: any) => void
}>

export type SearchFormValueType = Partial<{
  username: string
  email: string
  role: string
  account_status: string
  create_time: [Moment, Moment]
  creator: string
}>

const SearchForm: React.FC<SearchFormProps> = ({ searchOptions, onSubmit, children }) => {
  const { t } = useTranslation()
  const [form] = Form.useForm()

  const { roleMap, accountStatusMap } = searchOptions

  const handleFinish = (values: SearchFormValueType) => {
    console.log('values', values)
    onSubmit(values)
  }

  return (
    <Form
      form={form}
      labelAlign="left"
      name=""
      onFinish={handleFinish}
      style={{ margin: '0 0 20px 0' }}
    >
      <Row>
        <Col span={6}>
          <Form.Item name="username" label={t('用户名')}>
            <Input allowClear></Input>
          </Form.Item>
        </Col>
        <Col span={6} offset={1}>
          <Form.Item name="email" label={t('邮箱')}>
            <Input allowClear></Input>
          </Form.Item>
        </Col>
        <Col span={6} offset={1}>
          <Form.Item name="role" label={t('角色')}>
            <Select
              allowClear
              showSearch
              optionFilterProp="children"
              filterOption={(input, option) =>
                (String(option?.children) ?? '').toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              {roleMap.map((i) => (
                <Option value={i.value} key={i.value}>
                  {i.label}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
      </Row>

      <Row>
        <Col span={6}>
          <Form.Item name="account_status" label={t('账户状态')}>
            <Select
              allowClear
              showSearch
              optionFilterProp="children"
              filterOption={(input, option) =>
                (String(option?.children) ?? '').toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              {accountStatusMap.map((i) => (
                <Option value={i.value} key={i.value}>
                  {i.label}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>

        <Col span={10} offset={1}>
          <Form.Item name="create_time" label={t('创建时间')}>
            <RangePicker
              style={{ width: '100%' }}
              ranges={{
                Today: [moment().startOf('day'), moment().endOf('day')],
                'This week': [moment().startOf('week'), moment().endOf('week')],
                'This Month': [moment().startOf('month'), moment().endOf('month')]
              }}
              showTime
              format="YYYY-MM-DD HH:mm:ss"
            />
          </Form.Item>
        </Col>
        <Col span={6} offset={1}>
          <Form.Item name="creator" label={t('创建人')}>
            <Input allowClear></Input>
          </Form.Item>
        </Col>
      </Row>

      <Row>
        <Col span={10}>
          <Space>
            <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
              {t('查找')}
            </Button>
            <Button
              htmlType="button"
              onClick={() => {
                form.resetFields()
                form.submit()
              }}
              icon={<RetweetOutlined />}
            >
              {t('重置')}
            </Button>
            {children}
          </Space>
        </Col>
      </Row>
    </Form>
  )
}

export default SearchForm
