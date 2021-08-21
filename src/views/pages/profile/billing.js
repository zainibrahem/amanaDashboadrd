import { useState, useEffect } from 'react';
import axios from 'axios';
import { AlignJustify, Rss, Info, Image, Users, Edit } from 'react-feather';
import { Card, CardBody, CardHeader, CardText, CardTitle, CardImg, Collapse, Navbar, Nav, NavItem, NavLink, Button, Col } from 'reactstrap';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';
import useJwt from '@src/auth/jwt/useJwt';

const Billing = ({ data }) => {
  const config = useJwt.jwtConfig;
  const MySwal = withReactContent(Swal);

  const auth = {
    headers: {
      Authorization: `${config.tokenType} ${config.storageTokenKeyName}`,
    },
  };
  const handleSuccess = (msg) => {
    return MySwal.fire({
      title: 'Good job!',
      text: msg,
      icon: 'success',
      customClass: {
        confirmButton: 'btn btn-primary',
      },
      buttonsStyling: false,
    });
  };
  //alert error
  const hundeErrorText = (errMsg) => {
    if (Object.keys(errMsg || {}).length) {
      return (
        <>
          <div style={{ color: 'red', display: 'inline-block', fontSize: '15px' }}>
            {Object.keys(errMsg).map((el, key) => {
              console.log(JSON.stringify(errMsg[el]));
              return (
                <>
                  <p>{errMsg[el]}</p>
                </>
              );
            })}
          </div>
        </>
      );
    }
  };

  const handleError = (errMsg) => {
    console.log(errMsg);
    return MySwal.fire({
      title: 'Error!',
      text: 'click Ok to show errors',
      icon: 'error',
      customClass: {
        confirmButton: 'btn btn-primary',
      },
      buttonsStyling: false,
    }).then(() => MySwal.fire(hundeErrorText(errMsg || {})));
  };
  const handleErrorNetwork = (errMsg) => {
    console.log(errMsg);
    return MySwal.fire({
      title: 'Error!',
      text: 'click Ok to show errors',
      text: `${errMsg}`,
      icon: 'error',
      customClass: {
        confirmButton: 'btn btn-primary',
      },
      buttonsStyling: false,
    });
  };
  const [BillingData, setBillingData] = useState(null);
  useEffect(() => {
    axios
      .get('https://amanacart.com/api/admin/profile', auth)
      .then((response) => {
        setBillingData(response.data.billing);
      })
      .catch((error) => {
        // console.log(error);
        if (error.response) {
          console.log(error.response.status);
          if (error.response.status === 500) {
            handleErrorNetwork(`${error.response.status} internal server error`);
            console.log(error.response.status);
          } else if (error.response.status === 404) {
            handleErrorNetwork(`${error.response.status} page not found`);
          } else {
            handleError(error.response.data.error);
          }
        } else {
          handleErrorNetwork(`${error}`);
        }
      });
  }, []);

  return (
    <>
      <Col lg='8' md='8' sm='12' xs='12' style={{ border: '1px solid #d2c9c9', borderRadius: '8px' }}>
        <CardHeader>
          <CardTitle>خطط الاشتراك</CardTitle>
        </CardHeader>
        {BillingData && BillingData.plans && Object.keys(BillingData.plans || {}).length > 0
          ? Object.keys(BillingData.plans || {}).map((e) => {
              return (
                <div value={e} className='d-flex' style={{ justifyContent: 'space-between', marginTop: '14px' }}>
                  <Col sm='4'>{BillingData.plans[e]}</Col>
                  <Col>المميزات</Col>
                  <Col sm='4'>
                    <Button color='primary'>Select</Button>
                  </Col>
                </div>
              );
            })
          : ''}
        <CardHeader style={{ textAlign: 'right' }}>تأتي كل خطة مع فترة تجريبية مجانية مدتها 500 يوم</CardHeader>
      </Col>
      <Col lg='8' md='8' sm='12' xs='12' style={{ border: '1px solid #d2c9c9', borderRadius: '8px', marginTop: '45px' }}>
        <CardHeader>
          <CardTitle>الفواتير </CardTitle>
        </CardHeader>
        {BillingData && BillingData.plans && Object.keys(BillingData.plans || {}).length > 0 && Object.keys(BillingData.invoices || {}).length > 0 ? (
          Object.keys(BillingData.plans || {}).map((e) => {
            return (
              <Col lg='12' md='12' sm='12' value={e} className='d-flex' style={{ justifyContent: 'space-between', marginTop: '14px' }}>
                <Col lg='4' md='4' sm='12'>
                  {BillingData.plans[e]}
                </Col>
                <Col lg='4' md='4' sm='12'>
                  المميزات
                </Col>
                <Col lg='4' md='4' sm='12'>
                  <Button color='primary'>Select</Button>
                </Col>
              </Col>
            );
          })
        ) : (
          <CardHeader>لا يوجد فواتير</CardHeader>
        )}
      </Col>
    </>
  );
};

export default Billing;
