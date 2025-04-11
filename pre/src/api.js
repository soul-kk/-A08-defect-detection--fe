const baseApi = "https://amazed-obviously-bluejay.ngrok-free.app";

//检测图片
export const detectImage = async (id) => {
  try {
    const response = await fetch(`${baseApi}/api/detect/${id}`, { headers });
    if (!response.ok) {
      throw new Error(`http error:${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (err) {
    console.log("获取检测结果失败", err);
  }
};

//获取图库
export const getStorage = async () => {
  try {
    const response = await fetch(`${baseApi}/api/history`, { headers,
      mode: 'cors',  // 显式设置 CORS 模式
     });
    if (!response.ok) {
      throw new Error(`http error:${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (err) {
    console.log(`获取图库数据失败:${err}`);
  }
};
