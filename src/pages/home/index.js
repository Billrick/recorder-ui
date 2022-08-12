import './index.scss'
import { StarOutlined, LikeOutlined, MessageOutlined, TagOutlined } from '@ant-design/icons'
import http from '@/utils/http'
import { Avatar, Button, Col, Comment, Drawer, Empty, Form, Image, List, Radio, Row, Select, Skeleton, Space, Spin } from 'antd'
import { useState } from 'react'
import { useEffect } from 'react'
import SyncImg from '@/components/syncImg'
import { CommentList, Editor } from '@/components/comment'
import { useStore } from '@/store'
import { observer } from 'mobx-react-lite'
import { useForm } from 'antd/es/form/Form'
const { Option } = Select

function Home () {

  const { userStore } = useStore()
  const user = userStore.getUser()
  const [loading, setLoading] = useState(true)
  const [records, setRecords] = useState([])
  const [categoryDict, setCategoryDict] = useState([])
  const [category, setCategory] = useState([])


  const [searchForm] = useForm()
  // comment start
  const [childrenDrawer, setChildrenDrawer] = useState(false)
  const [comments, setComments] = useState([])
  const [submitting, setSubmitting] = useState(false)
  const [comment, setComment] = useState(null)
  const [currentRecord, setCurrentRecord] = useState(null)
  const handleSubmit = () => {
    if (!comment) return
    setSubmitting(true)
    http.post('/c/save', { recordId: currentRecord.id, content: comment }).then(d => {
      console.log(d)
      setSubmitting(false)
      setComment(null)
      getComments(currentRecord, true)
    }).catch(e => {
      setSubmitting(false)
    })
  }
  const handleChange = (d) => {
    setComment(d.target.value)
  }

  const onChildrenDrawerClose = () => {
    setChildrenDrawer(false)
  }

  const getComments = (record, reload) => {
    setChildrenDrawer(true)
    setCurrentRecord(record)
    // if (!reload) {
    //   setComments(record.comments)
    //   return
    // }
    http.post('/c/comments/' + record.id).then(d => {
      record.comments = d.rows
      setComments(d.rows)
    }).catch(e => {

    })
  }
  // comment end

  const searchHandler = (values) => {
    loadRecords(values)
  }

  const operateView = (recordId, topic) => {
    http.post('/v/like', { recordId, topic }).then(d => {
      const index = records.findIndex(r => r.id === recordId)
      let record = records[index]
      if (topic === 'RL') {
        const flag = record.viewCount.ilikeIt
        record.viewCount.likeIt += (flag ? -1 : 1)
        record.viewCount.ilikeIt = !flag
      } else if (topic === 'RC') {
        const flag = record.viewCount.icollectionIt
        record.viewCount.collection += (flag ? -1 : 1)
        record.viewCount.icollectionIt = !flag
      }
      setRecords([...records])
    }).catch(e => { })
  }

  const tagHandle = (id) => {
    if (category.indexOf(id) !== -1) {
      return
    }
    searchForm.setFieldValue('categoryIds', [id])
    loadRecords(searchForm.getFieldValue())
  }

  const categoryChangeHandle = (e) => {
    setCategory(e)
    loadRecords(searchForm.getFieldValue())
  }

  async function loadRecords (params) {
    const res = await http.post('/record/list', params)
    setRecords(res.rows)
    setLoading(false)
  }

  useEffect(() => {
    async function loadCategoryDict (params) {
      const res = await http.post('/category/dict')
      setCategoryDict(res.data)
    }

    loadRecords()
    loadCategoryDict()
  }, [])
  return (<>
    <Form onFinish={searchHandler}
      labelCol={{ span: 1.5 }}
      wrapperCol={{ span: 10 }}
      className="ant-advanced-search-form"
      initialValues={{ status: "" }}
      form={searchForm}
    >
      <Row gutter={24}>
        <Col span={24}>
          <Form.Item
            name="categoryIds"
            label="记录分类"
          >
            <Select mode="multiple" placeholder="记录分类" allowClear onChange={categoryChangeHandle} value={category} >
              {categoryDict.map(dict => <Option key={dict.id} value={dict.id}>{dict.title}</Option>)}
            </Select>
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={24}>
        <Col span={24}>
          <Form.Item name="status" label="显示状态">
            <Radio.Group>
              <Radio.Button value="">全部</Radio.Button>
              <Radio.Button value="0">公开</Radio.Button>
              <Radio.Button value="1">私人</Radio.Button>
            </Radio.Group>
          </Form.Item>
        </Col>
      </Row>
      <Form.Item wrapperCol={{ span: 15, offset: 1.5 }}>
        <Button type="primary" htmlType="submit">
          搜索
        </Button>
      </Form.Item>
    </Form>
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
      <div className='recordBody'>
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
                      <><StarOutlined style={item.viewCount.icollectionIt ? { 'color': 'red' } : null} onClick={() => operateView(item.id, 'RC')} /><span>{item.viewCount.collection}</span></>,
                      <><LikeOutlined style={item.viewCount.ilikeIt ? { 'color': 'red' } : null} onClick={() => operateView(item.id, 'RL')} /><span>{item.viewCount.likeIt}</span></>,
                      <><MessageOutlined onClick={() => { getComments(item) }} /></>,
                      <><a href='#!' className='categoryTag' onClick={() => tagHandle(item.categoryId)}>
                        <TagOutlined /> &nbsp;{item.categoryTitle}
                      </a></>
                    ]
                    : undefined
                }
              >
                <List.Item.Meta
                  avatar={<Avatar src={'https://joeschmoe.io/api/v1/' + item.user.avatar} />}
                  title={<a href={item.href}>{item.user.nickName}</a>}
                  description={item.recordDesc}
                />
                <div className='skeletonImgGroup'>
                  <Image.PreviewGroup>
                    {item.imgs.map(img =>
                      <SyncImg key={img.sha} width={100} height={100} imgUrl={img.imgUrl}></SyncImg>
                    )}
                  </Image.PreviewGroup>
                </div>
              </List.Item>
            )}
          />
        }

      </div>
    </Spin >

    <Drawer
      title="评论列表"
      width={400}
      mask={false}
      placement={'right'}
      onClose={onChildrenDrawerClose}
      visible={childrenDrawer}
    >
      {comments.length > 0 ? <CommentList comments={comments} /> : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={'暂无评论'} />}
      <Comment
        avatar={<Avatar src={"https://joeschmoe.io/api/v1/" + (user?.avatar ? user.avatar : "random")} alt={user?.nickName} />}
        content={
          <Editor
            onChange={handleChange}
            onSubmit={handleSubmit}
            submitting={submitting}
            value={comment}
            btnLabel={'评论'}
          />
        }
      />
    </Drawer>
  </>)
}

export default observer(Home)