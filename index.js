const fs = require('fs')
const path = require('path')
const tinify = require('tinify')
const Listr = require('listr')
const colors = require('colors')
const argv = require('minimist')(process.argv.slice(2))
const util = require('./lib/util')

// 1. 检测参数， 不符合则会退出程序
// 校验参数传递
function tinypng() {
  if (!argv.s) {
    util.logError(`arguments --s(image source path) is necessary!`)
  }

  if (!fs.existsSync(argv.s) || !fs.statSync(argv.s).isDirectory()) {
    util.logError(`${argv.s} is not directory!`)
  }

  if (!argv.key) {
    util.logError(`arguments --key(api KEY) is necessary!`)
  }

  // 校验API key
  tinify.key = argv.key
  tinify.validate(function(err) {
    if (err) {
      util.logError('invalid API key, to get key: https://tinypng.com/developers')
    } else {
      compress()
    }
  })

  function compress() {
    let sourcePath = argv.s
    let distPath = argv.d || argv.s

    // 获取源文件夹下的所有图片
    // let files = fs.readdirSync(sourcePath)
    let imageList = fs.readdirSync(sourcePath).filter(item => /(png|jpe?g)$/.test(item))

    if (!fs.existsSync(distPath)) {
      util.mkdirSync(distPath)
    }

    let taskList = []
    let startTotalSize = 0
    let endTotalSize = 0
    let count = 0
    imageList.forEach(item => {
      let sourceFile = path.join(sourcePath, item)
      let distFile = path.join(distPath, item)

      let startSize = util.getFileSize(sourceFile)
      startTotalSize += startSize

      // 对每张图片建立任务
      taskList.push({
        title: item,
        task: (ctx, task) => {
          return new Promise((reslove, reject) => {
            tinify.fromFile(sourceFile).toFile(distFile, function(e) {
              reslove()

              let endSize = util.getFileSize(distFile)
              endTotalSize += endSize
              let percent = (((startSize - endSize) / startSize) * 100).toFixed(0)
              task.title = `${item.padEnd(50)} [ ${(startSize + 'KB').padEnd(8)} => ${(endSize + 'KB').padEnd(
                8
              )}  -${percent}% ] `
              count++
              
              if (count >= imageList.length) {
                setTimeout(e => {
                  let savedSize = (startTotalSize - endTotalSize).toFixed(2)
                  let savedPercent = (((startTotalSize - endTotalSize) / startTotalSize) * 100).toFixed(0)
                  console.log(
                    `complete!  [ totalSize: ${startTotalSize}KB, resultSize: ${endTotalSize}KB, savedSize: ${savedSize}KB, savedPercent: ${savedPercent}% ]`
                      .green
                  )
                })
              }
            })
          })
        }
      })
    })

    const tasks = new Listr(taskList)
    // 运行任务
    tasks.run().catch(err => {
      if (err) throw err
    })
  }
}

module.exports = tinypng