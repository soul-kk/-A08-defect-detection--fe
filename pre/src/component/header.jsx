import { NavLink } from "react-router-dom";
import '../style/header.css'
import { AlertTwoTone, EyeTwoTone, PieChartTwoTone } from '@ant-design/icons'

export default function Header() {
    return (
        <div className="header">
            <AlertTwoTone className="titleIcon" />
            <h3 className="title">车辆零部件缺陷检测系统</h3>
            <nav>
                <EyeTwoTone className="routeIcon" />
                <NavLink to='/' className={({ isActive }) => isActive ? 'navlink active' : 'navlink'}>检测识别</NavLink>
                <PieChartTwoTone className="routeIcon" />
                <NavLink to='/statistics' className={({ isActive }) => isActive ? 'navlink active' : 'navlink'}>数据统计</NavLink>
            </nav>
        </div>
    );
}