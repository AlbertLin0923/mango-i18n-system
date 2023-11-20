import { useTranslation } from 'react-i18next'
import { Form, Row, Col, Input, Select, Space, Button } from 'antd'
import { SearchOutlined, RetweetOutlined } from '@ant-design/icons'
import { LoadableButton } from '@mango-kit/components'

import SelectCheckbox from '../SelectCheckbox'

const { Option } = Select

export type SearchFormProps = PropsWithChildren<{
  localeDictWithLabel: any[]
  moduleList: string[]
  onSubmit: (values: any) => void
}>

export interface SearchOptionsType {
  textType: string | undefined
  text: string | undefined
  modules: string[]
  filter: [boolean, string]
}

const SearchForm: FC<SearchFormProps> = ({
  localeDictWithLabel,
  moduleList,
  onSubmit,
  children,
}) => {
  const { t } = useTranslation()
  const [form] = Form.useForm()

  const handleSubmit = async (values: SearchOptionsType) => {
    await onSubmit(values)
  }

  const prefixSelector = (
    <Form.Item initialValue="zh-CN" name="textType" noStyle>
      <Select style={{ minWidth: '200px' }}>
        {localeDictWithLabel.map((i) => (
          <Option key={i.value} value={i.value}>
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
          <Form.Item initialValue={''} label={t('字段')} name="text">
            <Input
              addonBefore={prefixSelector}
              placeholder="请输入字段，支持模糊搜索"
              allowClear
            />
          </Form.Item>
        </Col>

        <Col offset={1} span={6}>
          <Form.Item initialValue={[]} label={t('所属模块')} name="modules">
            <Select
              filterOption={(input, option) =>
                (String(option?.children) ?? '')
                  .toLowerCase()
                  .indexOf(input.toLowerCase()) >= 0
              }
              maxTagCount="responsive"
              mode="multiple"
              optionFilterProp="children"
              placeholder="字段所属模块名称"
              allowClear
              showSearch
            >
              {moduleList.length &&
                moduleList.map((item) => {
                  return (
                    <Option key={item} value={item}>
                      {item}
                    </Option>
                  )
                })}
            </Select>
          </Form.Item>
        </Col>
        <Col offset={1} span={8}>
          <Form.Item initialValue={[false, 'en-US']} name="filter" noStyle>
            <SelectCheckbox localeDictWithLabel={localeDictWithLabel} />
          </Form.Item>
        </Col>
      </Row>
      <Row>
        <Col>
          <Space>
            <LoadableButton
              htmlType="submit"
              icon={<SearchOutlined />}
              type="primary"
            >
              {t('查询')}
            </LoadableButton>
            <Button
              icon={<RetweetOutlined />}
              onClick={() => {
                form.resetFields()
                form.submit()
              }}
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
