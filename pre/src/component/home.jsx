import Header from "./header";
import '../style/home.css'
import { Image, message } from 'antd'

export default function Home() {
    return <div className="indexContainer">
        <Header />
        <Descriprion />
        <div className="mainContainer">
            <Example />
            <ResultShow />
        </div>
    </div>
}

function Descriprion() {
    return (
        <div className="description">
            <h3>系统介绍</h3>
            <p>传统的零部件缺陷检测方法多依赖<span style={{fontWeight:'bolder'}}>人工检查，效率低、错误率高</span>，难以满足现代生产的要求，需要引入智能先进的检测技术。该系统主要针对车门的原材料钢板的表面进行<span style={{color:'red'}}>缺陷检测</span>。通过拍摄钢材表面图片，经过检测系统<span style={{color:'red',fontWeight:'bolder'}}>算法智能识别</span>缺陷，并对缺陷进行分类。</p>
        </div>
    );
}

function Example() {
    return (
        <div className="example">
            <h2>缺陷样例展示</h2>
            <Image.PreviewGroup preview={{ onChange: (current, prev) => console.log(`current index: ${current}, prev index: ${prev}`), }}>
                <p>-- 夹杂物</p>
                <Image className="exampleImage" src={'public/images/homeLeft/label1.png'} />
                <p>-- 补丁</p>
                <Image className="exampleImage" src={'public/images/homeLeft/label2.png'} />
                <p>-- 划痕</p>
                <Image className="exampleImage" src={'public/images/homeLeft/label3.png'} />
                <p>-- 其他缺陷</p>
                <Image className="exampleImage" src={'public/images/homeLeft/label4.png'} />
            </Image.PreviewGroup>
        </div>
    );
}

function ResultShow() {
    return (
        <div className="resultShow">
            <h2>检测结果展示</h2>
            <Image.PreviewGroup preview={{ onChange: (current, prev) => console.log(`current index: ${current}, prev index: ${prev}`), }}>
                <p>-- 夹杂物</p>
                <Image className="exampleImage" src={'public/images/homeRight/label1.png'} />
                <p>-- 补丁</p>
                <Image className="exampleImage" src={'public/images/homeRight/label2.png'} />
                <p>-- 划痕</p>
                <Image className="exampleImage" src={'public/images/homeRight/label3.png'} />
                <p>-- 其他缺陷</p>
                <Image className="exampleImage" src={'public/images/homeRight/label4.png'} />
            </Image.PreviewGroup>
        </div>
    );
}