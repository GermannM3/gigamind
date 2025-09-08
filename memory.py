import sqlite3
from sentence_transformers import SentenceTransformer
import faiss
import numpy as np
import os

class GigaMemory:
    def __init__(self, db_path="data/memory.db"):
        os.makedirs("data", exist_ok=True)
        self.conn = sqlite3.connect(db_path)
        self.create_table()
        self.model = SentenceTransformer('all-MiniLM-L6-v2')
        self.index = faiss.IndexFlatL2(384)  # Размер эмбеддинга модели
        self.history = []

    def create_table(self):
        self.conn.execute('''
            CREATE TABLE IF NOT EXISTS memory (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id TEXT,
                timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
                query TEXT,
                response TEXT,
                tags TEXT
            )
        ''')
        self.conn.commit()

    def add_memory(self, user_id, query, response, tags=""):
        self.conn.execute(
            "INSERT INTO memory (user_id, query, response, tags) VALUES (?, ?, ?, ?)",
            (user_id, query, response, tags)
        )
        self.conn.commit()
        # Добавляем в FAISS
        embedding = self.model.encode([query])[0]
        self.index.add(np.array([embedding]))
        self.history.append((user_id, query, response, tags))

    def search_memory(self, query, top_k=3):
        # Если ещё нет данных в индексе, возвращаем пустой список
        if self.index.ntotal == 0 or len(self.history) == 0:
            return []

        embedding = self.model.encode([query])[0]
        D, I = self.index.search(np.array([embedding]), top_k)
        results = []
        for idx in I[0]:
            # faiss может возвращать -1 для пустых/недоступных позиций
            if idx is None or idx < 0:
                continue
            if idx < len(self.history):
                results.append(self.history[idx])
        return results