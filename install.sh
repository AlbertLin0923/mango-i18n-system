#!/bin/bash

# 如果遇到错误立即退出
set -e

# 红色文本的 ANSI 转义序列
RED='\033[0;31m'
NC='\033[0m' # No Color

# 定义一个函数用于打印红色错误消息并退出
print_error_and_exit() {
    local message="$1"
    echo -e "${RED}${message}${NC}"
    exit 1
}

# 捕捉错误并执行自定义错误处理
trap 'print_error_and_exit "发生错误，脚本退出。"' ERR

clientPort=80
serverPort=8080
invitation_code="mango-i18n-system-invitation-code"
current_dir=$(pwd)
baseDir="${current_dir}/mango-i18n-system-${clientPort}-${serverPort}"

# 打印当前目录
echo "当前目录是: $current_dir"

# 检查端口是否被占用的函数
check_port() {
    if lsof -i:$1 > /dev/null; then
        return 1
    else
        return 0
    fi
}

# 获取用户输入的端口，默认值为80
get_client_port() {
    while true; do
        read -p "请输入客户端端口（默认: 80）: " clientPort
        clientPort=${clientPort:-80}
        if check_port $clientPort; then
            break
        else
            echo "端口 $clientPort 已被占用，请重新选择。"
        fi
    done
}

# 获取用户输入的端口，默认值为8080
get_server_port() {
    while true; do
        read -p "请输入服务端端口（默认: 8080）: " serverPort
        serverPort=${serverPort:-8080}
        if check_port $serverPort; then
            break
        else
            echo "端口 $serverPort 已被占用，请重新选择。"
        fi
    done
}

# 获取用户输入的端口，默认值为8080
get_invitation_code() {
    read -p "请输入服务端邀请码<用于管理员账号注册，请记住>（默认: ${invitation_code}): " invitation_code
    invitation_code=${invitation_code:-"mango-i18n-system-invitation-code"}

}

# 创建文件夹结构的函数
create_directories() {
    echo "创建服务端数据库、缓存、日志等宿主机映射目录。。。"
    echo "${baseDir}"
    if ! mkdir -p "$baseDir/server/database"; then
        print_error_and_exit "无法创建目录: $baseDir/server/database"
    fi
    if ! mkdir -p "$baseDir/server/contentHash"; then
        print_error_and_exit "无法创建目录: $baseDir/server/contentHash"
    fi
    if ! mkdir -p "$baseDir/server/logs"; then
        print_error_and_exit "无法创建目录: $baseDir/server/logs"
    fi
    if ! mkdir -p "$baseDir/server/sourceCode"; then
        print_error_and_exit "无法创建目录: $baseDir/server/sourceCode"
    fi
    echo "创建目录成功"
}

# 生成 docker-compose.yml 文件的函数
create_docker_compose() {
    echo "创建 docker-compose.yml 文件。。。"
    cat <<EOL > "$baseDir/docker-compose.yml"
services:
  server:
    image: mango-i18n-system-server:latest
    environment:
      TZ: Asia/Shanghai
      INVITATION_CODE: ${invitation_code}
      PASSWORD_SALT: mango-i18n-system-password-salt
      JWT_ACCESS_SECRET: mango-i18n-system-jwt-access-secret
      JWT_REFRESH_SECRET: mango-i18n-system-jwt-refresh-secret
      JWT_EXPIRES_IN: 31d
      JWT_REFRESH_IN: 62d
    volumes:
      - ${baseDir}/server/database:/home/app/server/database
      - ${baseDir}/server/contentHash:/home/app/server/contentHash
      - ${baseDir}/server/logs:/home/app/server/logs
      - ${baseDir}/server/sourceCode:/home/app/server/sourceCode
    ports:
      - '${serverPort}:8080'
    restart: always
    networks:
      - backend

  client:
    image: mango-i18n-system-client:latest
    depends_on:
      - server
    ports:
      - '${clientPort}:3000'
    restart: always
    networks:
      - backend

networks:
  backend:
    driver: bridge
EOL
    echo "创建 docker-compose.yml 文件成功"
}

# 判断是否安装了 docker 和 docker-compose
make_sure_docker_and_docker_compose() {
    # 判断是否安装了 docker
    if ! type docker >/dev/null 2>&1; then
        print_error_and_exit 'docker 未安装，请先安装 docker'
    else
        echo 'docker 已安装'
    fi

    # 判断是否安装了 docker-compose
    if ! type docker-compose >/dev/null 2>&1; then
        print_error_and_exit 'docker-compose 未安装，请先安装 docker-compose'
    else
        echo 'docker-compose 已安装'
    fi
}

# 主程序
get_client_port
get_server_port
get_invitation_code
create_directories
create_docker_compose
make_sure_docker_and_docker_compose

# 进入 baseDir 目录并执行 docker-compose up -d
echo "进入目录并启动 Docker 服务。。。"
cd $baseDir || print_error_and_exit "无法进入目录: $baseDir"
docker-compose up -d
