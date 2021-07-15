// ** Custom Components
import { useContext, useState, useEffect } from 'react';

import Avatar from '@components/avatar';
import { Link } from 'react-router-dom';
// ** Third Party Components
import axios from 'axios';
import { MoreVertical, Edit, FileText, Archive, Trash } from 'react-feather';
import { Row, Col, Badge, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem, Button, Modal, ModalHeader, ModalBody, ModalFooter, FormGroup, Label, Input } from 'reactstrap';

// ** UseJWT import to get config
import useJwt from '@src/auth/jwt/useJwt';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { Token } from 'prismjs';
import './style.css';

const config = useJwt.jwtConfig;
const auth = {
  headers: {
    Authorization: `${config.tokenType} ${config.storageTokenKeyName}`,
  },
};
const MySwal = withReactContent(Swal);

const handleSuccess = (msg) => {
  return MySwal.fire({
    title: 'عمل جيد !',
    text: 'تمت العملية بنجاح',
    icon: 'success',
    customClass: {
      confirmButton: 'btn btn-primary',
    },
    buttonsStyling: false,
  });
};
const hundeErrorText = (errMsg) => {
  // console.log(Object.keys(errMsg).length);
  //let errData = {err};
  //console.log(errData);
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
    text: `${errMsg}`,
    icon: 'error',
    customClass: {
      confirmButton: 'btn btn-primary',
    },
    buttonsStyling: false,
  });
};

// ** Table Intl Column

