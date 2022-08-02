import './index.scss'

import { Link, useLocation, useNavigate } from 'react-router-dom'
import { RobotOutlined, PartitionOutlined, SettingOutlined, PoweroffOutlined, LoginOutlined, UserOutlined, ProfileOutlined } from '@ant-design/icons'
import { Menu as AntMenu, message, Popconfirm } from 'antd'
import React, { useState } from 'react'
import { isLogin, removeToken } from '@/utils'
import { useEffect } from 'react'
import { observer } from 'mobx-react-lite'
import { useStore } from '@/store'

function Menu () {
  const { tokenStore } = useStore()
  const navigate = useNavigate()
  const [menus, setMenus] = useState([])
  const logout = () => {
    tokenStore.doLogout().then(d => {
      message.success(d.msg)
      removeToken()
      navigate('/login', { replace: true })
    }).catch(e => {
    })
  }

  const changeMenu = () => {
    if (isLogin()) {
      setMenus([{
        label: <Link to='/'>广场</Link>,
        key: '/',
        icon: <PartitionOutlined />,
      }, {
        label: <Link to='/me'>我</Link>,
        key: '/me',
        icon: <RobotOutlined />,
      }, {
        label: '设置',
        key: '/setting',
        icon: <SettingOutlined />,
        children: [
          {
            label: <Link to='/recordCategory'>记录分类</Link>,
            key: '/recordCategory',
            icon: <ProfileOutlined />,
          }, {
            label: <Link to='/userCenter'>个人中心</Link>,
            key: '/userCenter',
            icon: <UserOutlined />,
          },
        ]
      },
      {
        label: <Popconfirm
          placement="bottomRight"
          title='确认是否退出?'
          onConfirm={logout}
          okText="确认"
          cancelText="取消"
        >
          <a href='#!'>退出</a>
        </Popconfirm>,
        key: '/logout',
        icon: <PoweroffOutlined />,
      }])
    } else {
      setMenus([{
        label: <Link to='/'>广场</Link>,
        key: '/',
        icon: <PartitionOutlined />,
      }, {
        label: <Link to='/login'>登录</Link>,
        key: '/login',
        icon: <LoginOutlined />,
      }])
    }
  }

  useEffect(() => {
    changeMenu()
  }, [])// eslint-disable-line

  const { pathname } = useLocation()
  return (
    <>
      <AntMenu className='menu' defaultSelectedKeys={pathname} mode="horizontal" items={menus} />
    </>
  )
}

export default observer(Menu)