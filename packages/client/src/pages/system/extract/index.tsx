import {
  Form,
  Space,
  Select,
  Button,
  Input,
  App,
  Card,
  Spin,
  Tooltip,
  Collapse,
  Timeline,
} from 'antd'
import { useTranslation } from 'react-i18next'
import { InfoCircleOutlined } from '@ant-design/icons'
import { useRequest } from 'ahooks'

import * as API from '@/services/system'

type SearchOptionsType = {
  filterExtNameMap: { label: string; value: string }[]
  extractorMap: { label: string; value: string }[]
  resolveDirPathMap: { label: string; value: string }[]
  localeDictMap: { label: string; value: string }[]
}

type RepositoryFormSettingType = {
  gitRepositoryUrl: string
  gitAccessUserName: string
  gitAccessToken: string
  resolveGitBranchName: string
  projectDirName: string
}

type ExtractorFormSettingType = {
  filterExtNameList: string[]
  resolveDirPathList: string[]
  localeDict: string[]
  extractor: string
}

const renderMessage = (str: string) => {
  if (!str.includes('获取仓库最近一次提交记录')) {
    return str
  }
  return str.split('\n').map((it) => <p key={it}>{it}</p>)
}

const Page: FC = () => {
  const { t } = useTranslation()
  const [repositoryForm] = Form.useForm()
  const [extractorForm] = Form.useForm()
  const { message } = App.useApp()

  const {
    data: {
      searchOptions = {
        filterExtNameMap: [],
        extractorMap: [],
        resolveDirPathMap: [],
        localeDictMap: [],
      },
      repositoryActionMessages = [],
    } = {},
    loading: getSearchOptionsLoading,
    run: getSearchOptions,
  } = useRequest<
    {
      searchOptions: SearchOptionsType
      repositoryActionMessages: string[]
    },
    any
  >(
    async () =>
      await API.getSearchOptions().then((res) => {
        return {
          searchOptions: res?.data?.searchOptions,
          repositoryActionMessages: res?.data?.message ?? [],
        }
      }),
  )

  const { loading: getSettingLoading } = useRequest<
    RepositoryFormSettingType & ExtractorFormSettingType,
    any
  >(
    async () =>
      await API.getSetting().then((res) => {
        return res?.data?.setting
      }),
    {
      onSuccess: (data) => {
        const {
          gitRepositoryUrl,
          gitAccessUserName,
          gitAccessToken,
          resolveGitBranchName,
          projectDirName,
          filterExtNameList,
          localeDict,
          extractor,
          resolveDirPathList,
        } = data
        repositoryForm.setFieldsValue({
          gitRepositoryUrl,
          gitAccessUserName,
          gitAccessToken,
          resolveGitBranchName,
          projectDirName,
        })
        extractorForm.setFieldsValue({
          filterExtNameList,
          localeDict,
          extractor,
          resolveDirPathList,
        })
      },
    },
  )

  const { loading: editLoading, run } = useRequest<
    any,
    [RepositoryFormSettingType | ExtractorFormSettingType]
  >(async (v) => await API.updateSetting({ setting: v }), {
    manual: true,
    onSuccess: async ({ success }) => {
      if (success) {
        message.success(t('设置成功'))
        await getSearchOptions()
      }
    },
  })

  return (
    <div className="page-container">
      <Spin
        spinning={getSearchOptionsLoading || getSettingLoading}
        tip="正在加载配置，请稍候。。。"
      >
        <Card className="mb-6">
          <Collapse
            defaultActiveKey={['1']}
            items={[
              {
                key: '1',
                label: t('文案解析器操作日志'),
                children: (
                  <Timeline
                    items={repositoryActionMessages.map((i) => ({
                      children: renderMessage(i),
                    }))}
                    mode="left"
                  />
                ),
              },
            ]}
          />
        </Card>

        <Card
          className="mb-6"
          title={
            <div className="flex items-center">
              <span className="mr-2">{t('代码仓库配置')}</span>
              <Tooltip title="修改该配置任一个子项都会重新下载仓库仓库">
                <InfoCircleOutlined style={{ color: '#1890ff' }} />
              </Tooltip>
            </div>
          }
        >
          <Form
            form={repositoryForm}
            labelAlign="left"
            name="repositorySettingForm"
            onFinish={(v: RepositoryFormSettingType) => run(v)}
          >
            <Form.Item
              label="git仓库地址"
              name="gitRepositoryUrl"
              rules={[
                { required: true },
                {
                  validator: (_, value) => {
                    if (value && !String(value).trim())
                      return Promise.reject(new Error('请输入'))
                    return Promise.resolve()
                  },
                },
              ]}
            >
              <Input allowClear />
            </Form.Item>

            <Form.Item
              label="git仓库用户名"
              name="gitAccessUserName"
              rules={[
                { required: true },
                {
                  validator: (_, value) => {
                    if (value && !String(value).trim())
                      return Promise.reject(new Error('请输入'))
                    return Promise.resolve()
                  },
                },
              ]}
            >
              <Input allowClear />
            </Form.Item>

            <Form.Item
              label="git仓库访问令牌"
              name="gitAccessToken"
              rules={[
                { required: true },
                {
                  validator: (_, value) => {
                    if (value && !String(value).trim())
                      return Promise.reject(new Error('请输入'))
                    return Promise.resolve()
                  },
                },
              ]}
            >
              <Input allowClear />
            </Form.Item>

            <Form.Item
              label="解析的git分支名"
              name="resolveGitBranchName"
              rules={[
                { required: true },
                {
                  validator: (_, value) => {
                    if (value && !String(value).trim())
                      return Promise.reject(new Error('请输入'))
                    return Promise.resolve()
                  },
                },
              ]}
            >
              <Input allowClear />
            </Form.Item>

            <Form.Item
              label="项目目录名"
              name="projectDirName"
              rules={[
                { required: true },
                {
                  validator: (_, value) => {
                    if (value && !String(value).trim())
                      return Promise.reject(new Error('请输入'))
                    return Promise.resolve()
                  },
                },
              ]}
            >
              <Input allowClear />
            </Form.Item>

            <Form.Item style={{ textAlign: 'right' }}>
              <Space>
                <Button
                  htmlType="button"
                  onClick={() => {
                    repositoryForm.resetFields()
                  }}
                >
                  重置
                </Button>
                <Button htmlType="submit" loading={editLoading} type="primary">
                  确定
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Card>

        <Card className="mb-6" title="项目解析配置">
          <Form
            form={extractorForm}
            labelAlign="left"
            name="extractorForm"
            onFinish={(v: ExtractorFormSettingType) => run(v)}
          >
            <Form.Item
              label="解析的文件后缀名"
              name="filterExtNameList"
              rules={[{ required: true }]}
            >
              <Select
                filterOption={(input, option) =>
                  String(option?.children)
                    .toLowerCase()
                    .indexOf(input.toLowerCase()) >= 0
                }
                mode="multiple"
                optionFilterProp="children"
                allowClear
                showSearch
              >
                {searchOptions?.filterExtNameMap?.map((i: any) => (
                  <Select.Option key={i.value} value={i.value}>
                    {i.label}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              label="系统语言包列表"
              name="localeDict"
              rules={[{ required: true }]}
            >
              <Select
                filterOption={(input, option) =>
                  String(option?.children)
                    .toLowerCase()
                    .indexOf(input.toLowerCase()) >= 0
                }
                mode="multiple"
                optionFilterProp="children"
                allowClear
                showSearch
              >
                {searchOptions?.localeDictMap?.map((i) => (
                  <Select.Option key={i.value} value={i.value}>
                    {i.label}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              label="解析器类型"
              name="extractor"
              rules={[{ required: true }]}
            >
              <Select
                filterOption={(input, option) =>
                  String(option?.children)
                    .toLowerCase()
                    .indexOf(input.toLowerCase()) >= 0
                }
                optionFilterProp="children"
                allowClear
                showSearch
              >
                {searchOptions?.extractorMap?.map((i) => (
                  <Select.Option key={i.value} value={i.value}>
                    {i.label}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              label="解析的文件路径列表"
              name="resolveDirPathList"
              rules={[{ required: true }]}
            >
              <Select
                filterOption={(input, option) =>
                  String(option?.children)
                    .toLowerCase()
                    .indexOf(input.toLowerCase()) >= 0
                }
                mode="multiple"
                optionFilterProp="children"
                allowClear
                showSearch
              >
                {searchOptions?.resolveDirPathMap?.map((i) => (
                  <Select.Option key={i.value} value={i.value}>
                    {i.label}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item style={{ textAlign: 'right' }}>
              <Space>
                <Button
                  htmlType="button"
                  onClick={() => {
                    extractorForm.resetFields()
                  }}
                >
                  重置
                </Button>
                <Button htmlType="submit" loading={editLoading} type="primary">
                  确定
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Card>
      </Spin>
    </div>
  )
}

export default Page
