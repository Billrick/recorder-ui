
const service = {
  baseUrl: 'http://10.5.209.19:8080'
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

const gitee = {
  accessToken: 'ffe1179f05b469ca1d67bfda4923f079'
}

const map = {
  base: {
    key: 'a7a90e05a37d3f6bf76d4a9032fc9129'
  },
  api: {
    getAreaSearchURL: (keywords) => {
      return `https://restapi.amap.com/v3/config/district?platform=JS&s=rsv3&logversion=2.0&key=${map.base.key}&keywords=${keywords}&subdistrict=1&showbiz=false&output=json`
    }
  },
  zoom: {
    default: '11',
    centerDefault: '15'
  }
}

export { dateFormatter, recordAction, map, git, gitee, service }