import { MapInput } from "@/components/map"
import { dateFormatter } from "@/constants/constant"
import { DatePicker, Form, Input, Modal, Switch, } from "antd"
import moment from 'moment'
import { useEffect, useState } from "react"
moment.locale('zh-cn')

function EditModal ({ isModalVisible, isEdit, handleOk, handleCancel, record }) {
  // state
  const [clearFlag, setClearFlag] = useState(0)
  // ref
  const [form] = Form.useForm()
  // method
  const handleSubmit = (p) => {
    form.validateFields().then(values => {
      let data = values
      data.startDate = moment(values.rangeDate[0]).format(dateFormatter.ymdhms_none)
      data.endDate = moment(values.rangeDate[1]).format(dateFormatter.ymdhms_none)
      data.isPrivate = values.isPrivate ? '1' : '0'
      const mapInfo = values.mapInfo
      if (mapInfo) {
        data.mapPoint = values.mapInfo.id
        data.locale = values.mapInfo.name
      }
      if (record) {
        data.id = record.id
      }
      delete data.rangeDate
      console.log(data)
      handleOk(data, isEdit)
    }).catch(err => {
      console.log(err)
    })
  }

  //effect
  useEffect(() => {
    if (isModalVisible && !record) {//清空表单
      form.resetFields()
    }
    if (record) {
      let data = Object.assign({}, record)
      data.isPrivate = data.isPrivate === '1'
      data.rangeDate = [moment(data.startDate), moment(data.endDate)]
      data.mapInfo = { id: data.mapPoint, name: data.locale }
      form.setFieldsValue(data)
    }
  }, [record, isModalVisible])// eslint-disable-line

  useEffect(() => {
    if (isModalVisible) {//打开
      setClearFlag(-1)
    } else {//关闭
      setClearFlag(1)
    }
  }, [isModalVisible])

  return <>
    <Modal title={isEdit ? '编辑分类' : '新增分类'}
      okText='保存'
      visible={isModalVisible}
      onOk={handleSubmit}
      onCancel={handleCancel}
      //afterClose={closeHandle}
      width={700}>
      <Form
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 18 }}
        form={form}
        layout="horizontal"
      >
        <Form.Item label="分类名称" name='title' rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item label="描述" name='categoryDesc'>
          <Input.TextArea />
        </Form.Item>
        <Form.Item label="地点" name='mapInfo'>
          {isModalVisible ? <MapInput clearFlag={clearFlag}></MapInput> : null}
        </Form.Item>
        <Form.Item label="开始/结束日期" name='rangeDate' rules={[{ required: true }]}>
          <DatePicker.RangePicker format={'YYYY-MM-DD'} />
        </Form.Item>
        <Form.Item label="是否私有" valuePropName="checked" name='isPrivate'>
          <Switch />
        </Form.Item>
      </Form>

    </Modal>

  </>
}




export default EditModal