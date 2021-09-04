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
    .delete(`https://amanacart.com/api/admin/order/cart/${id}/`, auth)
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
    .delete(`https://amanacart.com/api/admin/order/cart/${id}`, auth)
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
    .get(`https://amanacart.com/api/admin/order/cart/${id}/restore`, auth)
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
    name: 'تاريخ الانشاء',
    selector: 'data',
    sortable: false,
    minWidth: '250px',
    cell: (row) => {
      return <span className='text'>{row.created_at}</span>;
    },
  },

  {
    name: 'نوع التحويل',
    selector: 'type',
    sortable: true,
    minWidth: '150px',
    cell: (row) => {
      return <span className='text'>{row.type}</span>;
    },
  },

  {
    name: 'الوصف',
    selector: 'meta.description',
    sortable: true,
    minWidth: '150px',
    cell: (row) => {
      return <span className='text'>{row.meta.description}</span>;
    },
  },
  {
    name: 'الكمية',
    selector: 'amount',
    sortable: true,
    minWidth: '250px',
    maxWidth: '3%',
    cell: (row) => {
      return <span className='number'>{row.amount}</span>;
    },

  
  },

  {
    name: 'الحالة',
    selector: 'status',
    sortable: true,
    minWidth: '150px',
   
    cell: (row) => {
      return <span className='text'>{row.confirmed?"تم التأكيد":"قيد الانتظار"}</span>;
    },
  },
];


export const ColumnsTrash = [
  {
    name: 'تاريخ الانشاء',
    selector: 'created_at',
    sortable: false,
    minWidth: '250px',
    cell: (row) => {
      return <span className='number'>{row.created_at}</span>;
    },
  },

  {
    name: 'عدد العناصر',
    selector: 'item_count',
    sortable: true,
    minWidth: '150px',
    cell: (row) => {
      return <span className='number'>{row.item_count}</span>;
    },
  },

  {
    name: ' معرف الزبون',
    selector: 'customer_id',
    sortable: true,
    minWidth: '150px',
    cell: (row) => {
      return <span className='number'>{row.customer_id}</span>;
    },
  },
  {
    name: 'المجموع الاجمالي',
    selector: 'grand_total',
    sortable: true,
    minWidth: '250px',
    maxWidth: '3%',
    cell: (row) => {
      return <span className='number'>{row.grand_total}</span>;
    },

    // cell: (row) => {
    //   return <p>{row.contact_person}</p>;
    // },
  },

  {
    name: ' مجموع العربة',
    selector: 'total_cart',
    sortable: true,
    minWidth: '150px',
    // cell: (row) => {
    //   return <Badge color='secondary'>{row.active}</Badge>;
    // },
    cell: (row) => {
      return <span className='number'>{row.total_cart}</span>;
    },
  },

  {
    name: 'الخيار',
    allowOverflow: true,
    cell: (row) => {
      return (
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
                <span className='align-middle ml-50'>حذف العنصر نهائيا</span>
              </DropdownItem>
            </DropdownMenu>
          </UncontrolledDropdown>
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
