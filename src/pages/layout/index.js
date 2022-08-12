import './index.scss'

//package
import { Layout as AntLayout } from "antd"
import { Outlet } from 'react-router-dom'
//commponets
import Header from "@/components/header"
import { getUserId, http } from '@/utils'
import { useStore } from '@/store'

const { Content } = AntLayout
function Layout () {
  const { userStore } = useStore()

  const loadUserInfo = async () => {
    const d = await http.post('/user/get/' + getUserId())
    userStore.setUserInfo(d.data)
  }
  loadUserInfo()
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