// ** Custom Components
import { useContext, useState, useEffect } from 'react';

import Avatar from '@components/avatar';
import { Link } from 'react-router-dom';
// ** Third Party Components
import axios from 'axios';
import { MoreVertical, Edit, FileText, Archive, Trash } from 'react-feather';
import { Badge, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem, Button, Modal, ModalHeader, ModalBody, ModalFooter, FormGroup, Label, Input } from 'reactstrap';

// ** UseJWT import to get config
import useJwt from '@src/auth/jwt/useJwt';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { Token } from 'prismjs';
import './style.css';

// ** Table Intl Column

export const Columns = [
  {
    selector: 'avatar',
    sortable: true,
    minWidth: '80px',
    cell: (row) => {
      return <img src={row.avatar ? row.avatar : row.image ? row.image.path : ''} style={{ width: '30px', borderRadius: '26px' }} />;
    },
  },
  {
    name: 'الاسم',
    selector: 'name',
    sortable: true,
    minWidth: '140px',
  },

  {
    name: 'عدد العناصر',
    selector: 'orders_count',
    sortable: true,
    minWidth: '140px',
    cell: (row) => {
      return <span className='number'>{row.orders_count}</span>;
    },
  },
  {
    name: 'الربح',
    selector: 'revenue',
    sortable: true,
    minWidth: '100px',
    cell: (row) => {
      return <span className='number'>{row.revenue}</span>;
    },
  },
];
