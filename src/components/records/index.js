import './index.scss'
import { StarOutlined, LikeOutlined, MessageOutlined, TagOutlined } from '@ant-design/icons'
import http from '@/utils/http'
import { Avatar, BackTop, Comment, Drawer, Empty, Image, List, Skeleton, Space, Spin } from 'antd'
import { useState } from 'react'
import SyncImg from '@/components/syncImg'
import { CommentList, Editor } from '@/components/comment'
import { observer } from 'mobx-react-lite'
import { useStore } from '@/store'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import moment from 'moment'

const Records = (props) => {
  const { records, setRecords, page, setPage, tagHandle, total } = props
  const { userStore } = useStore()
  const user = userStore.getUser()

  const navigate = useNavigate()

  const [loading, setLoading] = useState(true)
  const [childrenDrawer, setChildrenDrawer] = useState(false)
  const [comments, setComments] = useState([])
  const [submitting, setSubmitting] = useState(false)
  const [comment, setComment] = useState(null)
  const [currentRecord, setCurrentRecord] = useState(null)


  const loadData = () => {
    setPage(page + 1)
  }
  const handleSubmit = () => {
    if (!user) {
      navigate('/login', { replace: true })
    }
    if (!comment || !comment.trim()) return
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
    http.post('/c/comments/' + record.id).then(d => {
      record.comments = d.rows
      setComments(d.rows)
    }).catch(e => {

    })
  }
  // comment end

  useEffect(() => {
    if (records != null) {
      setLoading(false)
    }
  }, [records])

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

  return (<>
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
        {records ?
          <><List
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
                      <span className='point'><a href='#!' className='categoryTag' onClick={() => { return tagHandle ? tagHandle(item.categoryId) : null }}>
                        <TagOutlined /> &nbsp;{item.categoryTitle}
                      </a></span>,
                      <><span className='bottomDate'>{moment(item.createTime).fromNow()}</span></>
                    ]
                    : undefined
                }
              >
                <List.Item.Meta
                  avatar={<Avatar src={'https://joeschmoe.io/api/v1/' + item.user.avatar} />}
                  title={<><a href={item.href}>{item.user.nickName}</a><span className='rightDate'>{moment(item.createTime).fromNow()}</span></>}
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
            {(records && records.length > 0) ? <div style={{ 'textAlign': 'center', 'marginTop': '20px' }}>{total === records.length ? <span style={{ "color": "lightgray" }}>没有更多了</span> : <a href='#!' onClick={loadData}>加载更多</a>}</div> : null}
          </> : null
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
            btnLabel={user ? '评论' : '登录去'}
          />
        }
      />
    </Drawer>
    <BackTop>
    </BackTop>
  </>)
}

export default observer(Records)