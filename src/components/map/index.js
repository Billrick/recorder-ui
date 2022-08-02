import './index.scss'
import { CheckOutlined, PoweroffOutlined } from '@ant-design/icons'
import React, { useEffect, useState } from "react"
import { Map, Markers } from 'react-amap'
import { Button, Input, message } from 'antd'
import { map } from '@/constants/constant'
import { render } from 'react-dom'

const amapkey = map.base.key
const defaultZoom = map.zoom.default

let placeSearch = null
let autocomplete = null
function initSearchPlugin () {
  window.AMap.plugin(["AMap.PlaceSearch"], function () {
    placeSearch = new window.AMap.PlaceSearch({
      pageSize: 5, // 单页显示结果条数
      pageIndex: 1, // 页码
      //city: "010", // 兴趣点城市
      //citylimit: true,  //是否强制限制在设置的城市内搜索
      //map: map, // 展现结果的地图实例
      //panel: "panel", // 结果列表将在此容器中进行展示。
      //autoFitView: true // 是否自动调整地图视野使绘制的 Marker点都处于视口的可见范围
    })

  })
}

const AMap = (props) => {
  const { clearFlag, f_setInfo, children, initPoi } = props
  let [initCenterPoint, setInitCenterPoint] = useState(null)
  //地图中心点
  const [positionCenter, setPositionCenter] = useState(null)
  //地图层级
  const [zoom, setZoom] = useState(defaultZoom)
  //标记数组
  const [markerArr, setMarkerArr] = useState([])
  //标记数组实例
  const [markersInstance, setMarkersInstance] = useState([])
  //地图实例
  const [mapInstance, setMapInstance] = useState(null)
  //当前选中的标记
  const [currentMarker, setCurrentMarker] = useState(null)
  //搜索列表和标记被选择时 设置的状态
  const [poiId, setPoiId] = useState(null)

  const [poiInfo, setPoiInfo] = useState(null)
  const [poiLocation, setPoiLocation] = useState(null)
  const [infoWindowStatus, setInfoWindowStatus] = useState(null)

  //父子组件通讯方法
  const setInfo = (json) => {
    if (json.type === 'marker') {
      setMarkerArr(json.data)
      setInfoWindowStatus(null)
    } else if (json.type === 'clickSearchItem') {
      setPositionCenter([json.data.data.location.lng, json.data.data.location.lat])
    } else if (json.type === 'setPoi') {
      setPoiId(json.data)
    } else if (json.type === 'clickMarkerOk') {
      //close 
      console.log('确认选择', poiInfo)
      f_setInfo({ t: 'poi', d: poiInfo })
    }
  }

  const clearMap = () => {
    setPositionCenter(null)
    setMarkerArr([])
    setMarkersInstance([])
    setCurrentMarker(null)
    setPoiId(null)
    setPoiInfo(null)
    setPoiLocation(null)
    setInfoWindowStatus(null)
    setZoom(19)
  }

  //markers 事件
  const markerEvents = {
    created: (markers) => {
      if (markers) {
        setMarkersInstance(markers)
      }
    },
    click: (d, marker) => {
      const extData = marker.w.extData
      //获取当前marker实例并渲染
      if (currentMarker) currentMarker.render(renderMarker)
      marker.render(renderActiveMarker)
      setCurrentMarker(marker)
      const location = marker.De.position
      //设置中心点
      setPositionCenter([location.lng + -0.0007, location.lat])
      setZoom(20)
      //设置地点关键信息
      if (!poiId || poiId.id !== extData.id) {
        setPoiId({ id: extData.id, index: extData.index })
      }
      getDetails(showInfo, location)
    },
    mouseover: (e, marker) => {
      marker.render(renderHoverMarker)
    },
    mouseout: (e, marker) => {
      if (!currentMarker || marker.w.extData.index !== currentMarker.w.extData.index) {
        marker.render(renderMarker)
      }
    }
  }

  const showInfo = (result, location) => {
    if (result.poiList && result.poiList.pois && result.poiList.pois.length > 0) {
      const p = result.poiList.pois[0]
      setPoiInfo(p)
      if (location) {
        setPoiLocation(location)
      } else {
        setPoiLocation(p.location)
      }
      setInfoWindowStatus(0)
    }
  }


  const getDetails = (fn, location) => {
    //获取信息
    placeSearch.getDetails(poiId.id, function (status, result) {
      if (status === 'complete' && result.info === 'OK') {
        fn(result, location)
      }
    })
  }

  //map地图事件
  const mapEvents = {
    created: (mapinstance) => {
      setMapInstance(mapinstance)
      const point = mapinstance.getCenter()
      console.log('map created')
      setInitCenterPoint([point.lng, point.lat])
      initSearchPlugin()
    }
  }

  const renderMarker = (d) => {
    return (
      <div className={'amap-icon amap-icon-marker marker-' + d.index} >
      </div>
    )
  }

  const renderHoverMarker = (d) => {
    return (
      <div className={'amap-icon amap-icon-marker hover-marker-' + d.index} >
      </div>
    )
  }

  const renderActiveMarker = (d) => {
    return (
      <div className={'amap-icon amap-icon-marker active-marker-' + d.index} >
      </div>
    )
  }

  useEffect(() => {
    if (initPoi && initPoi.id) {
      setPoiId({ id: initPoi.id })
    }
  }, [mapInstance])// eslint-disable-line

  useEffect(() => {//生成marker后 居中
    if (mapInstance) {
      if (!markerArr || markerArr.length === 0) { return }
      mapInstance.setFitView(null, false, [150, 60, 100, -25])
    }
  }, [markerArr])// eslint-disable-line

  useEffect(() => {
    if (!poiId) {
      setCurrentMarker(null)
      return
    }
    //触发maker的click事件
    if (markersInstance != null && markersInstance.length > 0) {
      const markerInstance = markersInstance.filter(mi => mi.w.extData.id === poiId.id)[0]
      markerInstance.nf.click[0].yb({ type: 'click', target: markerInstance.nf.click[0].cf, lnglat: markerInstance.De.position })
    }
    if (initPoi && initPoi.id) {
      getDetails(function (result) {
        f_setInfo({ t: 'clearInitPoi' })
        if (result.poiList && result.poiList.pois && result.poiList.pois.length > 0) {
          setMarkerArr(result.poiList.pois.map((x, i) => {
            return {
              'id': x.id,
              'index': i,
              'name': x.name,
              'icon': '//a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-' + (i + 1) + '.png',
              'position': //[x.location.lng, x.location.lat]
              {
                'longitude': x.location.lng,
                'latitude': x.location.lat
              },
              'address': x.address,
              'title': x.name
            }
          }))
          const p = result.poiList.pois[0]
          //showInfo(result)
          setPositionCenter([p.location.lng + -0.0007, p.location.lat])
          setZoom(15)
        }

      })
    }
  }, [poiId])// eslint-disable-line

  useEffect(() => {
    if (clearFlag === 1) {//close
      clearMap()
    } else if (clearFlag === -1) {//open
      setPositionCenter(initCenterPoint)
      setZoom(defaultZoom)
      if (mapInstance && initPoi && initPoi.id) {
        setPoiId({ id: initPoi.id })
      }
    }
  }, [clearFlag])// eslint-disable-line

  return (
    <>
      {/* mapStyle='amap://styles/dark' */}
      <Map amapkey={amapkey} center={positionCenter} zoom={zoom} events={mapEvents} version='1.4.2&plugin=AMap.Geocoder,AMap.Autocomplete'>
        <MapSearchInput markerArr={markerArr} clearFlag={clearFlag} className='mapToolBar' poiId={poiId} f_setInfo={setInfo}></MapSearchInput>
        <Markers markers={markerArr} events={markerEvents} render={renderMarker}></Markers>
        <MapInfoWindow f_setInfo={setInfo} status={infoWindowStatus} poi={poiInfo} location={poiLocation}></MapInfoWindow>
        {children}
      </Map>
    </>
  )
}

