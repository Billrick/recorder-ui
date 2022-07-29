import './index.scss'

//package
import { Layout as AntLayout } from "antd"
import { Outlet } from 'react-router-dom'
//commponets
import Header from "@/components/header"

const { Content } = AntLayout
function Layout () {
  return (<div>

    <AntLayout className="layout">
      <Header>
      </Header>
      <Content>
        <Outlet />
      </Content>
    </AntLayout>
  </div>)
}

export default Layout