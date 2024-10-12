## Faker Server

Faker Server 是一个基于 Faker.js 的 mock 服务器。
使用 MongoDB 作为数据存储，包含一个前端管理页面，可以方便地管理 mock 数据。

![Faker Server](https://raw.githubusercontent.com/ray-d-song/faker-server/main/docs/static/preview.png)

在线访问：[https://faker-preview.jenrays.com/](https://faker-preview.jenrays.com/)  
只读密钥：`1234`

Mock 接口列表：

- [`GET /mock/user/list`](https://faker-preview.jenrays.com/mock/user/list)
- [`POST /mock/user`](https://faker-preview.jenrays.com/mock/user)

## 部署

当前支持 npm 命令和 Docker 部署。

首先你需要一个 MongoDB 数据库并获取连接字符串，推荐使用 MongoDB Atlas，也可以自己部署。  
MongoDB Atlas 的使用方法见 [这里](https://github.com/ray-d-song/faker-server/blob/main/docs/zh_CN/mongodb-atlas.md)。

### npm 命令

```bash
# 安装
npm install -g @ray-d-song/faker-server
# 启动
faker-server
```

程序将会在你的`~/.faker-server`目录下生成一个配置文件`.env`，你可以根据需要修改配置后重启服务。

```bash
# Server Port
PORT=3000

# Access /mock/* API
ACCESS_KEY=${uuid}

# If true, the server will allow public access to the /mock/* API
# /api/* will continue to require authentication
PUBLIC_ACCESS=false

# ADMIN_KEY is used to access the web page and modify the data
ADMIN_KEY=${uuid}

# READONLY_KEY can access the web page, but cannot modify the data
READONLY_KEY=${uuid}

# MongoDB URL
MONGO_URL=mongodb://admin:password@localhost:27017?authSource=admin
```

其中`ACCESS_KEY`、`ADMIN_KEY`、`READONLY_KEY`为服务首次启动时随机生成，你也可以根据需要修改。

`ACCESS_KEY`用于访问 mock 服务。  
`ADMIN_KEY`用于在页面管理接口。  
`READONLY_KEY`可以访问页面，但不能修改数据。

`PUBLIC_ACCESS`为 true 时，`/mock/*`接口将允许公共访问，用于编辑的`/api/*`接口仍然需要认证。

### Docker

🚧 待施工

## 访问服务

### web 页面

假如你的服务运行在`http://localhost:3000`，那么web页面可以通过`http://localhost:3000`访问。

页面会提示你输入`ADMIN_KEY`或`READONLY_KEY`。

### mock 服务

mock 服务的接口地址为 `/mock/*`，例如你新增了一个接口`/user/list`，那么你可以通过`http://localhost:3000/mock/user/list`访问。

`PUBLIC_ACCESS`设置为 false 时，访问接口需要携带`Faker-Server-Key`请求头，值为.env文件中的`ACCESS_KEY`。
