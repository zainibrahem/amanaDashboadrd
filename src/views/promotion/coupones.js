import { useContext, useState, useEffect } from 'react';
import { List, Plus, ChevronDown, ChevronUp, Trash2 } from 'react-feather';
import { CustomInput, FormGroup, Card, CardHeader, CardTitle, Button, Input, Label, Badge, Row, Col, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import TableWithButtons from '../tables/data-tables/basic/TableWithButtons';
import NumberInput from '@components/number-input';
import { EditorState } from 'draft-js';

// ** Table Data & Columns
import { Columns, ColumnsTrash } from '../tables/data-tables/cuoponesData';
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
  const [status, setStatus] = useState({ status: [] });
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
      .get('https://amanacart.com/api/admin/promotion/coupon', auth)
      .then((response) => {
        setdata(response.data.coupones);
        console.log(response.data);
        setTrashData(response.data.trashes);
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
        }
        handleErrorNetwork(`${error}`);
      });
  }, []);

  const [visibleImageError, setVisibleImageError] = useState('');
  const [visible, setVisible] = useState('');

  //init input value
  // const [image, setImage] = useState('');

  const [active, setActive] = useState('1');

  //init input value
  const [name, setName] = useState(null);
  const [code, setCode] = useState(null);
  const [value, setvalue] = useState(null);
  const [type, setType] = useState('percente');

  const [quantity, setQuantity] = useState(12);
  const [min_order_amount, setMin_order_amount] = useState(123);
  const [quantity_per_customer, setQuantity_per_customer] = useState(1);
  const [starting_time, setStarting_time] = useState('2021-06-28 01:11 am');
  const [ending_time, setEnding_time] = useState('2021-06-29 01:11 am');
  const [description, setDescription] = useState('TEST description');

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

  //handle empty trash
  const handleTrash = () => {
    if (trashData.length > 0) {
      axios
        .delete('https://amanacart.com/api/admin/promotion/coupon/emptyTrash', auth)
        .then((response) => {
          console.log(response);
          handleSuccess('EMPTY TRASH SUCCESS');
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
            handleErrorNetwork(`${error} Error network`);
          }
        });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();

    formData.append('name', name);
    formData.append('code', code);
    formData.append('value', 121);
    formData.append('type', type);
    formData.append('quantity', quantity);
    formData.append('min_order_amount', min_order_amount);
    formData.append('quantity_per_customer', quantity_per_customer);
    formData.append('starting_time', starting_time);
    formData.append('ending_time', ending_time);
    formData.append('description', description);

    formData.append('active', active);
    // formData.append('_method', 'PUT');

    axios
      .post(`https://amanacart.com/api/admin/promotion/coupon`, formData, auth)
      .then((response) => {
        console.log(response);
        window.location.reload();
        handleSuccess('ADD SUCCESS');

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
            handleErrorNetwork(`${error.response.status} page not found`);
          } else {
            handleError(error.response.data.error);
          }
        } else {
          handleErrorNetwork(`${error}`);
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

  return (
    <div id='dashboard-analytics'>
      <Row className='match-height mt-5'>
        <Col md='12' xs='12'>
          <Card className='m-0'>
            <CardHeader className='flex-md-row flex-column align-md-items-center align-items-start border-bottom'>
              <CardTitle tag='h4'>القسائم</CardTitle>
              <Button className='ml-2' color='primary' onClick={() => setBasicModal(!basicModal)}>
                <Plus size={15} />
                اضافة قسيمة
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
              <CardTitle tag='h4'>سلة المهملات</CardTitle>
              <div>
                <Button className='ml-2' color='primary' onClick={() => handleTrash()}>
                  <Trash2 size={15} />
                  حذف سلة المهملات نهائيا
                </Button>
              </div>
            </CardHeader>
          </Card>
        </Col>
        <Col>
          <TableWithButtons columns={ColumnsTrash} data={trashData} />
        </Col>
      </Row>
      <Modal isOpen={basicModal} toggle={() => setBasicModal(!basicModal)} className='modal-dialog-centered modal-lg'>
        <ModalHeader toggle={() => setBasicModal(!basicModal)}>FORM</ModalHeader>
        <ModalBody>
          <Row>
            <Col className='mb-1' lg='10' md='8' xs='12'>
              <Label for='name'>الاسم*</Label>
              <Input type='text' name='name' onChange={(e) => setName(e.target.value)} id='name' />
            </Col>
            <Col className='mb-1' lg='2' md='4' xs='12'>
              <Label for='active'>الحالة *</Label>
              <Input type='select' name='active' id='active' onChange={(e) => setActive(e.target.value)}>
                <option>تحديد</option>
                <option value={1}>Active</option>
                <option value={0}>InActive</option>
              </Input>
            </Col>
            <Col className='mb-1' lg='6' md='6' xs='12'>
              <Label for='code'>الرمز*</Label>
              <Input type='number' name='code' onChange={(e) => setCode(e.target.value)} id='code' />
            </Col>
            <Col className='mb-1' lg='6' md='6' xs='12'>
              <Label for='value'>القيمة*</Label>
              <Input type='number' name='value' onChange={(e) => setvalue(e.target.value)} id='amount' />
            </Col>
            <Col className='mb-1' lg='4' md='6' xs='12'>
              <Label for='quantity'>الكمية*</Label>
              <Input type='number' name='quantity' onChange={(e) => setQuantity(e.target.value)} id='quantity' />
            </Col>

            <Col className='mb-1' lg='4' md='6' xs='12'>
              <Label for='min_order_amount'>الحد الأدنى للطلب*</Label>
              <Input type='number' name='min_order_amount' onChange={(e) => setMin_order_amount(e.target.value)} id='min_order_amount' />
            </Col>
            <Col className='mb-1' lg='4' md='6' xs='12'>
              <Label for='quantity_per_customer'> الكمية لكل عميل*</Label>
              <Input type='text' name='quantity_per_customer' onChange={(e) => setQuantity_per_customer(e.target.value)} id='quantity_per_customer' />
            </Col>
            <Col className='mb-1' lg='12' md='6' xs='12'>
              <Label for='description'>الوصف*</Label>
              <Input type='text' name='description' onChange={(e) => setDescription(e.target.value)} id='description' />
            </Col>
            <Col className='mb-1' lg='6' md='6' xs='12'>
              <Label for='starting_time'>تاريخ البدء*</Label>
              <Input type='datetime' name='starting_time' onChange={(e) => setStarting_time(e.target.value)} placeholder='2021-06-28 01:11 am' id='starting_time' />
            </Col>
            <Col className='mb-1' lg='6' md='6' xs='12'>
              <Label for='ending_time'>تاريخ الانتهاء*</Label>
              <Input type='datetime' name='ending_time' onChange={(e) => setEnding_time(e.target.value)} placeholder='2021-07-28 01:11 pm' id='ending_time' />
            </Col>
            {/* <Col md='6' sm='12'>
              <FormGroup>
                <Label for='image'>BRAND LOGO </Label>
                <CustomInput type='file' onChange={(e) => handleFileSelected(e)} id='image' name='image' />
              </FormGroup>
            </Col> */}

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
