import { NavLink } from "react-router-dom";
import '../style/header.css'
import { AlertTwoTone, EyeTwoTone, PieChartTwoTone } from '@ant-design/icons'

export default function Header() {
    return (
        <div className="header">
            <AlertTwoTone className="titleIcon" />
            <h3 className="title">
                车辆零部件缺陷检测系统
                <h6 >
                    —基于位置敏感和自适应技术的RTDETR模型的车辆零部件检测系统
                </h6>
            </h3>
            <nav>
                <NavLink to='/' className={({ isActive }) => isActive ? 'navlink active' : 'navlink'}>首页</NavLink>

                <EyeTwoTone className="routeIcon" />
                <NavLink to='/detection' className={({ isActive }) => isActive ? 'navlink active' : 'navlink'}>缺陷检测</NavLink>

                <PieChartTwoTone className="routeIcon" />
                <NavLink to='/statistics' className={({ isActive }) => isActive ? 'navlink active' : 'navlink'}>数据统计</NavLink>
            </nav>
        </div>
    );
}