const MapSearchInput = (props) => {
  const { f_setInfo, poiId, clearFlag, markerArr } = props//, __ele__, __map__
  const [word, setWord] = useState('')
  //const map = __map__


  const initAutoComplete = () => {
    window.AMap.plugin(["AMap.Autocomplete"], function () {
      var autoOptions = {
        // 城市，默认全国 
        //city: "北京",
        // 使用联想输入的input的id
        input: "input"
      }
      autocomplete = new window.AMap.Autocomplete(autoOptions)
    })
  }

  const onSearch = (word, event) => {
    if (!placeSearch) {
      message.error('组件还在加载中!')
      return
    }
    //关键字查询
    placeSearch.search(word, (status, result) => {
      if (status === 'complete') {
        const positions = result.poiList.pois.map((x, i) => {
          return {
            'id': x.id,
            'index': i,
            'name': x.name,
            'icon': '//a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-' + (i + 1) + '.png',
            'position': //[x.location.lng, x.location.lat]
            {
              'longitude': x.location.lng,
              'latitude': x.location.lat
            },
            'address': x.address,
            'title': x.name
          }
        })
        f_setInfo({ type: 'marker', data: positions })
      }
      f_setInfo({ type: 'setPoi', data: null })
    })
  }
  const searchItemClickHandle = (id, index) => {
    f_setInfo({ type: 'setPoi', data: { id: id, index: index } })
  }
  const getItemClass = (id, idx) => {
    if (poiId && id === poiId.id) {
      return 'active-marker-' + idx
    }
    return 'marker-' + idx
  }

  const searchInputChange = (e) => {
    setWord(e.target.value)
  }

  useEffect(() => {
    initAutoComplete()
    autocomplete.on('select', function (d) {
      onSearch(d.poi.name)
    })
  }, [])// eslint-disable-line

  useEffect(() => {
    if (clearFlag === 1) {
      setWord('')
    }
  }, [clearFlag])
  return (
    <div className='searchDiv'>
      <Input.Search className='searchInput' value={word} onChange={searchInputChange} id='input' autoComplete='off' placeholder="搜索位置" onSearch={onSearch} enterButton />
      <div id='panel'>
        {markerArr.map((item, i) => <div className='searchListItem' key={item.id} onClick={() => { searchItemClickHandle(item.id, i) }}>
          <span className={'map-icon ' + getItemClass(item.id, i)}></span>
          <div className='poiInfo'>
            <div className='title'>{item.name}</div>
            <div className='address'>{item.address}</div>
          </div>
        </div>)}
      </div>
    </div>
  )
}



