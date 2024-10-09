## Faker Server
Faker Server 是一个基于 Faker.js 的 mock 服务器。 
使用 MongoDB 作为数据存储，包含一个前端管理页面，可以方便地管理 mock 数据。  

## 部署  
当前支持 Cloudflare Workers 和 Node.js 部署。  

首先你需要一个 MongoDB 数据库并获取连接字符串，推荐使用 MongoDB Atlas，也可以自己部署。  
MongoDB Atlas 的使用方法见 [这里](./mongodb-atlas.md)。  

### Cloudflare Workers  
[![Deploy to Cloudflare Workers](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/ray-d-song/faker-server)

点击上方按钮按照提示完成部署。  

之后你需要进入 Cloudflare Workers 控制台，进入`faker-server`页面，点击`设置`，选择`变量和机密`，添加以下环境变量：  

- `MONGO_URL`：MongoDB 连接字符串
- `KEY`：鉴权密钥，随意设置，最好采用`uuid`等具有一定复杂度的随机字符串

### Node.js  
