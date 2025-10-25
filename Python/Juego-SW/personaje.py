# ===============================================================
# ARCHIVO COMPLETO Y CORREGIDO PARA: personaje.py
# ===============================================================

import pygame
import os
from constantes import ASSETS_PATH, SCREEN_WIDTH, SCREEN_HEIGHT

class Personaje:
    def __init__(self, x, y):
        self.image = pygame.image.load(os.path.join(ASSETS_PATH, 'images', 'Speeder.png'))
        self.image = pygame.transform.scale(self.image, (95, 95))
        self.shape = self.image.get_rect(center=(x, y))
        self.lasers = []
        self.energia = 100
        self.cooldown = 400
        self.last_shot_time = 0

    def mover(self, dx, dy):
        self.shape.x += dx
        self.shape.y += dy
        if self.shape.left < 0:
            self.shape.left = 0
        if self.shape.right > SCREEN_WIDTH:
            self.shape.right = SCREEN_WIDTH
        if self.shape.top < 0:
            self.shape.top = 0
        if self.shape.bottom > SCREEN_HEIGHT:
            self.shape.bottom = SCREEN_HEIGHT

    def lanzar_laser(self, sonido_laser):
        current_time = pygame.time.get_ticks()
        if current_time - self.last_shot_time > self.cooldown:
            self.last_shot_time = current_time
            # La clase ahora se llama Proyectil
            laser = Proyectil(self.shape.centerx, self.shape.top)
            self.lasers.append(laser)
            sonido_laser.play()

    def recibir_dano(self):
        self.energia -= 10
        if self.energia <= 0:
            self.energia = 0
            return False
        return True

    def dibujar(self, screen):
        screen.blit(self.image, self.shape.topleft)
        for laser in self.lasers:
            laser.dibujar(screen)
            laser.mover()
        pygame.draw.rect(screen, (255, 0, 0), (10, 10, 100, 10))
        pygame.draw.rect(screen, (0, 255, 0), (10, 10, self.energia, 10))

class Enemigo:
    # (Esta clase queda igual)
    def __init__(self, x, y):
        self.image = pygame.image.load(os.path.join(ASSETS_PATH, 'images', 'enemigo1.png'))
        self.image = pygame.transform.scale(self.image, (80, 80))
        self.rect = self.image.get_rect(topleft=(x, y))
    def mover(self):
        self.rect.y += 5
    def dibujar(self, screen):
        screen.blit(self.image, self.rect.topleft)

# Renombramos la clase de Laser a Proyectil para evitar errores
class Proyectil:
    def __init__(self, x, y):
        self.image = pygame.image.load(os.path.join(ASSETS_PATH, 'images', 'laser_nuevo.png')).convert_alpha()
        self.image = pygame.transform.scale(self.image, (15, 40))
        self.rect = self.image.get_rect(center=(x, y))

    def mover(self):
        self.rect.y -= 10

    def dibujar(self, screen):
        screen.blit(self.image, self.rect.topleft)

class Explosion:
    # (Esta clase queda igual)
    def __init__(self, x, y):
        self.images = [pygame.image.load(os.path.join(ASSETS_PATH, 'images', f'regularExplosion0{i:02d}.png')) for i in range(9)]
        self.index = 0; self.image = self.images[self.index]; self.rect = self.image.get_rect(center=(x, y)); self.frame_rate = 0; self.max_frames = 20
    def actualizar(self):
        self.frame_rate += 1
        if self.frame_rate >= self.max_frames:
            self.frame_rate = 0; self.index += 1
            if self.index >= len(self.images): return False
            self.image = self.images[self.index]
        return True
    def dibujar(self, screen):
        screen.blit(self.image, self.rect.topleft)