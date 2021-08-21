// ** Custom Components
import { useContext, useState, useEffect } from 'react';

import Avatar from '@components/avatar';
import { Link } from 'react-router-dom';
// ** Third Party Components
import axios from 'axios';
import { MoreVertical, Edit, FileText, Archive, Trash } from 'react-feather';
import { Badge, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem, Button, Modal, ModalHeader, ModalBody, ModalFooter, FormGroup, Label, Input, Row, Col } from 'reactstrap';

// ** UseJWT import to get config
import useJwt from '@src/auth/jwt/useJwt';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { Token } from 'prismjs';
import './style.css';
export const Columns = [
  {
    name: 'الموضوع',
    selector: 'subject',
    sortable: true,
    minWidth: '330px',
    cell: (row) => {
      return (
        <Link
          color='secondary'
          to={{
            pathname: `/ticket/${row.id}`,
          }}
        >
          {row.subject ? row.subject : ''}
        </Link>
      );
    },
  },
  {
    name: ' الفئة',
    selector: 'category',
    sortable: true,
    minWidth: '50px',
    cell: (row) => {
      return <Badge color='secondary'>{row.category ? row.category : ''}</Badge>;
    },
  },
  {
    name: 'priority',
    selector: 'priority',
    sortable: true,
    minWidth: '50px',
  },
  {
    name: 'Replies',
    selector: 'replies_count',
    sortable: true,
    minWidth: '50px',
    cell: (row) => {
      return (
        <Badge color='secondary' className='number'>
          {row.replies_count ? row.replies_count : ''}
        </Badge>
      );
    },
  },
  {
    name: 'اخر تحديث',
    selector: 'created_at',
    sortable: true,
    minWidth: '50px',
  },
];
