import { useContext, useState, useEffect } from 'react';
import { List, Plus, ChevronDown, ChevronUp, Trash2 } from 'react-feather';
import { CustomInput, FormGroup, Card, CardHeader, CardTitle, Button, Input, Label, Badge, Row, Col, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import TableWithButtons from '../tables/data-tables/basic/TableWithButtons';
import NumberInput from '@components/number-input';
import { EditorState } from 'draft-js';

// ** Table Data & Columns
import { Columns, ColumnsTrash } from '../tables/data-tables/manufacturerData';
import '@styles/react/libs/charts/apex-charts.scss';

//api
import axios from 'axios';

// ** UseJWT import to get config
import useJwt from '@src/auth/jwt/useJwt';

//alert
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { AvForm, AvGroup, AvInput, AvFeedback } from 'availity-reactstrap-validation-safe';

const Catalog = () => {
  const [basicModal, setBasicModal] = useState(false);
  const [basicModals, setBasicModals] = useState(false);
  const [status, setStatus] = useState({ status: [] });
  const [trashData, setTrashData] = useState([]);

  //init alert
  const MySwal = withReactContent(Swal);

  // init headers auth
  const config = useJwt.jwtConfig;
  const auth = {
    headers: {
      Authorization: `${config.tokenType} ${config.storageTokenKeyName}`,
    },
  };
  const hundeErrorText = (errMsg) => {
    console.log(Object.keys(errMsg).length);
    //let errData = {err};
    //console.log(errData);
    if (Object.keys(errMsg).length) {
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
    }).then(() => MySwal.fire(hundeErrorText(errMsg)));
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
  const [data, setdata] = useState([]);
  useEffect(() => {
    axios
      .get('https://amanacart.com/api/admin/catalog/manufacturer', auth)
      .then((response) => {
        setdata(response.data.manufacturers);
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
        } else {
          handleErrorNetwork(`${error}`);
        }
      });
  }, []);
  const [dataSelect, setdataSelect] = useState([]);
  useEffect(() => {
    axios
      .get('https://amanacart.com/api/admin/catalog/manufacturer/create', auth)
      .then((response) => {
        setdataSelect(response.data.countries);
        setStatus({ status: response.data.statuses });
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
  const [visibleImageError, setVisibleImageError] = useState('');
  const [value, setValue] = useState(EditorState.createEmpty());

  const [visible, setVisible] = useState('');
  const [active, setActive] = useState('1');

  //init input value
  const [name, setName] = useState(null);
  const [slug, setSlug] = useState(null);
  const [url, setUrl] = useState(null);
  const [description, setDescription] = useState(null);
  const [origin, setOrigin] = useState(null);
  const [listing_count, setListing_count] = useState(null);
  const [image, setImage] = useState('');
  const [cover_image, setCover_image] = useState('');
  const [phone, setPhone] = useState(null);
  const [email, setEmail] = useState(null);
  const [products_count, setProducts_count] = useState(null);

  // alert success
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
  //handle empty trash
  const handleTrash = () => {
    if (trashData.length > 0)
      axios
        .delete('https://amanacart.com/api/admin/catalog/manufacturer/emptyTrash', auth)
        .then((response) => {
          console.log(response);
          handleSuccess('EMPTY TRASH SUCCESS');
          setBasicModal(!basicModal);
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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (value.getCurrentContent().getPlainText() === '') {
      setVisible(true);
    } else {
      setVisible(false);
    }
    const formData = new FormData();
    const formDataCover = new FormData();

    if (image === '' || cover_image === '') {
      setVisibleImageError(true);
    } else {
      setVisibleImageError(false);
      // Update the formData object
      formData.append('image', image, image.name);
      formData.append('cover_image', cover_image, cover_image.name);
    }
    formData.append('name', name);
    formData.append('slug', slug);
    formData.append('url', url);
    formData.append('description', value.getCurrentContent().getPlainText());
    formData.append('listing_count', listing_count);
    formData.append('phone', phone);
    formData.append('email', email);
    formData.append('origin', origin);

    formData.append('active', active);
    formData.append('products_count', Number(products_count));

    axios
      .post('https://amanacart.com/api/admin/catalog/manufacturer', formData, auth)
      .then((response) => {
        console.log(response);
        handleSuccess('ADD SUCCESS');
        setBasicModal(!basicModal);
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
              <CardTitle tag='h4'>الشركات المصنعة</CardTitle>
              <Button className='ml-2' color='primary' onClick={() => setBasicModal(!basicModal)}>
                <Plus size={15} />
                اضافة شركة مصنعة
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
        <ModalHeader toggle={() => setBasicModal(!basicModal)}>شكل</ModalHeader>
        <ModalBody>
          <Row>
            <Col className='mb-1' lg='8' md='8' xs='12'>
              <Label for='name'>الاسم*</Label>
              <Input type='text' name='name' onChange={(e) => setName(e.target.value)} id='name' placeholder='اسم الشركة المصنعة' required />
            </Col>
            <Col className='mb-1' lg='4' md='4' xs='12'>
              <Label for='status'>الحالة *</Label>
              <Input type='select' name='active' id='status' onChange={(e) => setActive(e.target.value)} required>
                <option>حدد</option>
                <option value={1}>Active</option>
                <option value={0}>InActive</option>
              </Input>
            </Col>
            <Col className='mb-1' lg='6' md='6' xs='12'>
              <Label for='url'>الرابط*</Label>
              <Input type='text' name='url' onChange={(e) => setUrl(e.target.value)} id='url' placeholder='عنوان الويب' required />
            </Col>
            <Col className='mb-1' lg='6' md='6' xs='12'>
              <Label for='origin'>الدولة*</Label>
              {/* <Input type='email' id='basicInput' placeholder='COUNTRY ' /> */}
              <Input type='select' name='origin' onChange={(e) => setOrigin(e.target.value)} id='origin'>
                <option>حدد البلد</option>

                {dataSelect.map((e) => {
                  return <option key={e.id}>{e.name}</option>;
                })}
              </Input>
            </Col>
            <Col className='mb-1' lg='6' md='6' xs='12'>
              <Label for='email'>عنوان البريد الالكتروني*</Label>
              <Input type='email' name='email' onChange={(e) => setEmail(e.target.value)} id='email' placeholder='ادخل عنوان بريد الكتروني صالحا' required />
            </Col>
            <Col className='mb-1' lg='6' md='6' xs='12'>
              <Label for='phone'>الهاتف*</Label>
              <Input type='text' name='phone' onChange={(e) => setPhone(e.target.value)} id='phone' placeholder='ادخل رقم هاتف صالحا' required />
            </Col>

            {/* <Col className='mb-1' lg='6' md='6' xs='12'>
              <Label for='products_count'>عدد المنتجات*</Label>
              <Input type='number' name='products_count' onChange={(e) => setProducts_count(e.target.value)} id='products_count' required />
            </Col> */}
            <Col className='mb-1' md='12'>
              <Label>الوصف*</Label>
              <Input type='textarea' type='text' name='description' onChange={(e) => setDescription(e.target.value)} id='description' required />
            </Col>
            <Col md='6' sm='12'>
              <FormGroup>
                <Label for='cover_image'>COVER IMAGE </Label>
                <CustomInput type='file' onChange={(e) => handleFileSelectedCover(e)} id='cover_image' name='cover_image' />
              </FormGroup>
            </Col>
            <Col md='6' sm='12'>
              <FormGroup>
                <Label for='image'>شعار العلامة التجارية </Label>
                <CustomInput type='file' onChange={(e) => handleFileSelected(e)} id='image' name='image' />
              </FormGroup>
            </Col>

            <Col className='mb-1 d-flex justify-content-end' xs='12'>
              <Button onClick={handleSubmit} color='primary' type='submit'>
                SAVE
              </Button>
            </Col>
          </Row>
        </ModalBody>
      </Modal>
    </div>
  );
};

export default Catalog;
