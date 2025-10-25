import pygame
import sys
import random
import os
from personaje import Personaje, Enemigo, Explosion, Proyectil
from constantes import SCREEN_WIDTH, SCREEN_HEIGHT, ASSETS_PATH

# === FUNCIONES DE HIGHSCORE ===
def cargar_mejor_puntaje():
    path = os.path.join(ASSETS_PATH, 'highscore.txt')
    try:
        with open(path, 'r', encoding='utf-8') as f:
            return int(f.read().strip() or 0)
    except Exception:
        return 0

def guardar_mejor_puntaje(score):
    path = os.path.join(ASSETS_PATH, 'highscore.txt')
    try:
        os.makedirs(os.path.dirname(path), exist_ok=True)
        with open(path, 'w', encoding='utf-8') as f:
            f.write(str(int(score)))
    except Exception as e:
        print("No se pudo guardar highscore:", e)

def mostrar_imagen_inicial(screen, imagen_path, duracion):
    pygame.mixer.music.load(os.path.join(ASSETS_PATH, 'sounds', 'Imperial March - Kenobi.mp3'))
    pygame.mixer.music.play(-1)
    imagen = pygame.image.load(imagen_path).convert()
    imagen = pygame.transform.scale(imagen, (SCREEN_WIDTH, SCREEN_HEIGHT))

    alpha = 255
    clock = pygame.time.Clock()

    tiempo_inicial = pygame.time.get_ticks()
    tiempo_total = duracion
    while pygame.time.get_ticks() - tiempo_inicial < tiempo_total:
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                pygame.quit()
                sys.exit()

        tiempo_transcurrido = pygame.time.get_ticks() - tiempo_inicial
        alpha = 255 - (255 * (tiempo_transcurrido / tiempo_total))
        if alpha < 0:
            alpha = 0

        imagen.set_alpha(int(alpha))
        screen.fill((0, 0, 0))
        screen.blit(imagen, (0, 0))
        pygame.display.flip()
        clock.tick(60)

# --- FUNCIÓN DEL MENÚ DE PAUSA ---
def mostrar_menu_pausa(screen, clock, volumen_actual, sonido_laser, sonido_explosion):
    modo_pausa = True
    volumen = volumen_actual
    esta_arrastrando_mouse = False
    font = pygame.font.Font(None, 36)

    texto_pausa = pygame.font.Font(None, 70).render("PAUSA", True, (255, 255, 255))
    texto_reanudar = font.render("Reanudar", True, (255, 255, 255))
    texto_salir = font.render("Salir", True, (255, 255, 255))

    boton_reanudar_rect = texto_reanudar.get_rect(center=(SCREEN_WIDTH / 2, 350))
    boton_salir_rect = texto_salir.get_rect(center=(SCREEN_WIDTH / 2, 420))
    
    overlay = pygame.Surface((SCREEN_WIDTH, SCREEN_HEIGHT), pygame.SRCALPHA)
    overlay.fill((0, 0, 0, 180))

    while modo_pausa:
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                pygame.quit()
                sys.exit()
            if event.type == pygame.KEYDOWN:
                if event.key == pygame.K_p or event.key == pygame.K_ESCAPE:
                    modo_pausa = False
            
            if event.type == pygame.MOUSEBUTTONDOWN and event.button == 1:
                if boton_reanudar_rect.collidepoint(event.pos):
                    modo_pausa = False
                if boton_salir_rect.collidepoint(event.pos):
                    pygame.quit()
                    sys.exit()
                if 400 <= event.pos[0] <= 800 and 290 <= event.pos[1] <= 320:
                    esta_arrastrando_mouse = True
            
            if event.type == pygame.MOUSEBUTTONUP and event.button == 1:
                esta_arrastrando_mouse = False
            
            if event.type == pygame.MOUSEMOTION and esta_arrastrando_mouse:
                volumen = (event.pos[0] - 400) / 400
                volumen = max(0.0, min(volumen, 1.0))
                pygame.mixer.music.set_volume(volumen)
                sonido_laser.set_volume(volumen)
                sonido_explosion.set_volume(volumen)

        screen.blit(overlay, (0, 0))
        screen.blit(texto_pausa, texto_pausa.get_rect(center=(SCREEN_WIDTH / 2, 150)))
        
        texto_volumen = font.render("Volumen", True, (255, 255, 255))
        screen.blit(texto_volumen, texto_volumen.get_rect(center=(SCREEN_WIDTH / 2, 260)))
        pygame.draw.rect(screen, (100, 100, 100), (400, 290, 400, 30))
        posicion_slider = int(volumen * 400) + 400
        pygame.draw.circle(screen, (255, 255, 0), (posicion_slider, 305), 15)

        screen.blit(texto_reanudar, boton_reanudar_rect)
        screen.blit(texto_salir, boton_salir_rect)
            
        pygame.display.flip()
        clock.tick(60)

    return volumen

