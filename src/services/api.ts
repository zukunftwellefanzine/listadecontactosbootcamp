const API_BASE = 'https://playground.4geeks.com/contact';

// You might need to create an agenda first. Replace 'your-agenda' with your actual agenda name
const AGENDA_SLUG = 'mi-agenda';

export const contactApi = {
  // Get all contacts
  getContacts: async () => {
    try {
      const response = await fetch(`${API_BASE}/agendas/${AGENDA_SLUG}/contacts`);
      if (!response.ok) {
        // If agenda doesn't exist, create it
        if (response.status === 404) {
          await contactApi.createAgenda();
          return [];
        }
        throw new Error('Failed to fetch contacts');
      }
      const data = await response.json();
      return data.contacts || [];
    } catch (error) {
      console.error('Error fetching contacts:', error);
      return [];
    }
  },

  // Create agenda if it doesn't exist
  createAgenda: async () => {
    try {
      const response = await fetch(`${API_BASE}/agendas/${AGENDA_SLUG}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response.ok;
    } catch (error) {
      console.error('Error creating agenda:', error);
      return false;
    }
  },

  // Create a new contact
  createContact: async (contact: Omit<Contact, 'id'>) => {
    try {
      const response = await fetch(`${API_BASE}/agendas/${AGENDA_SLUG}/contacts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(contact),
      });
      
      if (!response.ok) {
        throw new Error('Failed to create contact');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error creating contact:', error);
      throw error;
    }
  },

  // Update a contact
  updateContact: async (id: number, contact: Omit<Contact, 'id'>) => {
    try {
      const response = await fetch(`${API_BASE}/agendas/${AGENDA_SLUG}/contacts/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(contact),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update contact');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error updating contact:', error);
      throw error;
    }
  },

  // Delete a contact
  deleteContact: async (id: number) => {
    try {
      const response = await fetch(`${API_BASE}/agendas/${AGENDA_SLUG}/contacts/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete contact');
      }
      
      return true;
    } catch (error) {
      console.error('Error deleting contact:', error);
      throw error;
    }
  },
};