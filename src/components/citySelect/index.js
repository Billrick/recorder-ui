import './index.scss'
const { map } = require("@/constants/constant")
const { Select } = require("antd")
const { useEffect, useState } = require("react")
const { Option } = Select

const CitySelect = (props) => {
  const { value, onChange } = props
  const [provinces, setProvinces] = useState([])
  const [citys, setCitys] = useState([])
  const [areas, setAreas] = useState([])
  const [provinceInfo, setProvinceInfo] = useState(null)
  const [cityInfo, setCityInfo] = useState(null)
  const [areaInfo, setAreaInfo] = useState(null)

  const [formValue, setFormValue] = useState({})

  const handleProvinceChange = (value) => {
    cityData(value, 'city')
    const { adcode, name, center, level } = provinces.filter(i => i.adcode === value)[0]
    setFormValue({ provinceInfo: { adcode, name, center, level } })
    setProvinceInfo({ adcode, name, center, level })
  }
  const onSecondCityChange = (value) => {
    cityData(value, 'area')
    const { adcode, name, center, level } = citys.filter(i => i.adcode === value)[0]
    setFormValue({ provinceInfo, cityInfo: { adcode, name, center, level } })
    setCityInfo({ adcode, name, center, level })
  }
  const onAreaChange = (value) => {
    const { adcode, name, center, level } = areas.filter(i => i.adcode === value)[0]
    setFormValue({ provinceInfo, cityInfo, areaInfo: { adcode, name, center, level } })
    setAreaInfo({ adcode, name, center, level })
  }
  const cityData = (keywords, level) => {
    fetch(map.api.getAreaSearchURL(keywords)).then(async (res) => {
      return res.json()
    }).then(d => {
      if (level === 'province') {
        setProvinces(d.districts[0].districts)
        setCitys([])
        setAreas([])
        setCityInfo(null)
        setAreaInfo(null)
      } else if (level === 'city') {
        setCitys(d.districts[0].districts)
        setAreas([])
        setCityInfo(null)
        setAreaInfo(null)
      } else if (level === 'area') {
        setAreas(d.districts[0].districts)
        setAreaInfo(null)
      } else if (level === 'city-no') {
        setCitys(d.districts[0].districts)
      } else if (level === 'area-no') {
        setAreas(d.districts[0].districts)
      } else {
        setProvinces(d.districts[0].districts)
      }
    })
  }
  //初始化加载
  useEffect(() => {
    cityData('100000')
  }, [])
  //更新表单数据
  useEffect(() => {
    onChange(formValue)
  }, [formValue])// eslint-disable-line
  //回显
  useEffect(() => {
    if (value && typeof (value) == "string") {
      const locale = JSON.parse(value)
      setFormValue(locale)
      if (locale.provinceInfo) {
        setProvinceInfo(locale.provinceInfo)
      }
      if (locale.cityInfo) {
        cityData(locale.provinceInfo.adcode, 'city-no')
        setCityInfo(locale.cityInfo)
      }
      if (locale.areaInfo) {
        cityData(locale.cityInfo.adcode, 'area-no')
        setAreaInfo(locale.areaInfo)
      }
    }
  }, [value])
  return (<>
    <Select showSearch
      filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
      className="city-select" onChange={handleProvinceChange} value={provinceInfo ? provinceInfo.adcode : null} placeholder='省'>
      {provinces && provinces.map(p => <Option key={p.adcode} value={p.adcode}>{p.name}</Option>)}
    </Select>
    <Select showSearch
      filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
      className="city-select" onChange={onSecondCityChange} value={cityInfo ? cityInfo.adcode : null} placeholder='市'>
      {citys && citys.map(p => <Option key={p.adcode} value={p.adcode}>{p.name}</Option>)}
    </Select>
    <Select showSearch
      filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
      className="city-select" value={areaInfo ? areaInfo.adcode : null} onChange={onAreaChange} placeholder='区'>
      {areas && areas.map(p => <Option key={p.adcode} value={p.adcode}>{p.name}</Option>)}
    </Select>
  </>)
}


export default CitySelect