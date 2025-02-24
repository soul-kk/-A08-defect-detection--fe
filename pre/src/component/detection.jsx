import Header from "./header";
import '../style/detection.css'
import { Image, message } from 'antd'
import { UploadOutlined, ZoomInOutlined } from '@ant-design/icons';
import { Button, Upload } from 'antd';
import exampleImage1 from '../images/jzw.jpg'
import exampleImage2 from '../images/bd.jpg'
import exampleImage3 from '../images/hh.jpg'
import exampleImage4 from '../images/qt1.jpg'
import exampleImage5 from '../images/qt2.jpg'
import exampleImage6 from '../images/qt3.jpg'
import { useEffect, useState } from "react";
import { detectImage, getImage } from "../api";

export default function Detection() {
    return <div className="indexContainer">
        <Header />
        <Descriprion />
        <div className="mainContainer">
            <Example />
            <Main />
        </div>
    </div>
}

function Descriprion() {
    return (
        <div className="description">
            <h3>项目背景</h3>
            <p>传统的零部件缺陷检测方法多依赖人工检查，效率低、错误率高，难以满足现代生产的高效性和准确性要求。需要引入智能先进的检测技术，提升零部件的检测效率和准确性。该系统旨在彻底改变传统的车辆零部件质量检测流程，通过引入智能图像识别技术，实时、自动化的检测和分类，显著提升生产效率和产品质量。</p>
        </div>
    );
}

function Example() {
    return (
        <div className="example">
            <h2>缺陷样例展示</h2>
            <Image.PreviewGroup preview={{ onChange: (current, prev) => console.log(`current index: ${current}, prev index: ${prev}`), }}>
                <p>-- 夹杂物</p>
                <Image className="exampleImage" src={exampleImage1} />
                <p>-- 补丁</p>
                <Image className="exampleImage" src={exampleImage2} />
                <p>-- 划痕</p>
                <Image className="exampleImage" src={exampleImage3} />
                <p>-- 其他缺陷</p>
                <Image className="exampleImage" src={exampleImage4} />
                <Image className="exampleImage" src={exampleImage5} />
                <Image className="exampleImage" src={exampleImage6} />
            </Image.PreviewGroup>
        </div>
    );
}

function Main() {
    const [fileId, setFileId] = useState(null);
    const [result, setResult] = useState(['no result']);

    function handleUpload(info) {
        if (info.file.status === 'done') {       //请求成功
            const { response } = info.file;
            if (response.code === 200) {         //请求返回正常
                setFileId(response.data.fileId);
                message.success('图片上传成功！');
            } else {
                message.error(response.message || '上传失败');
            }
        } else if (info.file.status === 'error') {      //请求失败
            message.error('上传失败');
        }
    }

    async function handleDetect() {
        try {
            const response = await detectImage(fileId);
            if (response && response.data) {
                setResult(response.data.results);
                message.success('检测成功！');
            }
        } catch (error) {
            message.error('检测失败');
            console.log(error);
        }
    }

    console.log('fileId:', fileId);
    console.log('检测结果:', result);
    return (
        <div className="main">
            <h2>缺陷检测</h2>
            <div className="upload">
                <Upload
                    action="http://localhost:8080/api/upload"
                    listType="picture"
                    onChange={handleUpload}
                >
                    <Button type="primary" icon={<UploadOutlined />}>
                        上传图片
                    </Button>
                </Upload>
            </div>

            <div className="resultContainer">
                <Button type="primary" icon={<ZoomInOutlined />} onClick={handleDetect} >
                    检测缺陷
                </Button>
                <Result id={fileId} result={result} />
            </div>
        </div>
    );
}

function Result({ id, result }) {
    const [imageUrl, setImageUrl] = useState(null);
    useEffect(()=>{
        return ()=>{
            if(imageUrl) {
                URL.revokeObjectURL(imageUrl);
            }
        };
    },[id]);

    const label = result.map((result) => {
        return <p>--{result.label}--</p>
    });
    const confidence = result.map((result) => {
        return <p>--{result.confidence}--</p>
    });

    async function handleGetImage() {
        try {
            const url = await getImage(id);
            setImageUrl(url);
        } catch (err) {
            console.log(err);
        }
    }

    console.log('imageUrl:',imageUrl);

    return (
        <div className="result">
            <div className="label">
                <h3>缺陷类型：</h3>
                <p>{label}</p>
            </div>
            <div className="confidence">
                <h3>分别对应自信度：</h3>
                <p>{confidence}</p>
            </div>
            <div className="photo">
                <Button onClick={handleGetImage}>查看结果图</Button>
                <img src={imageUrl} />
            </div>
        </div>
    );
}