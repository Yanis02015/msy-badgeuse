module.exports = {
  pluginOptions: {
    electronBuilder: {
      nodeIntegration: true,
      externals: ['serialport'],
    }
  },
  transpileDependencies: [
    'vuetify'
  ]
}