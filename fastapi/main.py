import json
import os
from typing import List, Optional, ClassVar
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from mangum import Mangum


class Book(BaseModel):
    id: Optional[int]
    title: str
    description: str
    category: str
    price: float
    discountPercentage: float
    rating: float
    stock: int
    brand: str
    thumbnail: str

    BOOKS_FILE: ClassVar[str] = "books.json"
    BOOKS: ClassVar[List[dict]] = []

    @classmethod
    def load_books(cls):
        """Load books from the JSON file into the BOOKS list."""
        if os.path.exists(cls.BOOKS_FILE):
            with open(cls.BOOKS_FILE, "r") as f:
                cls.BOOKS = json.load(f)
        else:
            cls.BOOKS = []

    @classmethod
    def save_books(cls):
        """Save the current state of BOOKS into the JSON file."""
        with open(cls.BOOKS_FILE, "w") as f:
            json.dump(cls.BOOKS, f, indent=4)


# Load books initially
Book.load_books()

# FastAPI app initialization
app = FastAPI()
handler = Mangum(app)


@app.get("/")
def read_root():
    return {"message": "Welcome to the API"}


@app.get("/data")
async def read_data():
    return Book.BOOKS

@app.get("/data/{user_id}")
async def read_data(user_id: int):
    for book in Book.BOOKS:
        if book["id"] == user_id:
            return book
    raise HTTPException(status_code=404, detail="User not found")


@app.post("/data", status_code=201)
async def create_book(book: Book):
    """Add a new book to the collection."""
    # Generate a new unique ID
    if not book.id:
        book.id = max([b["id"] for b in Book.BOOKS], default=0) + 1
    Book.BOOKS.append(book.dict())
    Book.save_books()
    return {"message": "Book added successfully", "book": book}


@app.put("/data/{book_id}")
async def update_book(book_id: int, updated_book: Book):
    """Update an existing book."""
    for index, book in enumerate(Book.BOOKS):
        if book["id"] == book_id:
            Book.BOOKS[index] = updated_book.dict()
            updated_book.id = book_id  
            Book.save_books()
            return {"message": "Book updated successfully", "book": updated_book}
    raise HTTPException(status_code=404, detail="Book not found")


@app.delete("/data/{book_id}")
async def delete_book(book_id: int):
    """Delete a book from the collection."""
    for index, book in enumerate(Book.BOOKS):
        if book["id"] == book_id:
            deleted_book = Book.BOOKS.pop(index)
            Book.save_books()
            return {"message": "Book deleted successfully", "book": deleted_book}
    raise HTTPException(status_code=404, detail="Book not found")
