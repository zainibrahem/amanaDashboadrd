import { useEffect, useState } from 'react';
import axios from 'axios';
import { Users } from 'react-feather';
import StatsWithAreaChart from '@components/widgets/stats/StatsWithAreaChart';
import './style.css';
const SubscribersGained = ({ kFormatter, primary }) => {
  const [data, setData] = useState(null);
  const options = {
    chart: {
      id: 'revenue',
      toolbar: {
        show: false,
      },
      sparkline: {
        enabled: true,
      },
    },
    grid: {
      show: false,
    },
    colors: [primary],
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: 'smooth',
      width: 2.5,
    },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 0.9,
        opacityFrom: 0.7,
        opacityTo: 0.5,
        stops: [0, 80, 100],
      },
    },

    xaxis: {
      labels: {
        show: false,
      },
      axisBorder: {
        show: false,
      },
    },
    yaxis: {
      labels: {
        show: false,
      },
    },
    tooltip: {
      x: { show: false },
    },
  };

  useEffect(() => {
    axios.get('/card/card-statistics/subscribers').then((res) => setData(res.data));
  }, []);

  return data !== null ? (
    <StatsWithAreaChart icon={<Users size={21} />} color='primary' stats={kFormatter(data.analyticsData.subscribers)} statTitle='كسب المشتركين' series={data.series} options={options} type='area' />
  ) : null;
};

export default SubscribersGained;
