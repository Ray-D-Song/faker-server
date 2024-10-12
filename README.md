## Directory

- [简体中文](https://github.com/ray-d-song/faker-server/blob/main/docs/zh_CN/README.zhCN.md)
- [English](https://github.com/ray-d-song/faker-server/blob/main/README.md)

## Faker Server

Faker Server is a mock server based on Faker.js. It can be used to generate mock data for development and testing.

![Faker Server](https://raw.githubusercontent.com/ray-d-song/faker-server/main/docs/static/preview.png)

Online access: [https://faker-preview.jenrays.com/](https://faker-preview.jenrays.com/)  
Read-only key: `1234`

Mock API list:

- [`GET /mock/user/list`](https://faker-preview.jenrays.com/mock/user/list)
- [`POST /mock/user`](https://faker-preview.jenrays.com/mock/user)

## Deploy

Currently supports npm command and Docker deployment.

First, you need a MongoDB database and obtain the connection string. We recommend using MongoDB Atlas, but you can also deploy it yourself.

MongoDB Atlas usage method can be found [here](https://github.com/ray-d-song/faker-server/blob/main/docs/en/mongodb-atlas.md).

### npm command

```bash
# Install
npm install -g @ray-d-song/faker-server
# Start
faker-server
```

The program will generate a configuration file `.env` in your `~/.faker-server` directory. You can modify the configuration and restart the service as needed.

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

`ACCESS_KEY` `ADMIN_KEY` `READONLY_KEY` are randomly generated when the service is first started. You can also modify them as needed.

`ACCESS_KEY` is used to access the mock service.  
`ADMIN_KEY` is used to manage the interface in the page.  
`READONLY_KEY` can access the web page, but cannot modify the data.

`PUBLIC_ACCESS` is true, the mock service will allow public access, but the `/api/*` interface for editing will still require authentication.

### Docker

🚧 Under Construction

## Access Service

### web page

If your service is running on `http://localhost:3000`, then the web page can be accessed through `http://localhost:3000`.

The page will prompt you to enter `ADMIN_KEY` or `READONLY_KEY`.

### mock service

The mock service interface address is `/mock/*`, for example, if you add an interface `/user/list`, you can access it through `http://localhost:3000/mock/user/list`.

When `PUBLIC_ACCESS` is set to false, accessing the interface requires the `Faker-Server-Key` request header, the value is the `ACCESS_KEY` in the `.env` file.
