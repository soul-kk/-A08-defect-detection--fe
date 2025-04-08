import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

const BarChart = ({ data }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    if (!chartRef.current) return;

    const myChart = echarts.init(chartRef.current);
    const option = {
      xAxis: {
        type: 'category',
        data: data.map(item => item.label)
      },
      yAxis: { type: 'value' },
      series: [{
        data: data.map(item => item.value),
        type: 'bar',
        showBackground: true,
        backgroundStyle: {
          color: 'rgba(180, 180, 180, 0.2)'
        }
      }]
    };

    myChart.setOption(option);

    // 响应式调整
    const resizeHandler = () => myChart.resize();
    window.addEventListener('resize', resizeHandler);
    return () => window.removeEventListener('resize', resizeHandler);
  }, [data]);

  return <div ref={chartRef} style={{ width: '600px', height: '400px' }} />;
};

export default BarChart;