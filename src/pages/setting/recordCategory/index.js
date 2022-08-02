import './index.scss'

import { PlusOutlined, ExclamationCircleOutlined } from '@ant-design/icons'
import { http } from "@/utils"
import { Button, message, Space, Table, Modal, Drawer } from "antd"
import { useEffect, useState } from "react"
import moment from 'moment'
import { dateFormatter, recordAction } from "@/constants/constant"
import EditModal from './editModal'
import { Record } from './record'

const { confirm } = Modal

function RecordCategory () {
  const columns = [
    {
      title: '分类',
      dataIndex: 'title',
    },
    {
      title: '描述',
      dataIndex: 'categoryDesc',
      responsive: ['lg']
    },
    {
      title: '地点',
      dataIndex: 'locale'
    },
    {
      title: '地图点位',
      dataIndex: 'mapPoint',
      responsive: ['lg']
    },
    {
      title: '开始时间',
      dataIndex: 'startDate',
      render: startData => moment(startData).format(dateFormatter.ymd_none),
      responsive: ['lg']
    },
    {
      title: '结束时间',
      dataIndex: 'endDate',
      render: endDate => moment(endDate).format(dateFormatter.ymd_none),
      responsive: ['lg']
    },
    {
      title: '',
      render: (_, record) => (
        <Space size="middle">
          <a href='#!' onClick={() => handleAction(recordAction.edit, record)}>编辑</a>
          <a href='#!' onClick={() => handleAction(recordAction.remove, record)}>删除</a>
          <a href='#!' onClick={() => handleAction(recordAction.detail, record)}>查看</a>
        </Space >
      ),
    }
  ]
  const [drawerVisible, setDrawerVisible] = useState(false)
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [data, setData] = useState([])
  const [record, setRecord] = useState(null)
  const [recordModal, setRecordModal] = useState(false)
  const [page, setPage] = useState({
    current: 1,
    pageSize: 10
  })


  const setInfo = (json) => {
    if (json.t === 'setRecordFormModal') {
      setRecordModal(json.d)
    }
  }

  //模态框处理
  const handleOk = (params, isEdit) => {
    http.post(isEdit ? '/category/update' : '/category/save', params).then(d => {
      message.success(d.msg)
      setIsModalVisible(false)
      loadData({ page })
    }).catch(e => console.log(isEdit ? '/category/update' : '/category/save', e))

  }

  const handleCancel = () => {
    setIsModalVisible(false)
  }

  const showModal = () => {
    setIsModalVisible(true)
    setRecord(null)
  }

  const handleAction = (action, record) => {
    if (action === recordAction.save) {

    } else if (action === recordAction.edit) {
      showModal()
      setRecord(record)
    } else if (action === recordAction.remove) {
      if (record && record.id) {
        confirm({
          title: '你确定想删除该分类?',
          icon: <ExclamationCircleOutlined />,
          content: '毕竟回忆很难得，想清楚嗷',
          onOk () {
            remove({ id: record.id })
          },
          onCancel () {
            message.success('恭喜你，你留住了一份回忆！')
          },
        })
      }
    } else if (action === recordAction.detail) {
      setDrawerVisible(true)
      setRecord(record)
    }
  }


  //加载数据
  const loadData = (params) => {
    http.post('/category/list', params).then(d => {
      setData(d.rows)
      setPage({
        pageNum: params.current,
        pageSize: params.pageSize,
        total: d.total
      })
    }).catch(e =>
      console.log('/category/list', e))
  }

  // 删除
  const remove = (params) => {
    http.post('/category/remove/' + params.id).then(d => {
      message.success(d.msg + '，就让往事随风！')
      setIsModalVisible(false)
      loadData({ page })
    }).catch(e =>
      console.log('/category/list', e))
  }

  const onClose = () => {
    setDrawerVisible(false)
    //setRecord(null)
  }


  useEffect(() => {
    loadData({ page })
  }, [])// eslint-disable-line
  return (<>

    <div className="searchDiv">

    </div>
    <div className="toolbar">
      <Button type="primary" icon={<PlusOutlined />} onClick={showModal}>新增</Button>
    </div>
    <EditModal isEdit={record != null} record={record} handleOk={handleOk} handleCancel={handleCancel} isModalVisible={isModalVisible}>
    </EditModal>
    <Table columns={columns} rowKey={record => record.id} dataSource={data} pagination={page}></Table>
    <Record
      f_setInfo={setInfo}
      recordModalVisible={recordModal}
      category={record} onClose={onClose}
      drawerVisible={drawerVisible}></Record>
  </>)
}
export default RecordCategory