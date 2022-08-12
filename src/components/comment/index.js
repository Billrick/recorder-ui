import { useStore } from "@/store"
import { Avatar, Button, Comment, Form, List, Tooltip } from "antd"
import TextArea from "antd/lib/input/TextArea"
import moment from 'moment'

const CommentList = ({ comments }) => {
  const { userStore } = useStore()
  const user = userStore.getUser()
  const renderCommentItem = (props) => {
    return <Comment author={<a href="#!">{props?.creator.nickName + (props?.creator.nickName === user.nickName ? "（我）" : "")}</a>}
      avatar={<Avatar src={"https://joeschmoe.io/api/v1/" + (props.creator.avatar ? props.creator.avatar : 'random')} alt={props?.creator.nickName} />}
      content={
        <p>
          {props.content}
        </p>
      }
      datetime={
        <Tooltip title={moment(props.createTime).format('YYYY年MM月DD日HH点mm分')}>
          <span>{moment(props.createTime).fromNow()}</span>
        </Tooltip>
      }
    />
  }
  return (
    <List
      dataSource={comments}
      header={`${comments.length} ${comments.length > 1 ? '条评论' : '条评论'}`}
      itemLayout="horizontal"
      renderItem={renderCommentItem}
    />
  )
}

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