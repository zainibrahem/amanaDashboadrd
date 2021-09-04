import { useContext, useState, useEffect } from 'react';
import { List, Plus, MapPin, ChevronDown, ChevronUp, Trash2, Edit, XCircle } from 'react-feather';
import {
  CustomInput,
  FormGroup,
  Card,
  CardHeader,
  CardTitle,
  CardBody,
  CardText,
  Button,
  Input,
  Label,
  Badge,
  Row,
  Col,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ButtonDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  UncontrolledButtonDropdown,
  ListGroup,
  ListGroupItem,
} from 'reactstrap';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

import TableWithButtons from '../tables/data-tables/basic/TableWithButtons';
import NumberInput from '@components/number-input';
import { EditorState } from 'draft-js';
import CardAction from '@components/card-actions';

// ** Table Data & Columns
import { Columns, ColumnsTrash } from '../tables/data-tables/supplierData';
import '@styles/react/libs/charts/apex-charts.scss';

//api
import axios from 'axios';

// ** UseJWT import to get config
import useJwt from '@src/auth/jwt/useJwt';

//alert
import { AvForm, AvGroup, AvInput, AvFeedback } from 'availity-reactstrap-validation-safe';

import './style.css';
const Catalog = (props) => {
  const [basicModal, setBasicModal] = useState(false);
  const [basicModalPrice, setBasicModalPrice] = useState(false);
  const [basicModalEdit, setBasicModalEdit] = useState(false);
  const [basicModalEditZone, setBasicModalEditZone] = useState(false);
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

  const [dataSelect, setdataSelect] = useState([]);

  const [visibleImageError, setVisibleImageError] = useState('');
  const [value, setValue] = useState(EditorState.createEmpty());

  const [visible, setVisible] = useState('');

  //init input value
  const [image, setImage] = useState('');

  const [name, setName] = useState(null);
  const [shippingCarrier, setShippingCarrier] = useState('1');
  const [delivery_takes, setDelivery_takes] = useState(null);

  const [based_on, setBased_on] = useState(null);

  const [minimum, setMinimum] = useState(null);
  const [maximum, setMaximum] = useState(null);
  // const [free_shipping, setFree_shipping] = useState(false);
  const [rate, setRate] = useState(null);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  //init input value add shpping zone
  const [nameZone, setNameZone] = useState(null);

  const [active, setActive] = useState(1);
  const [country_ids, setCountry_ids] = useState([]);
  const [country_id, setCountry_id] = useState([]);

  const [tax_id, setTax_id] = useState('');

  const [id_zone, setId_zone] = useState(0);
  const [id_c, setId_c] = useState(0);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };
  const [data, setdata] = useState([]);
  const [countrys, setCountrys] = useState([]);
  const [taxs, setTaxs] = useState([]);

  useEffect(() => {
    axios
      .get('https://amanacart.com/api/admin/shipping/shippingZone', auth)
      .then((response) => {
        // console.log(response);
        setdata(response.data.shipping_zones);
        setCountrys(response.data.countries);
        console.log(countrys);
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
  useEffect(() => {
    axios
      .get('https://amanacart.com/api/admin/shipping/shippingZone/create', auth)
      .then((response) => {
        // console.log(response);
        setTaxs(response.data.taxes);
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
  console.log(taxs);

  // console.log(countrys);
  const handleSubmitAddZone = () => {
    // e.preventDefault();
    if (value.getCurrentContent().getPlainText() === '') {
      setVisible(true);
    } else {
      setVisible(false);
    }

    const formData = new FormData();

    formData.append('name', nameZone);
    formData.append('tax_id', tax_id);
    formData.append('delivery_takes', delivery_takes);
    country_ids.map((el) => {
      formData.append('country_ids[]', el);
    });
    formData.append('active', active);
    // formData.append('rest_of_the_world', 1);

    // formData.append('_method', 'PUT');
    axios
      .post(`https://amanacart.com/api/admin/shipping/shippingZone`, formData, auth)
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

  //handle empty trash shipping/shippingZone
  const handleDeleteShopingZone = (id) => {
    axios
      .delete(`https://amanacart.com/api/admin/shipping/shippingZone/${id}`, auth)
      .then((response) => {
        console.log(response);
        handleSuccess('DELETED SHOPING ZONE SUCCESS');
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
  const [countriesN, setCountriesN] = useState([]);
  const handleDeleteShopingRate = (id) => {
    axios
      .delete(`https://amanacart.com/api/admin/shipping/shippingRate/${id}`, auth)
      .then((response) => {
        console.log(response);

        handleSuccess('DELETED SHOPING ZONE SUCCESS');
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
  console.log(countriesN);
  const handleDeleteCounry = (id_zon, id_country) => {
    console.log(id_zon);
    console.log(id_country);
    // setId_zone(id_zon);
    // setId_c(id_country);

    axios
      .delete(`https://amanacart.com/api/admin/shipping/shippingZone/${id_zon}/removeCountry/${id_country}`, auth)
      .then((response) => {
        console.log(response);
        // setCountry_id(response.data.country_ids);
        // setCountriesN(response.data.country_ids);
        // console.log(countriesN);
        handleSuccess('DELETED SHOPING ZONE SUCCESS');
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
  console.log(country_id);

  const handleFileSelected = (e) => {
    setImage(e.target.files[0]);
  };
  const handleFileSelectedCover = (e) => {
    setCover_image(e.target.files[0]);
  };

  const setBased_on_price = () => {
    setBased_on('price');
  };
  const setBased_on_weight = () => {
    setBased_on('weight');
  };
  const hundelBasedOn = (id) => {
    console.log(based_on);
    setId_zone(id);
  };
  const hundelEditZone = (id) => {
    setId_zone(id);
    setBasicModalEditZone(!basicModalEditZone);
    axios
      .get(`https://amanacart.com/api/admin/shipping/shippingZone/${id}/edit`, auth)
      .then((response) => {
        console.log(response.data);
        //init input value add shpping zone
        setNameZone(response.data.name);
        setActive(response.data.active);
        setCountry_ids(response.data.country_ids);
        setTax_id(response.data.tax_id);
        // handleSuccess('DELETED SHOPING ZONE SUCCESS');
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
  const handleUpdate = () => {
    // e.preventDefault();
    if (value.getCurrentContent().getPlainText() === '') {
      setVisible(true);
    } else {
      setVisible(false);
    }

    const formData = new FormData();

    formData.append('name', nameZone);
    formData.append('tax_id', tax_id);
    country_ids.map((el) => {
      formData.append('country_ids[]', el);
    });
    formData.append('active', active);
    // formData.append('rest_of_the_world', 1);

    formData.append('_method', 'PUT');
    axios
      .post(`https://amanacart.com/api/admin/shipping/shippingZone/${id_zone}`, formData, auth)
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
            handleErrorNetwork(`${error.response.status} page not found`);
          } else {
            handleError(error.response.data.error);
          }
        } else {
          handleErrorNetwork(`${error}`);
        }
      });
  };
  const [name_rate, setName_rate] = useState(null);
  const [shippingCarrier_rate, setShippingCarrier_rate] = useState('1');
  const [delivery_takes_rate, setDelivery_takes_rate] = useState(null);

  const [based_on_rate, setBased_on_rate] = useState(null);

  const [minimum_rate, setMinimum_rate] = useState(null);
  const [maximum_rate, setMaximum_rate] = useState(null);
  // const [free_shipping, setFree_shipping] = useState(false);
  const [rate_rate, setRate_rate] = useState(null);
  const [shipping_zone_id_rate, setShipping_zone_id_rate] = useState(null);

  const hundelEditRate = (zond_id, rate_id) => {
    setBasicModalEdit(!basicModalEdit);
    axios
      .get(`https://amanacart.com/api/admin/shipping/shippingRate/${rate_id}/edit`, auth)
      .then((response) => {
        console.log(response.data);
        //init input value add shpping zone
        setName_rate(response.data.name);
        setShippingCarrier_rate(response.data.shipping_zone_id);
        setDelivery_takes_rate(response.data.delivery_takes);
        setMinimum_rate(response.data.minimum);
        setMaximum_rate(response.data.maximum);
        setRate_rate(response.data.rate);
        setBased_on_rate(response.data.based_on);
        setShipping_zone_id_rate(response.data.shipping_zone_id);
        // handleSuccess('DELETED SHOPING ZONE SUCCESS');
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

  const handleRateEdit = (id_rate) => {
    // console.log(e.id);
    // e.preventDefault();
    // setId_zone(e.id);
    console.log(id_zone);

    if (value.getCurrentContent().getPlainText() === '') {
      setVisible(true);
    } else {
      setVisible(false);
    }

    const formData = new FormData();

    formData.append('name', name_rate);
    formData.append('shipping_zone_id', shipping_zone_id_rate);
    formData.append('delivery_takes', delivery_takes_rate);

    // formData.append('based_on', based_on_r);
    formData.append('minimum', minimum_rate);
    formData.append('maximum', maximum_rate);
    // formData.append('free_shipping', 0);
    formData.append('rate', rate_rate);
    formData.append('carrier_id', shippingCarrier_rate);

    formData.append('_method', 'PUT');
    axios
      .post(`https://amanacart.com/api/admin/shipping/shippingRate/${id_rate}`, formData, auth)
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
            handleErrorNetwork(`${error.response.status} page not found`);
          } else {
            handleError(error.response.data.error);
          }
        } else {
          handleErrorNetwork(`${error}`);
        }
      });

    // console.log(formData['shipping_zone_id']);
  };

  return (
    <div id='dashboard-analytics'>
      <Row className='match-height'>
        <Col lg='12' md='12' xs='12'>
          <Card className='m-0' style={{ padding: '0.5rem 0.5rem 0' }}>
            <CardHeader className='flex-md-row flex-column align-md-items-center align-items-start border-bottom'>
              <CardTitle tag='h4'>مناطق الشحن</CardTitle>
              <Button className='ml-2' color='primary' onClick={() => setBasicModal(!basicModal)}>
                <Plus size={15} />
                اضافة منطقة شحن جديدة
              </Button>
            </CardHeader>
          </Card>
        </Col>
        {data.map((e, key) => {
          console.log(e.id);

          // const id = e.id;
          const handleSubmit = () => {
            // console.log(e.id);
            // e.preventDefault();
            // setId_zone(e.id);
            console.log(id_zone);

            if (value.getCurrentContent().getPlainText() === '') {
              setVisible(true);
            } else {
              setVisible(false);
            }

            const formData = new FormData();

            formData.append('name', name);
            formData.append('shipping_zone_id', id_zone);
            formData.append('delivery_takes', delivery_takes);

            formData.append('based_on', based_on);
            formData.append('minimum', minimum);
            formData.append('maximum', maximum);
            formData.append('free_shipping', 0);
            formData.append('rate', rate);
            formData.append('carrier_id', shippingCarrier);

            // formData.append('_method', 'PUT');
            axios
              .post(`https://amanacart.com/api/admin/shipping/shippingRate`, formData, auth)
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
                    handleErrorNetwork(`${error.response.status} page not found`);
                  } else {
                    handleError(error.response.data.error);
                  }
                } else {
                  handleErrorNetwork(`${error}`);
                }
              });

            // console.log(formData['shipping_zone_id']);
          };

          return (
            <>
              <Col lg='12' md='12' sm='12' key={e.id}>
                <Card className='m-0' style={{ padding: '0.5rem' }}>
                  <Row>
                    <Col lg='12' md='12' xs='12'>
                      <CardHeader className='flex-md-row flex-column align-md-items-center align-items-start border-bottom'>
                        <Col lg='4' md='12' sm='12' xs='12' style={{ padding: '0px' }}>
                          <CardTitle tag='h4'>
                            <MapPin size={20} />{' '}
                            <span className='' style={{ fontSize: '1.8rem', top: '4px', position: 'relative' }}>
                              {e.name}
                            </span>
                            {e.rest_of_the_world ? (
                              <>
                                <span className='' style={{ fontSize: '0.8rem', marginLeft: '10px' }}>
                                  كافة انحاء العالم
                                </span>
                                <span className='' style={{ fontSize: '0.8rem', marginLeft: '22px' }}>
                                  ضريبة
                                </span>
                              </>
                            ) : (
                              <span className='' style={{ fontSize: '0.8rem', marginLeft: '22px' }}>
                                ضريبة
                              </span>
                            )}
                          </CardTitle>
                        </Col>
                        <Col lg='8' md='12' sm='12' xs='12' style={{ textAlign: 'end', padding: '0px' }}>
                          <UncontrolledButtonDropdown className='ml-1 mb-2'>
                            <DropdownToggle color='primary' caret>
                              <Plus size={15} />
                              اضافة شحن جديد
                            </DropdownToggle>
                            <DropdownMenu onClick={() => hundelBasedOn(e.id)}>
                              <DropdownItem
                                value='based on price'
                                tag='a'
                                onClick={() => {
                                  setBased_on_price();
                                  setBasicModalPrice(!basicModalPrice);
                                }}
                              >
                                اعتمادا على السعر
                              </DropdownItem>
                              <DropdownItem
                                tag='a'
                                onClick={() => {
                                  setBased_on_weight();
                                  setBasicModalPrice(!basicModalPrice);
                                }}
                              >
                                اعتمادا على الوزن
                              </DropdownItem>
                            </DropdownMenu>
                          </UncontrolledButtonDropdown>

                          <Button className='ml-1 mb-2' color='primary' onClick={() => hundelEditZone(e.id)}>
                            <Plus size={15} />
                            اضافة بلد
                          </Button>
                          <Button className='ml-1 mb-2' color='primary' onClick={() => hundelEditZone(e.id)}>
                            <Edit size={15} /> تعديل
                          </Button>
                          <Button className='ml-1 mb-2' color='danger' onClick={() => handleDeleteShopingZone(e.id)}>
                            <Trash2 size={15} /> حذف
                          </Button>
                        </Col>
                      </CardHeader>

                      <Modal isOpen={basicModalPrice} toggle={() => setBasicModalPrice(!basicModalPrice)} className='modal-dialog-centered modal-lg'>
                        <ModalHeader toggle={() => setBasicModalPrice(!basicModalPrice)}>شكل</ModalHeader>
                        <ModalBody>
                          <Row>
                            <Col className='mb-1' lg='12' md='12' sm='12' xs='12'>
                              <Label for='name'>الاسم*</Label>
                              <Input type='text' name='name' onChange={(e) => setName(e.target.value)} id='name' required />
                            </Col>
                            <Col className='mb-1' lg='6' md='6' xs='12'>
                              <Label for='status'>ناقلة الشحن*</Label>
                              <Input type='select' placeholder='select' name='shippingCarrier' id='status' onChange={(e) => setShippingCarrier(e.target.value)} required>
                                <option>Select</option>
                                <option value={1}>USP</option>
                                <option value={2}>USPS</option>
                              </Input>
                            </Col>
                            <Col className='mb-1' lg='6' md='6' xs='12'>
                              <Label for='delivery_takes'>التسليم ياخذ*</Label>
                              <Input type='text' name='delivery_takes' onChange={(e) => setDelivery_takes(e.target.value)} id='delivery_takes' placeholder='1 -2 days' required />
                            </Col>

                            {based_on === 'price' ? (
                              <>
                                <Col className='mb-1' lg='6' md='6' md='12'>
                                  <Label>الحد الأدنى لسعر الطلب*</Label>
                                  <Input type='number' name='minimum' onChange={(e) => setMinimum(e.target.value)} id='minimum' />
                                </Col>
                                <Col className='mb-1' lg='6' md='6' md='12'>
                                  <Label>الحد الاعلى لسعر الطلب*</Label>
                                  <Input type='number' name='maximum' onChange={(e) => setMaximum(e.target.value)} placeholder='And up' id='maximum' />
                                </Col>
                              </>
                            ) : (
                              <>
                                <Col className='mb-1' lg='6' md='6' md='12'>
                                  <Label>الحد الادنى لوزن الطلب*</Label>
                                  <Input type='number' name='minimum' onChange={(e) => setMinimum(e.target.value)} id='minimum' placeholder='30 g' />
                                </Col>
                                <Col className='mb-1' lg='6' md='6' md='12'>
                                  <Label>الحد الاعلى لوزن الطلب*</Label>
                                  <Input type='number' name='maximum' onChange={(e) => setMaximum(e.target.value)} placeholder='1000 g' id='maximum' />
                                </Col>
                              </>
                            )}
                            <Col className='mb-1' lg='6' md='6' md='12'>
                              <Label>المعدل*</Label>
                              <Input type='number' name='rate' onChange={(e) => setRate(e.target.value)} id='rate' />
                            </Col>

                            <Col className='mb-1 d-flex justify-content-end' xs='12'>
                              <Button onClick={handleSubmit} color='primary' type='submit'>
                                حفظ
                              </Button>
                            </Col>
                          </Row>
                        </ModalBody>
                      </Modal>

                      {/* *add new zone */}
                      <Modal isOpen={basicModal} toggle={() => setBasicModal(!basicModal)} className='modal-dialog-centered modal-lg'>
                        <ModalHeader toggle={() => setBasicModal(!basicModal)}>FORM</ModalHeader>
                        <ModalBody>
                          <Row>
                            <Col className='mb-1' lg='8' md='6' sm='12' xs='12'>
                              <Label for='name'>الاسم*</Label>
                              <Input type='text' name='name' onChange={(e) => setNameZone(e.target.value)} id='name' required />
                            </Col>
                            <Col className='mb-1' lg='4' md='6' sm='12' xs='12'>
                              <Label for='status'>الحالة *</Label>
                              <Input type='select' placeholder='select' name='active' id='status' onChange={(e) => setActive(e.target.value)} required>
                                <option>تحديد</option>
                                <option value={0}>Active</option>
                                <option value={1}>InActive</option>
                              </Input>
                            </Col>
                            <Col className='mb-1' lg='8' md='8' xs='12'>
                              <Label for='country_ids'>البلد*</Label>
                              <Input type='select' placeholder='select' name='country_ids[]' id='status' required onChange={(e) => setCountry_ids((oldArray) => [...oldArray, e.target.value])}>
                                <option>Select</option>
                                {countrys
                                  ? Object.keys(countrys || {}).map((e) => {
                                      return <option value={e}>{countrys[e].name}</option>;
                                    })
                                  : ''}
                              </Input>
                            </Col>
                            <Col className='mb-1' lg='4' md='4' xs='12'>
                              <Label for='tax_id'>الضرائب*</Label>
                              <Input type='select' placeholder='select' name='tax_id' id='status' onChange={(e) => setTax_id(e.target.value)} required>
                                {taxs
                                  ? Object.keys(taxs).map((e) => {
                                      return <option value={e}>{taxs[e]}</option>;
                                    })
                                  : ''}
                              </Input>
                            </Col>

                            <Col className='mb-1 d-flex justify-content-end' xs='12'>
                              <Button onClick={handleSubmitAddZone} color='primary' type='submit'>
                                حفظ
                              </Button>
                            </Col>
                          </Row>
                        </ModalBody>
                      </Modal>

                      {/* *add Edit zone */}
                      <Modal isOpen={basicModalEditZone} toggle={() => setBasicModalEditZone(!basicModalEditZone)} className='modal-dialog-centered modal-lg'>
                        <ModalHeader toggle={() => setBasicModalEditZone(!basicModalEditZone)}>FORM</ModalHeader>
                        <ModalBody>
                          <Row>
                            <Col className='mb-1' lg='8' md='6' sm='12' xs='12'>
                              <Label for='name'>الاسم*</Label>
                              <Input type='text' name='name' value={nameZone} onChange={(e) => setNameZone(e.target.value)} id='nameZone' required />
                            </Col>
                            <Col className='mb-1' lg='4' md='6' sm='12' xs='12'>
                              <Label for='status'>الحالة *</Label>
                              <Input type='select' placeholder='select' name='active' id='statusZone' onChange={(e) => setActive(e.target.value)} value={active} required>
                                <option>Select</option>
                                <option value={0}>Active</option>
                                <option value={1}>InActive</option>
                              </Input>
                            </Col>
                            <Col className='mb-1' lg='8' md='8' xs='12'>
                              <Label for='country_ids'>البلد*</Label>
                              <Input
                                type='select'
                                // value={country_ids[0] ? country_ids[0] : null}
                                placeholder='select'
                                name='country_ids[]'
                                id='counret'
                                required
                                onChange={(e) => setCountry_ids((oldArray) => (oldArray.length > 0 ? [...oldArray, e.target.value] : [e.target.value]))}
                              >
                                <option>Select</option>
                                {countrys
                                  ? Object.keys(countrys || {}).map((e) => {
                                      return <option value={e}>{countrys[e].name}</option>;
                                    })
                                  : ''}
                              </Input>
                            </Col>
                            <Col className='mb-1' lg='4' md='4' xs='12'>
                              <Label for='tax_id'>الضرائب*</Label>
                              <Input type='select' placeholder='select' value={tax_id} name='tax_id' id='tax_id_zone' onChange={(e) => setTax_id(e.target.value)} required>
                                {taxs
                                  ? Object.keys(taxs).map((e) => {
                                      return <option value={e}>{taxs[e]}</option>;
                                    })
                                  : ''}
                              </Input>
                            </Col>

                            <Col className='mb-1 d-flex justify-content-end' xs='12'>
                              <Button color='primary' onClick={handleUpdate} type='submit'>
                                حفظ
                              </Button>
                            </Col>
                          </Row>
                        </ModalBody>
                      </Modal>
                    </Col>

                    <Col lg='6' md='6' sm='12' className='p'>
                      <CardAction title='البلدان' actions='collapse'>
                        <div style={{ color: '#000', border: '1px solid #ddd', borderRadius: '10px' }}>
                          {Object.keys(e.country_ids).length ? (
                            Object.keys(e.country_ids).map((el, key) => {
                              return (
                                <>
                                  <CardBody style={{ borderBottom: '1px solid #d8d4d4', padding: '1rem' }}>
                                    <CardText className='mb-0' style={{ display: 'flex', justifyContent: 'space-between' }}>
                                      <p className='mb-0'>
                                        {/* {e.country_ids[el]} */}
                                        <span style={{ marginRight: '20px', fontWeight: '500', fontSize: '12pt' }}>{countrys[e.country_ids[el]] ? countrys[e.country_ids[el]].name : ''} </span>{' '}
                                      </p>
                                      {/* onClick={() => handleDeleteCounry(e.id, el)} */}
                                      <XCircle size={15} style={{ cursor: 'pointer' }} onClick={() => handleDeleteCounry(e.id, e.country_ids[el])} />
                                    </CardText>

                                    {countrys[e.country_ids[el]] && Object.keys(countrys[e.country_ids[el]].states).length > 0 ? (
                                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <p className='mb-0'>
                                          <span>{countrys[e.country_ids[el]] && countrys[e.country_ids[el]].states ? Object.keys(countrys[e.country_ids[el]].states).length : ''}</span> من{' '}
                                          <span>{countrys[e.country_ids[el]] && countrys[e.country_ids[el]].states ? Object.keys(countrys[e.country_ids[el]].states).length : ''} ولاية </span>
                                        </p>
                                        {/* <div style={{ cursor: 'pointer' }}>
                                          <Edit size={12} style={{ marginTop: '-2px' }} />
                                          <span style={{ fontSize: '9pt' }}>تعديل</span>
                                        </div> */}
                                      </div>
                                    ) : (
                                      ''
                                    )}
                                  </CardBody>
                                </>
                              );
                            })
                          ) : (
                            <>
                              <p className='mb-0' style={{ padding: '1rem' }}>
                                تتضمن هذه المنطقة أي دول ومناطق داخل منطقة أعمال السوق التي لم يتم تحديدها بالفعل في مناطق الشحن الأخرى الخاصة بك.{' '}
                              </p>
                            </>
                          )}
                        </div>
                      </CardAction>
                    </Col>

                    <Col lg='6' md='6' sm='12' className='p'>
                      <CardAction title='اسعار الشحن' actions='collapse'>
                        <div style={{ color: '#000', border: '1px solid #ddd', borderRadius: '10px' }}>
                          {e.rates.length > 0 ? (
                            e.rates.map((el, key) => {
                              return (
                                <>
                                  <CardBody style={{ borderBottom: '1px solid #d8d4d4', padding: '1rem' }}>
                                    <CardText className='mb-0' style={{ display: 'flex', justifyContent: 'space-between' }}>
                                      <p className='mb-0'>
                                        <span style={{ marginRight: '20px', fontWeight: '500', fontSize: '12pt', fontFamily: 'sans-serif' }}>{el.name} </span>{' '}
                                        <span style={{ fontSize: '9pt', fontFamily: 'sans-serif' }}>
                                          By TNT Express AND TAKES {el.delivery_takes !== null ? el.delivery_takes : '(no limited days)'}
                                        </span>
                                      </p>
                                      <XCircle size={15} onClick={() => handleDeleteShopingRate(el.id)} style={{ cursor: 'pointer' }} />
                                    </CardText>
                                    <CardText className='mb-0' style={{ display: 'flex', justifyContent: 'space-between' }}>
                                      {el.based_on === 'weight' ? (
                                        <>
                                          <p style={{ fontSize: '8pt' }} className='mb-0'>
                                            {parseInt(el.minimum).toFixed(0)} gm - {parseInt(el.maximum).toFixed(0)} gm{' '}
                                            <Badge style={{ marginLeft: '10px', borderRadius: '10px' }}>
                                              <span style={{ color: '#fff' }}>${parseInt(el.rate).toFixed(1)}</span>
                                            </Badge>
                                          </p>
                                          <div
                                            style={{ cursor: 'pointer' }}
                                            onClick={() => {
                                              setBased_on_weight();
                                              hundelEditRate(e.id, el.id);
                                            }}
                                          >
                                            <Edit size={12} style={{ marginTop: '-2px' }} />
                                            <span style={{ fontSize: '9pt' }}>تعديل</span>
                                          </div>
                                        </>
                                      ) : (
                                        <>
                                          <p style={{ fontSize: '8pt' }} className='mb-0'>
                                            ر.ع{parseInt(el.minimum).toFixed(0)} الى {'ر.ع'}
                                            {el.maximum ? parseInt(el.maximum).toFixed(0) : 'up'}{' '}
                                            <Badge style={{ marginLeft: '10px', borderRadius: '10px' }}>
                                              <span style={{ color: '#fff' }}>ر.ع{el.rate ? parseInt(el.rate).toFixed(1) : '0'}</span>
                                            </Badge>{' '}
                                          </p>
                                          <div
                                            style={{ cursor: 'pointer' }}
                                            onClick={() => {
                                              setBased_on_price();
                                              hundelEditRate(e.id, el.id);
                                            }}
                                          >
                                            <Edit size={12} style={{ marginTop: '-2px' }} />
                                            <span style={{ fontSize: '9pt' }}>تعديل</span>
                                          </div>
                                        </>
                                      )}
                                    </CardText>
                                  </CardBody>
                                  {/**edit rate */}
                                  <Modal isOpen={basicModalEdit} toggle={() => setBasicModalEdit(!basicModalEdit)} className='modal-dialog-centered modal-lg'>
                                    <ModalHeader toggle={() => setBasicModalEdit(!basicModalEdit)}>شكل</ModalHeader>
                                    <ModalBody>
                                      <Row>
                                        <Col className='mb-1' lg='12' md='12' sm='12' xs='12'>
                                          <Label for='name'>الاسم*</Label>
                                          <Input type='text' name='name' onChange={(e) => setName_rate(e.target.value)} value={name_rate} id='name' required />
                                        </Col>
                                        <Col className='mb-1' lg='6' md='6' xs='12'>
                                          <Label for='status'>ناقلة الشحن*</Label>
                                          <Input
                                            type='select'
                                            placeholder='select'
                                            name='shippingCarrier'
                                            id='status'
                                            onChange={(e) => setShippingCarrier_rate(e.target.value)}
                                            value={shippingCarrier_rate}
                                            required
                                          >
                                            <option>Select</option>
                                            <option value={1}>USP</option>
                                            <option value={2}>USPS</option>
                                          </Input>
                                        </Col>
                                        <Col className='mb-1' lg='6' md='6' xs='12'>
                                          <Label for='delivery_takes'>التسليم ياخذ*</Label>
                                          <Input
                                            type='text'
                                            name='delivery_takes'
                                            onChange={(e) => setDelivery_takes(e.target.value)}
                                            value={delivery_takes_rate}
                                            id='delivery_takes'
                                            placeholder='1 -2 days'
                                            required
                                          />
                                        </Col>

                                        {based_on === 'price' ? (
                                          <>
                                            <Col className='mb-1' lg='6' md='6' md='12'>
                                              <Label>الحد الأدنى لسعر الطلب*</Label>
                                              <Input type='number' name='minimum' onChange={(e) => setMinimum_rate(e.target.value)} value={parseInt(minimum_rate).toFixed(0)} id='minimum' />
                                            </Col>
                                            <Col className='mb-1' lg='6' md='6' md='12'>
                                              <Label>الحد الاعلى لسعر الطلب*</Label>
                                              <Input
                                                type='number'
                                                name='maximum'
                                                onChange={(e) => setMaximum_rate(e.target.value)}
                                                value={parseInt(maximum_rate).toFixed(0)}
                                                placeholder='And up'
                                                id='maximum'
                                              />
                                            </Col>
                                          </>
                                        ) : (
                                          <>
                                            <Col className='mb-1' lg='6' md='6' md='12'>
                                              <Label>الحد الادنى لوزن الطلب*</Label>
                                              <Input
                                                type='number'
                                                name='minimum'
                                                onChange={(e) => setMinimum_rate(e.target.value)}
                                                value={parseInt(minimum_rate).toFixed(0)}
                                                id='minimum'
                                                placeholder='30 g'
                                              />
                                            </Col>
                                            <Col className='mb-1' lg='6' md='6' md='12'>
                                              <Label>الحد الاعلى لوزن الطلب*</Label>
                                              <Input
                                                type='number'
                                                name='maximum'
                                                onChange={(e) => setMaximum_rate(e.target.value)}
                                                value={parseInt(maximum_rate).toFixed(0)}
                                                placeholder='1000 g'
                                                id='maximum'
                                              />
                                            </Col>
                                          </>
                                        )}
                                        <Col className='mb-1' lg='6' md='6' md='12'>
                                          <Label>المعدل*</Label>
                                          <Input type='number' name='rate' onChange={(e) => setRate_rate(e.target.value)} value={parseInt(rate_rate).toFixed(0)} id='rate' />
                                        </Col>

                                        <Col className='mb-1 d-flex justify-content-end' xs='12'>
                                          <Button onClick={() => handleRateEdit(el.id)} color='primary' type='submit'>
                                            حفظ
                                          </Button>
                                        </Col>
                                      </Row>
                                    </ModalBody>
                                  </Modal>
                                </>
                              );
                            })
                          ) : (
                            <>
                              <p className='mb-0' style={{ padding: '1rem', fontFamily: 'sans-serif' }}>
                                تتضمن هذه المنطقة أي دول ومناطق داخل منطقة أعمال السوق التي لم يتم تحديدها بالفعل في مناطق الشحن الأخرى الخاصة بك.{' '}
                              </p>
                            </>
                          )}
                        </div>
                      </CardAction>
                    </Col>
                  </Row>
                </Card>
              </Col>
            </>
          );
        })}
      </Row>
      {/**based on price */}
    </div>
  );
};

export default Catalog;
