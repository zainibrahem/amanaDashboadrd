import Chart from 'react-apexcharts';
import { ArrowDown } from 'react-feather';
import { Card, CardHeader, CardTitle, CardBody, CardSubtitle, Badge } from 'reactstrap';
import { useEffect, useState } from 'react';
import axios from 'axios';
import useJwt from '@src/auth/jwt/useJwt';

const ApexLineChart = ({ direction, warning }) => {
  const config = useJwt.jwtConfig;

  const auth = {
    headers: {
      Authorization: `${config.tokenType} ${config.storageTokenKeyName}`,
    },
  };

  const [dataChar, setDataCart] = useState([]);
  const [breakdown, setBreakdown] = useState([]);

  useEffect(() => {
    axios.get('https://amanacart.com/api/admin/dashboard', auth).then((response) => {
      setDataCart(response.data.chart.values);
      setBreakdown(response.data.breakdown);
      console.log(response.data);
    });
  }, []);
  const options = {
    chart: {
      zoom: {
        enabled: false,
      },
      parentHeightOffset: 0,
      toolbar: {
        show: false,
      },
    },

    markers: {
      strokeWidth: 7,
      strokeOpacity: 1,
      strokeColors: ['#fff'],
      colors: [warning],
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: 'straight',
    },
    colors: [warning],
    grid: {
      xaxis: {
        lines: {
          show: true,
        },
      },
    },
    tooltip: {
      custom(data) {
        return `<div class='px-1 py-50'>
              <span>${data.series[data.seriesIndex][data.dataPointIndex]}%</span>
            </div>`;
      },
    },
    xaxis: {
      categories: ['7/12', '8/12', '9/12', '10/12', '11/12', '12/12', '13/12', '14/12', '15/12', '16/12', '17/12', '18/12', '19/12', '20/12', '21/12'],
    },
    yaxis: {
      opposite: direction === 'rtl',
    },
  };

  const series = [
    {
      data: dataChar,
      // data: [280, 200, 220, 180, 270, 250, 70, 90, 200, 150, 160, 100, 150, 100, 50],
    },
  ];

  return (
    <Card>
      <CardHeader className='d-flex flex-sm-row flex-column justify-content-md-between align-items-start justify-content-start'>
        <div>
          <CardTitle className='mb-75' tag='h4'>
            آخر <span className='number'>15</span> يومًا
          </CardTitle>
        </div>
        <div className='d-flex align-items-center flex-wrap mt-sm-0 mt-1'>
          {/* <h5 className='font-weight-bolder mb-0 mr-1'>$ 100,000</h5> */}
          {/* <Badge color='light-secondary'>
            <ArrowDown size={13} className='text-danger' />
            <span className='align-middle ml-25'>20%</span>
          </Badge> */}
        </div>
      </CardHeader>
      <CardBody>
        <p>تعطل:</p>

        <div className='d-flex' style={{ justifyContent: 'space-evenly' }}>
          <p>
            الطلبات:<span className='number'>{breakdown.orders}</span>
          </p>
          <p>
            النزاعات:<span className='number'>{breakdown.refunds}</span>
          </p>
          <p>
            الاجمالي:<span className='number'>{breakdown.total}</span>
          </p>
        </div>

        <Chart options={options} series={series} type='line' height={400} />
      </CardBody>
    </Card>
  );
};

export default ApexLineChart;
