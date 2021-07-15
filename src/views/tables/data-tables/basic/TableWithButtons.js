/* eslint-disable */

// ** React Imports
import { Fragment, useState, forwardRef } from 'react';

// ** Add New Modal Component
import Model from './Model';
import ModelGroup from './ModelGroup';

// ** Third Party Components
import ReactPaginate from 'react-paginate';
import DataTable from 'react-data-table-component';
import { ChevronDown, Share, Printer, FileText, File, Grid, Copy, Plus } from 'react-feather';
import { Card, CardHeader, CardTitle, Button, UncontrolledButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem, Input, Label, Row, Col } from 'reactstrap';

import PickerDefault from '../../../forms/form-elements/datepicker/PickerDefault';
import '@styles/react/libs/flatpickr/flatpickr.scss';

// ** Bootstrap Checkbox Component
const BootstrapCheckbox = forwardRef(
  (
    {
      // eslint-disable-next-line
      onClick,
      ...rest
    },
    ref
  ) => (
    <div className='custom-control custom-checkbox'>
      <input type='checkbox' className='custom-control-input' ref={ref} {...rest} />
      <label className='custom-control-label' onClick={onClick} />
    </div>
  )
);

const DataTableWithButtons = (props) => {
  // ** States
  const [modal, setModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [searchValue, setSearchValue] = useState('');
  const [filteredData, setFilteredData] = useState([]);

  // ** Function to handle Modal toggle
  const handleModal = () => setModal(!modal);

  // ** Function to handle filter
  const handleFilter = (e) => {
    const value = e.target.value;
    let updatedData = [];
    setSearchValue(value);

    const status = {
      1: { title: 'Current', color: 'light-primary' },
      2: { title: 'Professional', color: 'light-success' },
      3: { title: 'Rejected', color: 'light-danger' },
      4: { title: 'Resigned', color: 'light-warning' },
      5: { title: 'Applied', color: 'light-info' },
    };

    const col = [];
    props.columns.map((column) => {
      if (column.selector) {
        col.push(column.selector);
      }
    });

    // console.log(col)

    if (value.length) {
      updatedData = props.data.filter((item) => {
        // return item.indexOf(value) > -1;

        col.map((i) => {
          console.log(item.type);
          console.log(i);
          // const startsWith  = item.i.toLowerCase().startsWith(value.toLowerCase())
        });

        // const startsWith =
        //   item.full_name.toLowerCase().startsWith(value.toLowerCase()) ||
        //   item.post.toLowerCase().startsWith(value.toLowerCase()) ||
        //   item.email.toLowerCase().startsWith(value.toLowerCase()) ||
        //   item.age.toLowerCase().startsWith(value.toLowerCase()) ||
        //   item.salary.toLowerCase().startsWith(value.toLowerCase()) ||
        //   item.start_date.toLowerCase().startsWith(value.toLowerCase()) ||
        //   status[item.status].title.toLowerCase().startsWith(value.toLowerCase())

        // console.log(startsWith)

        // props.columns.map(column => {
        //   const includes = column.name.toLowerCase().includes(value.toLowerCase())
        // })
        // const includes =
        //   item.full_name.toLowerCase().includes(value.toLowerCase()) ||
        //   item.post.toLowerCase().includes(value.toLowerCase()) ||
        //   item.email.toLowerCase().includes(value.toLowerCase()) ||
        //   item.age.toLowerCase().includes(value.toLowerCase()) ||
        //   item.salary.toLowerCase().includes(value.toLowerCase()) ||
        //   item.start_date.toLowerCase().includes(value.toLowerCase()) ||
        //   status[item.status].title.toLowerCase().includes(value.toLowerCase())

        // if (startsWith) {
        //   return startsWith
        // } else if (!startsWith && includes) {
        //   return includes
        // } else return null
      });
      if (value === '') {
        updatedData = [];
      }
      setFilteredData(updatedData);
      setSearchValue(value);
    }
  };

  // ** Function to handle Pagination
  const handlePagination = (page) => {
    setCurrentPage(page.selected);
  };

  // ** Custom Pagination
  const CustomPagination = () => (
    <ReactPaginate
      previousLabel=''
      nextLabel=''
      forcePage={currentPage}
      onPageChange={(page) => handlePagination(page)}
      pageCount={searchValue.length ? filteredData.length / 7 : props.data.length / 7 || 1}
      breakLabel='...'
      pageRangeDisplayed={2}
      marginPagesDisplayed={2}
      activeClassName='active'
      pageClassName='page-item'
      breakClassName='page-item'
      breakLinkClassName='page-link'
      nextLinkClassName='page-link'
      nextClassName='page-item next'
      previousClassName='page-item prev'
      previousLinkClassName='page-link'
      pageLinkClassName='page-link'
      breakClassName='page-item'
      breakLinkClassName='page-link'
      containerClassName='pagination react-paginate separated-pagination pagination-sm justify-content-end pr-1 mt-1'
    />
  );

  // ** Converts table to CSV
  function convertArrayOfObjectsToCSV(array) {
    let result;

    const columnDelimiter = ',';
    const lineDelimiter = '\n';
    const keys = Object.keys(props.data[0]);

    result = '';
    result += keys.join(columnDelimiter);
    result += lineDelimiter;

    array.forEach((item) => {
      let ctr = 0;
      keys.forEach((key) => {
        if (ctr > 0) result += columnDelimiter;

        result += item[key];

        ctr++;
      });
      result += lineDelimiter;
    });

    return result;
  }

  // ** Downloads CSV
  function downloadCSV(array) {
    const link = document.createElement('a');
    let csv = convertArrayOfObjectsToCSV(array);
    if (csv === null) return;

    const filename = 'export.csv';

    if (!csv.match(/^data:text\/csv/i)) {
      csv = `data:text/csv;charset=utf-8,${csv}`;
    }

    link.setAttribute('href', encodeURI(csv));
    link.setAttribute('download', filename);
    link.click();
  }

  return (
    <Fragment>
      <Card>
        {props.title ? (
          <CardHeader className='flex-md-row flex-column align-md-items-center align-items-start border-bottom'>
            <CardTitle tag='h4'>{props.title}</CardTitle>
          </CardHeader>
        ) : (
          ''
        )}
        <Row className='justify-content-end mx-0 p-1'>
          <Col className='d-flex align-items-center justify-content-end mt-1' md='3' sm='3'>
            <Input className='dataTable-filter mb-50' placeholder='اكتب ما تريد البحث عنه...' type='text' bsSize='sm' id='search-input' value={searchValue} onChange={handleFilter} />
          </Col>
          <div className='d-flex align-items-center justify-content-end mt-1'>
            <UncontrolledButtonDropdown>
              {props.btnSelectTitle ? (
                <PickerDefault />
              ) : (
                <DropdownToggle color='secondary' caret outline>
                  <Share size={15} />
                  <span className='align-middle ml-50'>استخراج</span>
                </DropdownToggle>
              )}

              <DropdownMenu right>
                <DropdownItem className='w-100'>
                  <Printer size={15} />
                  <span className='align-middle ml-50'>طباعة</span>
                </DropdownItem>
                <DropdownItem className='w-100'>
                  <Copy size={15} />
                  <span className='align-middle ml-50'>نسخ</span>
                </DropdownItem>
                <DropdownItem className='w-100' onClick={() => downloadCSV(props.data)}>
                  <FileText size={15} />
                  <span className='align-middle ml-50'>CSV</span>
                </DropdownItem>
                <DropdownItem className='w-100'>
                  <Grid size={15} />
                  <span className='align-middle ml-50'>Excel</span>
                </DropdownItem>
                <DropdownItem className='w-100'>
                  <File size={15} />
                  <span className='align-middle ml-50'>PDF</span>
                </DropdownItem>
              </DropdownMenu>
            </UncontrolledButtonDropdown>
          </div>
        </Row>
        <DataTable
          noHeader
          pagination
          selectableRows
          columns={props.columns}
          paginationPerPage={7}
          className='react-dataTable'
          sortIcon={<ChevronDown size={10} />}
          paginationDefaultPage={currentPage + 1}
          paginationComponent={CustomPagination}
          data={searchValue.length ? filteredData : props.data}
          selectableRowsComponent={BootstrapCheckbox}
          noDataComponent='لا يوجد بيانات لعرضها'
        />
      </Card>
    </Fragment>
  );
};

export default DataTableWithButtons;
