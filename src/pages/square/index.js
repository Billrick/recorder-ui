import Records from "@/components/records"
import { http } from "@/utils"
import { useEffect } from "react"
import { useState } from "react"

function Square () {

  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [records, setRecords] = useState(null)

  const setRecordsFunc = (v) => {
    setRecords(v)
  }
  const setPageFunc = (p) => {
    setPage(p)
    loadRecords({ current: p }, true)
  }

  const loadRecords = (params, more) => {
    http.post('/public/square', params).then(d => {
      if (more && records != null) {
        setRecords([...records, ...d.data.list.rows])
      } else {
        setRecords(d.data.list.rows)
      }
      setTotal(d.data.list.total)
    }).catch(e => {
      console.log('/public/square', e)
    })
  }

  useEffect(() => {
    loadRecords({ current: page }, false)
  }, [])// eslint-disable-line
  return (<div>
    <Records records={records} setRecords={setRecordsFunc} page={page} setPage={setPageFunc} total={total}></Records>
  </div>)
}

export default Square