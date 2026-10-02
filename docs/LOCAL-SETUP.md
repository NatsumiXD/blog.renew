# 本地使用

本项目已导入 [Fuwari](https://github.com/saicaca/fuwari) 模板，来源提交：
`6d39b0dec41282e7852e23e032998a5789abee28`。

使用模板配套的 Astro 5.13.10 和 pnpm 9.14.4，已配置个人资料并替换示例文章。

- 安装依赖：`pnpm install --frozen-lockfile --offline=false`
- 检查：`pnpm check`
- 构建（包含 Pagefind 搜索索引）：`pnpm build`
- 新建文章：`pnpm new-post my-first-post`
- 站点标题、语言、头像、导航等：`src/config.ts`
- 文章目录：`src/content/posts/`
- 关于页面：`src/content/spec/about.md`

正式站点域名已配置为 `https://blog.natsumi.dev/`，构建时 RSS 和站点地图会使用此域名。

开发服务使用 `script/rundev.bat`（Windows）或 `bash script/rundev.sh`（Linux）前台启动，实时输出日志，按 `Ctrl+C` 停止。
添加 `background` 参数可后台运行，模板配套的 Astro 5 通过脚本分离进程实现后台管理。
安装、开发服务管理和部署构建命令见 [项目脚本](../script/README.md)。

## GitHub Actions

`.github/workflows/pages.yml` 在推送到 `main` 或 `master` 时运行，也可在 Actions 页面手动触发。
流程使用 Node.js 22 和 `package.json` 指定的 pnpm 版本，安装锁定依赖、检查并构建，随后将 `dist` 的内容发布到 `pages` 分支根目录（包括 Pagefind 搜索索引）。旧的构建文件会被替换，源码分支保持独立。

发布使用 GitHub 自动提供的 `GITHUB_TOKEN`，无需添加个人访问令牌。流程声明了 `contents: write`；仓库策略需允许该写入权限。
生成的分支包含 `.nojekyll` 和指向 `blog.natsumi.dev` 的 `CNAME`。
若使用 GitHub Pages 托管，在仓库 Settings → Pages 中选择 Deploy from a branch，分支选择 `pages`、目录选择 `/ (root)`，并配置自定义域名及 DNS。
