import './App.css'
import { unstable_HistoryRouter as HistoryRouter, Routes, Route } from 'react-router-dom'

//pages
import Layout from '@/pages/layout'
import Login from '@/pages/login'
import Home from '@/pages/home'
// antdesign 中文
import zh_CN from 'antd/es/locale/zh_CN'
import { ConfigProvider } from 'antd'
import 'moment/locale/zh-cn'
import moment from 'moment'
//component

//utils
import { history } from './utils'
import Square from './pages/square'
import AuthComponent from './components/auth/AuthComponent'
import RecordCategory from './pages/setting/recordCategory'
import UserCenter from './pages/setting/userCenter'

moment.locale('cn')

function App () {
  return (
    <div className="App">
      <ConfigProvider locale={zh_CN}>
        <HistoryRouter history={history}>
          <Routes>
            <Route path='/login' element={<Login />}></Route>
            <Route path='/' element={<Layout />}>
              {/* 二级路由 */}
              <Route path='/me' element={<AuthComponent><Home /></AuthComponent>}></Route>
              <Route index element={<Square />}></Route>
              <Route path='/userCenter' element={<UserCenter />}></Route>
              <Route path='/recordCategory' element={<RecordCategory />}></Route>
            </Route>
          </Routes>
        </HistoryRouter>
      </ConfigProvider>
    </div>
  )
}

export default App
