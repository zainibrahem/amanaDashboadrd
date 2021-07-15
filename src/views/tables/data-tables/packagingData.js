// ** Custom Components
import { useContext, useState, useEffect } from 'react';

import Avatar from '@components/avatar';
import { Link } from 'react-router-dom';
// ** Third Party Components
import axios from 'axios';
import { MoreVertical, Edit, FileText, Archive, Trash } from 'react-feather';
import { Badge, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem, Modal, ModalHeader, ModalBody, ModalFooter, Row, Col, Label } from 'reactstrap';
import { CustomInput, FormGroup, Card, CardHeader, CardTitle, Button, Input } from 'reactstrap';

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

const handleDelete = (id) => {
  axios
    .delete(`https://amanacart.com/api/admin/shipping/packaging/${id}/trash`, auth)
    .then((response) => {
      console.log(response);
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
    .delete(`https://amanacart.com/api/admin/shipping/packaging/${id}`, auth)
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
    .get(`https://amanacart.com/api/admin/shipping/packaging/${id}/restore`, auth)
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
// ** Table Intl Column

export const Columns = [
  {
    name: 'الصورة',
    selector: 'apiImage',
    sortable: false,
    maxWidth: '10%',
    minWidth: '130px',
    cell: (row) => {
      // {`https://amanacart.com/image/${row.apiImage ? row.apiImage : ''}`}
      return <img src={row.apiImage ? row.apiImage : ''} className='w-25' />;
    },
  },

  {
    name: 'الاسم',
    selector: 'name',
    sortable: true,
    minWidth: '150px',
  },
  {
    name: 'التكلفة',
    selector: 'cost',
    sortable: true,
    maxWidth: '10%',
    minWidth: '269px',
    cell: (row) => {
      return (
        <span color='secondary' className='number'>
          {row.cost}
        </span>
      );
    },
  },
  {
    name: 'الحالة',
    selector: 'active',
    sortable: true,
    minWidth: '150px',
    cell: (row) => {
      return <p>{row.active === true ? 'yes' : 'no'}</p>;
    },
  },

  {
    name: 'الخيار',
    allowOverflow: true,
    cell: (row) => {
      //init input value

      const [name, setName] = useState(null);
      const [active, setActive] = useState('1');
      const [width, setWidth] = useState(null);

      const [height, setHeight] = useState(null);

      const [depth, setDepth] = useState(null);
      const [cost, setCost] = useState(null);
      const [image, setImage] = useState('');
      const [basicModalEdit, setBasicModalEdit] = useState(false);

      function handelGetData() {
        axios
          .get(`https://amanacart.com/api/admin/shipping/packaging/${row.id}/edit`, auth)
          .then((response) => {
            console.log(response.data);
            setName(response.data.data.name);
            setActive(response.data.data.active);
            setWidth(response.data.data.width);
            setHeight(response.data.data.height);
            setDepth(response.data.data.depth);
            setCost(response.data.data.cost);
            console.log(response.status);
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
      const handleSubmit = (e) => {
        e.preventDefault();
        // if (value.getCurrentContent().getPlainText() === '') {
        //   setVisible(true);
        // } else {
        //   setVisible(false);
        // }
        // if (image === '') {
        //   setVisibleImageError(true);
        // } else {
        //   setVisibleImageError(false);
        //   // Update the formData object
        //   // formData.append('apiImage', image.name);
        // }

        const formData = new FormData();

        formData.append('name', name);
        formData.append('cost', cost);
        formData.append('width', width);

        formData.append('active', active);
        formData.append('height', height);
        formData.append('depth', depth);

        formData.append('_method', 'PUT');
        axios
          .post(`https://amanacart.com/api/admin/shipping/packaging/${row.id}`, formData, auth)
          .then((response) => {
            console.log(response.status);
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
      return (
        <div className='d-flex'>
          <UncontrolledDropdown>
            <DropdownToggle className='pr-1' tag='span'>
              <MoreVertical size={15} />
            </DropdownToggle>
            <DropdownMenu right>
              {/* <DropdownItem tag='a' href='/' className='w-100' onClick={(e) => e.preventDefault()}>
                <FileText size={15} />
                <span className='align-middle ml-50'>Details</span>
              </DropdownItem> */}
              {/* <DropdownItem tag='a' href='/' className='w-100' onClick={(e) => e.preventDefault()}>
                <Archive size={15} />
                <span className='align-middle ml-50'>Archive</span>
              </DropdownItem> */}
              <DropdownItem
                tag='a'
                className='w-100'
                onClick={() => {
                  handleDelete(row.id);
                }}
              >
                <Trash size={15} />
                <span className='align-middle ml-50'>حذف</span>
              </DropdownItem>
            </DropdownMenu>
          </UncontrolledDropdown>
          {console.log(row)}

          <Edit
            size={15}
            onClick={() => {
              setBasicModalEdit(!basicModalEdit);
              handelGetData();
            }}
          />
          {/*model edit*/}
          <Modal isOpen={basicModalEdit} toggle={() => setBasicModalEdit(!basicModalEdit)} className='modal-dialog-centered modal-lg'>
            <ModalHeader toggle={() => setBasicModalEdit(!basicModalEdit)}>شكل</ModalHeader>
            <ModalBody>
              <Row>
                <Col className='mb-1' lg='8' md='8' xs='12'>
                  <Label for='name'>الاسم*</Label>
                  <Input type='text' name='name' onChange={(e) => setName(e.target.value)} id='name' value={name} required />
                </Col>
                <Col className='mb-1' lg='4' md='4' xs='12'>
                  <Label for='status'>الحالة *</Label>
                  <Input type='select' name='active' id='status' onChange={(e) => setActive(e.target.value)} value={active} required>
                    <option>حدد الحالة</option>
                    <option value={1}>Active</option>
                    <option value={0}>InActive</option>
                  </Input>
                </Col>
                <Col className='mb-1' lg='4' md='4' xs='12'>
                  <Label for='width'>العرض*</Label>
                  <Input type='number' name='width' onChange={(e) => setWidth(e.target.value)} value={width} id='width' required />
                </Col>
                <Col className='mb-1' lg='4' md='4' xs='12'>
                  <Label for='height'>الارتفاع*</Label>
                  <Input type='number' name='height' onChange={(e) => setHeight(e.target.value)} value={height} id='height' />
                </Col>

                <Col className='mb-1' lg='4' md='4' md='12'>
                  <Label>العمق*</Label>
                  <Input type='number' name='depth' onChange={(e) => setDepth(e.target.value)} value={depth} id='depth' />
                </Col>
                <Col className='mb-1' lg='12' md='12' md='12'>
                  <Label>التكلفة*</Label>
                  <Input type='number' name='cost' onChange={(e) => setCost(e.target.value)} value={cost} id='cost' />
                </Col>
                {/* <Col md='6' lg='12' md='12' sm='12'>
              <FormGroup>
                <Label for='image'>BRAND LOGO </Label>
                <CustomInput type='file' onChange={(e) => handleFileSelected(e)} id='image' name='image' />
              </FormGroup>
            </Col> */}

                <Col className='mb-1 d-flex justify-content-end' xs='12'>
                  <Button color='primary' type='submit' onClick={handleSubmit}>
                    حفظ
                  </Button>
                </Col>
              </Row>
            </ModalBody>
          </Modal>
        </div>
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
    name: 'الصورة',
    selector: 'apiImage',
    sortable: false,
    maxWidth: '10%',
    minWidth: '130px',
    cell: (row) => {
      // {`https://amanacart.com/image/${row.apiImage ? row.apiImage : ''}`}
      return <img src={row.apiImage ? row.apiImage : ''} className='w-25' />;
    },
  },

  {
    name: 'الاسم',
    selector: 'name',
    sortable: true,
    minWidth: '150px',
  },
  {
    name: 'التكلفة',
    selector: 'cost',
    sortable: true,
    maxWidth: '10%',
    minWidth: '269px',
    cell: (row) => {
      return (
        <span color='secondary' className='number'>
          {row.cost}
        </span>
      );
    },
  },
  {
    name: 'الحالة',
    selector: 'active',
    sortable: true,
    minWidth: '150px',
    cell: (row) => {
      return <p>{row.active === true ? 'yes' : 'no'}</p>;
    },
  },
  {
    name: 'الرد',
    allowOverflow: true,
    cell: (row) => {
      return (
        <div className='d-flex'>
          <UncontrolledDropdown>
            <DropdownToggle className='pr-1' tag='span'>
              <MoreVertical size={15} />
            </DropdownToggle>
            <DropdownMenu right>
              {/* <DropdownItem tag='a' href='/' className='w-100' onClick={(e) => e.preventDefault()}>
                <FileText size={15} />
                <span className='align-middle ml-50'>Details</span>
              </DropdownItem> */}
              <DropdownItem
                tag='a'
                className='w-100'
                onClick={() => {
                  handleRestore(row.id);
                }}
              >
                <Archive size={15} />
                <span className='align-middle ml-50'>استعادة</span>
              </DropdownItem>
              <DropdownItem
                tag='a'
                className='w-100'
                onClick={() => {
                  handleDestroy(row.id);
                }}
              >
                <Trash size={15} />
                <span className='align-middle ml-50'>حذف بشكل نهائي</span>
              </DropdownItem>
            </DropdownMenu>
          </UncontrolledDropdown>
          {/* <Link
            to={{
              pathname: `/stock/editSupplier/edit/${row.id}`,
              id: row.id,
            }}
            style={{ color: 'rgba(0,0,0,0.87)' }}
          >
            <Edit size={15} />
          </Link> */}
        </div>
      );
    },
  },
];
// export const trashData = [];

// axios
//   .get('/api/manufacturer/initial-data')
//   .then((response) => {
//     trashData = response.data.trashes;
//     // console.log(trashData)
//   })
//   .catch((error) => {
//     console.error(error);
//   });
