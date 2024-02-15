# BiliFavListInfoExport
# 简介
这个工具用于以JSON、HTML格式保存B站收藏夹内的视频信息，包含视频标题、封面、UP主昵称、简介以及跳转链接。
# 如何使用
## 需要的信息
1. FavList ID: 你想要下载信息的收藏夹的 ID 。这个id你可以在该收藏夹的网址 URL 中找到。B站收藏夹的 URL中有一部分数字就是这个 ID，例如当你从自己的个人空间点击查看收藏夹的全部内容时，打开的网页会以这样的形式显示：https://space.bilibili.com/xxxx/favlist?fid=254012&ftype=collect&ctype=21 ，其fid后面的一串数字就是FavList ID。
2. SESSDATA: SESSDATA是调用B站API所需的Cookie。请以登录状态打开B站，打开浏览器的网络开发模式，在Cookie中找到SESSDATA一项，复制其值即可。
## 如何操作该工具
1. Git Clone 仓库到本地
2. 初始化运行环境
3. 键入```nodemon app.js```命令运行项目，显示运行成功后，在浏览器中打开：http://localhost:3000。根据提示信息，输入 FavList ID 和 SESSDATA，点击获取API信息。点击后，跳转的页面就会显示收藏夹的信息，数据也保存为all_videos.json”，位于项目根目录下。
# 注意事项
1. 一次运行只会保存一个收藏夹的所有视频数据。如果想要保存多个收藏夹的信息，需要在每次运行结束后，转移项目根目录下的“all_videos.json”文件，该文件只保存一个收藏夹的信息。（待优化）