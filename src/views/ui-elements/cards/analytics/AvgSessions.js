import { useEffect, useState } from 'react';
import axios from 'axios';
import { kFormatter } from '@utils';
import { Card, CardBody, CardText, Row, Col, Button, UncontrolledDropdown, DropdownMenu, DropdownItem, DropdownToggle, Progress } from 'reactstrap';
import Chart from 'react-apexcharts';
import useJwt from '@src/auth/jwt/useJwt';
import withReactContent from 'sweetalert2-react-content';
import ApexLineChart from '../../../charts/apex/ApexLineChart';

const AvgSessions = (props) => {
  const [data, setData] = useState(null);
  const [data_dash, setData_dash] = useState(null);
  const config = useJwt.jwtConfig;
  const auth = {
    headers: {
      Authorization: `${config.tokenType} ${config.storageTokenKeyName}`,
    },
  };

  useEffect(() => {
    axios.get('/card/card-analytics/avg-sessions').then((res) => {
      setData(res.data);
      console.log(res.data);
    });
  }, []);

  try {
    useEffect(() => {
      axios.get('https://amanacart.com/api/admin/dashboard', auth).then((response) => {
        setData_dash(response.data);
        console.log(response.data);
      });
    }, []);
  } catch (e) {
    console.log(e);
  }

  const options = {
      chart: {
        sparkline: { enabled: true },
        toolbar: { show: false },
      },
      grid: {
        show: false,
        padding: {
          left: 0,
          right: 0,
        },
      },
      states: {
        hover: {
          filter: 'none',
        },
      },
      colors: ['#ebf0f7', '#ebf0f7', props.primary, '#ebf0f7', '#ebf0f7', '#ebf0f7'],
      plotOptions: {
        bar: {
          columnWidth: '45%',
          distributed: true,
          endingShape: 'rounded',
        },
      },
      tooltip: {
        x: { show: false },
      },
      xaxis: {
        type: 'numeric',
      },
    },
    series = [
      {
        name: 'Sessions',
        data: [75, 125, 225, 175, 125, 75, 25],
      },
    ];

  return data !== null ? (
    <Card>
      <CardBody>
        <Row className='pt-50'>
          <Col className='mb-2' md='6' sm='12'>
            <p className='mb-50'>
              الأوامر غير المنفذة :<sapn className='number'>{data_dash && data_dash.unfullfilled_orders ? data_dash.unfullfilled_orders : '0'}</sapn>{' '}
            </p>
            <Progress className='avg-session-progress progress-bar-warning mt-25' value={data_dash && data_dash.unfullfilled_percentage ? data_dash.unfullfilled_percentage : '0'} />
            <p className='number'>%{data_dash && data_dash.unfullfilled_percentage ? data_dash.unfullfilled_percentage : '0'}</p>
          </Col>
          <Col className='mb-2' md='6' sm='12'>
            <p className='mb-50'>
              آخر بيع:<span className='number'>{data_dash && data_dash.todays_total ? data_dash.todays_total : '0'}</span>
            </p>
            <p className='number'>{data_dash && data_dash.last_sale_date ? data_dash.last_sale_date : '0'}</p>
          </Col>

          <Col className='mb-2' md='6' sm='12'>
            <p className='mb-50'>مجموع اليوم:</p>
            <Progress className='avg-session-progress progress-bar-warning mt-25' value={data_dash && data_dash.todays_total ? data_dash.todays_total : '0'} />
          </Col>
          <Col md='6' sm='12'>
            <p className='mb-50'>
              نفاد المخزون:<span className='number'>{data_dash && data_dash.stock_outs ? data_dash.stock_outs : '0'}</span>{' '}
            </p>
            <Progress className='avg-session-progress progress-bar-danger mt-25' value={data_dash && data_dash.stock_outs_percentage ? data_dash.stock_outs_percentage : '0'} />
            <p className='number'>%{data_dash && data_dash.stock_outs_percentage ? data_dash.stock_outs_percentage : '0'}</p>
          </Col>
          <Col md='6' sm='12'>
            <p className='mb-50'>
              النزاعات:<span className='number'>{data_dash && data_dash.disputes_count_percentage ? data_dash.disputes_count_percentage : '0'}</span>
            </p>

            <Progress className='avg-session-progress progress-bar-success mt-25' value='0' />
            <p className='number'> %{data_dash && data_dash.disputes_count_percentage ? data_dash.disputes_count_percentage : '0'}</p>
          </Col>
        </Row>
      </CardBody>
    </Card>
  ) : null;
};
export default AvgSessions;
