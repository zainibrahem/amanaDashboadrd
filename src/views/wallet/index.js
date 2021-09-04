import { useContext, useState, useEffect } from 'react';
import { List, Plus, ChevronDown, ChevronUp, Trash2 } from 'react-feather';
import { CustomInput, FormGroup, Card, CardHeader, CardTitle, Button, Input, Label, Badge, Row, Col, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import TableWithButtons from '../tables/data-tables/basic/TableWithButtons';
import NumberInput from '@components/number-input';
import { EditorState } from 'draft-js';

// ** Table Data & Columns
import { Columns, ColumnsTrash } from '../tables/data-tables/walletTable';
import '@styles/react/libs/charts/apex-charts.scss';

//api
import axios from 'axios';

// ** UseJWT import to get config
import useJwt from '@src/auth/jwt/useJwt';
import './style.css';

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
    axios.get('https://amanacart.com/api/admin/account/wallet', auth).then((response) => {
      setdata(response.data);
      console.log('sssssssssssssssssssssss');
      console.log(response.data)
    });
  }, []);
  const [dataSelect, setdataSelect] = useState([]);

  const [visibleImageError, setVisibleImageError] = useState('');
  const [value, setValue] = useState(EditorState.createEmpty());

  const [visible, setVisible] = useState('');

  //init input value
  const [image, setImage] = useState('');

  const [name, setName] = useState(null);
  const [contact_person, setContactPerson] = useState(null);

  const [email, setEmail] = useState(null);
  const [amount,setAmount] = useState(null);
  const [active, setActive] = useState('1');
  const [description, setDescription] = useState(null);

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
  const handleError = (msg) => {
    return MySwal.fire({
      title: 'Error!',
      text: msg,
      icon: 'error',
      customClass: {
        confirmButton: 'btn btn-primary',
      },
      buttonsStyling: false,
    });
  };

  //handle empty trash
  const handleTrash = () => {
    axios
      .delete('https://amanacart.com/api/admin/order/cart/emptyTrash', auth)
      .then((response) => {
        console.log(response);
        handleSuccess('EMPTY TRASH SUCCESS');
        window.location.reload();
      })
      .catch((error) => {
        console.error(error.response);
        handleError(error.response.data.error.name);
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (value.getCurrentContent().getPlainText() === '') {
      setVisible(true);
    } else {
      setVisible(false);
    }

    const formData = new FormData();
    const formDataCover = new FormData();

    formData.append('email', email);

    formData.append('amount',amount);

    // formData.append('_method', 'PUT');
    axios
      .post(`https://amanacart.com/api/admin/account/wallet/transfer`, formData, auth)
      .then((response) => {
        console.log(response);
        window.location.reload();
        handleSuccess('تمت العملية بنجاح');
      })
      .catch((error) => {
        handleError(` ${error}`);
        console.log(error);
      });

  };
  const handlePayout = (e) => {
    e.preventDefault();
    if (value.getCurrentContent().getPlainText() === '') {
      setVisible(true);
    } else {
      setVisible(false);
    }

    const formData = new FormData();
    const formDataCover = new FormData();

    

    formData.append('amount',amount);

    // formData.append('_method', 'PUT');
    axios
      .post(`https://amanacart.com/api/admin/account/wallet/withdraw`, formData, auth)
      .then((response) => {
        console.log(response);
        window.location.reload();
        handleSuccess('تمت العملية بنجاح');
      })
      .catch((error) => {
        handleError(` ${error}`);
        console.log(error);
      });

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
              <CardTitle tag='h4'>المحفظة</CardTitle>
              <Button className='ml-2' color='primary' onClick={() => setBasicModals(!basicModals)}>
                <Plus size={15} />
                طلب سحب الأرباح
              </Button>
              <Button className='ml-2' color='primary' onClick={() => setBasicModal(!basicModal)}>
                <Plus size={15} />
                إيداع قيمة
              </Button>
              <Button className='ml-2' color='primary' onClick={() => setBasicModal(!basicModal)}>
                <Plus size={15} />
                تحويل
              </Button>
            </CardHeader>
          </Card>
        </Col>
        <Col>

          <TableWithButtons columns={Columns} data={data} />
        </Col>
      </Row>
      <Modal isOpen={basicModal} toggle={() => setBasicModal(!basicModal)} className='modal-dialog-centered modal-md'>
        <ModalHeader toggle={() => setBasicModal(!basicModal)}>تحويل</ModalHeader>
        <ModalBody>
            <Row>
            <Col className='mb-1' lg='2' md='2' xs='12'></Col>
                <Col className='mb-1' lg='8' md='8' xs='12'>
                    <Label for='name'>تحويل إلى*</Label>
                    <Input type='text' name='name' placeholder="أدخل البريد الالكتروني للمستلم" onChange={(e) => setEmail(e.target.value)} id='name' />
                </Col>
                <Col className='mb-1' lg='2' md='2' xs='12'></Col>
                <Col className='mb-1' lg='2' md='2' xs='12'></Col>
                <Col className='mb-1' lg='8' md='8' xs='12'>
                    <Label for='name'>الكمية*</Label>
                    <Input type='number' name='amount' placeholder="أدخل الكمية" onChange={(e) => setAmount(e.target.value)} id='name' />
                </Col>
                <Col className='mb-1' lg='2' md='2' xs='12'></Col>

                <Col className='mb-1' lg='4' md='2' xs='12'></Col>
                <Col className='mb-1' style={{textAlign:"center"}} lg='4' md='2' xs='12'>
                    <Button onClick={handleSubmit} color='primary' type='submit'>
                        تحويل
                    </Button>
                </Col>
                <Col className='mb-1' lg='4' md='2' xs='12'></Col>
            </Row>
        </ModalBody>
      </Modal>
    




      <Modal isOpen={basicModals} toggle={() => setBasicModals(!basicModals)} className='modal-dialog-centered modal-md'>
        <ModalHeader toggle={() => setBasicModals(!basicModals)}>تقديم طلب سحب أرباح</ModalHeader>
        <ModalBody>
          
            <Row>
            <Col className='mb-1' lg='2' md='2' xs='12'></Col>
                <Col className='mb-1' lg='8' md='8' xs='12'>
                    <Label for='name'>أقل كمية للسحب هيي 100.0</Label>
                </Col>
                <Col className='mb-1' lg='2' md='2' xs='12'></Col>
                <Col className='mb-1' lg='2' md='2' xs='12'></Col>
                <Col className='mb-1' lg='8' md='8' xs='12'>
                    <Label for='name'>الكمية*</Label>
                    <Input type='number' name='amount' placeholder="أدخل الكمية" onChange={(e) => setAmount(e.target.value)} id='name' />
                </Col>
                <Col className='mb-1' lg='2' md='2' xs='12'></Col>
                <Col className='mb-1' lg='2' md='2' xs='12'></Col>
                <Col className='mb-1' lg='8' md='8' xs='12'>
                    قد يتم إضافة ضريبة للسحب من قبل أمانة
                </Col>
                <Col className='mb-1' lg='2' md='2' xs='12'></Col>
                <Col className='mb-1' lg='4' md='2' xs='12'></Col>
                <Col className='mb-1' style={{textAlign:"center"}} lg='4' md='2' xs='12'>
                    <Button onClick={handlePayout} color='primary' type='submit'>
                        سحب
                    </Button>
                </Col>
                <Col className='mb-1' lg='4' md='2' xs='12'></Col>
            </Row>
        </ModalBody>
      </Modal>
   
      </div>
  );
};

export default Catalog;
