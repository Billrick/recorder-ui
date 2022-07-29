import SyncImg from '@/components/syncImg'
import { service } from '@/constants/constant'
import { getToken, http } from '@/utils'
import { StarOutlined, LikeOutlined, MessageOutlined, EditOutlined, DeleteOutlined, PlusOutlined, CloseCircleOutlined } from '@ant-design/icons'
import { Button, Drawer, Image, List, Modal, Skeleton, Space, Spin, Upload } from "antd"
import { useEffect, useState } from 'react'


const Record = (props) => {
  const { category, recordModalVisible, f_setInfo, onClose, drawerVisible } = props
  const [loading, setLoading] = useState(true)
  const [records, setRecords] = useState([])
  const [currentRecord, setCurrentRecord] = useState(null)
  // const searchHandler = (values) => {
  //   console.log(values)
  // }

  const openRecordFormModal = (item) => {
    if (item) {
      setCurrentRecord(item)
    } else {
      setCurrentRecord(null)
    }
    f_setInfo({ t: 'setRecordFormModal', d: true })
  }
  const handleSubmit = (d) => {
    console.log(d)
  }

  useEffect(() => {
    async function loadImgs (img) {
      setRecords([])
      const res = await http.post('/record/list', { categoryId: category.id })
      setRecords(res.rows)
      setLoading(false)
    }
    if (category) {
      loadImgs()
    }
  }, [category])

  return (
    <>
      <Drawer
        title={<b>{category?.title}</b>}
        placement="right"
        size={'large'}
        onClose={onClose}
        visible={drawerVisible}
        extra={
          <>
            <Space size={'middle'}>
              <Button type='primary' onClick={() => openRecordFormModal()}>新建</Button>
              <Button onClick={onClose}>关闭</Button>
            </Space>
          </>
        }
      >

        <Spin spinning={loading} delay={500}>
          {loading ? (<div className='ant-list ant-list-vertical ant-list-lg ant-list-split'><ul className='ant-list-items'>
            {[{ id: 1 }, { id: 2 }].map((i) =>
              <li key={i.id} className='ant-list-item ant-list-item-no-flex'>
                <Skeleton loading={loading} active avatar>
                </Skeleton>
                <br />
                <div className='skeletonImgGroup'>
                  <Space>
                    <Skeleton.Image />
                    <Skeleton.Image />
                    <Skeleton.Image />
                  </Space><br />
                </div>
              </li>
            )}
          </ul></div>) : undefined
          }
          <div className='recordList'>
            {
              <List
                itemLayout="vertical"
                size="large"
                dataSource={records}
                renderItem={item => (
                  <List.Item
                    key={item.title}
                    actions={
                      !loading
                        ? [
                          <><StarOutlined /><span>10</span></>,
                          <><LikeOutlined /><span>20</span></>,
                          <><MessageOutlined /><span>30</span></>,
                          <>
                            <Space size={'large'}>
                              <a href='#!' title='编辑' onClick={() => openRecordFormModal(item)}><EditOutlined /></a>
                              <a href='#!' title='删除'><DeleteOutlined /></a>
                              <span>{item.createTime}</span>
                            </Space>
                          </>,

                        ]
                        : undefined
                    }
                  >

                    <div className='skeletonImgGroup' style={{ 'paddingLeft': '10px' }}>
                      <Image.PreviewGroup>
                        {item.imgs.map(img =>
                          <SyncImg key={img.sha} width={100} height={100} imgUrl={img.imgUrl}></SyncImg>
                        )}
                      </Image.PreviewGroup>
                    </div>
                    <div className='recordContent'>
                      {item.recordDesc}
                    </div>
                  </List.Item>
                )}
              />
            }
          </div>
        </Spin>
      </Drawer>
      <RecordFormModal record={currentRecord} categoryId={category?.id} handleSubmit={handleSubmit} recordModalVisible={recordModalVisible} f_setInfo={f_setInfo}></RecordFormModal>
    </>
  )
}


const RecordFormModal = (props) => {
  const { recordModalVisible, categoryId, record, handleSubmit, f_setInfo } = props
  const token = getToken()
  const [fileList, setFileList] = useState([])
  const handleCancel = () => {
    f_setInfo({ t: 'setRecordFormModal', d: false })
  }

  const getBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result)
      reader.onerror = (error) => reject(error)
    })
  const handleChange = ({ fileList: newFileList }) => setFileList(newFileList)

  const handleRemove = (f) => {
    console.log(f)
    // http.post('/f/del', { categoryId }).then(d => {

    // }).catch(e => {
    //   console.log('/f/del', e)
    // })
    return true
  }
  const setData = () => {
    let d = {}
    d.categoryId = categoryId
    return d
  }
  //actions: { download: function, preview: function, remove: function }
  const renderItem = (originNode, file, fileList, actions) => {
    //console.log(originNode, file, fileList, actions)
    return (
      <div className="ant-upload-list-item ant-upload-list-item-done ant-upload-list-item-list-type-picture-card" style={{ 'overflow': 'hidden' }}>
        <CloseCircleOutlined className='imgClose' onClick={() => actions.remove(file)} />
        <SyncImg height={'100%'} width={'100%'} imgUrl={file.response ? file.response.data.content.url : getBase64(file.originFileObj)}></SyncImg>
      </div >
    )
  }

  useEffect(() => {
    if (record) {
      const imgs = record.imgs.map(item => {
        return { name: item.fileName, uid: item.sha, url: ``, response: { data: { content: { sha: item.sha, url: item.imgUrl } } } }
      })
      setFileList(imgs)
    }
  }, [record, recordModalVisible])// eslint-disable-line
  return (<>
    <Modal
      visible={recordModalVisible}
      onOk={handleSubmit}
      onCancel={handleCancel}
      title={record ? '编辑回忆' : '创建记忆'}
    >
      <div className='recorUpload'>
        <Upload
          action={service.baseUrl + '/f/upload'}
          listType="picture-card"
          fileList={fileList}
          onChange={handleChange}
          itemRender={renderItem}
          headers={{ Authorization: `Bearer ${token}` }}
          data={setData()}
        >
          <div>
            <PlusOutlined />
            <div
              style={{
                marginTop: 8,
              }}
            >
              上传
            </div>
          </div>

        </Upload>
      </div>

    </Modal>
  </>)
}

export { Record }