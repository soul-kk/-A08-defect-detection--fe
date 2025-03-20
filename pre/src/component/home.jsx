import Header from "./header";
import '../style/home.css'
import { Image, message } from 'antd'
import exampleImage1 from '/images/exampleShow/jzw.jpg'
import exampleImage2 from '/images/exampleShow/bd.jpg'
import exampleImage3 from '/images/exampleShow/hh.jpg'
import exampleImage4 from '/images/exampleShow/qt1.jpg'
import exampleImage5 from '/images/exampleShow/qt2.jpg'
import exampleImage6 from '/images/exampleShow/qt3.jpg'
import exampleImage7 from '/images/exampleShow/qt3.jpg'


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
            <p>传统的零部件缺陷检测方法多依赖人工检查，效率低、错误率高，难以满足现代生产的要求，需要引入智能先进的检测技术。该系统主要针对车门的原材料钢板的表面进行缺陷检测。通过拍摄钢材表面图片，经过检测系统算法来识别缺陷，并对缺陷进行分类。</p>
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

function ResultShow() {
    return (
        <div className="resultShow">
            <h2>检测结果展示</h2>
            <Image.PreviewGroup preview={{ onChange: (current, prev) => console.log(`current index: ${current}, prev index: ${prev}`), }}>
                <p>-- 夹杂物</p>
                <Image className="exampleImage" src={exampleImage7} />
                <p>-- 补丁</p>
                <Image className="exampleImage" src={exampleImage7} />
                <p>-- 划痕</p>
                <Image className="exampleImage" src={exampleImage7} />
                <p>-- 其他缺陷</p>
                <Image className="exampleImage" src={exampleImage7} />
                <Image className="exampleImage" src={exampleImage7} />
                <Image className="exampleImage" src={exampleImage7} />
            </Image.PreviewGroup>
        </div>
    );
}