const MapInfoWindow = (props) => {
  const { __map__, poi, location, status, f_setInfo } = props
  const mapInstance = __map__

  function clickOk () {
    f_setInfo({ type: 'clickMarkerOk', data: 'ok' })
  }
  const initInfoWindow = () => {
    var div = document.createElement('div')
    render(
      <div>
        <b>名称：{poi.name}</b>
        <br />
        地址：{poi.address}
        <br />
        电话：{poi.tel}
        <br />
        类型：{poi.type}
        <br />
        <br />
        <Button type="primary" block size='small' icon={<CheckOutlined />} onClick={() => clickOk()}>就决定是你了!</Button>
      </div>, div)
    //显示信息框
    const info = new window.AMap.InfoWindow({
      content: div,
      offset: new window.AMap.Pixel(3, -30)
    })
    //添加信息框
    info.open(mapInstance, [location.lng, location.lat])

  }
  useEffect(() => {
    if (status === 0) {
      initInfoWindow()
    }
  }, [poi, status])// eslint-disable-line
  return null
}


const MapInput = (props) => {
  const { clearFlag } = props
  const [poiInfo, setPoiInfo] = useState(null)
  const [inputClearFlag, setInputClearFlag] = useState(0)
  const [panelVisible, setPanelVisible] = useState(false)
  const [initPoi, setInitPoi] = useState(null)

  const setInfo = (d) => {
    if (d.t === 'poi') {
      setPoiInfo(d.d)
      setPanelVisible(false)
    } else if (d.t === 'clearInitPoi') {
      setInitPoi(null)
    }
  }
  useEffect(() => {
    setPanelVisible(false)
    setInputClearFlag(clearFlag)
    if (clearFlag === -1) {
      setInitPoi(props.value)
    } else if (clearFlag === 1) {
      setInitPoi(null)
    }
  }, [clearFlag])// eslint-disable-line
  useEffect(() => {
    props.onChange(poiInfo)
  }, [poiInfo])// eslint-disable-line
  return (
    <>
      <Input readOnly={true} onClick={() => { setPanelVisible(!panelVisible) }} value={props.value?.name} ></Input>
      <div className={panelVisible ? 'amap-panel' : 'amap-panel amap-panel-hide'}>
        <AMap f_setInfo={setInfo} initPoi={initPoi} clearFlag={inputClearFlag}>
          <div className='closeBtn' >
            <Button onClick={() => { setPanelVisible(false) }} type="primary" danger icon={<PoweroffOutlined />}>关闭地图</Button>
          </div>
        </AMap></div>
    </>
  )
}


export { AMap, MapSearchInput, MapInput }