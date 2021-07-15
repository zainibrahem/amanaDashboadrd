// ** Custom Components
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
    title: 'Good job!',
    text: msg,
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

const handleDelete = (id) => {
  axios
    .delete(`https://amanacart.com/api/admin/catalog/product/${id}/trash`, auth)
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
    .delete(`https://amanacart.com/api/admin/catalog/product/${id}`, auth)
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
    .get(`https://amanacart.com/api/admin/catalog/product/${id}/restore`, auth)
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
    selector: 'img',
    sortable: false,
    minWidth: '150px',
    cell: (row) => {
      console.log(row.images);
      return <img src={row.images.length > 0 ? row.images[0].path : ''} className='w-25' />;
    },
  },
  {
    name: 'الاسم',
    selector: 'name',
    sortable: true,
    minWidth: '150px',
    cell: (row) => {
      return <small>{row.name}</small>;
    },
  },
  {
    name: 'GTIN',
    selector: 'gtin',
    sortable: true,
    minWidth: '150px',
    cell: (row) => {
      return (
        <div>
          <small>{row.gtin}</small>
          <Badge color='secondary'>{row.gtin_type}</Badge>
        </div>
      );
    },
  },
  // {
  //   name: 'Category',
  //   selector: 'cat',
  //   sortable: true,
  //   minWidth: '150px',
  //   cell: row => {
  //     return (
  //       <div>
  //         {row.category_list.map(item => {
  //             return (
  //               <Badge color="secondary" className="my-1" >
  //                 {item}
  //               </Badge>
  //             )
  //         }
  //             )
  //         }
  //       </div>
  //     )
  //   }
  // },
  {
    name: 'قائمة',
    selector: 'list',
    sortable: true,
    minWidth: '150px',
    cell: (row) => {
      return <Badge color='secondary'>{row.listing_count}</Badge>;
    },
  },
  {
    name: 'Added By',
    selector: 'add_by',
    sortable: false,
    minWidth: '150px',
  },
  {
    name: 'خيار',
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
                  handleDelete(row.id);
                }}
              >
                <Trash size={15} />
                <span className='align-middle ml-50'>حذف</span>
              </DropdownItem>
            </DropdownMenu>
          </UncontrolledDropdown>
          {console.log(row)}
          {/* <Link
            to={{
              pathname: `/catalog/product/edit/${row.id}`,
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

export let data;

// ** Get initial Data
axios
  .get('/api/product/initial-data')
  .then((response) => {
    data = response.data.products;
    // console.log(data)
  })
  .catch((error) => {
    console.error(error);
  });

export const ColumnsTrash = [
  {
    name: 'صورة',
    selector: 'img',
    sortable: false,
    minWidth: '150px',
    cell: (row) => {
      return <img src={row.images.length > 0 ? row.images[0].path : ''} className='w-25' />;
    },
  },
  {
    name: 'الاسم',
    selector: 'name',
    sortable: true,
    minWidth: '150px',
    cell: (row) => {
      return <small>{row.name}</small>;
    },
  },
  {
    name: 'GTIN',
    selector: 'gtin',
    sortable: true,
    minWidth: '150px',
    cell: (row) => {
      return (
        <div>
          <small>{row.gtin}</small>
          <Badge color='secondary'>{row.gtin_type}</Badge>
        </div>
      );
    },
  },
  // {
  //   name: 'Category',
  //   selector: 'cat',
  //   sortable: true,
  //   minWidth: '150px',
  //   cell: row => {
  //     return (
  //       <div>
  //         {row.category_list.map(item => {
  //             return (
  //               <Badge color="secondary" className="my-1" >
  //                 {item}
  //               </Badge>
  //             )
  //         }
  //             )
  //         }
  //       </div>
  //     )
  //   }
  // },
  {
    name: 'قائمة',
    selector: 'list',
    sortable: true,
    minWidth: '150px',
    cell: (row) => {
      return <Badge color='secondary'>{row.listing_count}</Badge>;
    },
  },
  {
    name: 'Added By',
    selector: 'add_by',
    sortable: false,
    minWidth: '150px',
  },
  {
    name: 'خيار',
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
                <span className='align-middle ml-50'>الحذف نهائيا</span>
              </DropdownItem>
            </DropdownMenu>
          </UncontrolledDropdown>
        </div>
      );
    },
  },
];

export let trashData;

axios
  .get('/api/product/initial-data')
  .then((response) => {
    trashData = response.data.trashes;
    // console.log(trashData)
  })
  .catch((error) => {
    console.error(error);
  });
