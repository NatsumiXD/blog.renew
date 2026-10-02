# 项目脚本

Windows 使用 `.bat`；Linux 使用 `bash script/<名称>.sh`。脚本会自动切换到项目根目录，可以从任意目录调用。

需要先安装 Node.js 22 LTS 或更新版本以及 pnpm：`npm install -g pnpm@9.14.4`。

| 操作 | Windows | Linux |
| --- | --- | --- |
| 安装依赖 | `script\install.bat` | `bash script/install.sh` |
| 前台启动开发服务，实时输出日志 | `script\rundev.bat` | `bash script/rundev.sh` |
| 后台启动开发服务 | `script\rundev.bat background` | `bash script/rundev.sh background` |
| 查看后台服务状态 | `script\rundev.bat status` | `bash script/rundev.sh status` |
| 查看后台服务日志 | `script\rundev.bat logs` | `bash script/rundev.sh logs` |
| 停止后台服务 | `script\rundev.bat stop` | `bash script/rundev.sh stop` |
| 检查并生成部署文件 | `script\depoly.bat` | `bash script/depoly.sh` |

`depoly` 保留请求中的文件名。它执行类型检查、构建和搜索索引生成，输出 `dist/`；尚未配置远程发布目标。
上线前请修改 `astro.config.mjs` 中的 `site` 域名。

默认在当前终端运行，持续输出日志并支持热重载，按 `Ctrl+C` 停止。
如果之前启动了后台服务，先执行 `rundev stop`，再启动前台服务。

当前 Astro 5 没有原生后台服务管理功能。显式使用 `background` 时，脚本通过 Node.js 分离进程运行，PID 和日志保存在 `.dev-server/`，通过上述脚本管理。
