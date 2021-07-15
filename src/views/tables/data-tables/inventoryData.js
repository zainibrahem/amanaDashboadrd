// ** Custom Components
import { useContext, useState, useEffect } from 'react';

import Avatar from '@components/avatar';
import { Link } from 'react-router-dom';
// ** Third Party Components
import axios from 'axios';
import { MoreVertical, Edit, FileText, Archive, Trash } from 'react-feather';
import { Badge, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem, UncontrolledTooltip } from 'reactstrap';

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

const hundeErrorText = (errMsg) => {
  console.log(Object.keys(errMsg).length);
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

const handleDelete = (id) => {
  axios
    .delete(`https://amanacart.com/api/admin/stock/inventory/${id}/trash`, auth)
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
    .delete(`https://amanacart.com/api/admin/stock/inventory/${id}`, auth)
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
    .get(`https://amanacart.com/api/admin/stock/inventory/${id}/restore`, auth)
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
    name: 'صورة',
    selector: 'image',
    sortable: false,
    minWidth: '250px',
    maxWidth: '10%',
    minWidth: '124px',
    cell: (row) => {
      return <img src={`https://amanacart.com/image/${row.image ? row.image.path : ''}`} className='w-25' />;
    },
  },

  {
    name: 'SKU',
    selector: 'sku',
    sortable: true,
    minWidth: '110px',
  },

  {
    name: 'العنوان',
    selector: 'title',
    sortable: true,
    minWidth: '150px',
  },
  {
    name: 'الشرط',
    selector: 'condition',
    sortable: true,
    maxWidth: '7%',
    minWidth: '92px',
  },
  {
    name: 'السعر(غير شامل للضريبة)',
    selector: 'sale_price',
    sortable: true,
    minWidth: '250px',
    cell: (row) => {
      return (
        <Badge color='secondary' className='number'>
          {row.sale_price ? parseInt(row.sale_price).toFixed(0) : ''}
        </Badge>
      );
    },
  },

  {
    name: 'الكمية',
    selector: 'stock_quantity',
    sortable: true,
    minWidth: '150px',
    cell: (row) => {
      return <p className='number'>{row.stock_quantity ? parseInt(row.stock_quantity).toFixed(0) : ''}</p>;
    },
  },

  {
    name: 'خيار',
    minWidth: '100px',

    allowOverflow: true,
    cell: (row) => {
      return (
        <div className='d-flex'>
          <UncontrolledDropdown>
            <DropdownToggle className='pr-1' tag='span'>
              <MoreVertical size={15} />
            </DropdownToggle>
            <DropdownMenu right>
              {/* <DropdownItem tag='a' className='w-100' onClick={(e) => e.preventDefault()}>
                <FileText size={15} />
                <span className='align-middle ml-50'>Details</span>
              </DropdownItem> */}
              {/* <DropdownItem tag='a' className='w-100' onClick={(e) => e.preventDefault()}>
                <Link
                  to={{
                    pathname: `/stock/editInventorie/edit/${row.id}`,
                    id: row.id,
                  }}
                >
                  <Edit id='edit' size={13} style={{ color: 'blue' }} />
                  <span className='align-middle ml-50'>Edit</span>
                </Link>
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
          <Link
            to={{
              pathname: `/stock/editInventorie/edit/${row.id}`,
              id: row.id,
            }}
            style={{ color: '#989898' }}
          >
            <Edit id='edit' size={15} />
          </Link>

          {console.log(row)}
          {/* <FileText id='display' size={15} href='/' className='w-100' onClick={(e) => e.preventDefault()} style={{ color: 'blue' }} style={{ cursor: 'pointer' }} />
          <UncontrolledTooltip placement='top' target='display'>
            Display
          </UncontrolledTooltip>
          <Link
            to={{
              pathname: `/stock/editInventorie/edit/${row.id}`,
              id: row.id,
            }}
          >
            <Edit id='edit' size={13} style={{ color: 'blue' }} />
            <UncontrolledTooltip placement='top' target='edit'>
              Edit
            </UncontrolledTooltip>
          </Link>
          <Trash
            id='trash'
            size={15}
            className='w-100'
            onClick={() => {
              handleDelete(row.id);
            }}
            style={{ cursor: 'pointer', color: 'blue' }}
          />
          <UncontrolledTooltip placement='top' target='trash'>
            Trash
          </UncontrolledTooltip> */}
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
    name: 'صورة',
    selector: 'image',
    sortable: false,
    minWidth: '250px',
    maxWidth: '10%',
    minWidth: '124px',
    cell: (row) => {
      return <img src={`https://amanacart.com/image/${row.image ? row.image.path : ''}`} className='w-25' />;
    },
  },

  {
    name: 'SKU',
    selector: 'sku',
    sortable: true,
    minWidth: '110px',
  },

  {
    name: 'العنوان',
    selector: 'title',
    sortable: true,
    minWidth: '150px',
    cell: (row) => {
      return <p color='secondary'>{row.title}</p>;
    },
  },
  {
    name: 'الشرط',
    selector: 'condition',
    sortable: true,
    maxWidth: '7%',
    minWidth: '92px',
    cell: (row) => {
      return <p>{row.condition}</p>;
    },
  },
  {
    name: 'السعر(غير شامل للضريبة)',
    selector: 'sale_price',
    sortable: true,
    minWidth: '250px',
    cell: (row) => {
      return (
        <Badge color='secondary' className='number'>
          {row.sale_price ? parseInt(row.sale_price).toFixed(0) : ''}
        </Badge>
      );
    },
  },

  {
    name: 'الكمية',
    selector: 'stock_quantity',
    sortable: true,
    minWidth: '150px',
    cell: (row) => {
      return <p className='number'>{row.stock_quantity ? parseInt(row.stock_quantity).toFixed(0) : ''}</p>;
    },
  },

  {
    name: 'خيار',
    minWidth: '100px',

    allowOverflow: true,
    cell: (row) => {
      return (
        <div className='d-flex' style={{ width: '100%' }}>
          {/* <UncontrolledDropdown>
            <DropdownToggle className='pr-1' tag='span'>
              <MoreVertical size={15} />
            </DropdownToggle>
            <DropdownItem tag='a' href='/' className='w-100' onClick={(e) => e.preventDefault()}>
              <FileText size={15} />
              <span className='align-middle ml-50'>Details</span>
            </DropdownItem>
            <DropdownItem tag='a' href='/' className='w-100' onClick={(e) => e.preventDefault()}>
              <Archive size={15} />
              <span className='align-middle ml-50'>Archive</span>
            </DropdownItem>
            <DropdownItem
              tag='a'
              className='w-100'
              onClick={() => {
                handleDelete(row.id);
              }}
            >
              <span className='align-middle ml-50'>Delete</span>
            </DropdownItem>
          </UncontrolledDropdown> */}

          {/* <Archive size={15} href='/' className='w-100' onClick={(e) => e.preventDefault()} /> */}

          <Archive
            id='archive'
            size={15}
            onClick={() => {
              handleRestore(row.id);
            }}
            style={{ cursor: 'pointer', marginRight: '5px' }}
          />
          <UncontrolledTooltip placement='top' target='archive'>
            استعادة
          </UncontrolledTooltip>

          <Trash
            id='trash'
            size={15}
            onClick={() => {
              handleDestroy(row.id);
            }}
            style={{ cursor: 'pointer' }}
          />
          <UncontrolledTooltip placement='top' target='trash'>
            حذف نهائيا
          </UncontrolledTooltip>
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
