import { useState } from 'react'
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
import { useMount } from 'ahooks'

import * as API from '@/services/system'

import './index.module.scss'

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

export type SearchOptionsType = {
  already: boolean
  data: {
    filterExtNameMap: { label: string; value: string }[]
    extractorMap: { label: string; value: string }[]
    resolveDirPathMap: { label: string; value: string }[]
    localeDictMap: { label: string; value: string }[]
  }
}

const Page: FC = () => {
  const { t } = useTranslation()
  const [repositoryForm] = Form.useForm()
  const [extractorForm] = Form.useForm()

  const { message } = App.useApp()

  const [pageLoading, setPageLoading] = useState(false)

  const [extractorFormDisable, setExtractorFormDisable] = useState(true)

  const [searchOptions, setSearchOptions] = useState<SearchOptionsType>({
    already: false,
    data: {
      filterExtNameMap: [],
      extractorMap: [],
      resolveDirPathMap: [],
      localeDictMap: [],
    },
  })

  const [repositoryActionMessages, setRepositoryActionMessages] = useState<
    string[]
  >([])

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [repositoryFormSetting, setRepositoryFormSetting] =
    useState<RepositoryFormSettingType>({
      gitRepositoryUrl: '',
      gitAccessUserName: '',
      gitAccessToken: '',
      resolveGitBranchName: '',
      projectDirName: '',
    })

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [extractorFormSetting, setExtractorFormSetting] =
    useState<ExtractorFormSettingType>({
      filterExtNameList: [],
      localeDict: [],
      extractor: '',
      resolveDirPathList: [],
    })

  const getSearchOptions = async () => {
    const { data } = await API.getSearchOptions()
    if (data) {
      setSearchOptions(() => ({
        data: data?.searchOptions,
        already: true,
      }))
      setRepositoryActionMessages(() => [...(data?.message ?? [])])
    }
  }

  const getSetting = async () => {
    const { data, success } = await API.getSetting()
    if (success) {
      const {
        setting: {
          gitRepositoryUrl,
          gitAccessUserName,
          gitAccessToken,
          resolveGitBranchName,
          projectDirName,
          filterExtNameList,
          localeDict,
          extractor,
          resolveDirPathList,
        },
      } = data

      const _repositoryFormSetting = {
        gitRepositoryUrl,
        gitAccessUserName,
        gitAccessToken,
        resolveGitBranchName,
        projectDirName,
      }

      const _extractorFormSetting = {
        filterExtNameList,
        localeDict,
        extractor,
        resolveDirPathList,
      }

      setRepositoryFormSetting(() => _repositoryFormSetting)
      repositoryForm.setFieldsValue(_repositoryFormSetting)

      setExtractorFormSetting(() => _extractorFormSetting)
      extractorForm.setFieldsValue(_extractorFormSetting)

      // 如果代码仓库配置已经完善,则放开项目解析配置
      if (
        Object.values(_repositoryFormSetting).every((i) => {
          if (i) {
            return true
          } else {
            return false
          }
        })
      ) {
        setExtractorFormDisable(false)
      }
    }
  }

  useMount(async () => {
    setPageLoading(true)
    await getSearchOptions()
    await getSetting()
    setPageLoading(false)
  })

  const handleRepositoryFormFinish = async (
    values: RepositoryFormSettingType,
  ) => {
    setPageLoading(true)
    const { success, data } = await API.updateSetting({
      setting: values,
    })
    setPageLoading(false)
    if (success) {
      if (data?.message?.length > 0) {
        message.success(data?.message.join(','))
        setRepositoryActionMessages(() => [...data.message])
      }
      message.success(t('代码仓库配置设置成功'))
      await getSearchOptions()
      setExtractorFormDisable(false)
    }
  }

  const handleExtractorFormFinish = async (
    values: ExtractorFormSettingType,
  ) => {
    setPageLoading(true)
    const { success, data } = await API.updateSetting({
      setting: values,
    })
    setPageLoading(false)
    if (success) {
      if (data?.message?.length > 0) {
        message.success(data?.message.join(','))
      }
      message.success(t('项目解析配置设置成功'))
    }
  }

  const renderMessage = (str: string) => {
    if (str.includes('获取仓库最近一次提交记录')) {
      return str.split('\n').map((it, index) => {
        return <p key={it}>{it}</p>
      })
    } else {
      return str
    }
  }

  return (
    <div className="page-container">
      <Spin spinning={pageLoading} tip="正在加载配置，请稍候。。。">
        <Card className="card">
          <Collapse defaultActiveKey={['1']}>
            <Collapse.Panel header={t('文案解析器操作日志')} key="1">
              <Timeline mode="left">
                {repositoryActionMessages.map((i, index) => {
                  return (
                    <Timeline.Item key={i}>{renderMessage(i)}</Timeline.Item>
                  )
                })}
              </Timeline>
            </Collapse.Panel>
          </Collapse>
        </Card>

        <Card
          className="card"
          title={
            <div className="card-title">
              <span className="card-title-text">{t('代码仓库配置')}</span>
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
            onFinish={handleRepositoryFormFinish}
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
                <Button htmlType="submit" type="primary">
                  确定
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Card>

        <Card className="card" title="项目解析配置">
          <Form
            form={extractorForm}
            labelAlign="left"
            name="extractorForm"
            onFinish={handleExtractorFormFinish}
          >
            <Form.Item
              label="解析的文件后缀名"
              name="filterExtNameList"
              rules={[{ required: true }]}
            >
              <Select
                disabled={extractorFormDisable}
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
                {searchOptions?.data?.filterExtNameMap.map((i: any) => (
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
                disabled={extractorFormDisable}
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
                {searchOptions?.data?.localeDictMap.map((i) => (
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
                disabled={extractorFormDisable}
                filterOption={(input, option) =>
                  String(option?.children)
                    .toLowerCase()
                    .indexOf(input.toLowerCase()) >= 0
                }
                optionFilterProp="children"
                allowClear
                showSearch
              >
                {searchOptions?.data?.extractorMap.map((i) => (
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
                disabled={extractorFormDisable}
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
                {searchOptions?.data?.resolveDirPathMap.map((i) => (
                  <Select.Option key={i.value} value={i.value}>
                    {i.label}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item style={{ textAlign: 'right' }}>
              <Space>
                <Button
                  disabled={extractorFormDisable}
                  htmlType="button"
                  onClick={() => {
                    extractorForm.resetFields()
                  }}
                >
                  重置
                </Button>
                <Button
                  disabled={extractorFormDisable}
                  htmlType="submit"
                  type="primary"
                >
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
