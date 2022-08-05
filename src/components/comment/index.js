import { Avatar, Button, Comment, Form, List, Tooltip } from "antd"
import TextArea from "antd/lib/input/TextArea"
import moment from 'moment'

const CommentList = ({ comments }) => (
  <List
    dataSource={comments}
    header={`${comments.length} ${comments.length > 1 ? '条评论' : '条评论'}`}
    itemLayout="horizontal"
    renderItem={(props) => {
      return <Comment author={<a href="!#" dangerouslySetInnerHTML={{ __html: props.createByName }}></a>}
        avatar={<Avatar src="https://joeschmoe.io/api/v1/random" alt="Han Solo" />}
        content={
          <p>
            {props.content}
          </p>
        }
        datetime={
          <Tooltip title={moment().format('YYYY年MM月DD日HH点mm分')}>
            <span>{moment(props.createTime).fromNow()}</span>
          </Tooltip>
        } />
    }}
  />
)

const Editor = ({ onChange, onSubmit, submitting, value, btnLabel }) => (
  <>
    <Form.Item>
      <TextArea rows={4} onChange={onChange} value={value} />
    </Form.Item>
    <Form.Item>
      <Button htmlType="submit" loading={submitting} onClick={onSubmit} type="primary">
        {btnLabel}
      </Button>
    </Form.Item>
  </>
)

export { Editor, CommentList }