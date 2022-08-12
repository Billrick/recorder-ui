import { useContext } from "react"
import { createContext } from "react"
import TokenStore from "./token"
import UserStore from "./user"
class RootStore {
  constructor() {
    this.tokenStore = new TokenStore()
    this.userStore = new UserStore()
  }
}
const rootStore = new RootStore()
const context = createContext(rootStore)
const useStore = () => useContext(context)

export { useStore }