export const Columns = [
  {
    name: '#الطلب',
    selector: 'order',
    sortable: true,
    minWidth: '150px',
    cell: (row) => {
      return (
        <Badge color='secondary' className='number'>
          {row.order.order_number}
        </Badge>
      );
    },
  },
  {
    name: 'إرجاع البضائع',
    selector: 'return_goods',
    sortable: true,
    minWidth: '250px',
    cell: (row) => {
      return <Badge color='secondary'>{row.return_goods === 0 ? 'off' : 'on'}</Badge>;
    },
  },
  {
    name: 'كمية الطلب',
    selector: 'total',
    sortable: true,
    minWidth: '280px',
    cell: (row) => {
      return (
        <Badge color='secondary' className='number'>
          ${parseInt(row.order.total).toFixed(1)}
        </Badge>
      );
    },
  },
  {
    name: 'المبلغ المسترد',
    selector: 'amount',
    sortable: true,
    minWidth: '280px',
    cell: (row) => {
      return (
        <Badge color='secondary' className='number'>
          ${parseInt(row.amount).toFixed(1)}
        </Badge>
      );
    },
  },
  {
    name: 'الحالة',
    selector: 'status',
    sortable: true,
    minWidth: '280px',
    cell: (row) => {
      return (
        <p color='secondary'>
          {row.dispute_type_id === 1 ? (
            <Badge>Did not receive goods</Badge>
          ) : row.dispute_type_id === 2 ? (
            <Badge>Counterfeit goods</Badge>
          ) : row.dispute_type_id === 3 ? (
            <Badge>Quantity shortage</Badge>
          ) : row.dispute_type_id === 4 ? (
            <Badge>Damaged goods</Badge>
          ) : row.dispute_type_id === 5 ? (
            <Badge>Quality not good</Badge>
          ) : row.dispute_type_id === 6 ? (
            <Badge>Product not as described</Badge>
          ) : row.dispute_type_id === 7 ? (
            <Badge>Problems with the accessories</Badge>
          ) : row.dispute_type_id === 8 ? (
            <Badge>Shipping method</Badge>
          ) : row.dispute_type_id === 9 ? (
            <Badge>Customs problem</Badge>
          ) : (
            <Badge>Shipping address not correct</Badge>
          )}
        </p>
      );
    },
  },
  {
    name: 'تاريخ الانشاء',
    selector: 'created_at',
    sortable: true,
    minWidth: '280px',
    cell: (row) => {
      return (
        <span color='secondary' className='number'>
          ${row.created_at}
        </span>
      );
    },
  },
  {
    name: 'اخر تحديث',
    selector: 'updated_at',
    sortable: true,
    minWidth: '280px',
    cell: (row) => {
      return (
        <span color='secondary' className='number'>
          ${row.updated_at}
        </span>
      );
    },
  },
  {
    name: 'الخيار',
    allowOverflow: true,
    cell: (row) => {
      const [formModal, setFormModal] = useState(false);
      const [data, setData] = useState([]);
      const [order, setOrder] = useState([]);
      const [payment_status, setPayment_status] = useState(null);
      useEffect(() => {
        axios
          .get(`https://amanacart.com/api/admin/support/refund/${row.id}/response`, auth)
          .then((response) => {
            setData(response.data.refund);
            setOrder(response.data.refund.order);
            setPayment_status(response.data.payment_status);
          })
          .catch((error) => {
            // console.log(error);
            if (error.response) {
              console.log(error.response.status);
              if (error.response.status === 500) {
                handleErrorNetwork(`${error.response.status} internal server error`);
                console.log(error.response.status);
              } else if (error.response.status === 404) {
                handleErrorNetwork(`Select Order`);
              } else {
                handleError(error.response.data.error);
              }
            } else {
              handleErrorNetwork(`${error} Network Error`);
            }
          });
      }, []);
      console.log(data);
      const hundelAprrove = (id) => {
        axios
          .get(`https://amanacart.com/api/admin/support/refund/${id}/approve`, auth)
          .then((response) => {
            window.location.reload();
            handleSuccess('APPROVED');
          })
          .catch((error) => {
            // console.log(error);
            if (error.response) {
              console.log(error.response.status);
              if (error.response.status === 500) {
                handleErrorNetwork(`${error.response.status} internal server error`);
                console.log(error.response.status);
              } else if (error.response.status === 404) {
                handleErrorNetwork(`Select Order`);
              } else {
                handleError(error.response.data.error);
              }
            } else {
              handleErrorNetwork(`${error} Network Error`);
            }
          });
      };
      const hundelDecline = (id) => {
        axios
          .get(`https://amanacart.com/api/admin/support/refund/${id}/decline`, auth)
          .then((response) => {
            window.location.reload();
            handleSuccess('DECLINE');
          })
          .catch((error) => {
            // console.log(error);
            if (error.response) {
              console.log(error.response.status);
              if (error.response.status === 500) {
                handleErrorNetwork(`${error.response.status} internal server error`);
                console.log(error.response.status);
              } else if (error.response.status === 404) {
                handleErrorNetwork(`Select Order`);
              } else {
                handleError(error.response.data.error);
              }
            } else {
              handleErrorNetwork(`${error} Network Error`);
            }
          });
      };

      return (
        <>
          <div className='d-flex'>
            {console.log(row)}
            <FileText size={15} onClick={() => setFormModal(!formModal)} />

            {/* <Link
              to={{
                pathname: `/promotion/coupon/editCoupon/edit/${row.id}`,
                id: row.id,
              }}
              style={{ color: 'rgba(0,0,0,0.87)' }}
            >
              <Edit size={15} />
            </Link> */}
            {/* <Button onClick={() => setFormModal(!formModal)}>
              <Edit size={15} />{' '}
            </Button> */}
          </div>
          <Modal isOpen={formModal} toggle={() => setFormModal(!formModal)} className=''>
            <ModalHeader toggle={() => setFormModal(!formModal)}>الاستجابة</ModalHeader>
            <ModalBody>
              <Row style={{ justifyContent: 'center' }}>
                <Col lg='12'>
                  <Col lg='12' md='12' sm='12'>
                    <Label for='email' sm='5'>
                      #الطلب:
                    </Label>
                    <span>{order.order_number}</span>
                  </Col>
                  <Col lg='12' md='12' sm='12'>
                    <Label for='email' sm='5'>
                      المبلغ المسترد:
                    </Label>
                    <span>{parseInt(data.amount).toFixed(1)}</span>
                  </Col>
                  <Col lg='12' md='12' sm='12'>
                    <Label for='email' sm='5'>
                      كمية الطلب:
                    </Label>
                    <span>{parseInt(order.total).toFixed(1)}</span>
                  </Col>
                  <Col lg='12' md='12' sm='12'>
                    <Label for='email' sm='5'>
                      حالة السداد:
                    </Label>
                    <Badge>{payment_status}</Badge>
                  </Col>
                  <Col lg='12' md='12' sm='12'>
                    <Label for='email' sm='5'>
                      طلب وارد:
                    </Label>
                    <span>{order.goods_received === 1 ? 'yes' : 'no'}</span>
                  </Col>
                  <Col lg='12' md='12' sm='12'>
                    <Label for='email' sm='5'>
                      إرجاع البضائع:
                    </Label>
                    <span>{data.return_goods === 1 ? 'on' : 'off'}</span>
                  </Col>
                  <Col lg='12' md='12' sm='12'>
                    <Label for='email' sm='5'>
                      تاريخ الطلب:
                    </Label>
                    <span>{order.created_at}</span>
                  </Col>
                  <Col lg='12' md='12' sm='12'>
                    <Label for='email' sm='5'>
                      الوصف:
                    </Label>
                    <span>{data.description ? data.description : 'Description is not available.'}</span>
                  </Col>
                </Col>
              </Row>
            </ModalBody>
            <ModalFooter>
              <Row style={{ width: '100%' }}>
                <Col lg='6' md='6' sm='6' xs='12'>
                  <Button style={{ width: '100%' }} color='primary' onClick={() => hundelAprrove(row.id)}>
                    يوافق
                  </Button>
                </Col>
                <Col lg='6' md='6' sm='6' xs='12'>
                  <Button style={{ width: '100%' }} color='primary' onClick={() => hundelDecline(row.id)}>
                    يتناقص
                  </Button>
                </Col>
              </Row>
            </ModalFooter>
          </Modal>
        </>
      );
    },
  },
];

