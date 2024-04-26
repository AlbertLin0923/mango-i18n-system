import { useTranslation } from 'react-i18next'
import { Form, Row, Col, Input, Select, Space, Button, Checkbox } from 'antd'
import { SearchOutlined, RetweetOutlined } from '@ant-design/icons'
import { LoadableButton } from '@mango-kit/components'
import { useControllableValue } from 'ahooks'

import { commonSelectProps } from '@/utils'

export type SearchFormProps = PropsWithChildren<{
  localeDictWithLabel: { label: string; value: string }[]
  moduleList: string[]
  onSubmit: (values: any) => void
}>

export interface SearchOptionsType {
  textType: string | undefined
  text: string | undefined
  modules: string[]
  filter: [boolean, string]
}

const SelectCheckbox: FC<{
  localeDictWithLabel: { label: string; value: string }[]
  value?: any[]
  onChange?: (checked: boolean, type: string) => void
}> = (props) => {
  const { localeDictWithLabel = [] } = props
  const [state, setState] = useControllableValue<[boolean, string]>(props)
  const [_checked, _type] = state

  const handleCheckboxChange = (checked: boolean) => {
    setState([checked, _type])
  }

  const handleSelectChange = (type: string) => {
    setState([_checked, type])
  }

  return (
    <div className="flex items-center">
      <Checkbox
        checked={_checked}
        className="mr-3"
        onChange={(e) => handleCheckboxChange(e.target.checked)}
      />

      <div className="flex items-center">
        <div className="flex-none">只显示未翻译</div>
        <Select
          className="min-w-40"
          options={localeDictWithLabel}
          value={_type}
          variant="borderless"
          onChange={handleSelectChange}
        />
        <div className="flex-none">的文案</div>
      </div>
    </div>
  )
}

const SearchForm: FC<SearchFormProps> = ({
  localeDictWithLabel,
  moduleList,
  onSubmit,
  children,
}) => {
  const { t } = useTranslation()
  const [form] = Form.useForm()

  return (
    <Form
      form={form}
      labelAlign="left"
      name="form"
      onFinish={(values: SearchOptionsType) => {
        onSubmit(values)
      }}
    >
      <Row gutter={32}>
        <Col>
          <Form.Item initialValue={''} label={t('文案')} name="text">
            <Input
              addonBefore={
                <Form.Item initialValue="zh-CN" name="textType" noStyle>
                  <Select
                    options={localeDictWithLabel}
                    style={{ minWidth: '200px' }}
                  />
                </Form.Item>
              }
              placeholder="请输入文案，支持模糊搜索"
              style={{ width: '420px' }}
              allowClear
            />
          </Form.Item>
        </Col>
        <Col>
          <Form.Item initialValue={[]} label={t('所属模块')} name="modules">
            <Select
              {...commonSelectProps}
              maxTagCount="responsive"
              mode="multiple"
              options={moduleList?.map((item) => ({
                label: item,
                value: item,
              }))}
              placeholder="文案所属模块名称"
              style={{ width: '200px' }}
            />
          </Form.Item>
        </Col>
        <Col>
          <Form.Item initialValue={[false, 'en-US']} name="filter">
            <SelectCheckbox localeDictWithLabel={localeDictWithLabel} />
          </Form.Item>
        </Col>
      </Row>
      <Row>
        <Col>
          <Space size="middle">
            <Form.Item>
              <LoadableButton
                htmlType="submit"
                icon={<SearchOutlined />}
                type="primary"
              >
                {t('查询')}
              </LoadableButton>
            </Form.Item>

            <Form.Item>
              <Button
                icon={<RetweetOutlined />}
                onClick={() => {
                  form.resetFields()
                  form.submit()
                }}
              >
                {t('重置')}
              </Button>
            </Form.Item>

            {children}
          </Space>
        </Col>
      </Row>
    </Form>
  )
}

export default SearchForm
