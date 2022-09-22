import React from 'react'
import { useTranslation } from 'react-i18next'
import { Form, Row, Col, Input, Select, Space, Button, DatePicker } from 'antd'
import { SearchOutlined, RetweetOutlined } from '@ant-design/icons'

import moment, { Moment } from 'moment'

const { Option } = Select
const { RangePicker } = DatePicker

export type SearchFormProps = React.PropsWithChildren<{
  searchOptions: SearchOptionsType
  onSubmit: (values: any) => void
}>

export type SearchFormValueType = Partial<{
  operate_way: string
  operate_type: string
  operate_time: [Moment, Moment]
  operator_name: string
  operate_field: string
}>

export type SearchOptionsType = {
  already: boolean
  operateWayMap: Array<{ label: string; value: string }>
  operateTypeMap: Array<{ label: string; value: string }>
  operatorNameMap: Array<{ label: string; value: string }>
}

const SearchForm: React.FC<SearchFormProps> = ({ searchOptions, onSubmit }) => {
  const { t } = useTranslation()
  const [form] = Form.useForm()

  const { operateWayMap, operateTypeMap, operatorNameMap } = searchOptions

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
          <Form.Item name="operate_way" label={t('操作方式')}>
            <Select
              allowClear
              showSearch
              optionFilterProp="children"
              filterOption={(input, option) =>
                (String(option?.children) ?? '').toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              {operateWayMap.map((i) => (
                <Option value={i.value} key={i.value}>
                  {i.label}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col span={6} offset={1}>
          <Form.Item name="operate_type" label={t('操作类型')}>
            <Select
              allowClear
              showSearch
              optionFilterProp="children"
              filterOption={(input, option) =>
                (String(option?.children) ?? '').toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              {operateTypeMap.map((i) => (
                <Option value={i.value} key={i.value}>
                  {i.label}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>

        <Col span={10} offset={1}>
          <Form.Item name="update_time" label={t('操作时间')}>
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
      </Row>

      <Row>
        <Col span={6}>
          <Form.Item name="operator_name" label={t('操作人')}>
            <Select
              allowClear
              showSearch
              optionFilterProp="children"
              filterOption={(input, option) =>
                (String(option?.children) ?? '').toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              {operatorNameMap.map((i) => (
                <Option value={i.value} key={i.value}>
                  {i.label}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col span={6} offset={1}>
          <Form.Item name="operate_field" label={t('操作字段')}>
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
          </Space>
        </Col>
      </Row>
    </Form>
  )
}

export default SearchForm
