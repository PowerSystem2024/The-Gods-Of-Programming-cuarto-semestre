import pygame
import os
from constantes import ASSETS_PATH, LASER_COLOR

class Laser(pygame.sprite.Sprite):
    def __init__(self, x, y, width=4, height=16, speed=10):
        super().__init__()
        self.image = pygame.Surface((width, height))
        self.image.fill(LASER_COLOR)
        self.rect = self.image.get_rect(center=(x, y))
        self.speed = speed
    def update(self):
        self.rect.y -= self.speed
        if self.rect.bottom < 0:
            self.kill()

class Personaje(pygame.sprite.Sprite):
    def __init__(self, x, y, width, height, speed, image_path):
        super().__init__()
        self.x = x
        self.y = y
        self.width = width
        self.height = height
        self.speed = speed
        img_full_path = os.path.join(ASSETS_PATH, image_path)
        self.image = pygame.image.load(img_full_path)
        self.image = pygame.transform.scale(self.image, (width, height))
        self.rect = self.image.get_rect(topleft=(x, y))
        self.lasers = pygame.sprite.Group()
    def dibujar(self, screen):
        screen.blit(self.image, self.rect)
        self.lasers.draw(screen)
    def mover(self, dx, dy):
        self.rect.x += dx * self.speed
        self.rect.y += dy * self.speed
    def disparar(self):
        laser = Laser(self.rect.centerx, self.rect.top)
        self.lasers.add(laser)
    def actualizar_lasers(self, screen_height):
        self.lasers.update()
        for laser in self.lasers:
            if laser.rect.bottom < 0 or laser.rect.top > screen_height:
                laser.kill()
