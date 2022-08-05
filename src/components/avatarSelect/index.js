
import { Image, Select } from "antd"
const { Option } = Select
const AvatarSelect = () => {

  const handleChange = (value) => {
    console.log(`selected ${value}`)
  }

  return (<>
    <Select
      style={{
        width: "100%"
      }}
      mode={'multiple'}
      placeholder="请选择头像，点击头像预览，ESC退出预览。"
      
      defaultValue={[]}
      virtual={false}
      onChange={handleChange}
      optionLabelProp="label"
    >
      <Option value="https://joeschmoe.io/api/v1/jake" label="jake">
        <div className="demo-option-label-item">
          <Image src="https://joeschmoe.io/api/v1/jake" width="50px"
            height="50px" />
          jake
        </div>
      </Option>
      <Option value="https://joeschmoe.io/api/v1/jess" label="jess">
        <div className="demo-option-label-item">
          <Image src="https://joeschmoe.io/api/v1/jess" width="50px"
            height="50px" />
          jess
        </div>
      </Option>
      <Option value="https://joeschmoe.io/api/v1/jeane" label="jeane">
        <div className="demo-option-label-item">
          <Image src="https://joeschmoe.io/api/v1/jeane" width="50px"
            height="50px" />
          jeane
        </div>
      </Option>
      <Option value="https://joeschmoe.io/api/v1/jolee" label="jolee">
        <div className="demo-option-label-item">
          <Image src="https://joeschmoe.io/api/v1/jolee" width="50px"
            height="50px" />
          jolee
        </div>
      </Option>
      <Option value="https://joeschmoe.io/api/v1/jordan" label="jordan">
        <div className="demo-option-label-item">
          <Image src="https://joeschmoe.io/api/v1/jordan" width="50px"
            height="50px" />
          jordan
        </div>
      </Option>
      <Option value="https://joeschmoe.io/api/v1/jocelyn" label="jocelyn">
        <div className="demo-option-label-item">
          <Image src="https://joeschmoe.io/api/v1/jocelyn" width="50px"
            height="50px" />
          jocelyn
        </div>
      </Option>
      <Option value="https://joeschmoe.io/api/v1/jana" label="jana">
        <div className="demo-option-label-item">
          <Image src="https://joeschmoe.io/api/v1/jana" width="50px"
            height="50px" />
          jana
        </div>
      </Option>
      <Option value="https://joeschmoe.io/api/v1/jerry" label="jerry">
        <div className="demo-option-label-item">
          <Image src="https://joeschmoe.io/api/v1/jerry" width="50px"
            height="50px" />
          jerry
        </div>
      </Option>
      <Option value="https://joeschmoe.io/api/v1/jaqueline" label="jaqueline">
        <div className="demo-option-label-item">
          <Image src="https://joeschmoe.io/api/v1/jaqueline" width="50px"
            height="50px" />
          jaqueline
        </div>
      </Option>
      <Option value="https://joeschmoe.io/api/v1/jon" label="jon">
        <div className="demo-option-label-item">
          <Image src="https://joeschmoe.io/api/v1/jon" width="50px"
            height="50px" />
          jon
        </div>
      </Option>
      <Option value="https://joeschmoe.io/api/v1/jai" label="jai">
        <div className="demo-option-label-item">
          <Image src="https://joeschmoe.io/api/v1/jai" width="50px"
            height="50px" />
          jai
        </div>
      </Option>
      <Option value="https://joeschmoe.io/api/v1/jeri" label="jeri">
        <div className="demo-option-label-item">
          <Image src="https://joeschmoe.io/api/v1/jeri" width="50px"
            height="50px" />
          jeri
        </div>
      </Option>
      <Option value="https://joeschmoe.io/api/v1/jodi" label="jodi">
        <div className="demo-option-label-item">
          <Image src="https://joeschmoe.io/api/v1/jodi" width="50px"
            height="50px" />
          jodi
        </div>
      </Option>
      <Option value="https://joeschmoe.io/api/v1/jia" label="jia">
        <div className="demo-option-label-item">
          <Image src="https://joeschmoe.io/api/v1/jia" width="50px"
            height="50px" />
          jia
        </div>
      </Option>
      <Option value="https://joeschmoe.io/api/v1/joe" label="joe">
        <div className="demo-option-label-item">
          <Image src="https://joeschmoe.io/api/v1/joe" width="50px"
            height="50px" />
          joe
        </div>
      </Option>
      <Option value="https://joeschmoe.io/api/v1/jack" label="jack">
        <div className="demo-option-label-item">
          <Image src="https://joeschmoe.io/api/v1/jack" width="50px"
            height="50px" />
          jack
        </div>
      </Option>
      <Option value="https://joeschmoe.io/api/v1/jane" label="jane">
        <div className="demo-option-label-item">
          <Image src="https://joeschmoe.io/api/v1/jane" width="50px"
            height="50px" />
          jane
        </div>
      </Option>
      <Option value="https://joeschmoe.io/api/v1/jabala" label="jabala">
        <div className="demo-option-label-item">
          <Image src="https://joeschmoe.io/api/v1/jabala" width="50px"
            height="50px" />
          jabala
        </div>
      </Option>
      <Option value="https://joeschmoe.io/api/v1/jacques" label="jacques">
        <div className="demo-option-label-item">
          <Image src="https://joeschmoe.io/api/v1/jacques" width="50px"
            height="50px" />
          jacques
        </div>
      </Option>
      <Option value="https://joeschmoe.io/api/v1/josephine" label="josephine">
        <div className="demo-option-label-item">
          <Image src="https://joeschmoe.io/api/v1/josephine" width="50px"
            height="50px" />
          josephine
        </div>
      </Option>
      <Option value="https://joeschmoe.io/api/v1/josh" label="josh">
        <div className="demo-option-label-item">
          <Image src="https://joeschmoe.io/api/v1/josh" width="50px"
            height="50px" />
          josh
        </div>
      </Option>
      <Option value="https://joeschmoe.io/api/v1/julie" label="julie">
        <div className="demo-option-label-item">
          <Image src="https://joeschmoe.io/api/v1/julie" width="50px"
            height="50px" />
          julie
        </div>
      </Option>
      <Option value="https://joeschmoe.io/api/v1/jude" label="jude">
        <div className="demo-option-label-item">
          <Image src="https://joeschmoe.io/api/v1/jude" width="50px"
            height="50px" />
          jude
        </div>
      </Option>
      <Option value="https://joeschmoe.io/api/v1/jazebelle" label="jazebelle">
        <div className="demo-option-label-item">
          <Image src="https://joeschmoe.io/api/v1/jazebelle" width="50px"
            height="50px" />
          jazebelle
        </div>
      </Option>
      <Option value="https://joeschmoe.io/api/v1/james" label="james">
        <div className="demo-option-label-item">
          <Image src="https://joeschmoe.io/api/v1/james" width="50px"
            height="50px" />
          james
        </div>
      </Option>
      <Option value="https://joeschmoe.io/api/v1/jean" label="jean">
        <div className="demo-option-label-item">
          <Image src="https://joeschmoe.io/api/v1/jean" width="50px"
            height="50px" />
          jean
        </div>
      </Option>
      <Option value="https://joeschmoe.io/api/v1/jed" label="jed">
        <div className="demo-option-label-item">
          <Image src="https://joeschmoe.io/api/v1/jed" width="50px"
            height="50px" />
          jed
        </div>
      </Option>
      <Option value="https://joeschmoe.io/api/v1/jenni" label="jenni">
        <div className="demo-option-label-item">
          <Image src="https://joeschmoe.io/api/v1/jenni" width="50px"
            height="50px" />
          jenni
        </div>
      </Option>
    </Select>
  </>
  )


}

export default AvatarSelect