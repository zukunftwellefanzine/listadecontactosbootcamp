import React, { useState } from 'react';
import { Contact } from '../types/contact';
import { Edit2, Trash2, Phone, Mail, MapPin } from 'lucide-react';
import { useContacts } from '../context/ContactContext';
import { ConfirmModal } from './Modal';
import { useNavigate } from 'react-router-dom';

interface ContactCardProps {
  contact: Contact;
}

export const ContactCard: React.FC<ContactCardProps> = ({ contact }) => {
  const { actions } = useContacts();
  const navigate = useNavigate();
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleDelete = async () => {
    try {
      await actions.deleteContact(contact.id);
    } catch (error) {
      console.error('Error al eliminar contacto:', error);
    }
  };

  const handleEdit = () => {
    navigate(`/add-contact/${contact.id}`);
  };

  return (
    <>
      <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 p-6 border border-gray-100">
        {/* Header with name and actions */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-gray-900 mb-1">
              {contact.name}
            </h3>
          </div>
          
          <div className="flex space-x-2 ml-4">
            <button
              onClick={handleEdit}
              className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
              title="Editar contacto"
            >
              <Edit2 className="h-4 w-4" />
            </button>
            <button
              onClick={() => setShowDeleteModal(true)}
              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
              title="Eliminar contacto"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Contact details */}
        <div className="space-y-3">
          {contact.phone && (
            <div className="flex items-center text-gray-600">
              <Phone className="h-4 w-4 mr-3 text-gray-400" />
              <span className="text-sm">{contact.phone}</span>
            </div>
          )}
          
          {contact.email && (
            <div className="flex items-center text-gray-600">
              <Mail className="h-4 w-4 mr-3 text-gray-400" />
              <span className="text-sm break-all">{contact.email}</span>
            </div>
          )}
          
          {contact.address && (
            <div className="flex items-start text-gray-600">
              <MapPin className="h-4 w-4 mr-3 mt-0.5 text-gray-400 flex-shrink-0" />
              <span className="text-sm">{contact.address}</span>
            </div>
          )}
        </div>
      </div>

      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        title="Eliminar Contacto"
        message={`¿Estás seguro de que deseas eliminar a ${contact.name}? Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        isDestructive={true}
      />
    </>
  );
};