import Header from "./header";
import '../style/detection.css'
import { Image } from 'antd'
import { UploadOutlined, ZoomInOutlined } from '@ant-design/icons';
import { Button, Upload } from 'antd';
import exampleImage1 from '../images/0a2c9f2e5.jpg'
import exampleImage2 from '../images/0a2dbbb6f.jpg'
import exampleImage3 from '../images/0a3962685.jpg'
import exampleImage4 from '../images/0a63f7765.jpg'
import exampleImage5 from '../images/0a9cbb927.jpg'
import exampleImage6 from '../images/0e2adcd02.jpg'


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
    return (
        <div className="main">
            <h2>模型检测</h2>
            <div className="upload">
                <Upload
                    action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
                    listType="picture"
                >
                    <Button type="primary" icon={<UploadOutlined />}>
                        上传图片
                    </Button>
                </Upload>
            </div>

            <div className="resultContainer">
                <Button type="primary" icon={<ZoomInOutlined />}>
                    检测缺陷
                </Button>
                <Result />
            </div>
        </div>
    );
}

function Result() {
    return (
        <div className="result">
            <div className="label">
                <h3>缺陷类型：</h3>
                <p>--划痕--</p>
            </div>
            <div className="confidence">
                <h3>自信度：</h3>
                <p>--0.89--</p>
            </div>
            <div className="photo">
                <Button>查看结果图</Button>
                <Image src={exampleImage1} />
            </div>
        </div>
    );
}