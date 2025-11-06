import pygame
import sys
import os
import random
from constantes import SCREEN_WIDTH, SCREEN_HEIGHT, ENEMY_SPEED
from personaje import Personaje
from explosiones import Explosion

def crear_enemigos(num=5):
    enemigos = pygame.sprite.Group()
    for _ in range(num):
        x = random.randint(0, SCREEN_WIDTH-50)
        y = random.randint(0, SCREEN_HEIGHT//2)
        enemigo = Personaje(x, y, 50, 50, ENEMY_SPEED, os.path.join('images', 'enemy.png'))
        enemigos.add(enemigo)
    return enemigos

def detectar_colisiones(grupo1, grupo2):
    return pygame.sprite.groupcollide(grupo1, grupo2, False, True)

def main():
    pygame.init()
    screen = pygame.display.set_mode((SCREEN_WIDTH, SCREEN_HEIGHT))
    pygame.display.set_caption('Juego de Disparos Pygame')
    clock = pygame.time.Clock()
    fondo = pygame.Surface((SCREEN_WIDTH, SCREEN_HEIGHT))
    fondo.fill((30, 30, 30))
    jugador = Personaje(SCREEN_WIDTH//2, SCREEN_HEIGHT-80, 50, 50, 8, os.path.join('images', 'player.png'))
    enemigos = crear_enemigos()
    explosiones = pygame.sprite.Group()
    running = True
    while running:
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                running = False
            if event.type == pygame.KEYDOWN:
                if event.key == pygame.K_SPACE:
                    jugador.disparar()
        keys = pygame.key.get_pressed()
        dx = dy = 0
        if keys[pygame.K_LEFT]: dx = -1
        if keys[pygame.K_RIGHT]: dx = 1
        if keys[pygame.K_UP]: dy = -1
        if keys[pygame.K_DOWN]: dy = 1
        jugador.mover(dx, dy)
        jugador.actualizar_lasers(SCREEN_HEIGHT)
        enemigos.update()
        for enemigo in enemigos:
            enemigo.actualizar_lasers(SCREEN_HEIGHT)
        # Colisiones láser jugador vs enemigos
        for laser in jugador.lasers:
            hit = pygame.sprite.spritecollideany(laser, enemigos)
            if hit:
                explosion = Explosion(hit.rect.centerx, hit.rect.centery, 60)
                explosiones.add(explosion)
                hit.kill()
                laser.kill()
        # Actualizar explosiones
        explosiones.update()
        # Renderizado
        screen.blit(fondo, (0,0))
        jugador.dibujar(screen)
        enemigos.draw(screen)
        for enemigo in enemigos:
            enemigo.lasers.draw(screen)
        for explosion in explosiones:
            explosion.dibujar(screen)
        pygame.display.flip()
        clock.tick(60)
    pygame.quit()
    sys.exit()

if __name__ == "__main__":
    main()
