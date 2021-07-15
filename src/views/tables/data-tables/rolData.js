// ** Custom Components
import { useContext, useState, useEffect } from 'react';

import Avatar from '@components/avatar';
import { Link } from 'react-router-dom';
// ** Third Party Components
import axios from 'axios';
import { MoreVertical, Edit, FileText, Archive, Trash } from 'react-feather';
import {
  Row,
  Col,
  Badge,
  CustomInput,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  FormGroup,
  Label,
  Input,
} from 'reactstrap';

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
    .delete(`https://amanacart.com/api/admin/setting/role/${id}/trash`, auth)
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
    .delete(`https://amanacart.com/api/admin/setting/role/${id}`, auth)
    .then((response) => {
      handleSuccess('DESTROY SUCCESS');
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

const handleRestore = (id) => {
  console.log(id);
  axios
    .get(`https://amanacart.com/api/admin/setting/role/${id}/restore`, auth)
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
    name: 'الاسم',
    selector: 'name',
    sortable: true,
    minWidth: '150px',
  },
  {
    name: ' المستخدمين',
    selector: 'users_count',
    sortable: true,
    minWidth: '250px',
    cell: (row) => {
      return (
        <Badge color='secondary' className='number'>
          {row.users_count}
        </Badge>
      );
    },
  },
  {
    name: ' الوصف',
    selector: 'description',
    sortable: true,
    minWidth: '280px',
  },
  {
    name: ' مستوى القاعدة',
    selector: 'level',
    sortable: true,
    minWidth: '280px',
    cell: (row) => {
      return (
        <Badge color='secondary' className='number'>
          {row.level}
        </Badge>
      );
    },
  },

  {
    name: 'الخيار',
    allowOverflow: true,
    cell: (row) => {
      const [basicModal, setBasicModal] = useState(false);
      const [name, setName] = useState(null);
      const [level, setLevel] = useState(null);

      const [description, setDescription] = useState(null);
      const [s_permission, setS_Permission] = useState([]);
      // const [s_permission_ids, setS_Permissio_ids] = useState([]);
      const s_permission_ids = [];

      const permissionList = [];

      const [permission, setPermission] = useState([]);
      const hundelSinglepermission = (id) => {
        setBasicModal(!basicModal);

        axios.get(`https://amanacart.com/api/admin/setting/role/${id}`, auth).then((response) => {
          setName(response.data.role.name);
          setLevel(response.data.role.level);
          setDescription(response.data.role.description);
          setS_Permission(response.data.role.permissions);
        });
      };
      useEffect(() => {
        axios.get('https://amanacart.com/api/admin/setting/role/create', auth).then((response) => {
          setPermission(response.data.permissions);
        });
      }, []);
      const hundelPermission = (e, id) => {
        if (e.target.checked) {
          permissionList.push(id);
          console.log(permissionList);
        } else {
          const index = permissionList.indexOf(id);
          if (index > -1) {
            permissionList.splice(index, 1);
          }
          console.log(permissionList);

          // let idN = permissionList.filter((e) => e !== id);
          // setPermissionList(idN);
        }
      };

      const hundelAddRole = (e, id) => {
        e.preventDefault();
        const formData = new URLSearchParams();
        permissionList.map((ele1) => {
          formData.append('permissions[]', ele1);
        });
        formData.append('name', name);
        formData.append('level', level);
        formData.append('description', description);
        // formData.append('permissions[]', permissionList);
        // formData.append('active', active);
        // formData.append('_method', 'PUT');

        axios
          .put(`https://amanacart.com/api/admin/setting/role/${id}`, formData, auth)
          .then((response) => {
            // console.log(response);
            handleSuccess('ADD SUCCESS');

            window.location.reload();

            // setBasicModal(!basicModal);
            // return response;
          })
          .catch((error) => {
            console.log(error.response);
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
      s_permission.map((e) => s_permission_ids.push(e.pivot.permission_id));

      console.log(s_permission);
      console.log(s_permission_ids);

      return (
        <>
          <div className='d-flex'>
            <UncontrolledDropdown>
              <DropdownToggle className='pr-1' tag='span'>
                <MoreVertical size={15} />
              </DropdownToggle>
              <DropdownMenu right>
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
            <Link
              // to={{
              //   pathname: `/catalog/product/edit/${row.id}`,
              //   id: row.id,
              // }}
              style={{ color: 'rgba(0,0,0,0.87)' }}
              onClick={() => {
                hundelSinglepermission(row.id);
              }}
            >
              <Edit size={15} />
            </Link>
            <Modal isOpen={basicModal} toggle={() => setBasicModal(!basicModal)} className='modal-dialog-centered modal-lg'>
              <ModalHeader toggle={() => setBasicModal(!basicModal)}>FORM</ModalHeader>
              <ModalBody>
                <Row>
                  <Col className='mb-1' lg='10' md='8' xs='12'>
                    <Label for='name'>NAME*</Label>
                    <Input type='text' name='name' id='name' onChange={(e) => setName(e.target.value)} value={name} />
                  </Col>
                  <Col className='mb-1' lg='2' md='4' xs='12'>
                    <Label for='level'>ROLE LEVEL *</Label>
                    <Input type='number' name='level' id='level' onChange={(e) => setLevel(e.target.value)} value={level} />
                    {/* <AvFeedback>the number must be</AvFeedback> */}
                  </Col>
                  <Col className='mb-1' lg='12' md='12' xs='12'>
                    <Label for='description'>DESCRIPTION *</Label>
                    <Input type='text' name='description' id='description' onChange={(e) => setDescription(e.target.value)} value={description} />
                  </Col>

                  {/* <CustomInput inline type='checkbox' id='exampleCustomCheckbox' label='Checked' defaultChecked /> */}
                  {permission &&
                    permission.length > 0 &&
                    permission.map((e) => {
                      return (
                        <>
                          <Col className='mb-1' lg='12' md='12' xs='12' key={e.permissions.module_id} className='d-flex'>
                            <Label for='value' xs={3}>
                              {e.name}*
                            </Label>
                            <div xs={9}>
                              {e.permissions.map((el) => {
                                return (
                                  <CustomInput
                                    inline
                                    type='checkbox'
                                    id={el.id}
                                    label={el.name}
                                    onChange={(e) => hundelPermission(e, el.id)}
                                    // checked={s_permission_ids.find((e) => el.id === s_permission_ids[e])}
                                    defaultChecked={s_permission.find((e) => el.id === e.pivot.permission_id)}
                                  />
                                );
                              })}
                            </div>
                          </Col>
                        </>
                      );
                    })}

                  <Col className='mb-1 d-flex justify-content-end' xs='12'>
                    <Button color='primary' type='submit' onClick={(e) => hundelAddRole(e, row.id)}>
                      SAVE
                    </Button>
                  </Col>
                </Row>
              </ModalBody>
            </Modal>
          </div>
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
    name: ' المستخدمين',
    selector: 'users_count',
    sortable: true,
    minWidth: '250px',
    cell: (row) => {
      return (
        <Badge color='secondary' className='name'>
          {row.users_count}
        </Badge>
      );
    },
  },
  {
    name: ' الوصف',
    selector: 'description',
    sortable: true,
    minWidth: '280px',
  },
  {
    name: ' مستوى القاعدة',
    selector: 'level',
    sortable: true,
    minWidth: '280px',
    cell: (row) => {
      return (
        <span color='secondary' className='name'>
          {row.level}
        </span>
      );
    },
  },

  {
    name: 'الخيار',
    allowOverflow: true,
    cell: (row) => {
      //   useEffect(() => {
      //     axios
      //       .get(`https://amanacart.com/api/admin/support/refund/${row.id}/response`, auth)
      //       .then((response) => {
      //         setData(response.data.refund);
      //         setOrder(response.data.refund.order);
      //         setPayment_status(response.data.payment_status);
      //       })
      //       .catch((error) => {
      //         // console.log(error);
      //         if (error.response) {
      //           console.log(error.response.status);
      //           if (error.response.status === 500) {
      //             handleErrorNetwork(`${error.response.status} internal server error`);
      //             console.log(error.response.status);
      //           } else if (error.response.status === 404) {
      //             handleErrorNetwork(`Select Order`);
      //           } else {
      //             handleError(error.response.data.error);
      //           }
      //         } else {
      //           handleErrorNetwork(`${error} Network Error`);
      //         }
      //       });
      //   }, []);

      return (
        <>
          <div className='d-flex'>
            <UncontrolledDropdown>
              <DropdownToggle className='pr-1' tag='span'>
                <MoreVertical size={15} />
              </DropdownToggle>
              <DropdownMenu right>
                <DropdownItem
                  tag='a'
                  className='w-100'
                  onClick={() => {
                    handleDestroy(row.id);
                  }}
                >
                  <Trash size={15} />
                  <span className='align-middle ml-50'>حذف العنصر نهائيا</span>
                </DropdownItem>
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
              </DropdownMenu>
            </UncontrolledDropdown>
          </div>
        </>
      );
    },
  },
];
