import { useContext, useState, useEffect } from 'react';
import { List } from 'react-feather';
import { kFormatter } from '@utils';
import Avatar from '@components/avatar';
import Timeline from '@components/timeline';
import AvatarGroup from '@components/avatar-group';
import jsonImg from '@src/assets/images/icons/json.png';
import InvoiceList from '@src/views/apps/invoice/list';
import ceo from '@src/assets/images/portrait/small/avatar-s-9.jpg';
import { ThemeColors } from '@src/utility/context/ThemeColors';
import Sales from '@src/views/ui-elements/cards/analytics/Sales';
import AvgSessions from '@src/views/ui-elements/cards/analytics/AvgSessions';
import CardAppDesign from '@src/views/ui-elements/cards/advance/CardAppDesign';
import SupportTracker from '@src/views/ui-elements/cards/analytics/SupportTracker';
import { Row, Col, Card, CardHeader, CardTitle, CardBody, Media, Table, Alert } from 'reactstrap';
import OrdersReceived from '@src/views/ui-elements/cards/statistics/OrdersReceived';
import CardCongratulations from '@src/views/ui-elements/cards/advance/CardCongratulations';
import SubscribersGained from '@src/views/ui-elements/cards/statistics/SubscribersGained';
import ApexLineChart from '../../charts/apex/ApexLineChart';
import { useRTL } from '@hooks/useRTL';
import CardAction from '@components/card-actions';
import { ChevronDown, RotateCw, X, AlertCircle } from 'react-feather';
import '@styles/react/libs/charts/apex-charts.scss';
import useJwt from '@src/auth/jwt/useJwt';
import axios from 'axios';
import { Columns } from '../../tables/data-tables/dashboard_top_custom';
import TableWithButtons from '../../tables/data-tables/basic/TableWithButtons';
import { Columns_return_custom } from '../../tables/returning_customersData';

import './style.css';

