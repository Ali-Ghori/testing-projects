import json
import os
from typing import List, Optional, ClassVar
from fastapi import FastAPI
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

Book.load_books()

app = FastAPI()
handler = Mangum(app)

@app.get("/")
def read_root():
    return {"message": "Welcome to the API"}

@app.get("/data")
async def read_data():
    return Book.BOOKS
