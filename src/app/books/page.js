'use client'

import api from '@axios'
import { useState, useEffect } from 'react'

export default function Books() {
  const [books, setBooks] = useState([])
  const [newBookTitle, setNewBookTitle] = useState("") // Estado para el nuevo libro

  useEffect(() => {
    async function fetchBooks() {
      try {
        const response = await api.get("/books")
        const fetchedBooks = response.data.rows
        setBooks(fetchedBooks)
      } catch (error) {
        console.error("Error al obtener los libros:", error)
      }
    }

    fetchBooks()
  }, [])

  // Función para manejar la adición de un nuevo libro
  const handleAddBook = async (e) => {
    e.preventDefault()
    if (!newBookTitle) {
      alert("El título no puede estar vacío")
      return
    }

    try {
      const response = await api.post("/books", { title: newBookTitle }) // Solicitud POST a la API
      const addedBook = response.data // Se asume que la API responde con el libro recién añadido

      setBooks((prevBooks) => [...prevBooks, addedBook]) // Actualiza la lista de libros
      setNewBookTitle("") // Resetea el campo de título después de agregar el libro
    } catch (error) {
      console.error("Error al agregar el libro:", error)
    }
  }

  return (
    <div>
      <main>
        <h1>Books</h1>

        {/* Formulario para agregar un nuevo libro */}
        <form onSubmit={handleAddBook} style={{marginBottom: '20px', marginTop: '20px'}}>
          <input
            type="text"
            placeholder="Escribe el título del libro"
            value={newBookTitle}
            onChange={(e) => setNewBookTitle(e.target.value)}
            style={{
              width: '300px', 
              height: '40px',
              fontSize: '16px',
              padding: '10px',
            }}
          />
          <button type="submit" style={{marginLeft: '10px', width: '300px', height: '40px', fontSize: '16px'}}>Agregar Libro</button>
        </form>

        {/* Lista de libros */}
        <ul style={{marginTop: '20px'}}>
          {books.length > 0 && (
            books.map((book, index) => (
              <li key={index} style={{marginTop: '10px'}}>
                <strong>{book.title}</strong>
              </li>
            ))
          )}
        </ul>
      </main>
    </div>
  )
}
