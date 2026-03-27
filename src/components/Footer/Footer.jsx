/**
 * @fileoverview Footer action module.
 * Provides the persistent floating action button used to trigger item creation.
 */
import React from 'react';
import { Button } from 'react-bootstrap';
import AddIcon from '@mui/icons-material/Add'; 
import './Footer.css';

/**
 * Bottom floating action area used to open the creation modal.
 *
 * @param {Object} props - Component props.
 * @param {function(): void} props.onOpenModal - Opens the create modal.
 * @returns {JSX.Element} Footer action button.
 */
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