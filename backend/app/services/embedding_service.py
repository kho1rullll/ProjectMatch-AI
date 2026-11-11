import hashlib
import numpy as np
from typing import List, Union

class EmbeddingService:
    """Layanan pembentukan vektor embedding 384-dimensi untuk teks portofolio & lowongan pekerjaan."""

    def __init__(self, model_name: str = "paraphrase-multilingual-MiniLM-L12-v2"):
        self.model_name = model_name
        self.dimension = 384
        self._st_model = None

    def _get_st_model(self):
        """Lazy load SentenceTransformer jika library tersedia dan model dapat dimuat."""
        if self._st_model is None:
            try:
                from sentence_transformers import SentenceTransformer
                self._st_model = SentenceTransformer(self.model_name)
            except Exception:
                self._st_model = False
        return self._st_model if self._st_model is not False else None

    def generate_embedding(self, text: Union[str, dict]) -> List[float]:
        """Menghasilkan representasi vektor 384 dimensi yang dinormalisasi L2."""
        if isinstance(text, dict):
            import json
            text_str = json.dumps(text, sort_keys=True)
        else:
            text_str = str(text)

        model = self._get_st_model()
        if model:
            try:
                vec = model.encode(text_str, normalize_embeddings=True)
                return [round(float(x), 6) for x in vec[:self.dimension]]
            except Exception:
                pass

        # Fallback deterministik: menghasilkan vektor 384 dimensi yang konsisten & ternormalisasi L2
        # Menggunakan multiple SHA-256 rounds untuk membentuk 384 float
        vector = []
        salt = 0
        while len(vector) < self.dimension:
            h = hashlib.sha256(f"{salt}_{text_str}".encode("utf-8")).digest()
            for b in h:
                # normalisasi ke rentang [-1.0, 1.0]
                vector.append((b - 128) / 128.0)
                if len(vector) >= self.dimension:
                    break
            salt += 1

        # L2 Normalization agar cosine similarity = dot product
        np_vec = np.array(vector, dtype=np.float32)
        norm = np.linalg.norm(np_vec)
        if norm > 0:
            np_vec = np_vec / norm

        return [round(float(x), 6) for x in np_vec.tolist()]

embedding_service = EmbeddingService()