// export let data;

// // ** Get initial Data

// axios
//   .get('https://amanacart.com/api/admin/catalog/manufacturer', auth)
//   .then((response) => {
//     data = response.data.manufacturers;
//     console.log(data);
//   })
//   .catch((error) => {
//     console.error(error);
//   });

export const ColumnsTrash = [
  {
    name: '#الطلب',
    selector: 'order',
    sortable: true,
    minWidth: '150px',
    cell: (row) => {
      return <Badge color='secondary'>{row.order ? row.order.order_number : ''}</Badge>;
    },
  },
  {
    name: 'إرجاع البضائع',
    selector: 'return_goods',
    sortable: true,
    minWidth: '250px',
    cell: (row) => {
      return <Badge color='secondary'>{row.return_goods === 0 ? 'off' : 'on'}</Badge>;
    },
  },
  {
    name: 'كمية الطلب',
    selector: 'total',
    sortable: true,
    minWidth: '280px',
    cell: (row) => {
      return <Badge color='secondary'>${row.order ? parseInt(row.order.total).toFixed(1) : ''}</Badge>;
    },
  },
  {
    name: 'المبلغ المسترد',
    selector: 'amount',
    sortable: true,
    minWidth: '280px',
    cell: (row) => {
      return <Badge color='secondary'>${parseInt(row.amount).toFixed(1)}</Badge>;
    },
  },
  {
    name: 'الحالة',
    selector: 'status',
    sortable: true,
    minWidth: '280px',
    cell: (row) => {
      return (
        <p color='secondary'>
          {row.dispute_type_id === 1 ? (
            <Badge>Did not receive goods</Badge>
          ) : row.dispute_type_id === 2 ? (
            <Badge>Counterfeit goods</Badge>
          ) : row.dispute_type_id === 3 ? (
            <Badge>Quantity shortage</Badge>
          ) : row.dispute_type_id === 4 ? (
            <Badge>Damaged goods</Badge>
          ) : row.dispute_type_id === 5 ? (
            <Badge>Quality not good</Badge>
          ) : row.dispute_type_id === 6 ? (
            <Badge>Product not as described</Badge>
          ) : row.dispute_type_id === 7 ? (
            <Badge>Problems with the accessories</Badge>
          ) : row.dispute_type_id === 8 ? (
            <Badge>Shipping method</Badge>
          ) : row.dispute_type_id === 9 ? (
            <Badge>Customs problem</Badge>
          ) : (
            <Badge>Shipping address not correct</Badge>
          )}
        </p>
      );
    },
  },
  {
    name: 'تاريخ الانشاء',
    selector: 'created_at',
    sortable: true,
    minWidth: '280px',
  },
  {
    name: 'اخر تحديث',
    selector: 'updated_at',
    sortable: true,
    minWidth: '280px',
  },
  // {
  //   name: 'الخيار',
  //   allowOverflow: true,
  //   cell: (row) => {
  //     const [formModal, setFormModal] = useState(false);

  //     return (
  //       <>
  //         <div className='d-flex'></div>
  //       </>
  //     );
  //   },
  // },
];
