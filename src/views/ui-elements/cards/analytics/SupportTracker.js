import { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, Table, CardHeader, CardTitle, CardBody, CardText, UncontrolledDropdown, DropdownMenu, DropdownItem, DropdownToggle, Row, Col } from 'reactstrap';
import Chart from 'react-apexcharts';
import useJwt from '@src/auth/jwt/useJwt';
import CardAction from '@components/card-actions';
import { ChevronDown, RotateCw, X } from 'react-feather';

const SupportTracker = (props) => {
  const [data, setData] = useState(null);
  const config = useJwt.jwtConfig;
  const auth = {
    headers: {
      Authorization: `${config.tokenType} ${config.storageTokenKeyName}`,
    },
  };

  useEffect(() => {
    axios.get('/card/card-analytics/support-tracker').then((res) => setData(res.data));
  }, []);
  const [dataPer, setDataPer] = useState([]);
  try {
    useEffect(() => {
      axios.get('https://amanacart.com/api/admin/kpi', auth).then((response) => {
        setDataPer(response.data);
        console.log(response.data);
      });
    }, []);
  } catch (e) {
    console.log(e);
  }

  const options = {
      plotOptions: {
        radialBar: {
          size: 150,
          offsetY: 20,
          startAngle: -150,
          endAngle: 150,
          hollow: {
            size: '65%',
          },
          track: {
            background: '#fff',
            strokeWidth: '100%',
          },
          dataLabels: {
            name: {
              offsetY: -5,
              fontFamily: 'Montserrat',
              fontSize: '1rem',
            },
            value: {
              offsetY: 15,
              fontFamily: 'Montserrat',
              fontSize: '1.714rem',
            },
          },
        },
      },
      colors: [props.danger],
      fill: {
        type: 'gradient',
        gradient: {
          shade: 'dark',
          type: 'horizontal',
          shadeIntensity: 0.5,
          gradientToColors: [props.primary],
          inverseColors: true,
          opacityFrom: 1,
          opacityTo: 1,
          stops: [0, 100],
        },
      },
      stroke: {
        dashArray: 8,
      },
      labels: ['Completed Tickets'],
    },
    series = [83];

  return data !== null ? (
    <Card>
      {/* <CardHeader className='pb-0'>
        <CardTitle tag='h4'>تعقب الدعم</CardTitle>
        <UncontrolledDropdown className='chart-dropdown'>
          <DropdownToggle color='' className='bg-transparent btn-sm border-0 p-50'>
            اخر 7 ايام
          </DropdownToggle>
          <DropdownMenu right>
            {data.last_days.map((item) => (
              <DropdownItem className='w-100' key={item}>
                {item}
              </DropdownItem>
             ))}
          </DropdownMenu>
        </UncontrolledDropdown>
      </CardHeader> */}
      <CardBody>
        <Row>
          <Col md='6' sm='12'>
            <p className='mb-50'>
              إيرادات:<span className='number'>{dataPer && dataPer.revenue ? dataPer.revenue : '0'}</span>{' '}
            </p>
            <p>آخر 12 شهرًا</p>
            {/* <p>%{dataPer && dataPer.stock_outs_percentage ? data_dash.stock_outs_percentage : '0'}</p> */}
          </Col>
          <Col md='6' sm='12'>
            <p className='mb-50'>
              معدل التحويل:<span className='number'>%{dataPer && dataPer.conversion_rate ? dataPer.conversion_rate : '0'}</span>{' '}
            </p>
            <p>آخر 12 شهرًا</p>
          </Col>
          <Col md='6' sm='12'>
            <p className='mb-50'>
              عربات مهجورة:<span className='number'>{dataPer && dataPer.abandoned_carts ? dataPer.abandoned_carts : '0'}</span>{' '}
            </p>
            <p>آخر 12 شهرًا</p>
          </Col>
          <Col md='6' sm='12'>
            <p className='mb-50'>
              متوسط قيمة الطلب :<span className='number'>%{dataPer && dataPer.avg_order_value ? dataPer.avg_order_value : '0'}</span>{' '}
            </p>
            <p>
              آخر <span className='number'>12</span> شهرًا
            </p>
          </Col>
        </Row>
      </CardBody>
    </Card>
  ) : null;
};
export default SupportTracker;
