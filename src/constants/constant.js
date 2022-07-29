
const service = {
  baseUrl: 'http://localhost:8080'
}

const dateFormatter = {
  ymd_none: "YYYY-MM-DD",
  ymdhms_none: "YYYY-MM-DD hh:mm:ss"
}

const recordAction = {
  save: 0,
  edit: 1,
  remove: 2,
  detail: 3
}

const git = {
  headers: {
    Accept: 'application/vnd.github.v3+json',
    Authorization: 'token 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'
  }
}

const map = {
  base: {
    key: 'a7a90e05a37d3f6bf76d4a9032fc9129'
  },
  zoom: {
    default: '11',
    centerDefault: '15'
  }
}

export { dateFormatter, recordAction, map, git, service }