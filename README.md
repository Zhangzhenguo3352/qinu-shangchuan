### 1.功能简介

Uploadersdk是基于七牛云和阿里云js-sdk进行二次开发的纯js sdk插件，去除了官方冗余的依赖，支持图片、视频、文本等各种文件上传到自定义存储空间（目前仅支持上传到七牛云，后续会支持上传到阿里云）

### 2.使用
 #### 1.页面中引入uploader.v1.js <script src="./uploader.v1.js"></script>
 
 #### 2.实例化uploader对象
 ``` js
 var uploadM = new uploader({
    multiple: true,
    accept: ['jpg', 'png', 'mov', 'txt'],
    onRemove: function () { console.log('我是删除回调函数') },
    WHcontrol: { control: true, Proportion: false, width: 2000, height: 2000 },
    maxSize: 50,
    maxFiles: 10,
    business_key: '',
    loginToken: '',
  })
  ```
  > 参数说明
  
  字段 | 含义 | 类型 | 是否可空 | 值解释
:---:  | :---: | :---: | :---:| :---:
multiple   | 是否支持文件多选 | Boolean | 否 | true:多选，flase:单选 
accept   | 支持上传的文件类型 | Array | 否 | jpg:.jpg格式图片；mov:.mov格式视频
onRemove   | 删除已上传文件时回调函数 | Function | 否 | 
  WHcontrol   | 上传图片尺寸、比例控制 | Object | 否 |control:true控制图片尺寸、比例设置。Proportion:true 对上传图片进行等比例控制，Proportion:false 对上传图片进行宽高范围限制
maxSize   | 上传文件大小限制 | Number | 否 | 50:上传文件的大小不能超过50M
maxSize   | 上传文件数量限制 | Number | 否 | 10:多选文件时一次最多只能上传10个文件
business_key   | 业务线标识，用于获取上传空间 | String | 否 | 
loginToken   | 登录token | String | 否 | 

### 3.初始化上传组件
``` js
uploadM.init()
```

### 自定义开始上传方法
``` js
 document.getElementById("upload").addEventListener('click', function () {
    uploadM.start()
  })
```
> 备注：upload是‘开始上传’按钮的id

### 4.API
API    |     method
:---   | :---:
文件添加进队列后,处理相关的事情 | FilesAdded
每个文件上传前,处理相关的事情 | BeforeUpload
每个文件上传时,处理相关的事情 | UploadProgress
每个文件上传成功后,处理相关的事情 | FileUploaded
队列文件全部上传成功后,处理相关的事情 | UploadComplete
> 以上几个方法都是组件在文件选择后到上传完毕前这个阶段的过程方法，必须在组件初始化之后调用。使用方法: uploadM.FilesAdded()


#### 5.完整demo
``` js
// 实例化uploader对象
var uploadM = new uploader({
    multiple: true,
    accept: ['jpg', 'png', 'mov', 'txt'],
    onRemove: function () { console.log('我是删除回调函数') },
    WHcontrol: { control: true, Proportion: false, width: 2000, height: 2000 },
    maxSize: 50,
    maxFiles: 10,
    business_key: '',
    loginToken: '',
  })

// 初始化上传组件
uploadM.init()

// 开始上传
uploadM.start()

/**
*上传过程中切片方法
*/
//选择文件后，返回所选文件
uploadM.FilesAdded()
//每个文件上传前，返回当前准备上传的文件
uploadM.BeforeUpload()
//每个文件上传时，返回正在上传的文件
uploadM.UploadProgress()
//每个文件上传成功后，反正刚上传成功的文件
uploadM.FileUploaded()
//队列文件全部上传成功后，返回文件队列所有上传成功的文件
uploadM.UploadComplete()
```

# qinu-shangchuan
