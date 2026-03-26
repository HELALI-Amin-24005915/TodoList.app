import React, { useEffect, useState, useContext } from 'react';
import { Modal, Tabs, Tab, Button, Form } from 'react-bootstrap';
import { TodoContext } from '../../contexts/TodoContext';
import { ETATS } from '../../utils/constants';
import './CreateItemModal.css';

const CreateItemModal = ({ show, onHide, initialTab = 'task' }) => {
  const { addTask, addFolder, folders } = useContext(TodoContext);
  const [activeTab, setActiveTab] = useState('task');
  
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDesc, setTaskDesc] = useState('');
  const [taskDate, setTaskDate] = useState('');
  const [taskEtat, setTaskEtat] = useState(ETATS.NOUVEAU);
  const [taskPriority, setTaskPriority] = useState(2);
  const [taskFolder, setTaskFolder] = useState(''); 
  const [taskEquipiers, setTaskEquipiers] = useState('');
  
  const [folderTitle, setFolderTitle] = useState('');
  const [folderColor, setFolderColor] = useState('bluesky'); 

  const handleTaskSubmit = (e) => {
    e.preventDefault();
    if (taskTitle.length >= 5 && taskDate) {
      addTask({
        title: taskTitle,
        description: taskDesc,
        date_creation: new Date().toISOString().split('T')[0],
        date_echeance: taskDate, 
        priorite: Number(taskPriority),
        etat: taskEtat,
        equipiers: taskEquipiers
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean),
        folderId: taskFolder ? Number(taskFolder) : null 
      });
      
      setTaskTitle(''); 
      setTaskDesc('');
      setTaskDate('');
      setTaskEtat(ETATS.NOUVEAU);
      setTaskPriority(2);
      setTaskFolder(''); 
      setTaskEquipiers('');
      onHide(); 
    } else {
      alert("Veuillez remplir le titre (min 5 caractères) et la date d'échéance.");
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

  useEffect(() => {
    if (show) setActiveTab(initialTab);
  }, [show, initialTab]);

  return (
    <Modal show={show} onHide={onHide} centered className="create-item-modal">
      <Modal.Header closeButton className="create-item-modal__header">
        <Modal.Title>Créer un nouvel élément</Modal.Title>
      </Modal.Header>
      
      <Modal.Body>
        <Tabs 
          id="create-item-tabs" 
          activeKey={activeTab} 
          onSelect={(k) => setActiveTab(k)} 
          className="create-item-modal__tabs mb-3"
        >
          <Tab eventKey="task" title="Tâche">
            <Form onSubmit={handleTaskSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Titre de la tâche *</Form.Label>
                <Form.Control 
                  type="text" 
                  placeholder="Ex: Faire les courses" 
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  required minLength={5}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Description</Form.Label>
                <Form.Control 
                  as="textarea" rows={2}
                  placeholder="Détails optionnels..." 
                  value={taskDesc}
                  onChange={(e) => setTaskDesc(e.target.value)}
                />
              </Form.Group>

              <div className="row">
                <Form.Group className="col-md-6 mb-3">
                  <Form.Label>Date d'échéance *</Form.Label>
                  <Form.Control 
                    type="date" 
                    value={taskDate}
                    onChange={(e) => setTaskDate(e.target.value)}
                    required
                  />
                </Form.Group>

                <Form.Group className="col-md-6 mb-3">
                  <Form.Label>Priorité</Form.Label>
                  <Form.Select 
                    value={taskPriority}
                    onChange={(e) => setTaskPriority(e.target.value)}
                  >
                    <option value={1}>1 - Haute (Rouge)</option>
                    <option value={2}>2 - Moyenne (Jaune)</option>
                    <option value={3}>3 - Basse (Bleu)</option>
                  </Form.Select>
                </Form.Group>
              </div>

              <div className="row">
                <Form.Group className="col-md-6 mb-3">
                  <Form.Label>Statut</Form.Label>
                  <Form.Select
                    value={taskEtat}
                    onChange={(e) => setTaskEtat(e.target.value)}
                  >
                    <option value={ETATS.NOUVEAU}>Nouveau</option>
                    <option value={ETATS.EN_COURS}>En cours</option>
                    <option value={ETATS.EN_ATTENTE}>En attente</option>
                    <option value={ETATS.REUSSI}>Réussi</option>
                    <option value={ETATS.ABANDONNE}>Abandonné</option>
                  </Form.Select>
                </Form.Group>

                <Form.Group className="col-md-6 mb-3">
                  <Form.Label>Équipiers (séparés par des virgules)</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Ex: Paul, Bob"
                    value={taskEquipiers}
                    onChange={(e) => setTaskEquipiers(e.target.value)}
                  />
                </Form.Group>
              </div>

              <Form.Group className="mb-3">
                <Form.Label>Associer à un dossier (Optionnel)</Form.Label>
                <Form.Select 
                  value={taskFolder}
                  onChange={(e) => setTaskFolder(e.target.value)}
                >
                  <option value="">-- Aucun dossier --</option>
                  {folders.map(folder => (
                    <option key={folder.id} value={folder.id}>
                      {folder.title}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>

              <div className="d-flex justify-content-end mt-2">
                <Button variant="primary" type="submit">Créer la tâche</Button>
              </div>
            </Form>
          </Tab>

          <Tab eventKey="folder" title="Dossier">
            <Form onSubmit={handleFolderSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Nom du dossier *</Form.Label>
                <Form.Control 
                  type="text" 
                  placeholder="Ex: Projet React" 
                  value={folderTitle}
                  onChange={(e) => setFolderTitle(e.target.value)}
                  required minLength={3}
                />
              </Form.Group>
              
              <Form.Group className="mb-3">
                <Form.Label>Couleur</Form.Label>
                <Form.Select 
                  value={folderColor} 
                  onChange={(e) => setFolderColor(e.target.value)}
                >
                  <option value="bluesky">Bleu ciel</option>
                  <option value="orange">Orange</option>
                  <option value="pink">Rose</option>
                  <option value="green">Vert</option>
                  <option value="purple">Violet</option>
                  <option value="red">Rouge</option>
                  <option value="yellow">Jaune</option>
                  <option value="cyan">Cyan</option>
                  <option value="grey">Gris</option>
                  <option value="brown">Marron</option>
                </Form.Select>
              </Form.Group>

              <div className="d-flex justify-content-end">
                <Button variant="primary" type="submit">Créer le dossier</Button>
              </div>
            </Form>
          </Tab>
        </Tabs>
      </Modal.Body>
    </Modal>
  );
};

export default CreateItemModal;