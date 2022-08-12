import logo from '@/assets/logo.png'
import './index.scss'

import { Card, Form, Input, Checkbox, Button, message } from 'antd'
//图标
import { LockOutlined, UserOutlined } from '@ant-design/icons'
import { useStore } from '@/store'

import { useNavigate } from 'react-router-dom'
import { setToken } from '@/utils'


function Login () {
  const { tokenStore } = useStore()
  const navigate = useNavigate()
  const onFinish = async (values) => {
    try {
      tokenStore.doLogin({ username: values.username, password: values.password }).then((d) => {
        if (d.code === 200) {
          setToken(d.data.tokenValue)
          navigate('/', { replace: true })
          message.success('登录成功！')
        } else {
          message.error(`登录失败 ${d.msg}！`)
        }
      })
      //
    } catch (error) {
      message.error(`登录失败 ${error}！`)
    }

  }
  const onFinishFailed = (error) => {
    console.log(error)
  }
  return (
    <div className="login">
      <Card className="login-container">
        <img className="login-logo" src={logo} alt="" />
        <Form
          autoComplete='off'
          initialValues={{
            "isRead": true,
            username: "zhangsan@qq.com",
            password: "12345678"
          }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          labelCol={{ span: 3 }}>
          <Form.Item
            name="username"
            rules={[{ required: true, message: '请输入用户名!' }]}
          >
            <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="用户名" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: '请输入密码!' }]}
          >
            <Input
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder="密码"
            />
          </Form.Item>
          <Form.Item name="isRead" valuePropName="checked">
            <Checkbox >我已阅读并同意 《用户许可须知》</Checkbox>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" className="login-form-button">
              登录
            </Button>
          </Form.Item>

        </Form>
      </Card>
    </div >
  )
}

export default Login