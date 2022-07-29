import './index.scss'
import { StarOutlined, LikeOutlined, MessageOutlined } from '@ant-design/icons'
import http from '@/utils/http'
import { Avatar, Button, Col, Form, Image, List, Radio, Row, Select, Skeleton, Space, Spin } from 'antd'
import { useState } from 'react'
import { useEffect } from 'react'
import SyncImg from '@/components/syncImg'
const { Option } = Select

function Home () {
  const [loading, setLoading] = useState(true)
  const [records, setRecords] = useState([])

  const searchHandler = (values) => {
    console.log(values)
  }

  useEffect(() => {
    async function loadImgs (img) {
      const res = await http.post('/record/list')
      setRecords(res.rows)
      setLoading(false)
    }
    loadImgs()
  }, [])
  return (<>
    <Form onFinish={() => searchHandler()}
      labelCol={{ span: 1.5 }}
      wrapperCol={{ span: 6 }}
      className="ant-advanced-search-form"
      initialValues={{ status: "" }}
    >
      <Row gutter={24}>
        <Col span={24}>
          <Form.Item
            name="category"
            label="记录分类"
          >
            <Select mode="multiple" placeholder="记录分类">
              <Option value="">拉萨</Option>
              <Option value="">西藏</Option>
              <Option value="">湖北</Option>
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
                      <><StarOutlined /><span>10</span><em className="ant-list-item-action-split"></em></>,
                      <><LikeOutlined /><span>20</span><em className="ant-list-item-action-split"></em></>,
                      <><MessageOutlined /><span>30</span></>
                    ]
                    : undefined
                }
              >
                <List.Item.Meta
                  avatar={<Avatar src={item.avatar} />}
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
  </>)
}

export default Home