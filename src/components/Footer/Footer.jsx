import React from 'react';
import { Button } from 'react-bootstrap';
import AddIcon from '@mui/icons-material/Add'; 
import './Footer.css';

const Footer = ({ onOpenModal }) => {
  return (
    <footer className="footer fixed-bottom bg-light border-top d-flex justify-content-center p-2">
      <Button 
        variant="primary" 
        className="rounded-circle shadow d-flex align-items-center justify-content-center" 
        onClick={onOpenModal}
      >
        <AddIcon fontSize="large" />
      </Button>
    </footer>
  );
};

export default Footer;