def main():
    pygame.init()
    screen = pygame.display.set_mode((SCREEN_WIDTH, SCREEN_HEIGHT))
    pygame.display.set_caption('Amenaza Fantasma')

    imagen_inicial_path = os.path.join(ASSETS_PATH, 'images', 'inicio', 'star.png')
    mostrar_imagen_inicial(screen, imagen_inicial_path, 5000)

    icon = pygame.image.load(os.path.join(ASSETS_PATH, 'images', '001.jfif'))
    pygame.display.set_icon(icon)

    fondo2 = pygame.image.load(os.path.join(ASSETS_PATH, 'images', 'fondo2.jpg')).convert()
    fondo2 = pygame.transform.scale(fondo2, (SCREEN_WIDTH, SCREEN_HEIGHT))
    fondo3 = pygame.image.load(os.path.join(ASSETS_PATH, 'images', 'fondo3.jpg')).convert()
    fondo3 = pygame.transform.scale(fondo3, (SCREEN_WIDTH, SCREEN_HEIGHT))
    fondo_actual = fondo2

    sonido_laser = pygame.mixer.Sound(os.path.join(ASSETS_PATH, 'sounds', 'laserdis.mp3'))
    sonido_explosion = pygame.mixer.Sound(os.path.join(ASSETS_PATH, 'sounds', 'explosion.mp3'))

    pygame.mixer.music.load(os.path.join(ASSETS_PATH, 'sounds', 'efectos.mp3'))
    pygame.mixer.music.play(-1)
    
    volumen = 0.5
    pygame.mixer.music.set_volume(volumen)

    personaje = Personaje(SCREEN_WIDTH // 2, SCREEN_HEIGHT // 2)
    enemigos = []
    explosiones = []
    puntos = 0
    nivel = 1
    mejor_puntaje = cargar_mejor_puntaje()  # 🔥 carga el récord guardado

    clock = pygame.time.Clock()
    running = True
    while running:
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                pygame.quit()
                sys.exit()
            
            if event.type == pygame.KEYDOWN:
                if event.key == pygame.K_p or event.key == pygame.K_ESCAPE:
                    volumen = mostrar_menu_pausa(screen, clock, volumen, sonido_laser, sonido_explosion)
                    pygame.mixer.music.set_volume(volumen)
                    sonido_laser.set_volume(volumen)
                    sonido_explosion.set_volume(volumen)

        keys = pygame.key.get_pressed()
        dx, dy = 0, 0
        if keys[pygame.K_LEFT]:
            dx = -5
        if keys[pygame.K_RIGHT]:
            dx = 5
        if keys[pygame.K_UP]:
            dy = -5
        if keys[pygame.K_DOWN]:
            dy = 5
        personaje.mover(dx, dy)

        if keys[pygame.K_SPACE]:
            personaje.lanzar_laser(sonido_laser)

        for enemigo in enemigos[:]:
            enemigo.mover()
            if enemigo.rect.top > SCREEN_HEIGHT:
                enemigos.remove(enemigo)
            for laser in personaje.lasers[:]:
                if enemigo.rect.colliderect(laser.rect):
                    explosiones.append(Explosion(enemigo.rect.centerx, enemigo.rect.centery))
                    if enemigo in enemigos:
                        enemigos.remove(enemigo)
                    personaje.lasers.remove(laser)
                    sonido_explosion.play()
                    puntos += 10
                    break
            if enemigo in enemigos and enemigo.rect.colliderect(personaje.shape):
                if not personaje.recibir_dano():
                    running = False

        if random.random() < 0.02:
            x = random.randint(0, SCREEN_WIDTH - 50)
            enemigo = Enemigo(x, 0)
            enemigos.append(enemigo)

        explosiones = [exp for exp in explosiones if exp.actualizar()]

        if puntos > 0 and puntos % 200 == 0:
            if fondo_actual == fondo2:
                fondo_actual = fondo3
            else:
                fondo_actual = fondo2
            puntos += 10

        # 🔥 Actualiza el récord si superás el mejor puntaje
        if puntos > mejor_puntaje:
            mejor_puntaje = puntos
            guardar_mejor_puntaje(mejor_puntaje)

        screen.blit(fondo_actual, (0, 0))
        personaje.dibujar(screen)
        for enemigo in enemigos:
            enemigo.dibujar(screen)
        for explosion in explosiones:
            explosion.dibujar(screen)

        font = pygame.font.Font(None, 36)
        texto_puntos = font.render(f"Puntos: {puntos}", True, (0, 255, 0))
        texto_nivel = font.render(f"Nivel: {nivel}", True, (0, 200, 255))
        texto_record = font.render(f"Record: {mejor_puntaje}", True, (255, 215, 0))
        screen.blit(texto_puntos, (10, 50))
        screen.blit(texto_nivel, (10, 90))
        screen.blit(texto_record, (10, 130))

        if puntos >= 250:
            nivel += 1
            puntos = 0

        pygame.display.flip()
        clock.tick(60)

    # === GAME OVER ===
    screen.fill((0, 0, 0))
    font_large = pygame.font.Font(None, 74)
    font_small = pygame.font.Font(None, 36)
    texto_game_over = font_large.render("GAME OVER", True, (255, 0, 0))
    texto_mensaje = font_small.render("Que la Fuerza te acompañe", True, (255, 255, 255))
    texto_record_final = font_small.render(f"Mejor puntaje: {mejor_puntaje}", True, (255, 215, 0))
    pos_x_game_over = SCREEN_WIDTH // 2 - texto_game_over.get_width() // 2
    pos_y_game_over = SCREEN_HEIGHT // 2 - texto_game_over.get_height() // 2 - 20
    pos_x_mensaje = SCREEN_WIDTH // 2 - texto_mensaje.get_width() // 2
    pos_y_mensaje = SCREEN_HEIGHT // 2 + texto_game_over.get_height() // 2 + 20
    texto_reinicio = font_small.render("Reiniciar", True, (255, 0, 0))
    boton_rect = texto_reinicio.get_rect(center=(SCREEN_WIDTH // 2, SCREEN_HEIGHT // 2 + 100))
    screen.blit(texto_game_over, (pos_x_game_over, pos_y_game_over))
    screen.blit(texto_mensaje, (pos_x_mensaje, pos_y_mensaje))
    screen.blit(texto_record_final, (SCREEN_WIDTH // 2 - texto_record_final.get_width() // 2, pos_y_mensaje + 80))
    screen.blit(texto_reinicio, boton_rect)
    pygame.display.flip()
    
    reiniciar = False
    while not reiniciar:
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                pygame.quit()
                sys.exit()
            if event.type == pygame.MOUSEBUTTONDOWN:
                if event.button == 1 and boton_rect.collidepoint(event.pos):
                    main()

if __name__ == '__main__':
    main()
