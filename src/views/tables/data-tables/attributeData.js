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
    .delete(`https://amanacart.com/api/admin/catalog/attribute/${id}/trash`, auth)
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
    .delete(`https://amanacart.com/api/admin/catalog/attribute/${id}`, auth)
    .then((response) => {
      // console.log(response)
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
    .get(`https://amanacart.com/api/admin/catalog/attribute/${id}/restore`, auth)
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
    name: 'طلب',
    selector: 'order',
    sortable: true,
    minWidth: '250px',
    cell: (row) => {
      return <span className='number'>{row.order}</span>;
    },
  },
  {
    name: 'الاسم',
    selector: 'name',
    sortable: true,
    minWidth: '150px',
  },
  {
    name: 'نوع',
    selector: 'type',
    sortable: true,
    minWidth: '150px',
  },
  {
    name: 'الكيانات',
    selector: 'values',
    sortable: true,
    minWidth: '150px',
    cell: (row) => {
      return <Badge color='secondary'>{row.values}</Badge>;
    },
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
              <DropdownItem className='w-100' onClick={(e) => e.preventDefault()}>
                <Link
                  to={{
                    pathname: `/catalog/attribute/entities/${row.id}`,
                    id: row.id,
                  }}
                  style={{ color: 'rgba(0,0,0,0.87)' }}
                >
                  <FileText size={15} />
                  <span className='align-middle ml-50'>الكيانات</span>
                </Link>
              </DropdownItem>

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
              pathname: `/catalog/attribute/edit/${row.id}`,
              id: row.id,
            }}
            style={{ color: 'rgba(0,0,0,0.87)' }}
          >
            <Edit size={15} />
          </Link>
          {console.log(row)}
        </div>
      );
    },
  },
];

export const ColumnsTrash = [
  {
    name: 'طلب',
    selector: 'order',
    sortable: true,
    minWidth: '250px',
    cell: (row) => {
      return <span className='number'>{row.order}</span>;
    },
  },
  {
    name: 'الاسم',
    selector: 'name',
    sortable: true,
    minWidth: '150px',
  },
  {
    name: 'نوع',
    selector: 'type',
    sortable: true,
    minWidth: '150px',
  },
  {
    name: 'الكيانات',
    selector: 'entity',
    sortable: true,
    minWidth: '150px',
    cell: (row) => {
      return <Badge color='secondary'>{row.entity}</Badge>;
    },
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

export let data;

// ** Get initial Data
axios.get('/api/attribute/initial-data').then((response) => {
  data = response.data.attributes;
});

export let trashData = [];

axios
  .get('https://amanacart.com/api/admin/catalog/attribute')
  .then((response) => {
    trashData = response.data.trashes;
  })
  .catch((error) => {
    console.log(error);
  });
