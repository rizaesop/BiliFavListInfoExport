const express = require('express');
const request = require('request');
const fs = require('fs');

const app = express();
const port = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

app.get('/', (req, res) => {
  // 渲染包含输入表单的页面
  res.render('index');
});

app.post('/getData', async (req, res) => {
  try {
    // 读取根目录下的 all_videos.json 文件
    const filePath = 'all_videos.json';
    const rawData = fs.readFileSync(filePath);
    const allVideos = JSON.parse(rawData);

    // 渲染视图，传递所有视频信息
    res.render('result', { allVideos });
  } catch (error) {
    const mediaId = req.body.mediaId;
    const platform = 'web';
    const ps = 20;
    const sessdata = req.body.sessdata;

    const url = 'https://api.bilibili.com/x/v3/fav/resource/list';
    const params = {
      'media_id': mediaId,
      'platform': platform,
      'ps': ps
    };
    const cookies = {
      'SESSDATA': sessdata
    };

    // 发送第一次请求获取总视频数
    const firstResponse = await sendRequest(url, { ...params, pn: 1 }, cookies);
    const numOfVideos = firstResponse.data.info.media_count;

    // 处理分页数据
    const totalPages = Math.ceil(numOfVideos / ps);
    const allVideos = [];

    for (let pn = 1; pn <= totalPages; pn++) {
      const response = await sendRequest(url, { ...params, pn }, cookies);
      const medias = response.data.medias;

      // 处理 medias 数据，可以根据需求进行修改
      const keep_fields = [
        'title',
        'pubtime',
        'bv_id',
        'cover',
        'intro',
        'up_name',
      ];

      medias.forEach((media) => {
        const filteredData = {};
        keep_fields.forEach((key) => {
          if (key in media) {
            filteredData[key] = media[key];
          }
        });

        if ('upper' in media && 'name' in media.upper) {
          filteredData.up_name = media.upper.name;
          delete media.upper.name;
        }

        filteredData.link = `http://www.bilibili.com/video/${media.bv_id}`;
        Object.keys(media).forEach((key) => delete media[key]);
        Object.assign(media, filteredData);
      });
      allVideos.push(...medias);
    }

    // 导出所有视频信息到文件
    const filePath = 'all_videos.json';
    fs.writeFileSync(filePath, JSON.stringify(allVideos, null, 2));

    res.render('getData', { allVideos: allVideos });
    console.log("API请求成功，所有视频信息已导出到 all_videos.json。");
  }
});


// 封装发送请求的函数
function sendRequest(url, params, cookies) {
  return new Promise((resolve, reject) => {
    request.get({ url, qs: params, headers: { Cookie: `SESSDATA=${cookies.SESSDATA}` } }, (error, response, body) => {
      if (!error && response.statusCode === 200) {
        resolve(JSON.parse(body));
      } else {
        reject(error || response.statusCode);
      }
    });
  });
}

app.get('/result', (req, res) => {
  try {
    // 读取根目录下的 all_videos.json 文件
    const filePath = 'all_videos.json';
    const rawData = fs.readFileSync(filePath);
    const allVideos = JSON.parse(rawData);

    // 渲染视图，传递所有视频信息
    res.render('result', { allVideos });
  } catch (error) {
    console.error("读取文件失败:", error);
    res.status(500).send("读取文件失败");
  }
});

app.listen(port, () => {
  console.log(`服务器运行在 http://localhost:${port}`);
});
