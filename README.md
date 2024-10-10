## Directory
- [简体中文](./docs/zh_CN/README.zhCN.md)
- [English](./README.md)

## Faker Server
Faker Server is a mock server based on Faker.js. It can be used to generate mock data for development and testing.  

## Deploy
Currently supports npm command and Docker deployment.

First, you need a MongoDB database and obtain the connection string. We recommend using MongoDB Atlas, but you can also deploy it yourself.

MongoDB Atlas usage method can be found [here](./docs/en/mongodb-atlas.md).

### npm command
```bash
# Install
npm install -g faker-server
# Start
faker-server
```

The program will generate a configuration file `.env` in your `~/.faker-server` directory. You can modify the configuration and restart the service as needed.

```bash
# Server Port
PORT=3000

# Remember to change this key
KEY=123456-123456-123456-123456

# MongoDB URL
MONGO_URL=mongodb://admin:password@localhost:27017?authSource=admin
```

### Docker

🚧 Under Construction
