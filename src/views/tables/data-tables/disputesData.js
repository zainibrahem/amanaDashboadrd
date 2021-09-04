// ** Custom Components
import { useContext, useState, useEffect } from 'react';

import Avatar from '@components/avatar';
import { Link } from 'react-router-dom';
// ** Third Party Components
import axios from 'axios';
import { MoreVertical, Edit, FileText, Archive, Trash, CornerUpLeft } from 'react-feather';
import { Badge, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem, Button, Modal, ModalHeader, ModalBody, ModalFooter, FormGroup, Label, Input } from 'reactstrap';

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
// ** Table Intl Column

export const Columns = [
  {
    name: 'الاسم',
    selector: 'name',
    sortable: true,
    minWidth: '150px',
    cell: (row) => {
      return <p color='secondary'>{row.customer.name ? row.customer.name : ''}</p>;
    },
  },

  {
    name: 'النوع',
    selector: 'dispute_type_id',
    sortable: true,
    minWidth: '250px',
    cell: (row) => {
      return (
        <p color='secondary'>
          {row.dispute_type_id === 1 ? (
            <Badge>Did not receive goods</Badge>
          ) : row.dispute_type_id === 2 ? (
            <Badge>Counterfeit goods</Badge>
          ) : row.dispute_type_id === 3 ? (
            <Badge>Quantity shortage</Badge>
          ) : row.dispute_type_id === 4 ? (
            <Badge>Damaged goods</Badge>
          ) : row.dispute_type_id === 5 ? (
            <Badge>Quality not good</Badge>
          ) : row.dispute_type_id === 6 ? (
            <Badge>Product not as described</Badge>
          ) : row.dispute_type_id === 7 ? (
            <Badge>Problems with the accessories</Badge>
          ) : row.dispute_type_id === 8 ? (
            <Badge>Shipping method</Badge>
          ) : row.dispute_type_id === 9 ? (
            <Badge>Customs problem</Badge>
          ) : (
            <Badge>Shipping address not correct</Badge>
          )}
        </p>
      );
    },
  },
  {
    name: 'استرداد طلب',
    selector: 'refund_amount',
    sortable: true,
    minWidth: '250px',
    cell: (row) => {
      return (
        <p color='secondary' className='number'>
          ${row.refund_amount}
        </p>
      );
    },
  },
  {
    name: 'عدد الاجابات',
    selector: 'replies_count',
    sortable: true,
    minWidth: '150px',
    cell: (row) => {
      return (
        <Badge color='secondary' className='number'>
          {row.replies_count}
        </Badge>
      );
    },
  },
  {
    name: 'اخر تحديث',
    selector: 'updated_at',
    sortable: true,
    minWidth: '280px',
    cell: (row) => {
      return <span className='number'>{row.updated_at}</span>;
    },
  },
  {
    name: 'الخيار',
    allowOverflow: true,
    cell: (row) => {
      const [formModal, setFormModal] = useState(false);
      const [reply, setReply] = useState(null);
      const formData = new FormData();
      formData.append('reply', reply);

      const hundelResponse = (e) => {
        e.preventDefault();

        axios
          .post(`https://amanacart.com/api/admin/support/dispute/${row.id}/storeResponse`, formData, auth)
          .then((response) => {
            console.log(response);
            handleSuccess('تمت العملية بنجاح');
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
        <>
          <div className='d-flex'>
            <CornerUpLeft size={15} onClick={() => setFormModal(!formModal)} style={{ cursor: 'pointer' }} />
            <Link
              to={{
                pathname: `/supportDisk/disputes/${row.id}`,
                id: row.id,
              }}
            >
              <FileText size={15} />
              {/* <UncontrolledTooltip placement='top' target='details'>
                
              </UncontrolledTooltip> */}
            </Link>
          </div>
          <Modal isOpen={formModal} toggle={() => setFormModal(!formModal)} className='modal-dialog-centered'>
            <ModalHeader toggle={() => setFormModal(!formModal)}>Reply</ModalHeader>
            <ModalBody>
              <FormGroup>
                <Label for='reply'>ارسال رد:</Label>
                <Input type='text' id='reply' name='reply' placeholder='Enter Reply' onChange={(e) => setReply(e.target.value)} />
              </FormGroup>
            </ModalBody>
            <ModalFooter>
              <Button type='submit' color='primary' onClick={hundelResponse}>
                ارسال رد
              </Button>{' '}
            </ModalFooter>
          </Modal>
        </>
      );
      console.log(row);
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
    cell: (row) => {
      return <p color='secondary'>{row.customer.name ? row.customer.name : ''}</p>;
    },
  },

  {
    name: 'النوع',
    selector: 'dispute_type_id',
    sortable: true,
    minWidth: '250px',
    cell: (row) => {
      return (
        <p color='secondary'>
          {row.dispute_type_id === 1 ? (
            <Badge>Did not receive goods</Badge>
          ) : row.dispute_type_id === 2 ? (
            <Badge>Counterfeit goods</Badge>
          ) : row.dispute_type_id === 3 ? (
            <Badge>Quantity shortage</Badge>
          ) : row.dispute_type_id === 4 ? (
            <Badge>Damaged goods</Badge>
          ) : row.dispute_type_id === 5 ? (
            <Badge>Quality not good</Badge>
          ) : row.dispute_type_id === 6 ? (
            <Badge>Product not as described</Badge>
          ) : row.dispute_type_id === 7 ? (
            <Badge>Problems with the accessories</Badge>
          ) : row.dispute_type_id === 8 ? (
            <Badge>Shipping method</Badge>
          ) : row.dispute_type_id === 9 ? (
            <Badge>Customs problem</Badge>
          ) : (
            <Badge>Shipping address not correct</Badge>
          )}
        </p>
      );
    },
  },
  {
    name: 'استرداد طلب',
    selector: 'refund_amount',
    sortable: true,
    minWidth: '250px',
    cell: (row) => {
      return <p color='secondary'>${row.refund_amount}</p>;
    },
  },
  {
    name: 'عدد الاجابات',
    selector: 'replies_count',
    sortable: true,
    minWidth: '150px',
    cell: (row) => {
      return <Badge color='secondary'>{row.replies_count}</Badge>;
    },
  },
  {
    name: 'اخر تحديث',
    selector: 'updated_at',
    sortable: true,
    minWidth: '280px',
  },
  {
    name: 'الخيار',
    allowOverflow: true,
    cell: (row) => {
      const [formModal, setFormModal] = useState(false);
      const [reply, setReply] = useState(null);
      const formData = new FormData();
      formData.append('reply', reply);

      const hundelResponse = (e) => {
        e.preventDefault();

        axios
          .post(`https://amanacart.com/api/admin/support/dispute/${row.id}/storeResponse`, formData, auth)
          .then((response) => {
            console.log(response);
            handleSuccess('تمت العملية بنجاح');
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
        <>
          <div className='d-flex'>
            <CornerUpLeft size={15} onClick={() => setFormModal(!formModal)} style={{ cursor: 'pointer' }} />
            <Link
              to={{
                pathname: `/supportDisk/disputes/${row.id}`,
                id: row.id,
              }}
            >
              <FileText size={15} />
              {/* <UncontrolledTooltip placement='top' target='details'>
                
              </UncontrolledTooltip> */}
            </Link>
          </div>
          <Modal isOpen={formModal} toggle={() => setFormModal(!formModal)} className='modal-dialog-centered'>
            <ModalHeader toggle={() => setFormModal(!formModal)}>Reply</ModalHeader>
            <ModalBody>
              <FormGroup>
                <Label for='reply'>ارسال رد:</Label>
                <Input type='text' id='reply' name='reply' placeholder='Enter Reply' onChange={(e) => setReply(e.target.value)} />
              </FormGroup>
            </ModalBody>
            <ModalFooter>
              <Button type='submit' color='primary' onClick={hundelResponse}>
                ارسال رد
              </Button>{' '}
            </ModalFooter>
          </Modal>
        </>
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
