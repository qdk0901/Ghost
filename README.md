####百度BAE上部署Ghost
#####首先申请BAE账号，然后来到[BAE控制台](http://console.bce.baidu.com/bae/#/bae/app/list)添加部署
![](http://transing.bj.bcebos.com/bae-console.png)
#######注意内存要选256M的，Ghost需要的内存超过140M，代码版本工具选git
![](http://transing.bj.bcebos.com/bae-application.png)

#####添加私有mysql服务，来到[控制台](http://console.bce.baidu.com/bae/#/bae/service/create~type=MySQL)
######选私有mysql，因为免费的mysql有长连接问题，需要修改到knex module，这里没办法改。网上改连接池数目到0，或者捕捉ERESET异常的办法都没有效。
![](http://transing.bj.bcebos.com/bae-mysql.png)
添加完之后，可以在[扩展服务列表](http://console.bce.baidu.com/bae/#/bae/service/list)里,找到新添加的数据库，里面可以看到数据库地址，这个地址等下要填到配置文件里的
![](http://transing.bj.bcebos.com/mysql-info.png)
#####申请开通BOS(对象存储)，然后来到[BOS控制台](http://console.bce.baidu.com/bos/#/bos/list)新建Bucket
######新建一个你自己的bucket，等下bucket的名字要填到配置文件里
![](http://transing.bj.bcebos.com/bos-console.png)

#####获取源码
######[Ghost项目官方地址](https://github.com/TryGhost/Ghost)，如果不想从官网源码开始改，也可以用[我已经改好的](https://github.com/qdk0901/Ghost.git)

```
git clone https://github.com/qdk0901/Ghost.git -b baidu_bce_github
git checkout -b master (新建一个master分支，因为BAE只认master分支)
```
克隆完成如下图
![](http://transing.bj.bcebos.com/clone-baidu-bce-ghost.png)
获取BAE部署的git项目地址
![](http://transing.bj.bcebos.com/bae-git.png)


#####修改配置文件
打开config.example.js，主要修改如下内容，其中AK/SK从[安全认证](http://console.bce.baidu.com/iam/#/iam/accesslist)里获取
```
if (process.env.SERVER_SOFTWARE == 'bae/3.0') {
	config.development.database = {
		client: 'mysql',
        connection: {
			host     : '<private mysql address>',//这里填你的私有mysql地址
			port	: '10396',
			user     : '<ak>', //填你的Access key
			password : '<sk>', //填你的Secret key
			database : '<database name>', //填你的数据库名
			charset  : 'utf8'
		},

		debug: false,
	};
	console.log('database switch to mysql for BAE');
}

config.development.storage = {
    active: 'baidu-bce',
	//active: 'aliyun-oss',
    config: {
		baiduBce: {
			credentials: {
				ak: '<ak>', //填你的Access key
				sk: '<sk>' //填你的Secret key
			},
			endpoint: 'http://bj.bcebos.com',
			bucket: '<your bucket>', //填你的Bucket名
			objectUrlPrefix: 'http://<填你的Bucket名>.bj.bcebos.com'
		}
    }
}
```
添加BAE git项目作为remote
```
git remote add bae https://git.duapp.com/appidf29vg2kvng
git pull bae master (把BAE上的东西拖下来合并，之后会package.json有冲突，把冲突解决掉重新提交就可以了)
git push bae master (把本地代码推送到bae去)
```
代码push完，结果如下图
![](http://transing.bj.bcebos.com/bae-pull-push.png)

#####一切准备好，就可以到[BAE部署列表](http://console.bce.baidu.com/bae/#/bae/app/list)里去发布项目了，第一次发布会比较久，发布正常后，效果如下
![](http://transing.bj.bcebos.com/bae-test-ok.png)



