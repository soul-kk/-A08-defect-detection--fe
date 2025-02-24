const baseApi = 'http://localhost:8080'

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

//获取标注后的图片      返回图片的Blob url
export const getImage = async (id) => {
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