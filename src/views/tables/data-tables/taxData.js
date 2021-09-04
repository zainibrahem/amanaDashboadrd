// ** Custom Components
import { useContext, useState, useEffect } from 'react';

import Avatar from '@components/avatar';
import { Link } from 'react-router-dom';
// ** Third Party Components
import axios from 'axios';
import { MoreVertical, Edit, FileText, Archive, Trash } from 'react-feather';
import { Badge, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem, Button, Modal, ModalHeader, ModalBody, ModalFooter, FormGroup, Label, Input, Row, Col } from 'reactstrap';

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

const handleDelete = (id) => {
  axios
    .delete(`https://amanacart.com/api/admin/setting/tax/${id}/trash`, auth)
    .then((response) => {
      // console.log(response)
      handleSuccess('DELETE SUCCESS');
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

const handleDestroy = (id) => {
  console.log(id);
  axios
    .delete(`https://amanacart.com/api/admin/setting/tax/${id}`, auth)
    .then((response) => {
      handleSuccess('DESTROY SUCCESS');
      window.location.reload();
      console.log(response);
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

const handleRestore = (id) => {
  console.log(id);
  axios
    .get(`https://amanacart.com/api/admin/setting/tax/${id}/restore`, auth)
    .then((response) => {
      // console.log(response)
      handleSuccess('RESTORE SUCCESS');
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
export const Columns = [
  {
    name: 'الاسم',
    selector: 'name',
    sortable: true,
    minWidth: '150px',
  },
  {
    name: 'معدل الضريبة',
    selector: 'taxrate',
    sortable: true,
    minWidth: '250px',
    cell: (row) => {
      return (
        <Badge color='secondary' className='number'>
          {row.taxrate ? parseInt(row.taxrate).toFixed(1) : ''}
        </Badge>
      );
    },
  },
  {
    name: 'منطقة',
    selector: 'name',
    sortable: true,
    minWidth: '280px',
    cell: (row) => {
      return <p color='secondary'>{row.country.name}</p>;
    },
  },
  {
    name: 'العامة',
    selector: 'public',
    sortable: true,
    minWidth: '280px',
    cell: (row) => {
      return <p color='secondary'>{row.public ? row.public : '-'}</p>;
    },
  },
  {
    name: 'الحالة',
    selector: 'status',
    sortable: true,
    minWidth: '150px',
    cell: (row) => {
      return <p color='secondary'>{row.active === 1 ? 'active' : 'inactive'}</p>;
    },
  },

  {
    name: 'الخيار',
    allowOverflow: true,
    cell: (row) => {
      const [formModal, setFormModal] = useState(false);

      const [active, setActive] = useState('1');

      //init input value
      const [name, setName] = useState(null);
      const [taxrate, setTaxrate] = useState(null);
      const [state_id, setState_id] = useState(null);
      const [countryVal, setCounrtyVal] = useState('');
      const [countries, setContries] = useState([]);

      const hundelEditTax = (id) => {
        setFormModal(!formModal);
        axios
          .get(`https://amanacart.com/api/admin/setting/tax/${id}/edit`, auth)
          .then((response) => {
            setName(response.data.tax.name);
            setTaxrate(response.data.tax.taxrate);
            setState_id(response.data.tax.state_id);
            setCounrtyVal(response.data.tax.country_id);
            setActive(response.data.tax.active);

            setContries(response.data.countries);

            // console.log(response.data);
            // setTrashData(response.data.trashes);
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
      const handleSubmit = (e, id) => {
        e.preventDefault();

        const formData = new URLSearchParams();

        formData.append('name', name);
        formData.append('taxrate', taxrate);
        formData.append('state_id', state_id);
        formData.append('country_id', countryVal);
        formData.append('active', active);
        // formData.append('_method', 'PUT');

        axios
          .put(`https://amanacart.com/api/admin/setting/tax/${id}`, formData, auth)
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

      return (
        <>
          <div className='d-flex'>
            {console.log(row)}
            <Trash size={15} onClick={() => handleDelete(row.id)} style={{ cursor: 'pointer' }} />
            <Edit size={15} style={{ cursor: 'pointer' }} onClick={() => hundelEditTax(row.id)} />
          </div>

          <Modal isOpen={formModal} toggle={() => setFormModal(!formModal)} className='modal-dialog-top  modal-lg'>
            <ModalHeader toggle={() => setFormModal(!formModal)}>شكل</ModalHeader>
            <ModalBody>
              <Row>
                <Col lg='12' md='12' sm='12'>
                  <Label for='name'>الاسم:</Label>
                  <Input type='name' id='name' value={name} onChange={(e) => setName(e.target.value)} />
                </Col>
                <Col lg='6' md='6' sm='12'>
                  <Label for='taxrate'>معدل الضريبة:</Label>
                  <Input type='number' id='taxrate' name='taxrate' value={parseInt(taxrate).toFixed(1)} onChange={(e) => setTaxrate(e.target.value)} />
                </Col>
                <Col lg='6' md='6' sm='12'>
                  <Label for='active'>الحالة:</Label>
                  <Input type='select' id='active' name='active' value={active} onChange={(e) => setActive(e.target.value)}>
                    <option>Select</option>
                    <option value={1}>Active</option>
                    <option value={0}>Inactive</option>
                  </Input>
                </Col>
                <Col className='mb-1' lg='6' md='6' xs='12'>
                  <Label for='country_id'>البلد *</Label>
                  <Input type='select' name='country_id' id='country_id' value={countryVal} onChange={(e) => setCounrtyVal(e.target.value)}>
                    {countries
                      ? Object.keys(countries || {}).map((e) => {
                          return <option value={e}>{countries[e].name}</option>;
                        })
                      : ''}
                  </Input>
                </Col>
                <Col className='mb-1' lg='6' md='6' xs='12'>
                  <Label for='state_id'>الدولة / الإقليم / المنطقة*</Label>
                  <Input type='select' name='state_id' id='state_id' value={state_id ? state_id : ''} onChange={(e) => setState_id(e.target.value)}>
                    {countries[countryVal]
                      ? Object.keys(countries[countryVal].states || {}).map((e) => {
                          return <option value={e}>{countries[countryVal].states[e]}</option>;
                        })
                      : ''}
                  </Input>
                </Col>
              </Row>
            </ModalBody>
            <ModalFooter>
              <Button color='primary' onClick={(e) => handleSubmit(e, row.id)}>
                حفظ
              </Button>
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
    name: 'الاسم',
    selector: 'name',
    sortable: true,
    minWidth: '150px',
  },
  {
    name: 'معدل الضريبة',
    selector: 'taxrate',
    sortable: true,
    minWidth: '250px',
    cell: (row) => {
      return (
        <Badge color='secondary' className='number'>
          {row.taxrate ? parseInt(row.taxrate).toFixed(1) : ''}
        </Badge>
      );
    },
  },
  {
    name: 'منطقة',
    selector: 'name',
    sortable: true,
    minWidth: '280px',
    cell: (row) => {
      return <p color='secondary'>{row.country.name}</p>;
    },
  },
  {
    name: 'العامة',
    selector: 'public',
    sortable: true,
    minWidth: '280px',
    cell: (row) => {
      return <p color='secondary'>{row.public ? row.public : '-'}</p>;
    },
  },
  {
    name: 'الحالة',
    selector: 'status',
    sortable: true,
    minWidth: '150px',
    cell: (row) => {
      return <p color='secondary'>{row.active === 1 ? 'active' : 'inactive'}</p>;
    },
  },

  {
    name: 'الخيار',
    allowOverflow: true,
    cell: (row) => {
      const [formModal, setFormModal] = useState(false);

      return (
        <>
          <div className='d-flex'>
            {console.log(row)}
            <Trash size={15} onClick={() => handleDestroy(row.id)} style={{ cursor: 'pointer' }} />
            <Archive size={15} onClick={() => handleRestore(row.id)} style={{ cursor: 'pointer' }} />

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
          {/* <Modal isOpen={formModal} toggle={() => setFormModal(!formModal)} className='modal-dialog-centered'>
                <ModalHeader toggle={() => setFormModal(!formModal)}>Change password</ModalHeader>
                <ModalBody>
                  <FormGroup>
                    <Label for='email'>Email:</Label>
                    <Input type='email' id='email' placeholder='Email Address' />
                  </FormGroup>
                  <FormGroup>
                    <Label for='password'>Password:</Label>
                    <Input type='password' id='password' placeholder='Password' />
                  </FormGroup>
                </ModalBody>
                <ModalFooter>
                  <Button color='primary' onClick={() => setFormModal(!formModal)}>
                    Login
                  </Button>{' '}
                </ModalFooter>
              </Modal> */}
        </>
      );
    },
  },
];
