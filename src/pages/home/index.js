import './index.scss'
import http from '@/utils/http'
import { Button, Col, Form, Radio, Row, Select } from 'antd'
import { useState } from 'react'
import { useEffect } from 'react'
import { observer } from 'mobx-react-lite'
import { useForm } from 'antd/es/form/Form'
import Records from '@/components/records'
const { Option } = Select

function Home () {

  const [records, setRecords] = useState(null)
  const [categoryDict, setCategoryDict] = useState([])
  const [category, setCategory] = useState([])
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [searchForm] = useForm()
  const searchHandler = (values) => {
    loadRecords(values)
  }
  const setPageFunc = (p) => {
    setPage(p)
    loadRecords({ current: p }, true)
  }
  const setRecordsFunc = (v) => {
    setRecords(v)
  }
  const tagHandle = (id) => {
    if (category.indexOf(id) !== -1) {
      return
    }
    searchForm.setFieldValue('categoryIds', [id])
    categoryChangeHandle(id)
  }

  const categoryChangeHandle = (e) => {
    setCategory(e)
    setPage(1)
    loadRecords({ current: 1 }, false)
  }

  async function loadRecords (params, more) {
    params = Object.assign(params, searchForm.getFieldValue())
    const res = await http.post('/record/list', params)
    setTotal(res.total)
    if (more && records != null) {
      setRecords([...records, ...res.rows])
    } else {
      setRecords(res.rows)
    }
  }

  useEffect(() => {
    async function loadCategoryDict (params) {
      const res = await http.post('/category/dict')
      setCategoryDict(res.data)
    }
    loadCategoryDict()
    loadRecords({ current: page }, false)
  }, [])// eslint-disable-line

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
    <Records records={records} setRecords={setRecordsFunc} tagHandle={tagHandle} page={page} setPage={setPageFunc} total={total}></Records>
  </>)
}

export default observer(Home)