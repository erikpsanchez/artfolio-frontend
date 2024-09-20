'use client'

import api from '@axios'
import { useState, useEffect } from 'react'

export default function Books() {
  const [books, setBooks] = useState([])

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

  return (
    <div>
      <main>
        <h1>Books</h1>
        <ul style={{marginTop: '20px'}}>
          {/* Renderizar los libros si existen */}
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
