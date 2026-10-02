# 💧 BakaHome

**笨蛋博客** · Rakurin Natsumi · 一个笨蛋

基于 [Fuwari](https://github.com/saicaca/fuwari) 主题定制的个人博客，使用 Astro、Svelte 和 Tailwind CSS 构建。

- 站点：<https://blog.natsumi.dev/>
- 仓库：[NatsumiXD/blog.renew](https://github.com/NatsumiXD/blog.renew)
- 作者：[NatsumiXD](https://github.com/NatsumiXD)

## 功能

- 中文界面，支持浅色、深色、跟随系统和主题色调整。
- 全屏欢迎页：背景按比例裁切、随鼠标倾斜，点击后播放 RN 描线与展开动画。
- 同一标签页进入博客后跳过欢迎页，站内导航使用 Swup 和淡入淡出过渡。
- Markdown 文章、标签、分类、归档、目录、图片预览和代码块复制。
- Pagefind 静态搜索、RSS 和站点地图。
- QQ 联系页，根据设备和浏览器选择客户端唤起方式。
- GitHub Actions 自动构建并发布到 `pages` 分支。

## 本地运行

准备 Node.js 22 和 pnpm 9.14.4：

```sh
npm install -g pnpm@9.14.4
git clone https://github.com/NatsumiXD/blog.renew.git
cd blog.renew
pnpm install --frozen-lockfile --offline=false
pnpm dev
```

默认访问 <http://localhost:4321/>，实际地址以终端输出为准。开发服务支持热重载，日志在当前终端输出，按 `Ctrl+C` 停止。

也可以使用 `script/` 中的脚本：

| 操作 | Windows | Linux |
| --- | --- | --- |
| 安装依赖 | `script\install.bat` | `bash script/install.sh` |
| 启动开发服务 | `script\rundev.bat` | `bash script/rundev.sh` |
| 检查并构建 | `script\depoly.bat` | `bash script/depoly.sh` |

`rundev` 默认前台运行，也支持 `background`、`status`、`logs` 和 `stop` 参数。`depoly` 保留原脚本名称，仅生成 `dist/`，供手动上传。更多用法见 [项目脚本说明](script/README.md)。

## 常用命令

在项目根目录执行：

| 命令 | 作用 |
| --- | --- |
| `pnpm dev` | 启动开发服务 |
| `pnpm check` | 检查 Astro 和类型错误 |
| `pnpm build` | 构建 `dist/` 并生成 Pagefind 搜索索引 |
| `pnpm preview` | 本地预览构建产物 |
| `pnpm new-post my-post` | 创建文章模板 |
| `pnpm format` | 格式化源代码 |

搜索索引在构建时生成，验证搜索功能请先执行 `pnpm build`，再运行 `pnpm preview`。

## 配置与内容

| 文件或目录 | 用途 |
| --- | --- |
| `src/config.ts` | 标题、副标题、语言、主题色、横幅、目录、图标、个人资料、导航和文章许可 |
| `astro.config.mjs` | 正式域名、基础路径及构建集成 |
| `src/constants/constants.ts` | 每页文章数、默认显示模式及页面宽度等 |
| `src/content/posts/` | 博客文章 |
| `src/content/spec/about.md` | 关于页面 |
| `src/components/WelcomeScreen.astro` | 欢迎页文字、布局及入场动画 |
| `src/assets/images/` | 头像及欢迎页背景 |
| `public/favicon/water-drop.svg` | 水滴 emoji 网站图标 |
| `src/pages/qq.astro`、`src/utils/qq.ts` | QQ 页面和客户端跳转地址 |

当前域名为 `https://blog.natsumi.dev/`，副标题为「笨蛋博客」，简介为「一个笨蛋」。修改域名时，同时检查 RSS 的备用地址和工作流中的 `cname`。

### 写文章

```sh
pnpm new-post my-post
```

编辑生成的 `src/content/posts/my-post.md`：

```yaml
---
title: 我的文章
published: 2026-10-03
description: 一段简短的文章介绍。
tags: [日常]
category: 随笔
draft: false
lang: zh_CN
---
```

在 frontmatter 下方写 Markdown 正文。`title` 和 `published` 必填；还可以设置 `updated`（更新日期）和 `image`（封面路径）。将 `draft` 设为 `true` 可暂时隐藏文章。

## 自动构建与发布

工作流位于 [`.github/workflows/pages.yml`](.github/workflows/pages.yml)。推送到 `master` 或 `main` 后自动执行，也可在仓库 Actions 页面手动运行。

1. 使用 Node.js 22 和 `package.json` 指定的 pnpm 版本安装锁定依赖。
2. 执行 `pnpm check` 和 `pnpm build`。
3. 将 `dist/` 的内容发布到 `pages` 分支根目录，替换旧构建文件。
4. 生成 `.nojekyll` 和内容为 `blog.natsumi.dev` 的 `CNAME`。

源码保存在 `master` / `main`，`pages` 仅用于构建产物，请在源码分支修改内容。工作流使用自动提供的 `GITHUB_TOKEN`，仓库策略需允许 `contents: write` 权限。

若使用 GitHub Pages 托管，在 **Settings → Pages** 中选择 **Deploy from a branch**，分支选择 **pages**，目录选择 **/ (root)**。随后配置 `blog.natsumi.dev` 的 DNS、自定义域名和 HTTPS。

## 项目来源与许可

主题来自 [saicaca/fuwari](https://github.com/saicaca/fuwari)，导入版本为 `6d39b0dec41282e7852e23e032998a5789abee28`。本项目使用 Astro 5.13.10。

代码许可见 [LICENSE](LICENSE)（MIT）。文章页面默认显示 **CC BY-NC-SA 4.0**，可在 `src/config.ts` 中调整。图片素材的权利归各自作者所有。

补充说明见 [本地使用文档](docs/LOCAL-SETUP.md)。
