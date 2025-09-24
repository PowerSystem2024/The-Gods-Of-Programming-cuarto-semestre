import pygame
import os
from constantes import ASSETS_PATH

class Explosion(pygame.sprite.Sprite):
    def __init__(self, x, y, size):
        super().__init__()
        self.images = []
        expl_path = os.path.join(ASSETS_PATH, 'images', 'explosions')
        for i in range(1, 6):
            img = pygame.image.load(os.path.join(expl_path, f'explosion{i}.png'))
            img = pygame.transform.scale(img, (size, size))
            self.images.append(img)
        self.frame = 0
        self.last_update = pygame.time.get_ticks()
        self.x = x
        self.y = y
        self.size = size
        self.done = False
        self.image = self.images[self.frame]
        self.rect = self.image.get_rect(center=(x, y))
    def update(self):
        now = pygame.time.get_ticks()
        if now - self.last_update > 50:
            self.frame += 1
            self.last_update = now
            if self.frame < len(self.images):
                self.image = self.images[self.frame]
            else:
                self.done = True
                self.kill()
    def dibujar(self, screen):
        if not self.done:
            screen.blit(self.image, self.rect)
