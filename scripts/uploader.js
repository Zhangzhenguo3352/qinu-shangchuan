(function (global) {

  // 加载依赖js
  (function loadDepJs() {
    function loadJs(url, index) {
      var s = document.createElement('script');
      s.type = 'text/javascript';
      s.async = false;
      s.src = url;
      var x = document.getElementsByTagName('script')[index];
      x.parentNode.insertBefore(s, x);
    }
    loadJs('scripts/moxie.js', 0)
    loadJs('scripts/filemd5.js', 1)
    loadJs('scripts/plupload.dev.js', 2)
    loadJs('scripts/qiniu.js', 3)

  })()

  // 配置下载
  var downloadFile = '';
  var downloadkey = '';
   function getImageUrl(key) {
    // handleAjax(`https://wx.yinzhimeng.com.cn:7654/file/getUrl?key=${key}`,
    //     {
            
    //     },
    //     function(ress){
    //       downloadFile = ress.data
    //         console.log('aaakey',ress )
    // }, false)

  }

  var arr = []
  var arr2 = []
  var num = 0;
  var as = 0
   function get_filemd5sum(ofile, filesLength, up, file) {
           console.log('ofile',ofile)
            var file = ofile;
            var tmp_md5;
            var blobSlice = File.prototype.slice || File.prototype.mozSlice || File.prototype.webkitSlice,
                // file = this.files[0],
                chunkSize = 8097152, // Read in chunks of 2MB
                chunks = Math.ceil(file.size / chunkSize),
                currentChunk = 0,
                spark = new SparkMD5.ArrayBuffer(),
                fileReader = new FileReader();
                 console.log('sss',chunks);
            fileReader.onload = function(e) {
                console.log('read chunk nr');
                spark.append(e.target.result); // Append array buffer
                currentChunk++;
                var md5_progress = Math.floor((currentChunk / chunks) * 100);

                console.log(file.name + "  正在处理，请稍等," + "已完成" + md5_progress + "%");
                // var handler_info = document.getElementById("handler_info");
                // var progressbar = document.getElementsByClassName("progressbar")[0];
                // handler_info.innerHTML=file.name + "  正在处理，请稍等," + "已完成" + md5_progress + "%"
                // progressbar.value =md5_progress;
                 console.log('currentChunk < chunks',currentChunk < chunks)
                if (currentChunk < chunks) {
                    loadNext();
                } else {
                    
                    tmp_md5 = spark.end();
                    // handler_info.innerHTML = file.name + "的MD5值是：" + tmp_md5;
                  // console.log('tmp_md5',,tmp_md5)
                  
                    
                }
            };

            fileReader.onerror = function() {

                console.warn('oops, something went wrong.');
            };

            function loadNext() {
                var start = currentChunk * chunkSize,
                    end = ((start + chunkSize) >= file.size) ? file.size : start + chunkSize;
                // fileReader.readAsArrayBuffer(blobSlice.call(file, start, end));
                fileReader.readAsArrayBuffer(blobSlice.call(file.getNative(), start, end));
            }
            loadNext();
        }



        function get_filemd5sum2(ofile, up, file, i) {
            console.log()
            var file = ofile;
            var tmp_md5;
            var blobSlice = File.prototype.slice || File.prototype.mozSlice || File.prototype.webkitSlice,
                // file = this.files[0],
                chunkSize = 8097152, // Read in chunks of 2MB
                chunks = Math.ceil(file.size / chunkSize),
                currentChunk = 0,
                spark = new SparkMD5.ArrayBuffer(),
                fileReader = new FileReader();
                 // console.log('sss',chunks);
            fileReader.onload = function(e) {
                // console.log('read chunk nr');
                spark.append(e.target.result); // Append array buffer
                currentChunk++;
                var md5_progress = Math.floor((currentChunk / chunks) * 100);

                // console.log(file.name + "  正在处理，请稍等," + "已完成" + md5_progress + "%");
                // var handler_info = document.getElementById("handler_info");
                // var progressbar = document.getElementsByClassName("progressbar")[0];
                // handler_info.innerHTML=file.name + "  正在处理，请稍等," + "已完成" + md5_progress + "%"
                // progressbar.value =md5_progress;
                if (currentChunk < chunks) {
                    loadNext();
                } else {
                    tmp_md5 = spark.end();
                    // // handler_info.innerHTML = file.name + "的MD5值是：" + tmp_md5;
                  
                    for(var i = 0; i< arr.length ;i++) {
                      // console.log('arr[i].md5',arr[i].md5 )
                      // console.log(' tmp_md5',tmp_md5)
                      // console.log('arr[i].md5 == tmp_md5',arr[i].md5 == tmp_md5)
                      if(arr[i].md5 == tmp_md5) {
                       arr.splice(i, 1)
                        // up.stop()
                        // up.removeFile(file.id)
                      } 
                    }
                    arr.push({
                      hash: tmp_md5,
                      fileName: file.name,
                      size: file.size
                    })
                    handleAjax(`https://wx.yinzhimeng.com.cn:7654/file/inspectHash`,
                        {
                          hash: tmp_md5,
                          fileName: file.name,
                          size: file.size

                        },
                        function(ress){
                          
                            console.log('aaakey',ress )

                            if(ress.code == 1) { // md5 存在, 做关联
                              
                                handleAjax(`https://wx.yinzhimeng.com.cn:7654/file/upLoad`,
                                {
                                  hash: tmp_md5,
                                  fileName: file.name,
                                  size: file.size
                                },
                                function(data){
                                    console.log('data',data )
                              }, false, 'POST')
                            } else if(ress.code == '106') {
                              alert(ress.message+'文件不支持')
                            } else {

                            }
                      }, false, 'POST')
                    // for(var j = 0;j < arr.length; j++) {
                    //   handleAjax(`https://wx.yinzhimeng.com.cn:7654/file/inspectHash`,
                    //     {
                    //         hash: arr[i].hash,
                    //         fileName: arr[i].fileName,
                    //         size: arr[i].size

                    //     },
                    //     function(ress){
                          
                    //         console.log('aaakey',ress )

                    //         if(ress.code == 1) { // md5 存在, 做关联
                              
                    //             handleAjax(`https://wx.yinzhimeng.com.cn:7654/file/upLoad`,
                    //             {
                    //                 hash: arr[i].hash,
                    //                 fileName: arr[i].fileName,
                    //                 size: arr[i].size
                    //             },
                    //             function(data){
                    //                 console.log('data',data )
                    //           }, false, 'POST')
                    //         } else if(ress.code == '106') {
                    //           alert(ress.message+'文件不支持')
                    //         } else {

                    //         }
                    //   }, false, 'POST')
                    // }
                    // 做 MD5 校验
                }
            };

            fileReader.onerror = function() {

            };

            function loadNext() {
                var start = currentChunk * chunkSize,
                    end = ((start + chunkSize) >= file.size) ? file.size : start + chunkSize;
                // fileReader.readAsArrayBuffer(blobSlice.call(file, start, end));
                fileReader.readAsArrayBuffer(blobSlice.call(file.getNative(), start, end));
            }
            loadNext();
        }

  /**initConfig: 初始化配置参数
   * userConfig: 用户初始化uploader实例参数
   * Tool:通用工具方法
   * qiniuConfig: 初始化七牛实例参数(带上传过程method)
   * bucketType: 上传空间类型（七牛||阿里）
   * bucketName: 上传空间名称
   * uploader: 七牛实例化对象
   */
  var initConfig = {
    userConfig: {
      multiple: true,
      accept: ['jpg', 'png', 'mov', 'txt'],
      onRemove: function () { },
      WHcontrol: { control: true, Proportion: false, width: 2000, height: 2000 },
      maxSize: 50,
      maxFiles: 10,
      business_key: 'NL9ot5FEa8WQH34NZ5sznkgnb44SIy72tzMUMqYA',
      loginToken: '44HofK97PYznFG8dq2x6AvCFO7rviCrpUpy-u2o6',
    },
    Tool: {
      // 获取上传空间、获取UpToken,涉及到跨域，所以封装了一个ajaxRequestJsonP
      ajaxRequestJsonP: function (params) {
        params = params || {};
        params.data = params.data || {};
        var json = params.jsonp ? jsonp(params) : json(params);
        // jsonp请求 
        function jsonp(params) {
          //创建script标签并加入到页面中 
          var callbackName = params.jsonp;
          var head = document.getElementsByTagName('head')[0];
          // 设置传递给后台的回调参数名 
          params.data['callback'] = callbackName;
          var data = formatParams(params.data);
          var script = document.createElement('script');
          head.appendChild(script);

          //创建jsonp回调函数 
          global[callbackName] = function (json) {
            head.removeChild(script);
            clearTimeout(script.timer);
            global[callbackName] = null;
            params.success && params.success(json);
          };
          //发送请求 
          script.src = params.url + '?' + data;
          //为了得知此次请求是否成功，设置超时处理 
          if (params.time) {
            script.timer = setTimeout(function () {
              global[callbackName] = null;
              head.removeChild(script);
              params.error && params.error({
                message: '超时'
              });
            }, time);
          }
        };

        //格式化参数 
        function formatParams(data) {
          var arr = [];
          for (var name in data) {
            arr.push(encodeURIComponent(name) + '=' + encodeURIComponent(data[name]));
          };

          // 添加一个随机数，防止缓存 
          arr.push('v=' + random());
          return arr.join('&');
        }

        // 获取随机数 
        function random() {
          return Math.floor(Math.random() * 10000 + 500);
        }
      },

      // 插入上传后的文件行 
      insRow: function (file, isImg) {

        var fileSize = plupload.formatSize(file.size).toUpperCase()
        var a = ''
        var b = fileSize
        var c = '<div class="container" id="container"><div class="time" id="bar" style="width:1%;"></div></div>'
        var d = '<a  id="delRow" herf="javascript:;">×</a>'
        if (isImg) {
          a = `<img src="${downloadFile}"/${file.name}?imageView2/1/w/100/h/100 />`
        }
        else {
          a = '<img class="default-img" src="images/default.png" />'
        }

        var x = document.getElementById('fileTable').insertRow(1)
        var y = x.insertCell(0)
        var z = x.insertCell(1)
        var k = x.insertCell(2)
        var m = x.insertCell(3)
        y.innerHTML = a
        z.innerHTML = b
        k.innerHTML = c
        m.innerHTML = d

        document.getElementById("delRow").addEventListener('click', function () {
          initConfig.Tool.delFile(this.parentNode.parentNode.rowIndex, initConfig.userConfig.onRemove())
        })

      },
      // 删除文件
      delFile: function (rowIndex, callBackFunc) {
        var table = document.getElementById('fileTable')
        table.deleteRow(rowIndex)
        callBackFunc
      },

      // 判断是否是图片格式
      isImage: function (url) {
        // console.log('bbbb',url)
        var res, suffix = ""
        var imageSuffixes = ["png", "jpg", "jpeg", "gif", "bmp"]
        var suffixMatch = /\.([a-zA-Z0-9]+)(\?|\@|$)/

        if (!url || !suffixMatch.test(url)) {
          return false
        }
        res = suffixMatch.exec(url);
        suffix = res[1].toLowerCase()
        for (var i = 0, l = imageSuffixes.length; i < l; i++) {
          if (suffix === imageSuffixes[i]) {
            return true
          }
        }
        return false
      },

      // // 检验文件在 这个 总体里面是否相同
      // fileNameSame:function (up, file) {
        
      //   num++
        
      //   // if(up.files.length == num) {

      //   // } else{
      //   //   arr.push()
      //   // }
      //   for(var i =0 ;i< up.files.length; i++) {
      //     var a = get_filemd5sum(up.files[i], up.files.length)
      //     console.log('a',a)
      //   }
      //   // get_filemd5sum(up.files[i], up, file)
      //    // if(get_filemd5sum(up.files[i], up.files.length)) {}

      //   return true
      // },
      // 检测当前文件格式是否上传受限
      checkFileType: function (up, file) {
        const { accept } = initConfig.userConfig
        const isJPG = accept && accept.some((item) => {
          return file.name.split('.').pop().toLowerCase() == item
        })

        if (!isJPG) {
          alert('只允许上传[' + accept + ']类型的文件')
          up.stop()
          up.removeFile(file.id)
          return false
        }
        return true
      },

      // // 检测文件大小
      // checkFileSize: function (up, file) {
      //   const { maxSize } = initConfig.userConfig
      //   const isLt2M = file.size / 1024 / 1024 < (maxSize - 0)

      //   if (!isLt2M) {
      //     alert('文件大小不能超过' + maxSize + 'M!')
      //     up.stop()
      //     up.removeFile(file.id)
      //     return false
      //   }
      //   return true
      // },
      // 检测文件个数是否受限
      checkFilesNum: function (up, file) {

        
        
       
        // console.log('as',as)
       get_filemd5sum2(up.files[ as], up, file, as)
      as++
         
        //             console.log('arr',arr)
        const { maxFiles } = initConfig.userConfig
        if (up.files.length > maxFiles - 0) {
          alert('最多上传' + maxFiles + '个文件')
          up.stop()
          up.removeFile(file.id)
          return false
        }
        return true
      },
      // 进度条加载
      setProgress: function (percent) {
        var self = this
        var bar = document.getElementById("bar");
        if (bar) {
          bar.style.width = parseInt(percent) + "%"
          bar.innerHTML = bar.style.width
          if (bar.style.width >= "98%") {
            clearTimeout(jindu)
            return;
          }
          var jindu = setTimeout("self.setProgress", 3000)
        }
      },
      // 上传前检查图片、进度条展示
      progressShow: function (up, file) {
        // console.log('校验通过a',file)
        // 每个文件上传前,处理相关的事情
        // 文件类型、文件大小、文件个数校验
        if ( !initConfig.Tool.checkFileType(up, file) || !initConfig.Tool.checkFilesNum(up, file)) {
          return false;
        }
        var isImg = false;
        var url = 'http://f.yinzhimeng.com.cn/' + file.name;
        if (initConfig.Tool.isImage(url)) {
          isImg = true
          // 图片尺寸校验
          if (initConfig.userConfig.WHcontrol.control) {
            var nativeFile = file.getNative();
            var img = new Image();
            img.src = URL.createObjectURL(nativeFile)
            img.onload = function () {
              var width = img.naturalWidth
              var height = img.naturalHeight
              // 图片尺寸校验：1.比例，2.宽高
              var ckProportion = initConfig.userConfig.WHcontrol.Proportion && (initConfig.userConfig.WHcontrol.width / initConfig.userConfig.WHcontrol.height == width / height)
              var ckSize = initConfig.userConfig.WHcontrol.width >= width && initConfig.userConfig.WHcontrol.height >= height
              // if ((initConfig.userConfig.WHcontrol.Proportion && !ckProportion) || !ckSize) {
              //   alert('上传图片的尺寸不满足条件')
              //   up.removeFile(file)
              //   return false;
              // } else { //校验通过
                // console.log('校验通过b',file)
                // console.log('校验通过c',isImg)
                getImageUrl(downloadkey)
                initConfig.Tool.insRow(file, isImg)
              // }
            }
          } else { //不做图片尺寸校验
            // console.log('不做图片尺寸校验')
            initConfig.Tool.insRow(file, isImg)
          }

        } else {
          initConfig.Tool.insRow(file, isImg)
        }
      }

    },
    qiniuConfig: {
      runtimes: 'html5,html4,flash',
      browse_button: 'pickfiles',
      // http://jssdk.demo.qiniu.io/uptoken
      // uptoken: 'http://192.168.100.6:7654/file/getToken/', //需要先获取这个token
      uptoken_url: 'https://wx.yinzhimeng.com.cn:7654/file/getToken/', //需要先获取这个token
      domain: 'http://f.yinzhimeng.com.cn/', //随便填，但不可缺
      get_new_uptoken: false,
      max_file_size: '50mb',
      max_retries: 3,
      multi_selection: true,
      dragdrop: false,
      chunk_size: '0mb',
      auto_start: false,
      init: {
        'FilesAdded': function (up, file) {
        },
        'BeforeUpload': function (up, file) {
          initConfig.Tool.progressShow(up, file)


          // get_filemd5sum(up.files[0])
          // console.log('up, file',up, file)
          return true
        },

        'UploadProgress': function (up, file) {
          if (file.percent <= 100) {
            initConfig.Tool.setProgress(file.percent)
          }
          // console.log('上传中-' + file.percent + '%')
        },

        'FileUploaded': function (up, file, info) {
           // console.log('FileUploaded', up.files, file, info)
           // console.log('json.parse',JSON.parse(info.response))
          // console.log('uploader',uploader)
          // console.log('this',this)
          downloadkey = JSON.parse(info.response).key
          // initConfig.Tool.progressShow(up, file)
          getImageUrl(JSON.parse(info.response).key)
          document.getElementById('fileTable').rows[1].cells[2].innerHTML = `${file.name}</a>`
        },
        'UploadComplete': function (up) {
          //队列文件处理完毕后,处理相关的事情
          // console.log('队列文件处理完毕', up)
        },
        'Error': function (up, err, errTip) {
          initConfig.Tool.delFile(1, initConfig.userConfig.onRemove())
          alert(errTip)
          return false;
        },
      }
    },
    bucketType: 'QINIU',
    bucketName: 'bbbb',
    uploader: {}
  }

  //上传组件，包含七牛and阿里云
  function uploader(config) {

    initConfig.userConfig = config
  }

  // 1.获取上传空间信息
  uploader.prototype.getBucketSpace = function (businessKey) {
    // console.log('key',businessKey)
    try {
      //获取上传空间(需要business_key) ，返回 空间类型"bucketType":"QINIU", 空间名称"bucketName":"axx-test"  
      initConfig.Tool.ajaxRequestJsonP({
        url: '//storage.aixuexi.com/component/business_key/upload_info',
        jsonp: 'jsonpCallback',
        data: { 'businessKey': businessKey },
        success: function (res) {
          // console.log('ressss',res)

          initConfig.bucketType = res.data.bucketType
          initConfig.bucketName = res.data.bucketName
        },
        error: function (error) { },
        options: "",
      });
    } catch (err) {
      console.log('获取上传空间出错了:' + err)
    }

  }

  // 2.获取UploadToken(需要bucketName)，返回"upload_token":"token-content" 
  uploader.prototype.getUploadToken = function (businessKey, bucketType, bucketName) {
    try {
      Too.ajaxRequestJsonP({
        url: '//storage.aixuexi.com/component/qiniu/upload_token/',  // 请求地址
        jsonp: 'jsonpCallback', // 采用jsonp请求，且回调函数名为"jsonpCallbak"，可以设置为合法的字符串
        data: {
          'businessKey': businessKey,
          'bucketType': bucketType,
          'bucketName': bucketName
        },
        success: function (res) {
          initConfig.qiniuConfig.uptoken = res.data.upload_token //获得上传token
        },
        error: function (error) { }
      });
    } catch (err) {
      console.log('获取UploadToken出错了:' + err)
    }
  }
  global.onload = function () {
    // 3.初始化七牛
    uploader.prototype.init = function () {
      initConfig.uploader = Qiniu.uploader(initConfig.qiniuConfig)
      return initConfig.uploader
    }

    // 开始上传
    uploader.prototype.start = function () {
      if (initConfig.uploader.files.length > 0) {
        return initConfig.uploader.start()
      } else {
        alert('请先选择上传文件')
        return false
      }
    }




    //上传组件实例化
    var uploadM = new uploader(initConfig.userConfig)
    /**
     * multiple: 是否支持多图片上传 true|false
     * accept: 支持格式(array)
     * onRemove: 删除上传文件回调函数
     * WHcontrol: 上传图片宽高、比例控制 control：是否限制图片宽高、比例；Proportion:图片比例控制
     * maxSize: 文件文件大小限制(单位：M)
     * maxFiles: 最大文件数
     * business_key: 业务线标识，用于获取上传空间
     *  loginToken: '',登录token
     */
    var uploadM = new uploader({
      multiple: true,
      // accept: ['jpg', 'png', 'mov', 'txt', ],
      accept: ["jpg","jpeg","png","gif","bmp","txt","doc","docx","xls","xlsx","ppt","pptx"],
      onRemove: function () { console.log('我是删除回调函数') },
      WHcontrol: { control: true, Proportion: false, width: 2000, height: 2000 },
      maxSize: 50,
      maxFiles: 10,
      business_key: '',
      loginToken: '',
    })

    // 实例化七牛上传组件
    if (initConfig.bucketType === "QINIU") {
    uploadM.getBucketSpace(initConfig.userConfig.business_key)
    uploadM.getUploadToken(initConfig.userConfig.business_key, initConfig.bucketType,initConfig.bucketName)
    uploadM.init()
    }

    // 七牛上传阶段方法拆分
    uploader.prototype.FilesAdded = function () {
      initConfig.uploader.bind('FilesAdded', function (up, file) {
        console.log("FilesAdded:", file)
        return file
      });
    }
    uploader.prototype.BeforeUpload = function () {
      initConfig.uploader.bind('BeforeUpload', function (up, file) {
        console.log("BeforeUpload:", file)
        return file
      });
    }
    uploader.prototype.UploadProgress = function () {
      initConfig.uploader.bind('UploadProgress', function (up, file) {
        console.log("UploadProgress:", file)
        return file
      });
    }



    uploader.prototype.FileUploaded = function () {
      initConfig.uploader.bind('FileUploaded', function (up, file, info) {
        console.log("FileUploaded :", file)
        return files
      });
    }

    uploader.prototype.UploadComplete = function () {
      initConfig.uploader.bind('UploadComplete', function (up) {
        console.log("UploadComplete2:", up)
        return up
      });
    }

    // uploadM.FilesAdded()
    // uploadM.BeforeUpload()
    // uploadM.UploadProgress()
    // uploadM.FileUploaded()
    // uploadM.UploadComplete()

    // 绑定开始上传按钮事件
    document.getElementById("upload").addEventListener('click', function () {
      uploadM.start()
    })
  }

})(window)