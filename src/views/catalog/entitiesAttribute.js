import React, { useState, useEffect } from 'react';
import { Plus, ChevronDown, ChevronUp, Trash2 } from 'react-feather';
import { Card, CardHeader, CardTitle, Button, Input, Label, Badge, Row, Col, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import TableWithButtons from '../tables/data-tables/basic/TableWithButtons';
import NumberInput from '@components/number-input';

// ** Table Data & Columns
import { Columns, ColumnsTrash, data, trashData } from '../tables/data-tables/attributeData';
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

const Catalog = (props) => {
  const { id } = props.location;
  //init Modal
  const [basicModal, setBasicModal] = useState(false);
  const [basicModals, setBasicModals] = useState(false);

  //init input value
  const [types, setTypes] = useState({ types: [] });
  const [name, setName] = useState('');
  const [type, setType] = useState('');
  const [order, setOrder] = useState('');

  //init alert
  const MySwal = withReactContent(Swal);

  // init headers auth
  const config = useJwt.jwtConfig;
  const auth = {
    headers: {
      Authorization: `${config.tokenType} ${config.storageTokenKeyName}`,
    },
  };

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

  //fetch data from api
  useEffect(() => {
    axios
      .get(`https://amanacart.com/api/admin/catalog/attribute/${id}/edit`, auth)
      .then((response) => {
        console.log(response.data);
        setName(response.data.name);
        setType(response.data.type);
        setOrder(response.data.order);
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
    if (type && name) {
      axios
        .post('https://amanacart.com/api/admin/catalog/attribute', { attribute_type_id: Number(type.type), name: name.name, order: order.order }, auth)
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
  const handleSubmitValue = (e) => {
    e.preventDefault();
    if (type && name) {
      axios
        .post('https://amanacart.com/api/admin/catalog/attribute', { attribute_type_id: Number(type.type), name: name.name, order: order.order }, auth)
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
  };

  return (
    <div id='dashboard-analytics'>
      <Row className='match-heightmt-5 mt-5'>
        <Col md='12' xs='12'>
          <Card className='m-0'>
            <CardHeader className='flex-md-row flex-column align-md-items-center align-items-start border-bottom'>
              <CardTitle tag='h4'>
                ATTRIBUTES : {name} | type: {type}
              </CardTitle>
              {console.log(name)}
              {console.log(type)}
              <div>
                <Button className='ml-2' color='primary' onClick={() => setBasicModals(!basicModals)}>
                  <Plus size={15} />
                  <span className='align-middle ml-50'>ADD ATTRIBUTES VALUES</span>
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
              <CardTitle tag='h4'>TRASH</CardTitle>
              <div>
                <Button className='ml-2' color='primary' onClick={() => handleTrash()}>
                  <Trash2 size={15} />
                  <span className='align-middle ml-50'>EMPTY TRASH</span>
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
            <AvForm onSubmit={handleSubmit}>
              <Row>
                <Col className='mb-1' xs='12'>
                  <AvGroup>
                    <Label for='select-basic'>ATTRIBUTE TYPE*</Label>
                    <AvInput type='select' name='type' onChange={(e) => setType({ type: e.target.value })} id='type' required>
                      <option hidden>Select</option>
                      {types.types.map((item) => {
                        return <option value={item.id}>{item.type}</option>;
                      })}
                    </AvInput>
                    <AvFeedback>Please select a valid type!</AvFeedback>
                  </AvGroup>
                </Col>
                <Col className='mb-1' lg='6' md='6' xs='12'>
                  <AvGroup>
                    <Label for='basicInput'>ATTRIBUTE NAME*</Label>
                    <AvInput type='text' name='name' onChange={(e) => setName({ name: e.target.value })} id='name' placeholder='ATTRIBUTE NAME' required />
                    <AvFeedback>Please select a valid and Unique name!</AvFeedback>
                  </AvGroup>
                </Col>
                <Col className='mb-1' lg='6' md='6' xs='12'>
                  <Label for='basicInput'>LIST ORDER*</Label>
                  <NumberInput
                    onChange={(e) => {
                      setOrder({ order: e });
                    }}
                    downIcon={<ChevronDown size={14} />}
                    upIcon={<ChevronUp size={14} />}
                    name='order'
                    id='order'
                  />
                </Col>
                <Col className='mb-1 d-flex justify-content-between' xs='12'>
                  <Button color='danger' onClick={() => setBasicModal(!basicModal)}>
                    CANCEL
                  </Button>
                  <Button color='primary'>SAVE</Button>
                </Col>
              </Row>
            </AvForm>
          </ModalBody>
        </Modal>

        <Modal isOpen={basicModals} toggle={() => setBasicModals(!basicModals)} className='modal-dialog-centered modal-lg'>
          <ModalHeader toggle={() => setBasicModals(!basicModals)}>FORM</ModalHeader>
          <ModalBody>
            <AvForm onSubmit={handleSubmitValue}>
              <Row>
                <Col className='mb-1' xs='12'>
                  <Label for='select-basic'>ATTRIBUTE*</Label>
                  <Input
                    type='select'
                    name='select'
                    id='select'
                    onChange={(e) => {
                      setType({ type: e.target.value });
                    }}
                    value={type}
                  >
                    <option>Pulp Fiction</option>
                    <option>Nightcrawler</option>
                  </Input>
                </Col>
                <Col className='mb-1' lg='6' md='6' xs='12'>
                  <Label for='basicInput'>ATTRIBUTE VALUE*</Label>
                  <Input
                    type='text'
                    id='name'
                    name='name'
                    placeholder='ATTRIBUTE VALUE'
                    onChange={(e) => {
                      setName({ name: e.target.value });
                    }}
                    value={name}
                  />
                </Col>
                <Col className='mb-1' lg='6' md='6' xs='12'>
                  <Label for='basicInput'>LIST ORDER*</Label>
                  <NumberInput
                    downIcon={<ChevronDown size={14} />}
                    upIcon={<ChevronUp size={14} />}
                    id='order'
                    name='order'
                    onChange={(e) => {
                      setOrder({ order: e });
                    }}
                    value={order}
                  />
                </Col>
                <Col className='mb-1 d-flex justify-content-between' xs='12'>
                  <Button color='danger' onClick={() => setBasicModals(!basicModals)}>
                    CANCEL
                  </Button>
                  <Button color='primary'>SAVE</Button>
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
