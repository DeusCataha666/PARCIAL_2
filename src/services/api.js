import axios from 'axios'

const API_URL = 'https://fakestoreapi.com'

// Adaptamos la FakeStore API para biblioteca
export const bookService = {
  // GET - Listar libros
  async getBooks() {
    try {
      const response = await axios.get(`${API_URL}/products`)
      // Transformamos datos a formato de libro
      return response.data.map(item => ({
        id: item.id,
        title: item.title,
        author: item.category, // Reutilizamos campo
        year: Math.floor(item.price) + 1900, // Simulamos año
        isbn: `ISBN-${item.id}-${Math.floor(Math.random() * 1000)}`,
        description: item.description,
        cover: item.image,
        available: Math.random() > 0.5
      }))
    } catch (error) {
      console.error('Error al obtener libros:', error)
      throw error
    }
  },

  // POST - Crear libro (simulado)
  async createBook(bookData) {
    try {
      const response = await axios.post(`${API_URL}/products`, {
        title: bookData.title,
        price: bookData.year - 1900,
        description: bookData.description,
        category: bookData.author,
        image: bookData.cover
      })
      return {
        ...response.data,
        isbn: `ISBN-NEW-${Date.now()}`,
        available: true
      }
    } catch (error) {
      console.error('Error al crear libro:', error)
      throw error
    }
  },

  // PUT - Actualizar libro (simulado)
  async updateBook(id, bookData) {
    try {
      const response = await axios.put(`${API_URL}/products/${id}`, {
        title: bookData.title,
        price: bookData.year - 1900,
        description: bookData.description,
        category: bookData.author,
        image: bookData.cover
      })
      return {
        ...response.data,
        isbn: `ISBN-${id}-${Math.floor(Math.random() * 1000)}`,
        available: bookData.available
      }
    } catch (error) {
      console.error('Error al actualizar libro:', error)
      throw error
    }
  },

  // DELETE - Eliminar libro (simulado)
  async deleteBook(id) {
    try {
      await axios.delete(`${API_URL}/products/${id}`)
      return { success: true }
    } catch (error) {
      console.error('Error al eliminar libro:', error)
      throw error
    }
  }
}