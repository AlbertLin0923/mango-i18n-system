import React from 'react'
import { useTranslation } from 'react-i18next'
import { Form, Row, Col, Input, Select, Space, Button } from 'antd'
import { SearchOutlined, RetweetOutlined } from '@ant-design/icons'

import LoadableButton from '@/components/LoadableButton'
import SelectCheckbox from '../SelectCheckbox/index'

const { Option } = Select

export type SearchFormProps = React.PropsWithChildren<{
  localeDictWithLabel: Array<any>
  moduleList: Array<string>
  onSubmit: (values: any) => void
}>

export interface SearchOptionsType {
  textType: string | undefined
  text: string | undefined
  modules: Array<string>
  filter: [boolean, string]
}

const SearchForm: React.FC<SearchFormProps> = ({
  localeDictWithLabel,
  moduleList,
  onSubmit,
  children
}) => {
  const { t } = useTranslation()
  const [form] = Form.useForm()

  const handleSubmit = async (values: SearchOptionsType) => {
    await onSubmit(values)
  }

  const prefixSelector = (
    <Form.Item name="textType" noStyle initialValue="zh-CN">
      <Select style={{ minWidth: '200px' }}>
        {localeDictWithLabel.map((i) => (
          <Option value={i.value} key={i.value}>
            {i.label}
          </Option>
        ))}
      </Select>
    </Form.Item>
  )

  return (
    <Form
      form={form}
      labelAlign="left"
      name="form"
      style={{ margin: '0 0 20px 0' }}
      onFinish={handleSubmit}
    >
      <Row>
        <Col span={8}>
          <Form.Item name="text" label={t('字段')} initialValue={''}>
            <Input allowClear addonBefore={prefixSelector} placeholder="请输入字段，支持模糊搜索" />
          </Form.Item>
        </Col>

        <Col span={6} offset={1}>
          <Form.Item name="modules" label={t('所属模块')} initialValue={[]}>
            <Select
              showSearch
              mode="multiple"
              allowClear
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
                    <Option value={item} key={item}>
                      {item}
                    </Option>
                  )
                })}
            </Select>
          </Form.Item>
        </Col>
        <Col span={8} offset={1}>
          <Form.Item name="filter" initialValue={[false, 'en-US']} noStyle>
            <SelectCheckbox localeDictWithLabel={localeDictWithLabel}></SelectCheckbox>
          </Form.Item>
        </Col>
      </Row>
      <Row>
        <Col>
          <Space>
            <LoadableButton type="primary" htmlType="submit" icon={<SearchOutlined />}>
              {t('查询')}
            </LoadableButton>
            <Button
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
