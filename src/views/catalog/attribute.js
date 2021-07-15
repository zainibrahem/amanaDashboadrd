import React, { useState, useEffect } from 'react';
import { Plus, ChevronDown, ChevronUp, Trash2 } from 'react-feather';
import { Card, CardHeader, CardTitle, Button, Input, Label, Badge, Row, Col, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import TableWithButtons from '../tables/data-tables/basic/TableWithButtons';
import NumberInput from '@components/number-input';

// ** Table Data & Columns
import { Columns, ColumnsTrash, data } from '../tables/data-tables/attributeData';
import '@styles/react/libs/charts/apex-charts.scss';

//api
import axios from 'axios';

// ** UseJWT import to get config
import useJwt from '@src/auth/jwt/useJwt';

//alert
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

//validation input value
import { AvForm, AvGroup, AvInput, AvFeedback } from 'availity-reactstrap-validation-safe';

const Catalog = () => {
  //init Modal
  const [basicModal, setBasicModal] = useState(false);
  const [basicModals, setBasicModals] = useState(false);

  //init input value
  const [types, setTypes] = useState({ types: [] });
  const [name, setName] = useState(null);
  const [type, setType] = useState(null);
  const [order, setOrder] = useState(null);

  //init alert
  const MySwal = withReactContent(Swal);

  // init headers auth
  const config = useJwt.jwtConfig;
  const auth = {
    headers: {
      Authorization: `${config.tokenType} ${localStorage.getItem('token')}`,
    },
  };

  // alert success
  const handleSuccess = (msg) => {
    return MySwal.fire({
      title: 'عمل جيد!',
      text: 'تمت العملية بنجاح',
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
  const [trashData, setTrashData] = useState([]);
  const [attData, setAttData] = useState([]);

  useEffect(() => {
    axios
      .get('https://amanacart.com/api/admin/catalog/attribute', auth)
      .then((response) => {
        setAttData(response.data.attributes);

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

  //fetch data from api
  useEffect(() => {
    axios
      .get('https://amanacart.com/api/admin/catalog/attribute/create', auth)
      .then((response) => {
        setTypes({ types: response.data.attribute_types });
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

  //handle add attribute
  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('attribute_type_id', type);
    formData.append('name', name);

    formData.append('order', order);
    if (type && name) {
      axios
        .post('https://amanacart.com/api/admin/catalog/attribute', formData, auth)
        .then((response) => {
          // console.log(response)
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
    }
  };

  //handle add attribute value
  const [attribute_id, setAttribute_id] = useState(null);
  const [att_value, setAtt_value] = useState(null);

  const handleSubmitValue = (e) => {
    e.preventDefault();
    const formData = new Form();
    formData.append('attribute_id', attribute_id);
    // formData.append('name', name);

    formData.append('value', att_value);

    if (attribute_id && att_value) {
      axios
        .post('https://amanacart.com/api/admin/catalog/attributeValue', auth, formData)
        .then((response) => {
          // console.log(response)
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
    }
  };

  //handle empty trash
  const handleTrash = () => {
    if (trashData.length > 0) {
      axios
        .delete('https://amanacart.com/api/admin/catalog/attribute/emptyTrash', auth)
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

  return (
    <div id='dashboard-analytics'>
      <Row className='match-heightmt-5 mt-5'>
        <Col md='12' xs='12'>
          <Card className='m-0'>
            <CardHeader className='flex-md-row flex-column align-md-items-center align-items-start border-bottom'>
              <CardTitle tag='h4'>السمات</CardTitle>
              <div>
                {/* onClick={() => setBasicModals(!basicModals)} */}
                <Button className='ml-2' color='primary' onClick={() => setBasicModals(!basicModals)}>
                  <Plus size={15} />
                  اضافة قيمة السمة
                </Button>
                {/* onClick={() => setBasicModal(!basicModal)} */}
                <Button className='ml-2' color='primary' onClick={() => setBasicModal(!basicModal)}>
                  <Plus size={15} />
                  اضافة سمة
                </Button>
              </div>
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
                {/* onClick={() => handleTrash()} */}
                <Button className='ml-2' color='primary' onClick={(e) => handleTrash(e)}>
                  <Trash2 size={15} />
                  حذف السلة نهائيا
                </Button>
              </div>
            </CardHeader>
          </Card>
        </Col>
        <Col>
          <TableWithButtons columns={ColumnsTrash} data={trashData} />
        </Col>

        <Modal isOpen={basicModal} toggle={() => setBasicModal(!basicModal)} className='modal-dialog-centered modal-lg'>
          <ModalHeader toggle={() => setBasicModal(!basicModal)}>FORM</ModalHeader>
          <ModalBody>
            <Row>
              <Col className='mb-1' xs='12'>
                <Label for='attribute_type_id'>نوع السمة*</Label>
                <Input type='select' name='attribute_type_id' onChange={(e) => setType(e.target.value)} id='attribute_type_idtype' required>
                  {types.types.map((item) => {
                    return <option value={item.id}>{item.type}</option>;
                  })}
                  <option>حدد</option>
                </Input>
              </Col>
              <Col className='mb-1' lg='6' md='6' xs='12'>
                <Label for='name'>اسم السمة*</Label>
                <Input type='text' name='name' onChange={(e) => setName(e.target.value)} id='name' placeholder='' required />
              </Col>
              <Col className='mb-1' lg='6' md='6' xs='12'>
                <Label for='order'>قائمة الطلب*</Label>
                <Input onChange={(e) => setOrder(e.target.value)} name='order' id='order' type='number' />
              </Col>
              <Col className='mb-1 d-flex justify-content-between' xs='12'>
                <Button color='danger' onClick={() => setBasicModal(!basicModal)}>
                  تراجع
                </Button>
                <Button color='primary' onClick={handleSubmit} type='submit'>
                  حفظ
                </Button>
              </Col>
            </Row>
          </ModalBody>
        </Modal>

        <Modal isOpen={basicModals} toggle={() => setBasicModals(!basicModals)} className='modal-dialog-centered modal-lg'>
          <ModalHeader toggle={() => setBasicModals(!basicModals)}>شكل</ModalHeader>
          <ModalBody>
            <AvForm onSubmit={handleSubmitValue}>
              <Row>
                <Col className='mb-1' lg='6' md='6' xs='12'>
                  <Label for='attribute_id'>السمة*</Label>
                  <Input
                    type='select'
                    name='attribute_id'
                    id='attribute_id'
                    onChange={(e) => {
                      setAttribute_id(e.target.value);
                    }}
                  >
                    {attData &&
                      attData.length > 0 &&
                      attData.map((item) => {
                        return <option value={item.id}>{item.name}</option>;
                      })}
                    <option>حدد</option>
                  </Input>
                </Col>
                <Col className='mb-1' lg='6' md='6' xs='12'>
                  <Label for='value'>قيمة السمة*</Label>
                  <Input
                    type='text'
                    id='value'
                    name='value'
                    placeholder=''
                    onChange={(e) => {
                      setAtt_value(e.target.value);
                    }}
                    // value={name}
                  />
                </Col>

                <Col className='mb-1 d-flex justify-content-between' xs='12'>
                  <Button color='danger' onClick={() => setBasicModals(!basicModals)}>
                    تراجع
                  </Button>
                  <Button color='primary'>حفظ</Button>
                </Col>
              </Row>
            </AvForm>
          </ModalBody>
        </Modal>
      </Row>
    </div>
  );
};

export default Catalog;
