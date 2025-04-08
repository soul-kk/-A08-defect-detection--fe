import Header from "../component/header";
import '../style/detection.css'
import { UploadOutlined, ZoomInOutlined, FolderOpenFilled,TagTwoTone } from '@ant-design/icons';
import { Button, Upload, Spin, Modal, message } from 'antd';
import { useEffect, useState } from "react";
import { detectImage, getStorage } from "../api";
import { useQuery } from "@tanstack/react-query";

export default function Detection() {
    return (
        <div className="indexContainer">
            <Header />
            <div className="mainContainer">
                <Main />
                <Storage />
            </div>

        </div>
    );
}

function Main() {
    const [fileId, setFileId] = useState(null);
    const [result, setResult] = useState(['not detect yet']);
    const [images, setImages] = useState({
        initial_image: null,
        heatMap: null,
        result_image: null
    })

    function handleUpload(info) {
        if (info.file.status === 'done') {       //请求成功
            const { response } = info.file;
            console.log(`上传图片后的响应: ${response.data}`)
            if (response.code === 200) {         //请求返回正常
                setFileId(response.data.id);
                setImages({
                    initial_image: response.data.initial_image,
                    heatMap: response.data.heatmap,
                    result_image: response.data.result_image
                });
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
            }
        } catch (error) {
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
                    action="https://amazed-obviously-bluejay.ngrok-free.app/api/upload"
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
                <Result id={fileId} result={result} images={images} />
            </div>
        </div>
    );
}

function Result({ id, result, images }) {
    const [imagesIsShow,setImagesIsShow] = useState(false)

    console.log(images.heatMap)
    const label = result.map((result, index) => {
        return <p key={`label--${index}`}>--{result.label}--</p>
    });
    const confidence = result.map((result, index) => {
        return <p key={`label--${index}`}>--{result.confidence}--</p>
    });

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
                <Button onClick={() => setImagesIsShow(true)}>图片结果展示</Button>  
                <h3>原图：</h3>
                <img src={ imagesIsShow? images.initial_image : null} />
                <h3>结果图：</h3>
                <img src={ imagesIsShow? images.result_image : null} />        
                <h3>热力图：</h3>
                <img src={imagesIsShow? images.heatMap : null} />
            </div>
        </div>
    );
}

function Storage() {
    const { data, error, isLoading, isError } = useQuery({      //useQuery处理获取图库api
        queryKey: ['storageItems'],
        queryFn: getStorage
    });


    if (isLoading) {
        return (
            <Spin tip="Loading" size="large" > </Spin>
        );
    }
    if (isError) {
        return (
            <h2>http error detail in log</h2>
        );
    }

    console.log(data);
    function Item({ id, date, results, initialImage, resultImage, heatMap }) {
        const [isModalOpen, setIsModalOpen] = useState(false);      //antd的弹框

        const showModal = () => {                       //antd的弹框
            setIsModalOpen(true);
        };
        const handleOk = () => {
            setIsModalOpen(false);
        };
        const handleCancel = () => {
            setIsModalOpen(false);
        };
        
        const label = results.map((result, index) => {
            return <p key={`label--${index}`}>--{result.label}--</p>
        });
        const confidence = results.map((result, index) => {
            return <p key={`label--${index}`}>--{result.confidence}--</p>
        });

        return (
            <div className="item">
                <Button  onClick={showModal}>检测详情</Button>
                <Modal className="modal" title={<TagTwoTone />} open={isModalOpen} onOk={handleOk} onCancel={handleCancel} >
                    <h3>缺陷类型:</h3>
                    {label}
                    <h3>对应自信度:</h3>
                    {confidence}
                    <h3>原图:</h3>
                    <img src={initialImage} />
                    <h3>结果图:</h3>
                    <img src={resultImage} />
                    <h3>热力图:</h3>
                    <img src={heatMap} />
                    <p>上传日期:{date}</p>
                    <p>id:{id}</p>
                </Modal>
                <p>检测日期:{date}</p>
                <img src={initialImage} />
            </div>
        );
    }

    function ItemList() {
        const items = data.data.map(item => <Item key={item.id} id={item.id} date={item.date} results={item.results} initialImage={item.initial_image} resultImage={item.result_image} heatMap={item.heatmap} />)
        return (
            <>
                {items}
            </>

        );
    }


    return (
        <div className="storageContainer">
            <h2><FolderOpenFilled />历史图库</h2>
            <br />
            <div className="itemList">
                <ItemList />
            </div>
        </div>
    );
}