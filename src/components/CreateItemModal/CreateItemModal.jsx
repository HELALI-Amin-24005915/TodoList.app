import React, { useState, useContext } from 'react';
import { Modal, Tabs, Tab, Button, Form } from 'react-bootstrap';
import { TodoContext } from '../../contexts/TodoContext';
import { ETATS } from '../../utils/constants';

const CreateItemModal = ({ show, onHide }) => {
  const { addTask, addFolder } = useContext(TodoContext);
  const [activeTab, setActiveTab] = useState('task');
  // task form state
  const [taskTitle, setTaskTitle] = useState('');
  // state for folder form
  const [folderTitle, setFolderTitle] = useState('');
  const [folderColor, setFolderColor] = useState('bluesky'); 
  // handle form submissions for both tasks and folders
  const handleTaskSubmit = (e) => {
    e.preventDefault();
    if (taskTitle.length >= 5) {
      addTask({
        title: taskTitle,
        description: "",
        date_creation: new Date().toISOString().split('T')[0],
        date_echeance: "", 
        etat: ETATS.NOUVEAU,
        equipiers: []
      });
      setTaskTitle(''); 
      onHide();
    } else {
      alert("Le titre de la tâche doit faire au moins 5 caractères.");
    }
  };

  const handleFolderSubmit = (e) => {
    e.preventDefault();
    if (folderTitle.length >= 3) {
      addFolder({
        title: folderTitle,
        description: "",
        color: folderColor,
        icon: "",
        type: "project" 
      });
      setFolderTitle('');
      setFolderColor('bluesky');
      onHide(); 
    } else {
      alert("Le nom du dossier doit faire au moins 3 caractères.");
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Créer un nouvel élément</Modal.Title>
      </Modal.Header>
      
      <Modal.Body>
        <Tabs 
          id="create-item-tabs" 
          activeKey={activeTab} 
          onSelect={(k) => setActiveTab(k)} 
          className="mb-3"
        >
          {/* TAB 1: TASK */}
          <Tab eventKey="task" title="Tâche">
            <Form onSubmit={handleTaskSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Titre de la tâche (min 5 caractères)</Form.Label>
                <Form.Control 
                  type="text" 
                  placeholder="Entrer le titre de la tâche" 
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  required
                  minLength={5}
                />
              </Form.Group>
              <div className="d-flex justify-content-end">
                <Button variant="success" type="submit">Ajouter la tâche</Button>
              </div>
            </Form>
          </Tab>

          <Tab eventKey="folder" title="Dossier">
            <Form onSubmit={handleFolderSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Nom du dossier (min 3 caractères)</Form.Label>
                <Form.Control 
                  type="text" 
                  placeholder="Entrer le nom du dossier" 
                  value={folderTitle}
                  onChange={(e) => setFolderTitle(e.target.value)}
                  required
                  minLength={3}
                />
              </Form.Group>
              
              <Form.Group className="mb-3">
                <Form.Label>Couleur du dossier</Form.Label>
                <Form.Select 
                  value={folderColor} 
                  onChange={(e) => setFolderColor(e.target.value)}
                >
                  <option value="bluesky">Bleu ciel</option>
                  <option value="orange">Orange</option>
                  <option value="pink">Rose</option>
                  <option value="green">Vert</option>
                </Form.Select>
              </Form.Group>

              <div className="d-flex justify-content-end">
                <Button variant="success" type="submit">Ajouter le dossier</Button>
              </div>
            </Form>
          </Tab>
        </Tabs>
      </Modal.Body>
    </Modal>
  );
};

export default CreateItemModal;