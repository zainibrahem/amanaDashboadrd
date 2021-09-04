import { useContext, useState, useEffect } from 'react';
import { List, Plus, ChevronDown, ChevronUp, Trash2 } from 'react-feather';
import { CustomInput, FormGroup, Card, CardHeader, CardTitle, Button, Input, Label, Badge, Row, Col, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import TableWithButtons from '../tables/data-tables/basic/TableWithButtons';
import NumberInput from '@components/number-input';
import { EditorState } from 'draft-js';

// ** Table Data & Columns
import { Columns, ColumnsTrash } from '../tables/data-tables/refundsData';
import '@styles/react/libs/charts/apex-charts.scss';

//api
import axios from 'axios';

// ** UseJWT import to get config
import useJwt from '@src/auth/jwt/useJwt';

//alert
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { AvForm, AvGroup, AvInput, AvFeedback } from 'availity-reactstrap-validation-safe';

const Catalog = (props) => {
  const [basicModal, setBasicModal] = useState(false);
  const [basicModals, setBasicModals] = useState(false);
  // const [status, setStatus] = useState({ status: [] });
  const [trashData, setTrashData] = useState([]);
  const {
    match: { params },
  } = props;
  //init alert
  const MySwal = withReactContent(Swal);

  // init headers auth
  const config = useJwt.jwtConfig;
  const auth = {
    headers: {
      Authorization: `${config.tokenType} ${config.storageTokenKeyName}`,
    },
  };
  const [data, setdata] = useState([]);
  useEffect(() => {
    axios
      .get('https://amanacart.com/api/admin/support/refund', auth)
      .then((response) => {
        setdata(response.data['refunds ']);
        console.log(response.data);
        console.log(response.data['refunds ']);

        setTrashData(response.data.closed);
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
          handleErrorNetwork(`${error} Network Error`);
        }
      });
  }, []);

  const [visibleImageError, setVisibleImageError] = useState('');
  const [visible, setVisible] = useState('');

  //init input value
  // const [image, setImage] = useState('');

  const [status, setStatus] = useState('1');

  //init input value
  const [order_id, setOrder_id] = useState('');
  const [amount, setAmount] = useState(null);
  const [return_goods, setReturn_goods] = useState('');
  const [order_fulfilled, setOrder_fulfilled] = useState('');
  const [notify_customer, setNotify_customer] = useState(0);
  const [description, setDescription] = useState('');

  //    const [active, setActive] = useState(null);

  // alert success
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
  //alert error
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

  //handle empty trash

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();

    formData.append('order_id', order_id);
    formData.append('status', status);
    formData.append('amount', amount);
    formData.append('return_goods', return_goods);
    formData.append('order_fulfilled', order_fulfilled);
    formData.append('description', description);
    formData.append('notify_customer', notify_customer);
    // formData.append('_method', 'PUT');

    axios
      .post(`https://amanacart.com/api/admin/support/refund/initiate`, formData, auth)
      .then((response) => {
        console.log(response);
        window.location.reload();
        handleSuccess('تمت العملية بنجاح');

        // setBasicModal(!basicModal);
        // return response;
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

    console.log(formData['name']);
  };
  const handleFileSelected = (e) => {
    setImage(e.target.files[0]);
  };
  const handleFileSelectedCover = (e) => {
    setCover_image(e.target.files[0]);
  };
  const hundelGoods = (e) => {
    if (!e.target.checked) {
      setNotify_customer('1');
      console.log(notify_customer);
    } else {
      setNotify_customer('0');
      console.log(notify_customer);
    }
  };
  return (
    <div id='dashboard-analytics'>
      <Row className='match-height mt-5'>
        <Col md='12' xs='12'>
          <Card className='m-0'>
            <CardHeader className='flex-md-row flex-column align-md-items-center align-items-start border-bottom'>
              <CardTitle tag='h4'>المبالغ المستردة</CardTitle>
              <Button className='ml-2' color='primary' onClick={() => setBasicModal(!basicModal)}>
                <Plus size={15} />
                بدء استرداد
              </Button>
            </CardHeader>
          </Card>
        </Col>
        <Col>
          <TableWithButtons columns={Columns} data={data} />
        </Col>
      </Row>
      <Row className='match-height'>
        <Col md='12' xs='12'>
          <Card className='m-0'>
            <CardHeader className='flex-md-row flex-column align-md-items-center align-items-start border-bottom'>
              <CardTitle tag='h4'>المبالغ المستردة المغلقة</CardTitle>
            </CardHeader>
          </Card>
        </Col>
        <Col>
          <TableWithButtons columns={ColumnsTrash} data={trashData} />
        </Col>
      </Row>
      <Modal isOpen={basicModal} toggle={() => setBasicModal(!basicModal)} className='modal-dialog-centered modal-lg'>
        <ModalHeader toggle={() => setBasicModal(!basicModal)}>استرداد</ModalHeader>
        <ModalBody>
          <Row>
            <Col className='mb-1' lg='8' md='8' xs='12'>
              <Label for='order_id'>تحدد طلب*</Label>
              <Input type='select' name='order_id' id='order_id' onChange={(e) => setOrder_id(e.target.value)}>
                <option>Select Order</option>
                <option value={33}>#874522</option>
                {/* <option value={0}>InActive</option> */}
              </Input>
            </Col>
            <Col className='mb-1' lg='4' md='4' xs='12'>
              <Label for='status'>الحالة *</Label>
              <Input type='select' name='status' id='status' onChange={(e) => setStatus(e.target.value)}>
                <option>Select Status</option>
                <option value={1}>New</option>
                {/* <option value={2}>Approved</option> */}
                <option value={3}>Declined</option>
                <option value={4}>Wating</option>
                <option value={5}>Closed</option>
              </Input>
            </Col>
            <Col className='mb-1' lg='12' md='12' xs='12'>
              <Label for='amount'>المبلغ المسترد*</Label>
              <Input type='number' name='amount' onChange={(e) => setAmount(e.target.value)} id='amount' />
            </Col>
            <Col className='mb-1' lg='6' md='6' xs='12'>
              <Label for='return_goods'>إرجاع البضائع*</Label>
              <Input type='select' name='return_goods' id='return_goods' onChange={(e) => setReturn_goods(e.target.value)}>
                <option>Select</option>
                <option value={'on'}>ON</option>
                <option value={'off'}>OFF</option>

                {/* <option value={0}>InActive</option> */}
              </Input>
            </Col>
            <Col className='mb-1' lg='6' md='6' xs='12'>
              <Label for='order_fulfilled'>تم تنفيذ الطلب*</Label>
              <Input type='select' name='order_fulfilled' id='order_fulfilled' onChange={(e) => setOrder_fulfilled(e.target.value)}>
                <option>Select</option>
                <option value={'on'}>ON</option>
                <option value={'off'}>OFF</option>
              </Input>
            </Col>
            <Col className='mb-1' lg='12' md='12' xs='12'>
              <Label for='description'>الوصف*</Label>
              <Input type='text' name='description' onChange={(e) => setDescription(e.target.value)} id='description' />
            </Col>

            <Col lg='12'>
              <CustomInput inline type='checkbox' name='notify_customer' id='notify_customer' label='SEND A NOTIFICATION EMAIL TO CUSTOMER' onClick={(e) => hundelGoods(e)} />
            </Col>
            <Col className='mb-1 d-flex justify-content-end' xs='12'>
              <Button onClick={handleSubmit} color='primary' type='submit'>
                حفظ
              </Button>
            </Col>
          </Row>
        </ModalBody>
      </Modal>
    </div>
  );
};

export default Catalog;
