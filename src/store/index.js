import { useContext } from "react"
import { createContext } from "react"
import TokenStore from "./token"
class RootStore {
  constructor() {
    this.tokenStore = new TokenStore()
  }
}
const rootStore = new RootStore()
const context = createContext(rootStore)
const useStore = () => useContext(context)

export { useStore }