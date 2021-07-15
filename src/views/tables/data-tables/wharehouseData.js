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

// const handleError = (msg) => {
//   return MySwal.fire({
//     title: 'Error!',
//     text: msg,
//     icon: 'error',
//     customClass: {
//       confirmButton: 'btn btn-primary',
//     },
//     buttonsStyling: false,
//   });
// };
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
    .delete(`https://amanacart.com/api/admin/stock/warehouse/${id}/trash`, auth)
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
    .delete(`https://amanacart.com/api/admin/stock/warehouse/${id}`, auth)
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
    .get(`https://amanacart.com/api/admin/stock/warehouse/${id}/restore`, auth)
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
    selector: 'image',
    sortable: false,
    minWidth: '250px',
    maxWidth: '10%',
    minWidth: '160px',
    cell: (row) => {
      return <img src={`https://amanacart.com/image/${row.image ? row.image.path : ''}`} className='w-25' />;
    },
  },

  {
    name: 'الاسم',
    selector: 'name',
    sortable: true,
    maxWidth: '10%',
    minWidth: '237px',
  },

  {
    name: 'البريد الالكتروني',
    selector: 'email',
    sortable: true,
    maxWidth: '10%',
    minWidth: '229px', // cell: (row) => {
    //   return <p color='secondary'>{row.email}</p>;
    // },
  },
  {
    name: 'المسؤول',
    selector: 'incharge',
    sortable: true,
    maxWidth: '10%',
    minWidth: '127px',
    cell: (row) => {
      return <p color='secondary'>{row.incharge === 10 ? 'dasdas' : row.incharge === 3 ? 'Suzanne Farrell' : row.incharge === '12' ? 'wadawd' : ''}</p>;
    },
  },

  {
    name: 'الحالة',
    selector: 'active',
    sortable: true,
    maxWidth: '10%',
    minWidth: '167px',
    cell: (row) => {
      return <p>{row.active === 1 ? 'Actice' : 'Inactive'}</p>;
    },
  },

  {
    name: 'الخيار',
    allowOverflow: true,
    maxWidth: '6%',
    minWidth: '100px',

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
              pathname: `/stock/editWarehouse/edit/${row.id}`,
              id: row.id,
            }}
            style={{ color: '#454545' }}
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
              pathname: `/stock/editWarehouse/edit/${row.id}`,
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
          {/* <Link
            to={{
              pathname: `/stock/editWarehouse/edit/${row.id}`,
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
    selector: 'image',
    sortable: false,
    minWidth: '250px',
    maxWidth: '10%',
    minWidth: '160px',
    cell: (row) => {
      return <img src={`https://amanacart.com/image/${row.image ? row.image.path : ''}`} className='w-25' />;
    },
  },

  {
    name: 'الاسم',
    selector: 'name',
    sortable: true,
    maxWidth: '10%',
    minWidth: '237px',
  },

  {
    name: 'البريد الالكتروني',
    selector: 'email',
    sortable: true,
    maxWidth: '10%',
    minWidth: '229px', // cell: (row) => {
    //   return <p color='secondary'>{row.email}</p>;
    // },
  },
  {
    name: 'المسؤول',
    selector: 'incharge',
    sortable: true,
    maxWidth: '10%',
    minWidth: '127px',
  },

  {
    name: 'الحالة',
    selector: 'active',
    sortable: true,
    maxWidth: '10%',
    minWidth: '167px',
    cell: (row) => {
      return <p>{row.active === 1 ? 'Actice' : 'Inactive'}</p>;
    },
  },

  {
    name: 'الخيار',
    allowOverflow: true,
    maxWidth: '6%',
    minWidth: '100px',

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
                <Archive
                  size={15}
                  onClick={() => {
                    handleRestore(row.id);
                  }}
                />
                <span className='align-middle ml-50'>استعادة</span>
              </DropdownItem>
              <DropdownItem
                tag='a'
                className='w-100'
                onClick={() => {
                  handleDelete(row.id);
                }}
              >
                <Trash
                  size={15}
                  // onClick={() => {
                  //   handleDelete(row.id);
                  // }}
                />
                <span className='align-middle ml-50'>حذف العنصر نهائيا</span>
              </DropdownItem>
            </DropdownMenu>
          </UncontrolledDropdown>
          {/* <Trash
            size={15}
            onClick={() => {
              handleDelete(row.id);
            }}
          />
          <Archive
                  size={15}
                  onClick={() => {
                    handleRestore(row.id);
                  }}
                /> */}
          {console.log(row)}

          {/* <Archive
            id='archive'
            size={15}
            onClick={() => {
              handleRestore(row.id);
            }}
            style={{ cursor: 'pointer', marginRight: '5px' }}
          />
          <UncontrolledTooltip placement='top' target='archive'>
            Archive
          </UncontrolledTooltip>

          <Trash
            id='trash'
            size={15}
            onClick={() => {
              handleDestroy(row.id);
            }}
            style={{ cursor: 'pointer', color: 'blue' }}
          />
          <UncontrolledTooltip placement='top' target='trash'>
            Delete
          </UncontrolledTooltip> */}
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
