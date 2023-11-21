#!/usr/bin/env zx

cd("../");

async function boot() {
  const clientPort = await question("客户端端口号:");
  const serverPort = await question("服务端端口号:");

  console.log(
    chalk.green.bold(`
    客户端端口号: ${clientPort};
    服务端端口号: ${serverPort};
  `)
  );

  const modify = async (url) => {
    const _path = path.resolve(__dirname, url);
    console.log(chalk.yellow(`修改文件: ${_path} `));

    let content = await fs.readFile(_path, "utf8");
    const result = content
      .replaceAll("5005", clientPort)
      .replaceAll("5006", serverPort);

    await fs.writeFile(_path, result, {
      encoding: "utf8",
    });

    console.log(chalk.blue.bold(`修改文件成功: ${_path} `));
  };

  await modify("../docker-compose.yml");
  await modify("../packages/client/nginx/config/server.conf");
  await modify("../packages/client/Dockerfile");
  await modify("../packages/server/Dockerfile");
}

boot().catch((err) => {
  console.log(err);
});
