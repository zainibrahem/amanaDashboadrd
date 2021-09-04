import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { List, Plus, ChevronDown, ChevronUp, User } from 'react-feather';
import { CustomInput, FormGroup, Card, CardHeader, CardTitle, Button, Input, Label, Badge, Row, Col, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import NumberInput from '@components/number-input';
import { EditorState } from 'draft-js';
//alert
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
//api
import axios from 'axios';

// ** UseJWT import to get config
import useJwt from '@src/auth/jwt/useJwt';
const Catalog = (props) => {
  //get id from URL
  // const { id } = props.location;

  //init alert
  const MySwal = withReactContent(Swal);
  // init headers auth
  const config = useJwt.jwtConfig;
  const auth = {
    headers: {
      Authorization: `${config.tokenType} ${config.storageTokenKeyName}`,
    },
  };

  const {
    match: { params },
  } = props;
  //fetch data from api
  const [data, setdata] = useState([]);
  const [basicModalRefund, setBasicModalRefund] = useState(false);
  const [basicModal, setBasicModal] = useState(false);

  //init input value
  const [order_id, setOrder_id] = useState(null);

  const [order_number, setOrder_number] = useState('#874522');
  const [amount, setAmount] = useState(null);
  const [return_goods, setReturn_goods] = useState('');
  const [order_fulfilled, setOrder_fulfilled] = useState('');
  const [notify_customer, setNotify_customer] = useState(0);
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('');
  const hundelGoods = (e) => {
    if (!e.target.checked) {
      setNotify_customer('1');
      console.log(notify_customer);
    } else {
      setNotify_customer('0');
      console.log(notify_customer);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();

    formData.append('order_number', order_number);
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

  // console.log(data.customer['name']);

  // console.log(data['dispute_type'].detail);

  // console.log(data['customer'].name);

  const handleFileSelected = (e) => {
    setImage(e.target.files[0]);
  };
  const handleFileSelectedCover = (e) => {
    setCover_image(e.target.files[0]);
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
  //alert error
  const hundeErrorText = (errMsg) => {
    console.log(Object.keys(errMsg).length);
    //let errData = {err};
    //console.log(errData);
    if (Object.keys(errMsg).length) {
      return (
        <>
          <div style={{ color: 'red', display: 'inline-block', fontSize: '15px' }}>
            {Object.keys(errMsg || {}).map((el, key) => {
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
  const [customerData, setCustomerData] = useState(null);
  const [disputeTypeData, setDisputeTypeData] = useState(null);

  useEffect(() => {
    // axios.get("https://zcart.test/api/admin/catalog/manufacturer/create", auth).then(response => {
    //     // console.log(response.data.categories)
    // }).catch(error => {
    //     console.log(error)
    //     handleError(` ${error} check internet connection `)
    // const {
    //   match: { params },
    // } = props;

    if (params.id) {
      console.log(params.id);
    }
    // })
    if (params.id) {
      axios
        .get(`https://amanacart.com/api/admin/support/dispute/${params.id}`, auth)
        .then((response) => {
          try {
            console.log(response.data);
            setdata(response.data.dispute);
            setStatus(response.data.dispute.status);
            setOrder_id(response.data.dispute.order_id);
            setCustomerData(response.data.dispute.customer);
            setDisputeTypeData(response.data.dispute.dispute_type);
            console.log(response);
          } catch (e) {
            console.log(response, e);
          }
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
              handleErrorNetwork(`${error.response.status} page not found`);
            } else {
              handleError(error.response.data.error);
            }
          } else {
            handleErrorNetwork(`${error}`);
          }
        });
    }
  }, []);
  console.log(data);
  // console.log(data.dispute_type['detail']);
  // console.log(data.customer['name']);
  const [reply, setReply] = useState(null);

  const hundelResponse = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('reply', reply);

    axios
      .post(`https://amanacart.com/api/admin/support/dispute/${params.id}/storeResponse`, formData, auth)
      .then((response) => {
        console.log(response);
        handleSuccess('تمت العملية بنجاح');
        window.location.reload();
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
  };
  return (
    <Row>
      <Col lg='8' md='8' sm='12'>
        <div id='dashboard-analytics' className=' bg-white'>
          <Row style={{ padding: '10px' }}>
            <Col lg='8' md='8' xs='12'></Col>
            <Col md='12' xs='12' style={{ marginBottom: '20px' }}>
              <Card className='m-0'>
                <CardHeader className='flex-md-row flex-column align-md-items-center align-items-start border-bottom'>
                  <CardTitle tag='h4'>النزاعات</CardTitle>
                  <div>
                    <Button className='ml-2 primary' color='primary' onClick={() => setBasicModal(!basicModal)}>
                      <Plus size={15} />
                      الاستجابة
                    </Button>
                    {!data.dispute_type_id ? (
                      <Button className='ml-2 primary' color='primary' onClick={() => setBasicModalRefund(!basicModalRefund)}>
                        <Plus size={15} />
                        بدء استرداد الأموال
                      </Button>
                    ) : null}
                  </div>
                </CardHeader>
              </Card>
            </Col>
            <Col className='mb-1'>
              {data ? (
                //   {data.dispute_type.detail ? data.dispute_type.detail : ''}
                <>
                  <Label for='name'>
                    {data.dispute_type_id === 1 ? <Badge color='primary'>OPEN</Badge> : data.dispute_type_id === 2 ? <Badge>APPEALED</Badge> : <Badge color='danger'>CLOSED</Badge>}
                  </Label>
                  <p for='name'>{disputeTypeData ? disputeTypeData.detail : ''}</p>
                  <p className='mb-8 mt-9' style={{ border: '1px solid #dad6d6', borderRadius: '10px', backgroundColor: '#f1f1f1', padding: '12px 10px', marginTop: '30px', marginBottom: '12px' }}>
                    {data.description ? data.description : ''}
                  </p>
                </>
              ) : (
                ''
              )}
            </Col>
          </Row>
        </div>
      </Col>
      <Col lg='4' md='4' sm='12'>
        <div id='dashboard-analytics' className=' bg-white'>
          <Row style={{ padding: '10px' }}>
            <Col lg='8' md='8' xs='12'></Col>
            <Col md='12' xs='12' style={{ marginBottom: '20px' }}>
              <Card className='m-0'>
                <CardHeader className='flex-md-row flex-column align-md-items-center align-items-start border-bottom'>
                  <CardTitle tag='h4'>الزبون</CardTitle>
                </CardHeader>
              </Card>
            </Col>
            <Col className='mb-1' lg='12' md='12' sm='12'>
              {customerData ? (
                //   {data.dispute_type.detail ? data.dispute_type.detail : ''}
                <>
                  <div for='name' className='' style={{ display: 'flex' }}>
                    <User size={20} />
                    <p style={{ fontSize: '14pt', marginLeft: '13px', textTransform: 'capitalize' }}>{customerData.name ? customerData.name : ''}</p>
                  </div>
                  <div>
                    <p for='name'>
                      إجمالي النزاعات:<Badge color='primary'>2</Badge>
                    </p>
                    <p for='name'>
                      Last 30 days:<Badge color='primary'>0</Badge>
                    </p>
                  </div>
                  <div>
                    <p style={{ fontSize: '10pt' }}>
                      تم الانشاء:
                      <br /> {customerData.created_at}
                    </p>
                    <p style={{ fontSize: '10pt' }}>
                      اخر تحديث
                      <br /> {customerData.updated_at}
                    </p>
                  </div>
                </>
              ) : (
                ''
              )}
            </Col>
          </Row>
        </div>
      </Col>
      <Modal isOpen={basicModal} toggle={() => setBasicModal(!basicModal)} className='modal-dialog-centered'>
        <ModalHeader toggle={() => setBasicModal(!basicModal)}>رد</ModalHeader>
        <ModalBody>
          <FormGroup>
            <Label for='reply'>ارسال رد:</Label>
            <Input type='text' id='reply' name='reply' placeholder='' onChange={(e) => setReply(e.target.value)} />
          </FormGroup>
        </ModalBody>
        <ModalFooter>
          <Button type='submit' color='primary' onClick={hundelResponse}>
            ارسال رد
          </Button>{' '}
        </ModalFooter>
      </Modal>
      {/* model refund*/}

      <Modal isOpen={basicModalRefund} toggle={() => setBasicModalRefund(!basicModalRefund)} className='modal-dialog-centered modal-lg'>
        <ModalHeader toggle={() => setBasicModalRefund(!basicModalRefund)}>FORM</ModalHeader>
        <ModalBody>
          <Row>
            <Col className='mb-1' lg='8' md='8' xs='12'>
              <Label for='order_id'>تحديد طلب*</Label>
              <Input type='text' name='order_number' id='order_number' onChange={(e) => setOrder_number(e.target.value)} readOnly value={order_number} />
            </Col>
            <Col className='mb-1' lg='4' md='4' xs='12'>
              <Label for='status'>الحالة *</Label>
              <Input type='select' name='status' id='status' onChange={(e) => setStatus(e.target.value)} value={status}>
                <option>Select Status</option>
                <option value={1}>New</option>
                <option value={2}>Approved</option>
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
              <Label for='order_fulfilled'>تم تنفيذ بالطلب*</Label>
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
    </Row>
  );
};

export default Catalog;
