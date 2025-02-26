import Header from "./header";
import '../style/detection.css'
import { Image, message } from 'antd'
import { UploadOutlined, ZoomInOutlined } from '@ant-design/icons';
import { Button, Upload } from 'antd';
import { useEffect, useState } from "react";
import { detectImage, getInitialImage } from "../api";


export default function Detection() {
    return (
        <div className="indexContainer">
            <Header />
            <div className="mainContainer">
                <Main />
            </div>

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
    const [initialImageUrl, setInitialImageUrl] = useState(null);

    useEffect(() => {
        return () => {
            if (initialImageUrl) {
                URL.revokeObjectURL(initialImageUrl);
            }
        };
    }, [id]);

    const label = result.map((result, index) => {
        return <p key={`label--${index}`}>--{result.label}--</p>
    });
    const confidence = result.map((result, index) => {
        return <p key={`label--${index}`}>--{result.confidence}--</p>
    });

    async function handleGetInitialImage() {
        try {
            const initialUrl = await getInitialImage(id);
            setInitialImageUrl(initialUrl);
        } catch (err) {
            console.log(err);
        }
    }

    console.log('InitialImageUrl:', initialImageUrl);

    return (
        <div className="result">
            <div className="label">
                <h3>缺陷类型：</h3>
                {label}
            </div>
            <div className="confidence">
                <h3>分别对应自信度：</h3>
                {confidence}
            </div>
            <div className="photo">
                <Button onClick={handleGetInitialImage}>图片结果展示</Button>
                <h3>原图：</h3>
                <img src={initialImageUrl} />
                <h3>结果图：</h3>
                <img src={initialImageUrl} />           {/* TODO */}
            </div>
        </div>
    );
}