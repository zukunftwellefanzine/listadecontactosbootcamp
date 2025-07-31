import React from 'react';
import { Link } from 'react-router-dom';
import { Plus, Users } from 'lucide-react';
import { useContacts } from '../context/ContactContext';
import { ContactCard } from '../components/ContactCard';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorAlert } from '../components/ErrorAlert';

export const Contacts: React.FC = () => {
  const { state, actions } = useContacts();
  const { contacts, loading, error } = state;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <Users className="h-8 w-8 text-blue-600 mr-3" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Mis Contactos</h1>
              <p className="text-gray-600 mt-1">
                {contacts.length} contacto{contacts.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
          
          <Link
            to="/add-contact"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium flex items-center space-x-2 transition-colors shadow-lg hover:shadow-xl"
          >
            <Plus className="h-5 w-5" />
            <span>Nuevo Contacto</span>
          </Link>
        </div>

        {/* Error Alert */}
        {error && (
          <ErrorAlert message={error} onClose={actions.clearError} />
        )}

        {/* Loading State */}
        {loading && <LoadingSpinner />}

        {/* Empty State */}
        {!loading && contacts.length === 0 && !error && (
          <div className="text-center py-16">
            <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No hay contactos aún
            </h3>
            <p className="text-gray-600 mb-6">
              Comienza agregando tu primer contacto
            </p>
            <Link
              to="/add-contact"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium inline-flex items-center space-x-2 transition-colors"
            >
              <Plus className="h-5 w-5" />
              <span>Agregar Contacto</span>
            </Link>
          </div>
        )}

        {/* Contacts Grid */}
        {!loading && contacts.length > 0 && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {contacts.map((contact) => (
              <ContactCard key={contact.id} contact={contact} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};