const AnalyticsDashboard = () => {
  const { colors } = useContext(ThemeColors);
  const [isRtl, setIsRtl] = useRTL();
  const config = useJwt.jwtConfig;
  const auth = {
    headers: {
      Authorization: `${config.tokenType} ${config.storageTokenKeyName}`,
    },
  };
  const [top_cus_data, setTop_cus_data] = useState([]);
  const [close, setClose] = useState(false);
  const [close1, setClose1] = useState(false);
  const [close2, setClose2] = useState(false);
  const [close3, setClose3] = useState(false);

  const avatarGroupArr = [
      {
        title: 'Billy Hopkins',
        img: require('@src/assets/images/portrait/small/avatar-s-9.jpg').default,
        placement: 'bottom',
        imgHeight: 33,
        imgWidth: 33,
      },
      {
        title: 'Amy Carson',
        img: require('@src/assets/images/portrait/small/avatar-s-6.jpg').default,
        placement: 'bottom',
        imgHeight: 33,
        imgWidth: 33,
      },
      {
        title: 'Brandon Miles',
        img: require('@src/assets/images/portrait/small/avatar-s-8.jpg').default,
        placement: 'bottom',
        imgHeight: 33,
        imgWidth: 33,
      },
      {
        title: 'Daisy Weber',
        img: require('@src/assets/images/portrait/small/avatar-s-7.jpg').default,
        placement: 'bottom',
        imgHeight: 33,
        imgWidth: 33,
      },
      {
        title: 'Jenny Looper',
        img: require('@src/assets/images/portrait/small/avatar-s-20.jpg').default,
        placement: 'bottom',
        imgHeight: 33,
        imgWidth: 33,
      },
    ],
    data = [
      {
        title: '12 Invoices have been paid',
        content: 'Invoices have been paid to the company.',
        meta: '',
        metaClassName: 'mr-1',
        customContent: (
          <Media>
            <img className='mr-1' src={jsonImg} alt='data.json' height='23' />
            <Media className='mb-0' body>
              data.json
            </Media>
          </Media>
        ),
      },
      {
        title: 'Client Meeting',
        content: 'Project meeting with john @10:15am.',
        meta: '',
        metaClassName: 'mr-1',
        color: 'warning',
        customContent: (
          <Media className='align-items-center'>
            <Avatar img={ceo} />
            <Media className='ml-50' body>
              <h6 className='mb-0'>John Doe (Client)</h6>
              <span>CEO of Infibeam</span>
            </Media>
          </Media>
        ),
      },
      {
        title: 'Create a new project for client',
        content: 'Add files to new design folder',
        color: 'info',
        meta: '',
        metaClassName: 'mr-1',
        customContent: <AvatarGroup data={avatarGroupArr} />,
      },
      {
        title: 'Create a new project for client',
        content: 'Add files to new design folder',
        color: 'danger',
        meta: '',
        metaClassName: 'mr-1',
      },
    ];
  const [dataPer, setDataPer] = useState([]);
  const [data_returning_customers, setReturning_customers] = useState([]);
  try {
    useEffect(() => {
      axios.get('https://amanacart.com/api/admin/kpi', auth).then((response) => {
        setDataPer(response.data.finances);
        setTop_cus_data(response.data.top_customers);
        setReturning_customers(response.data.returning_customers);
        console.log(response.data);
      });
    }, []);
  } catch (e) {
    console.log(e);
  }
  const [notic, setNotic] = useState('');
  useEffect(() => {
    axios.get('https://amanacart.com/api/admin/notifications', auth).then((response) => {
      setNotic(response.data.notice);

      console.log(response.data);
    });
  }, []);
  const [status_ver, setStatus_ver] = useState('');
  useEffect(() => {
    axios.get('https://amanacart.com/api/admin/profile', auth).then((response) => {
      setStatus_ver(response.data.profile.verified);

      console.log(response.data);
    });
  }, []);

  return (
    <div id='dashboard-analytics'>
      <Row className='match-height'>
        {/* <Col lg='6' sm='12'>
          <CardCongratulations />
        </Col>
        <Col lg='3' sm='6'>
          <SubscribersGained kFormatter={kFormatter} primary={colors.primary.main} />
        </Col> */}
        {/* <Col lg='3' sm='6'>
          <OrdersReceived kFormatter={kFormatter} warning={colors.order.main} />
        </Col> */}
        {close === false ? (
          <Col lg='12'>
            <Alert color='warning'>
              <div className='alert-body d-flex' style={{ justifyContent: 'space-between' }}>
                <div>
                  <AlertCircle size={15} /> <span className='ml-1'>تنويه:{notic ? notic : 'لا يوجد تنويه'}</span>
                </div>
                <X size={25} onClick={() => setClose(true)} style={{ cursor: 'pointer' }} />
              </div>
            </Alert>
          </Col>
        ) : (
          ''
        )}
        {status_ver ? (
          <Col lg='12'>
            {close1 === false ? (
              <Alert color='warning'>
                <div className='alert-body d-flex' style={{ justifyContent: 'space-between' }}>
                  <div>
                    {' '}
                    <AlertCircle size={15} />{' '}
                    <span className='ml-1'>
                      تنويه:
                      {!status_ver.id === false ? 'تم تاكيد رفع الملف التجاري' : 'يرجى اعادة رفع الملف التجاري'}
                    </span>
                  </div>

                  <X size={25} onClick={() => setClose1(true)} style={{ cursor: 'pointer' }} />
                </div>
              </Alert>
            ) : (
              ''
            )}
            {close2 === false ? (
              <Alert color='warning'>
                <div className='alert-body d-flex' style={{ justifyContent: 'space-between' }}>
                  <div>
                    <AlertCircle size={15} />{' '}
                    <span className='ml-1'>
                      تنويه:
                      {!status_ver.phone === false ? ' تم تاكيد رقم الهاتف' : 'يرجى اعادة اخال رقم هاتف جديد وصالح'}
                    </span>
                  </div>
                  <X size={25} onClick={() => setClose2(true)} style={{ cursor: 'pointer' }} />
                </div>
              </Alert>
            ) : (
              ''
            )}

            {close3 === false ? (
              <Alert color='warning'>
                <div className='alert-body d-flex' style={{ justifyContent: 'space-between' }}>
                  <div>
                    <AlertCircle size={15} />{' '}
                    <span className='ml-1'>
                      تنويه:
                      {!status_ver.address === false ? 'تم تاكيد العنوان' : 'يرجى اعادة ادخال عنوان جديد وصالح'}
                    </span>
                  </div>
                  <X size={25} onClick={() => setClose3(true)} style={{ cursor: 'pointer' }} />
                </div>
              </Alert>
            ) : (
              ''
            )}
          </Col>
        ) : (
          ''
        )}
      </Row>
      <Row className='match-height'>
        <Col lg='6' xs='12'>
          <AvgSessions primary={colors.primary.main} />
        </Col>

        <Col lg='6' xs='12'>
          <SupportTracker primary={colors.primary.main} danger={colors.danger.main} />
        </Col>
      </Row>
      {/* <Col sm='4'>
        <CardAction
          title='Card Actions'
          actions={['collapse']}
          endReload={(endLoading) => {
            setTimeout(() => endLoading(), 2000);
          }}
        >
          <CardBody className='pt-0'>
            <Col className='d-flex' style={{ justifyContent: 'space-between' }}>
              <h5>إجمالي المبيعات</h5>
              <p>ر.ع{dataPer && dataPer.sales_total ? dataPer.sales_total : '0'} </p>
            </Col>
            <Col className='d-flex' style={{ justifyContent: 'space-between' }}>
              <h5> الخصومات</h5>
              <p>ر.ع{dataPer && dataPer.discounts ? dataPer.discounts : ''}</p>
            </Col>
            <Col className='d-flex' style={{ justifyContent: 'space-between' }}>
              <h5> المبالغ المستردة</h5>
              <p>ر.ع{dataPer && dataPer.refunds ? dataPer.refunds : '0'}</p>
            </Col>
            <Col className='d-flex' style={{ justifyContent: 'space-between' }}>
              <h5> صافي المبيعات</h5>
              <p>ر.ع{dataPer && dataPer.net_sales ? dataPer.net_sales : '0'}</p>
            </Col>
          </CardBody>
        </CardAction>
      </Col> */}
      <Row>
        <Col sm='12'>
          <ApexLineChart direction={isRtl ? 'rtl' : 'ltr'} warning={'#000'} />
        </Col>
      </Row>
      <Row>
        <Col lg='6' md='6' sm='12'>
          <CardAction
            title='المالية'
            actions={['collapse']}
            endReload={(endLoading) => {
              setTimeout(() => endLoading(), 2000);
            }}
          >
            <CardBody className='pt-0'>
              <TableWithButtons columns={Columns} data={top_cus_data} />
            </CardBody>
          </CardAction>
        </Col>
        <Col lg='6' md='6' sm='12'>
          <CardAction
            title='العملاء الذين يقومون بإرجاع'
            actions={['collapse']}
            endReload={(endLoading) => {
              setTimeout(() => endLoading(), 2000);
            }}
          >
            <CardBody className='pt-0'>
              <TableWithButtons columns={Columns_return_custom} data={data_returning_customers} />
            </CardBody>
          </CardAction>
        </Col>
      </Row>

      <Col sm='6'>
        <CardAction
          title='المالية'
          actions={['collapse']}
          endReload={(endLoading) => {
            setTimeout(() => endLoading(), 2000);
          }}
        >
          <CardBody className='pt-0'>
            <Col className='d-flex' style={{ justifyContent: 'space-between' }}>
              <h5>إجمالي المبيعات</h5>
              <p className='number'>ر.ع{dataPer && dataPer.sales_total ? dataPer.sales_total : '0'} </p>
            </Col>
            <Col className='d-flex' style={{ justifyContent: 'space-between' }}>
              <h5> الخصومات</h5>
              <p className='number'>ر.ع{dataPer && dataPer.discounts ? dataPer.discounts : ''}</p>
            </Col>
            <Col className='d-flex' style={{ justifyContent: 'space-between' }}>
              <h5> المبالغ المستردة</h5>
              <p className='number'>ر.ع{dataPer && dataPer.refunds ? dataPer.refunds : '0'}</p>
            </Col>
            <Col className='d-flex' style={{ justifyContent: 'space-between' }}>
              <h5> صافي المبيعات</h5>
              <p className='number'>ر.ع{dataPer && dataPer.net_sales ? dataPer.net_sales : '0'}</p>
            </Col>
          </CardBody>
        </CardAction>
      </Col>

      {/* <Row className='match-height'>
        <Col xs='12'>
          <InvoiceList />
        </Col>
      </Row> */}
    </div>
  );
};

export default AnalyticsDashboard;
