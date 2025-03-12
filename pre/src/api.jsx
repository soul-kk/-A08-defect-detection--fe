const baseApi = 'http://localhost:8080'
const mockApi = 'http://127.0.0.1:4523/m1/5885910-5572598-default/api/history'
//讯飞星火api
const API_URL = 'https://spark-api-open.xf-yun.com/v1/chat/completions'
const API_KEY = 'gSStxqxITAvspBtktFAF:XPnGxzpxprfLmuBfYsAF'

//检测图片
export const detectImage = async (id) => {
    try {
        const response = await fetch(`${baseApi}/api/detect/${id}`);
        if (!response.ok) {
            throw new Error(`http error:${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (err) {
        console.log('获取检测结果失败', err);
    }
}

//获取原图片      返回图片的Blob url
export const getInitialImage = async (id) => {
    try {
        const response = await fetch(`${baseApi}/api/detect/image/${id}`);
        if (!response.ok) {
            throw new Error(`http error:${response.status}`)
        }
        const imageBlob = await response.blob();
        const imageUrl = URL.createObjectURL(imageBlob);
        return imageUrl;
    } catch (err) {
        console.log(err);
    }
}

//获取图库
export const getStorage = async () => {
    try {
        const response = await fetch(`${mockApi}`);
        if (!response.ok) {
            throw new Error(`http error:${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (err) {
        console.log(`获取图库数据失败:${err}`);
    }
}

