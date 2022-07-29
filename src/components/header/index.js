import './index.scss'

import Logo from "@/components/logo"
import Menu from "@/components/menu"
function Header () {
  return (
    <div className="r-header">
      <Logo />
      <Menu />
    </div>)
}

export default Header