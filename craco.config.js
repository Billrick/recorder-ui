const path = require('path')

module.exports = {
  //webpack 配置
  webpack: {
    //定义 使用@表示src文件夹
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  }
}