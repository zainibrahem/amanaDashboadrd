// ** Custom Components
import { useContext, useState, useEffect } from 'react';

import Avatar from '@components/avatar';
import { Link } from 'react-router-dom';
// ** Third Party Components
import axios from 'axios';
import { MoreVertical, Edit, FileText, Archive, Trash } from 'react-feather';
import { Badge, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';

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
    .delete(`https://amanacart.com/api/admin/order/order/${id}/archive`, auth)
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
    .delete(`https://amanacart.com/api/admin/order/order/${id}`, auth)
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
    .get(`https://amanacart.com/api/admin/order/order/${id}/restore`, auth)
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
    name: '#الطلب',
    selector: 'order_number',
    sortable: false,
    minWidth: '250px',
    cell: (row) => {
      return <span className='number'>{row.order_number}</span>;
    },
    // cell: (row) => {
    //   return <img src={row.order_number} className='w-25' />;
    // },
  },
  {
    name: 'معرف الزبون',
    selector: 'customer_id',
    sortable: true,
    minWidth: '150px',
    cell: (row) => {
      return <span className='number'>{row.customer_id}</span>;
    },
    // cell: (row) => {
    //   return <p color='secondary'>{row.email}</p>;
    // },
  },
  {
    name: 'المجموع الاجمالي',
    selector: 'grand_total',
    sortable: true,
    minWidth: '150px',
    cell: (row) => {
      return <span className='number'>{row.grand_total}</span>;
    },

    // cell: (row) => {
    //   return <p>{row.contact_person}</p>;
    // },
  },

  {
    name: 'حالة الدفع',
    selector: 'payment_status',
    sortable: true,
    minWidth: '150px',
    cell: (row) => {
      return <Badge color='danger'>{row.payment_status}</Badge>;
    },
  },
  {
    name: ' عدد مرات الطلب',
    selector: 'item_count',
    sortable: true,
    minWidth: '150px',
    cell: (row) => {
      return (
        <Badge color='danger'>
          <span classname='number'>{row.item_count}</span>
        </Badge>
      );
    },
  },
  {
    name: ' تاريخ الطلب',
    selector: 'created_at',
    sortable: true,
    minWidth: '150px',
    cell: (row) => {
      return (
        <Badge color='danger' className='number'>
          {row.created_at}
        </Badge>
      );
    },
  },
  {
    name: 'الحالة',
    selector: 'order_status',
    sortable: true,
    minWidth: '150px',
    cell: (row) => {
      return <Badge color='danger'>{row.order_status}</Badge>;
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
    name: '#الطلب',
    selector: 'order_number',
    sortable: false,
    minWidth: '250px',
    // cell: (row) => {
    //   return <img src={row.order_number} className='w-25' />;
    // },
  },
  {
    name: 'معرف الزبون',
    selector: 'customer_id',
    sortable: true,
    minWidth: '150px',
    cell: (row) => {
      return (
        <span color='secondary' className='number'>
          {row.customer_id}
        </span>
      );
    },
  },
  {
    name: 'المجموع الاجمالي',
    selector: 'grand_total',
    sortable: true,
    minWidth: '150px',
    cell: (row) => {
      return <span>{row.grand_total}</span>;
    },
  },

  {
    name: 'حالة الدفع',
    selector: 'payment_status',
    sortable: true,
    minWidth: '150px',
    cell: (row) => {
      return <Badge color='danger'>{row.payment_status}</Badge>;
    },
  },
  {
    name: ' عدد مرات الطلب',
    selector: 'item_count',
    sortable: true,
    minWidth: '150px',
    cell: (row) => {
      return (
        <Badge color='danger' className='number'>
          {' '}
          {row.item_count}
        </Badge>
      );
    },
  },
  {
    name: ' تاريخ الطلب',
    selector: 'created_at',
    sortable: true,
    minWidth: '150px',
    cell: (row) => {
      return (
        <span color='danger' className='number'>
          {row.created_at}
        </span>
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
