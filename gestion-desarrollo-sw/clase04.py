# CLASE Padre
class Animal:
    def __init__(self, nombre):
        self.nombre = nombre

    def hacer_sonido(self):
        pass 
    
    def comer(self):
        pass

#CLASES Hijas
class Perro(Animal):
    def hacer_sonido(self):
        return "¡Guau guau!"

    def comer(self):
        return "Comiendo croquetas de carne"

class Gato(Animal):
    def hacer_sonido(self):
        return "¡Miau!"

    def comer(self):
        return "Comiendo atún"

class Vaca(Animal):
    def hacer_sonido(self):
        return "¡Muuu!"

    def comer(self):
        return "Pastando en el campo"

# DEMOSTRACIÓN
mis_animales = [
    Perro("Rocky"),
    Gato("GatoConBotas"),
    Vaca("Lola")
]

# Recorremos los elementos de la lista de animales ejecutando hacer_sonido y comer aplicando poliformismo
for animal in mis_animales:
    print(f"{animal.nombre} dice: {animal.hacer_sonido()}")
    print(f"{animal.nombre} está: {animal.comer()}")
    print("---")