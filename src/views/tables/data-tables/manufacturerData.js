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
    .delete(`https://amanacart.com/api/admin/catalog/manufacturer/${id}/trash`, auth)
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
    .delete(`https://amanacart.com/api/admin/catalog/manufacturer/${id}`, auth)
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
    .get(`https://amanacart.com/api/admin/catalog/manufacturer/${id}/restore`, auth)
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
    minWidth: '150px',
    maxWidth: '3%',

    cell: (row) => {
      return <img src={row.image} className='w-25' />;
    },
  },
  // {
  //   name: 'cover_image',
  //   selector: 'cover_image',
  //   sortable: false,
  //   minWidth: '150px',
  //   cell: (row) => {
  //     return <img src={row.cover_image} className='w-25' />;
  //   },
  // },
  // {
  //   name: 'url',
  //   selector: 'url',
  //   sortable: true,
  //   minWidth: '450px',
  //   maxWidth: '5%',
  // },
  {
    name: 'الاسم',
    selector: 'name',
    sortable: true,
    minWidth: '150px',
  },
  // {
  //   name: 'slug',
  //   selector: 'slug',
  //   sortable: true,
  //   minWidth: '150px',
  // },

  {
    name: 'البلد',
    selector: 'origin',
    sortable: true,
    minWidth: '120px',
    maxWidth: '3%',
  },
  // {
  //   name: 'listing_count',
  //   selector: 'listing_count',
  //   sortable: true,
  //   minWidth: '150px',
  //   cell: (row) => {
  //     return <Badge color='secondary'>{row.listing_count}</Badge>;
  //   },
  // },
  // {
  //   name: 'available_from',
  //   selector: 'available_from',
  //   sortable: true,
  //   minWidth: '150px',
  //   cell: (row) => {
  //     return <Badge color='secondary'>{row.available_from}</Badge>;
  //   },
  // },

  {
    name: 'رقم الهاتف',
    selector: 'phone',
    sortable: true,
    minWidth: '150px',
    cell: (row) => {
      return (
        <p color='secondary' className='number'>
          {row.phone}
        </p>
      );
    },
  },
  {
    name: 'البريد الالكتروني',
    selector: 'email',
    sortable: true,
    minWidth: '250px',
    maxWidth: '5%',

    cell: (row) => {
      return <p color='secondary'>{row.email}</p>;
    },
  },

  {
    name: 'المنتجات',
    selector: 'products_count',
    sortable: true,
    minWidth: '50px',
    maxWidth: '3%',

    cell: (row) => {
      return (
        <Badge color='secondary' className='number'>
          {row.products_count}
        </Badge>
      );
    },
  },

  {
    name: '',
    minWidth: '90px',
    maxWidth: '3%',

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
              </DropdownItem>
              <DropdownItem tag='a' href='/' className='w-100' onClick={(e) => e.preventDefault()}>
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
          <Link
            to={{
              pathname: `/catalog/manufacturer/edit/${row.id}`,
              id: row.id,
              id: row.id,
            }}
            style={{ color: 'rgba(0,0,0,0.87)' }}
          >
            <Edit size={15} />
          </Link>
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
    minWidth: '150px',
    maxWidth: '3%',

    cell: (row) => {
      return <img src={row.image} className='w-25' />;
    },
  },
  // {
  //   name: 'cover_image',
  //   selector: 'cover_image',
  //   sortable: false,
  //   minWidth: '150px',
  //   cell: (row) => {
  //     return <img src={row.cover_image} className='w-25' />;
  //   },
  // },
  // {
  //   name: 'url',
  //   selector: 'url',
  //   sortable: true,
  //   minWidth: '450px',
  //   maxWidth: '5%',
  // },
  {
    name: 'الاسم',
    selector: 'name',
    sortable: true,
    minWidth: '150px',
  },
  // {
  //   name: 'slug',
  //   selector: 'slug',
  //   sortable: true,
  //   minWidth: '150px',
  // },

  {
    name: 'البلد',
    selector: 'origin',
    sortable: true,
    minWidth: '120px',
    maxWidth: '3%',
  },
  // {
  //   name: 'listing_count',
  //   selector: 'listing_count',
  //   sortable: true,
  //   minWidth: '150px',
  //   cell: (row) => {
  //     return <Badge color='secondary'>{row.listing_count}</Badge>;
  //   },
  // },
  // {
  //   name: 'available_from',
  //   selector: 'available_from',
  //   sortable: true,
  //   minWidth: '150px',
  //   cell: (row) => {
  //     return <Badge color='secondary'>{row.available_from}</Badge>;
  //   },
  // },

  {
    name: 'رقم الهاتف',
    selector: 'phone',
    sortable: true,
    minWidth: '150px',
    cell: (row) => {
      return (
        <p color='secondary' className='number'>
          {row.phone}
        </p>
      );
    },
  },
  {
    name: 'البريد الالكتروني',
    selector: 'email',
    sortable: true,
    minWidth: '250px',
    maxWidth: '5%',

    cell: (row) => {
      return <p color='secondary'>{row.email}</p>;
    },
  },

  {
    name: 'المنتجات',
    selector: 'products_count',
    sortable: true,
    minWidth: '50px',
    maxWidth: '3%',

    cell: (row) => {
      return (
        <Badge color='secondary' className='number'>
          {row.products_count}
        </Badge>
      );
    },
  },
  {
    name: '',
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
                <span className='align-middle ml-50'>حذف نهائيا</span>
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
