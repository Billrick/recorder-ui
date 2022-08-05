import SyncImg from '@/components/syncImg'
import { service } from '@/constants/constant'
import { getToken, http } from '@/utils'
import { StarOutlined, LikeOutlined, MessageOutlined, EditOutlined, DeleteOutlined, PlusOutlined, CloseCircleOutlined } from '@ant-design/icons'
import { Button, Drawer, Form, Image, Input, List, message, Modal, Popconfirm, Skeleton, Space, Spin, Switch, Upload } from "antd"
import { useEffect, useState } from 'react'


const Record = (props) => {
  const { category, recordModalVisible, f_setInfo, onClose, drawerVisible } = props
  const [loading, setLoading] = useState(true)
  const [records, setRecords] = useState([])
  const [drawerWidth, setDrawerWidth] = useState(400)
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
    http.post('/record/save', d).then(d => {
      message.success(d.msg)
      f_setInfo({ t: 'setRecordFormModal', d: false })
      loadImgs()
    }).then(e => {
      console.log('/record/save', e)
    })
  }

  const loadImgs = async (imgs) => {
    setRecords([])
    const res = await http.post('/record/list', { categoryId: category.id })
    setRecords(res.rows)
    setLoading(false)
  }

  const removeRecord = (id) => {
    http.post(`/record/delete/${id}`).then(d => {
      message.success(d.msg)
    }).catch(e => {
      console.log(`/record/delete/${id}`, e)
    })
  }

  useEffect(() => {
    if (category) {
      loadImgs()
    }
  }, [category])// eslint-disable-line

  useEffect(() => {
    const windowWidth = window.innerWidth
    if (windowWidth > 740) {
      setDrawerWidth(740)
    } else {
      setDrawerWidth(400)
    }
  }, [drawerVisible])

  return (
    <>
      <Drawer
        title={<b>{category?.title}</b>}
        placement="right"
        //size={'large'}
        width={drawerWidth}
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
                          <><StarOutlined /><span>{item.viewCount.collection}</span></>,
                          <><LikeOutlined /><span>{item.viewCount.likeIt}</span></>,
                          <><MessageOutlined /><span>30</span></>,
                          <div style={drawerWidth === 400 ? { 'paddingTop': '10px' } : null}>
                            <Space size={'large'}>
                              <a href='#!' title='编辑' onClick={() => openRecordFormModal(item)}><EditOutlined /></a>

                              <Popconfirm
                                placement="top"
                                title='确认要删除吗?'
                                onConfirm={removeRecord}
                                okText="确认"
                                cancelText="取消"
                              >
                                <a href='#!' title='删除'><DeleteOutlined /></a>
                              </Popconfirm>
                              <span>{item.createTime}</span>
                            </Space>
                          </div>
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

  const [form] = Form.useForm()

  const [fileList, setFileList] = useState([])
  const [removeSha, setRemoveSha] = useState([])


  const handleSubmitPrev = (p) => {
    form.validateFields().then(values => {
      console.log(values)
      let data = values
      data.isPrivate = values.isPrivate ? '1' : '0'
      data.imgs = fileList.filter(f => f.originFileObj).map(f => {
        return {
          sha: f.response.data.content.sha,
          imgUrl: f.response.data.content.url,
          fileName: f.response.data.content.name
        }
      })
      if (record) {
        data.id = record.id
      }
      data.categoryId = categoryId
      data.removeSha = removeSha
      handleSubmit(data)
    }).catch(err => {
      console.log(err)
    })
    //handleSubmit
  }
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
  const handleChange = ({ fileList: newFileList }) => { setFileList(newFileList) }

  const handleRemove = (f) => {
    if (f.originFileObj) {
      http.post('/f/delTmp', {
        categoryId: categoryId,
        sha: f.response.data.content.sha,
        fileName: f.response.data.content.name
      }
      ).then(d => {
        console.log(d)
        return true
      }).catch(e => {
        console.log('/f/del', e)
      })
    } else {
      setRemoveSha([...removeSha, f.response.data.content.sha])
      return true
    }

    //return false
  }

  const remove = (actions, file) => {
    actions.remove(file)
  }
  const setData = () => {
    let d = {}
    d.categoryId = categoryId
    return d
  }
  const renderItem = (originNode, file, fileList, actions) => {
    return (
      <div className="ant-upload-list-item ant-upload-list-item-done ant-upload-list-item-list-type-picture-card" style={{ 'overflow': 'hidden' }}>
        <CloseCircleOutlined className='imgClose' onClick={() => remove(actions, file)} />
        <SyncImg height={'100%'} width={'100%'} imgUrl={file.originFileObj ? getBase64(file.originFileObj) : file.response.data.content.url}></SyncImg>
      </div >
    )
  }

  useEffect(() => {
    form.resetFields()
    setRemoveSha([])
    if (record) {
      const imgs = record.imgs.map(item => {
        return { name: item.fileName, uid: item.sha, response: { data: { content: { sha: item.sha, url: item.imgUrl, name: item.fileName } } } }
      })
      setFileList(imgs)
    } else {
      setFileList([])
    }
  }, [record, recordModalVisible])// eslint-disable-line
  return (<>
    <Modal
      visible={recordModalVisible}
      onOk={handleSubmitPrev}
      onCancel={handleCancel}
      title={record ? '编辑回忆' : '创建记忆'}
    >
      <Form
        form={form}
        initialValues={
          {
            recordDesc: record?.recordDesc,
            isPrivate: (record?.isPrivate === '1')
          }
        }
      >
        <Form.Item label="" name='title'>
          <div className='recorUpload'>
            <Upload
              action={service.baseUrl + '/f/upload'}
              listType="picture-card"
              fileList={fileList}
              onChange={handleChange}
              itemRender={renderItem}
              onRemove={handleRemove}
              headers={{ Authorization: `Bearer ${token}` }}
              data={setData()}
            >
              {fileList.length >= 6 ? null :
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
              }
            </Upload>
          </div>

        </Form.Item>
        <Form.Item label="" name='recordDesc'>
          <Input.TextArea placeholder='稍微聊聊' />
        </Form.Item>
        <Form.Item label="" valuePropName="checked" name='isPrivate'>
          <Switch checkedChildren="私人" unCheckedChildren="公开" />
        </Form.Item>
      </Form>


    </Modal>
  </>)
}

export { Record }