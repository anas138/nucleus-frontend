# Nucleus - Centralized Network Monitoring System

## Project setup

```
yarn install
```

### Compiles and hot-reloads for development

```
yarn serve
```

### Compiles and minifies for production

```
yarn build
```

### Lints and fixes files

```
yarn lint
```

### Docker Setup - Optional 

1. Commands to create docker image and run container for nucleus-frontend:

    ```
    docker build -t nucleus-frontend .
    docker stop nucleus-frontend
    docker rm nucleus-frontend
    ```
2. Run Docker Container for nucleus-frontend
    ```
    docker run -d -p {HOST_PORT}:80 --name nucleus-frontend nucleus-frontend
    docker run -d -p 9090:80 --name nucleus-frontend nucleus-frontend
    ```
    host port must be available and allowed on firewall

### Customize configuration

See [Configuration Reference](https://cli.vuejs.org/config/).
