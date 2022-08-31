import './index.scss'
import { SaveOutlined } from '@ant-design/icons'

import {
  Button,
  Col,
  Divider,
  Form,
  Input,
  message,
  Row,
  Select,
  Tabs,
} from 'antd'
import React, { useEffect, useState } from 'react'
import AvatarSelect from '@/components/avatarSelect'
import CitySelect from '@/components/citySelect'
import { http } from '@/utils'
import { useStore } from '@/store'
const { Option } = Select

const formLayout = 'vertical'


const UserCenter = () => {
  const [tabPosition, setTabPosition] = useState('left')

  const handlePosition = () => {
    const width = window.innerWidth
    if (width > 650) {
      setTabPosition('left')
    } else if (width <= 650) {
      setTabPosition('top')
    }
  }

  useEffect(() => {
    handlePosition()
    window.addEventListener('resize', handlePosition)

    return () => {
      // 组件销毁时移除监听事件
      window.removeEventListener('resize', handlePosition)
    }
  }, [])// eslint-disable-line
  return (<>
    <Tabs tabPosition={tabPosition} >
      <Tabs.TabPane tab="用户信息" key="1">
        <SetUserInfo></SetUserInfo>
      </Tabs.TabPane>
      <Tabs.TabPane tab="密码修改" key="2">
        <SetPassword></SetPassword>
      </Tabs.TabPane>
    </Tabs>

  </>)
}


function SetUserInfo () {
  const [form] = Form.useForm()
  const { userStore } = useStore()
  const [avatar, setAvatar] = useState(null)
  const onFinish = (values) => {
    values.avatar = avatar
    const locale = JSON.stringify(values.locale)
    values.locale = locale
    http.post('/user/set', values).then(d => {
      if (d.code === 200) {
        message.success(d.msg)
        userStore.setUserInfo(values)
      }
    }).catch(e => {
      console.log('/user/set', e)
    })
  }

  useEffect(() => {
    const setUserInfo = async () => {
      const d = await http.post('/user/get')
      form.setFieldsValue(d.data)
      setAvatar(d.data.avatar)
    }
    setUserInfo()
  }, [])// eslint-disable-line

  const prefixSelector = (
    <Form.Item name="prefix" noStyle>
      <Select
        style={{
          width: 70,
        }}
      >
        <Option value="86">+86</Option>
        <Option value="87">+87</Option>
      </Select>
    </Form.Item>
  )

  return (<>
    <Row>
      <Col md={1} xs={0}></Col>
      <Col md={6} xs={24}>
        <Divider orientation="left">头像</Divider>
        <AvatarSelect value={avatar} avatarChange={(v) => setAvatar(v)} />
      </Col>
      <Col md={2} xs={0}></Col>
      <Col md={15} xs={24}>
        <Divider orientation="left">基本信息</Divider>
        <Form
          layout={formLayout}
          form={form}
          className='userForm'
          onFinish={onFinish}
          initialValues={{
            prefix: '86',
          }}
          scrollToFirstError
        >
          <Form.Item
            hidden={true}
            name="id"
            label=""
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="username"
            label="邮箱"
            rules={[
              {
                type: 'email',
                message: '无效的邮箱地址!',
              },
              {
                required: true
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="nickName"
            label="昵称"
            tooltip="评论和发表时显示的名称"
            rules={[
              {
                required: true,
                whitespace: true,
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="phone"
            label="手机"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input
              addonBefore={prefixSelector}
              style={{
                width: '100%',
              }}
            />
          </Form.Item>
          <Form.Item
            name="gender"
            label="性别"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Select placeholder="请选择性别">
              <Option value="0">男</Option>
              <Option value="1">女</Option>
              <Option value="9">其他</Option>
            </Select>
          </Form.Item>
          <Form.Item name="locale"
            label="常住地">
            <CitySelect></CitySelect>
          </Form.Item>
          <div style={{ 'textAlign': 'center' }}>
            <Button type="primary" htmlType="submit" >
              <SaveOutlined />保存
            </Button>
          </div>
        </Form>
      </Col>
    </Row>

  </>)
}


const SetPassword = () => {
  const [form] = Form.useForm()

  const onFinish = (values) => {
    http.post('/user/setPassword', values).then(d => {
      if (d.code === 200) {
        message.success(d.msg)
        form.resetFields()
      }
    }).catch(e => {
      console.log('/user/setPassword', e)
    })
  }

  return (<>
    <Form
      layout={formLayout}
      form={form}
      name="register"
      className='passwordForm'
      onFinish={onFinish}
      scrollToFirstError
    >
      <Form.Item name="currentPassword"
        label="当前密码"
        rules={[
          {
            required: true,
          },
        ]}>
        <Input.Password />
      </Form.Item>
      <Form.Item name="password"
        label="新密码"
        rules={[
          {
            required: true,
          }, ({ getFieldValue }) => ({
            validator (_, value) {
              if (value && value === getFieldValue('currentPassword')) {
                return Promise.reject(new Error('新密码不能和老密码一致!'))
              }
              return Promise.resolve()
            },
          }),
        ]}>
        <Input.Password />
      </Form.Item>
      <Form.Item name="rePassword"
        label="确认密码"
        rules={[
          {
            required: true,
          }, ({ getFieldValue }) => ({
            validator (_, value) {
              if (!value || getFieldValue('password') === value) {
                return Promise.resolve()
              }
              return Promise.reject(new Error('两次密码不匹配,请重试!'))
            },
          }),
        ]}>
        <Input.Password />
      </Form.Item>
      <div style={{ 'textAlign': 'center' }}>
        <Button type="primary" htmlType="submit" >
          <SaveOutlined />保存
        </Button>
      </div>
    </Form>
  </>)
}



export default UserCenter