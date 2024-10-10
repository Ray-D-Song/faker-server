## Faker Server
Faker Server 是一个基于 Faker.js 的 mock 服务器。 
使用 MongoDB 作为数据存储，包含一个前端管理页面，可以方便地管理 mock 数据。  

## 部署  
当前支持 npm 命令和 Docker 部署。  

首先你需要一个 MongoDB 数据库并获取连接字符串，推荐使用 MongoDB Atlas，也可以自己部署。  
MongoDB Atlas 的使用方法见 [这里](./mongodb-atlas.md)。  

### npm 命令  
```bash
# 安装
npm install -g faker-server
# 启动
faker-server
```

程序将会在你的`~/.faker-server`目录下生成一个配置文件`.env`，你可以根据需要修改配置后重启服务。  

```bash
# Server Port
PORT=3000

# Remember to change this key
KEY=123456-123456-123456-123456

# MongoDB URL
MONGO_URL=mongodb://admin:password@localhost:27017?authSource=admin
```

### Docker  

🚧 待施工 
