import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { Contact, ContactFormData } from '../types/contact';
import { contactApi } from '../services/api';

interface ContactState {
  contacts: Contact[];
  loading: boolean;
  error: string | null;
}

type ContactAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_CONTACTS'; payload: Contact[] }
  | { type: 'ADD_CONTACT'; payload: Contact }
  | { type: 'UPDATE_CONTACT'; payload: Contact }
  | { type: 'DELETE_CONTACT'; payload: number }
  | { type: 'SET_ERROR'; payload: string | null };

interface ContactContextType {
  state: ContactState;
  actions: {
    loadContacts: () => Promise<void>;
    createContact: (contact: ContactFormData) => Promise<Contact>;
    updateContact: (id: number, contact: ContactFormData) => Promise<Contact>;
    deleteContact: (id: number) => Promise<void>;
    clearError: () => void;
  };
}

const ContactContext = createContext<ContactContextType | undefined>(undefined);

const contactReducer = (state: ContactState, action: ContactAction): ContactState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_CONTACTS':
      return { ...state, contacts: action.payload, loading: false, error: null };
    case 'ADD_CONTACT':
      return { 
        ...state, 
        contacts: [...state.contacts, action.payload], 
        loading: false, 
        error: null 
      };
    case 'UPDATE_CONTACT':
      return {
        ...state,
        contacts: state.contacts.map(contact =>
          contact.id === action.payload.id ? action.payload : contact
        ),
        loading: false,
        error: null
      };
    case 'DELETE_CONTACT':
      return {
        ...state,
        contacts: state.contacts.filter(contact => contact.id !== action.payload),
        loading: false,
        error: null
      };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    default:
      return state;
  }
};

const initialState: ContactState = {
  contacts: [],
  loading: false,
  error: null,
};

export const ContactProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(contactReducer, initialState);

  const loadContacts = async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const contacts = await contactApi.getContacts();
      dispatch({ type: 'SET_CONTACTS', payload: contacts });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Error al cargar los contactos' });
    }
  };

  const createContact = async (contactData: ContactFormData): Promise<Contact> => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const newContact = await contactApi.createContact(contactData);
      dispatch({ type: 'ADD_CONTACT', payload: newContact });
      return newContact;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Error al crear el contacto' });
      throw error;
    }
  };

  const updateContact = async (id: number, contactData: ContactFormData): Promise<Contact> => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const updatedContact = await contactApi.updateContact(id, contactData);
      dispatch({ type: 'UPDATE_CONTACT', payload: updatedContact });
      return updatedContact;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Error al actualizar el contacto' });
      throw error;
    }
  };

  const deleteContact = async (id: number) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      await contactApi.deleteContact(id);
      dispatch({ type: 'DELETE_CONTACT', payload: id });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Error al eliminar el contacto' });
      throw error;
    }
  };

  const clearError = () => {
    dispatch({ type: 'SET_ERROR', payload: null });
  };

  useEffect(() => {
    loadContacts();
  }, []);

  const contextValue: ContactContextType = {
    state,
    actions: {
      loadContacts,
      createContact,
      updateContact,
      deleteContact,
      clearError,
    },
  };

  return (
    <ContactContext.Provider value={contextValue}>
      {children}
    </ContactContext.Provider>
  );
};

export const useContacts = () => {
  const context = useContext(ContactContext);
  if (context === undefined) {
    throw new Error('useContacts must be used within a ContactProvider');
  }
  return context;
};