import Header from "../component/header";
import ChatBot from "../component/chatbot";
import styles from '../style/statistics.module.css';
import PieChart from '../component/PieChart';
import BarChart from '../component/BarChart';
import React from 'react';


export default function Statistics() {
    return (
        <div className={styles.indexContainer}>
            <Header />
            <div className={styles.mainContainer}>
                <Charts />
                <ChatBot />
            </div>
        </div>
    );
}

const Charts = () => {
    return (
        <div className={styles.chatsContainer}>
            <div className={styles.pieChartContainer}>
                <h2>车辆零部件缺陷分布占比</h2>
                <PieChart data={defectDistribution} />
                <p>{discription1}</p>
            </div>
            <div className={styles.barChartContainer}>
                <h2>预测正确率</h2>
                <BarChart data={predictionAccuracy} />
            </div>
        </div>
    );
};

// 原始数据（从数据.docx复制）
const defectDistribution = [
    { label: "0.夹杂物", value: 0.128 },
    { label: "1.其他", value: 0.013 },
    { label: "2.划痕", value: 0.606 },
    { label: "3.补丁", value: 0.079 },
    { label: "4.其他", value: 0.029 },
    { label: "5.其他", value: 0.042 },
    { label: "6.其他", value: 0.037 },
    { label: "7.其他", value: 0.018 },
    { label: "8.其他", value: 0.026 },
    { label: "9.其他", value: 0.023 }
];

const discription1 = "主要缺陷：划痕 占比高达 60.6%，是当前系统中的绝对主导缺陷类型，需优先排查其根本原因（如设计漏洞或流程缺陷）。次要缺陷：夹杂物（12.8%）和 补丁（7.9%）占比相对较高，建议作为次要优化目标。低频缺陷：其余类别（1、4、5、6、7、8、9）占比均不足 5%，可归类为边缘问题。"

const predictionAccuracy = [
    { label: "0.夹杂物", value: 0.71 },
    { label: "1.其他", value: 0.54 },
    { label: "2.划痕", value: 0.80 },
    { label: "3.补丁", value: 0.66 },
    { label: "4.其他", value: 0.41 },
    { label: "5.其他", value: 0.87 },
    { label: "6.其他", value: 0.94 },
    { label: "7.其他", value: 0.76 },
    { label: "8.其他", value: 0.79 },
    { label: "9.其他", value: 0.96 }
];