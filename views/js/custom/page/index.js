const { dialog } = require('electron').remote
const fs = require('fs')
const webp = require('webp-converter')
const path = require('path')
webp.grant_permission()

// eslint-disable-next-line no-undef
const pageApp = new Vue({
  el: '#appBody',
  data: {
    files: [],
    outputFolder: null,
    quality: 80,
    lossless: true,
    options: null,
    resizeStatus: false,
    aspectRatio: true,
    raitoWidth: 16,
    ratioHeight: 9,
    width: 1280,
    height: 720,
    process: {}
  },
  methods: {
    outputFolderSelect: async function () {
      const folder = await dialog.showOpenDialog({
        properties: ['openDirectory']
      })
      console.log(folder)
      this.outputFolder = folder.filePaths[0]
    },
    getFiles: async function () {
      const files = await dialog.showOpenDialog({
        properties: ['openFile', 'multiSelections'],
        filters: [
          {
            name: 'image',
            extensions: ['png', 'jpg']
          }
        ]
      })
      this.files = files.filePaths
    },
    convertAndSave: function () {
      const files = this.files
      for (const file of files) {
        this.process[file] = 'start'
        const sonuc = webp.cwebp(file, this.outputFolder + path.basename(file).slice(0, -3) + 'webp', this.options)
        sonuc.then(function (result) {
          pageApp.process[file] = 'success'
          console.log(result)
        })
      }
    },
    removeFile: function (index) {
      this.files.splice(index, 1)
    }
  },
  watch: {
    $data: {
      handler: function (val, oldVal) {
        this.options = `${this.lossless ? '-lossless' : '-q ' + this.quality} ${this.resizeStatus ? '-resize ' + this.width + ' ' + this.height : ''}`
        if (this.aspectRatio) {
          this.height = Math.round((this.ratioHeight / this.raitoWidth) * this.width)
        }
        console.log(this.options)
      },
      deep: true
    }
  }
})
