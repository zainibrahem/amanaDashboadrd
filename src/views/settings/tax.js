import { useContext, useState, useEffect } from 'react';
import { List, Plus, ChevronDown, ChevronUp, Trash2 } from 'react-feather';
import { CustomInput, FormGroup, Card, CardHeader, CardTitle, Button, Input, Label, Badge, Row, Col, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import TableWithButtons from '../tables/data-tables/basic/TableWithButtons';
import NumberInput from '@components/number-input';
import { EditorState } from 'draft-js';

// ** Table Data & Columns
import { Columns, ColumnsTrash } from '../tables/data-tables/taxData';
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
  const [countries, setContries] = useState([]);
  useEffect(() => {
    axios
      .get('https://amanacart.com/api/admin/setting/tax', auth)
      .then((response) => {
        setdata(response.data.taxes);
        setContries(response.data.countries);

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
        } else {
          handleErrorNetwork(`${error}`);
        }
      });
  }, []);

  const [visibleImageError, setVisibleImageError] = useState('');
  const [visible, setVisible] = useState('');

  //init input value
  // const [image, setImage] = useState('');

  const [active, setActive] = useState('1');

  //init input value
  const [name, setName] = useState(null);
  const [taxrate, setTaxrate] = useState(null);
  const [state_id, setState_id] = useState(null);
  const [countryVal, setCounrtyVal] = useState('');
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
        .delete('https://amanacart.com/api/admin/setting/tax/emptyTrash', auth)
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
            handleErrorNetwork(`${error}`);
          }
        });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();

    formData.append('name', name);
    formData.append('taxrate', taxrate);
    formData.append('state_id', state_id);
    formData.append('country_id', countryVal);
    formData.append('active', active);
    // formData.append('_method', 'PUT');

    axios
      .post(`https://amanacart.com/api/admin/setting/tax`, formData, auth)
      .then((response) => {
        console.log(response);
        handleSuccess('تمت العملية بنجاح');

        window.location.reload();

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
  console.log(countryVal);

  // console.log(countries[countryVal].states);
  return (
    <div id='dashboard-analytics'>
      <Row className='match-height mt-5'>
        <Col md='12' xs='12'>
          <Card className='m-0'>
            <CardHeader className='flex-md-row flex-column align-md-items-center align-items-start border-bottom'>
              <CardTitle tag='h4'>الضرائب</CardTitle>
              <Button className='ml-2' color='primary' onClick={() => setBasicModal(!basicModal)}>
                <Plus size={15} />
                اضافة ضريبة
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
                  حذف سلة المهملات
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
            <Col className='mb-1' lg='12' md='12' xs='12'>
              <Label for='name'>الاسم*</Label>
              <Input type='text' name='name' onChange={(e) => setName(e.target.value)} id='name' />
            </Col>
            <Col className='mb-1' lg='6' md='6' xs='12'>
              <Label for='taxrate'>معدل الضريبة*</Label>
              <Input type='number' name='taxrate' onChange={(e) => setTaxrate(e.target.value)} id='taxrate' />
            </Col>
            <Col className='mb-1' lg='6' md='6' xs='12'>
              <Label for='active'>الحالة *</Label>
              <Input type='select' name='active' id='active' onChange={(e) => setActive(e.target.value)}>
                <option>تحديد</option>
                <option value={1}>Active</option>
                <option value={0}>InActive</option>
              </Input>
            </Col>
            <Col className='mb-1' lg='6' md='6' xs='12'>
              <Label for='country_id'>البلد *</Label>
              <Input type='select' name='country_id' id='country_id' onChange={(e) => setCounrtyVal(e.target.value)}>
                {countries
                  ? Object.keys(countries || {}).map((e) => {
                      return <option value={e}>{countries[e].name}</option>;
                    })
                  : ''}
              </Input>
            </Col>
            <Col className='mb-1' lg='6' md='6' xs='12'>
              <Label for='active'>الدولة / الإقليم / المنطقة*</Label>
              <Input type='select' name='active' id='active' onChange={(e) => setState_id(e.target.value)}>
                {countries[countryVal]
                  ? Object.keys(countries[countryVal].states || {}).map((e) => {
                      return <option value={e}>{countries[countryVal].states[e]}</option>;
                    })
                  : ''}
              </Input>
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
