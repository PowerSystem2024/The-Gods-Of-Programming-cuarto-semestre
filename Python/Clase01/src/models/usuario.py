"""
Modelo Usuario
=============

Clase que representa la entidad Usuario del sistema
Implementa el patrón de propiedades para getters/setters
"""

from typing import Optional

class Usuario:
    """
    Clase que representa un usuario del sistema
    
    Attributes:
        id_usuario (int): Identificador único del usuario
        username (str): Nombre de usuario único
        password (str): Contraseña del usuario
        email (str): Email del usuario (equivale a _TPY_0 del UML)
    """
    
    def __init__(self, id_usuario: Optional[int] = None, 
                 username: Optional[str] = None, 
                 password: Optional[str] = None, 
                 email: Optional[str] = None):
        """
        Constructor del Usuario
        
        Args:
            id_usuario: ID único del usuario (None para nuevos usuarios)
            username: Nombre de usuario
            password: Contraseña
            email: Email del usuario
        """
        self._id_usuario = id_usuario
        self._username = username
        self._password = password
        self._email = email  # Este es el _TPY_0 del diagrama UML
    
    # === GETTERS (Properties) ===
    @property
    def id_usuario(self) -> Optional[int]:
        """Getter para id_usuario"""
        return self._id_usuario
    
    @property
    def username(self) -> Optional[str]:
        """Getter para username"""
        return self._username
    
    @property
    def password(self) -> Optional[str]:
        """Getter para password"""
        return self._password
    
    @property
    def email(self) -> Optional[str]:
        """Getter para email (_TPY_0 en UML)"""
        return self._email
    
    # === SETTERS ===
    @id_usuario.setter
    def id_usuario(self, id_usuario: Optional[int]) -> None:
        """Setter para id_usuario"""
        self._id_usuario = id_usuario
    
    @username.setter
    def username(self, username: Optional[str]) -> None:
        """Setter para username"""
        self._username = username
    
    @password.setter
    def password(self, password: Optional[str]) -> None:
        """Setter para password"""
        self._password = password
    
    @email.setter
    def email(self, email: Optional[str]) -> None:
        """Setter para email"""
        self._email = email
    
    # === MÉTODOS ESPECIALES ===
    def __str__(self) -> str:
        """Representación en string del usuario"""
        return f'Usuario[ID: {self._id_usuario}, Username: {self._username}, Email: {self._email}]'
    
    def __repr__(self) -> str:
        """Representación detallada del usuario"""
        return (f'Usuario(id_usuario={self._id_usuario}, '
                f'username="{self._username}", '
                f'email="{self._email}")')
    
    def __eq__(self, other) -> bool:
        """Comparación de igualdad entre usuarios"""
        if not isinstance(other, Usuario):
            return False
        return self._id_usuario == other._id_usuario
    
    def __hash__(self) -> int:
        """Hash del usuario basado en su ID"""
        return hash(self._id_usuario) if self._id_usuario else 0
    
    # === MÉTODOS DE VALIDACIÓN ===
    def is_valid(self) -> bool:
        """
        Valida si el usuario tiene los datos mínimos requeridos
        
        Returns:
            bool: True si el usuario es válido, False en caso contrario
        """
        return (self._username is not None and 
                self._password is not None and 
                self._email is not None and
                len(self._username.strip()) > 0 and
                len(self._password.strip()) > 0 and
                len(self._email.strip()) > 0)
    
    def to_dict(self) -> dict:
        """
        Convierte el usuario a diccionario
        
        Returns:
            dict: Diccionario con los datos del usuario
        """
        return {
            'id_usuario': self._id_usuario,
            'username': self._username,
            'password': self._password,
            'email': self._email
        }
    
    @classmethod
    def from_dict(cls, data: dict) -> 'Usuario':
        """
        Crea un Usuario desde un diccionario
        
        Args:
            data: Diccionario con los datos del usuario
            
        Returns:
            Usuario: Nueva instancia de Usuario
        """
        return cls(
            id_usuario=data.get('id_usuario'),
            username=data.get('username'),
            password=data.get('password'),
            email=data.get('email')
        )
