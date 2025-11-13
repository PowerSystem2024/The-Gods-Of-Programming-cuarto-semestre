package utn.tienda_libros;

import org.springframework.boot.WebApplicationType;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.context.ConfigurableApplicationContext;
import utn.tienda_libros.vista.LibroForm;
import java.awt.EventQueue;

@SpringBootApplication
public class TiendaLibrosApplication {

    public static void main(String[] args) {

        // Start the Spring application context in non-headless mode and without a web environment
        ConfigurableApplicationContext contextoSpring =
                new SpringApplicationBuilder(TiendaLibrosApplication.class)
                        .headless(false)
                        .web(WebApplicationType.NONE)
                        .run(args);

        // This ensures the LibroForm UI is loaded and visible after the Spring context is initialized
        EventQueue.invokeLater(() -> {
            LibroForm libroForm = contextoSpring.getBean(LibroForm.class);
            libroForm.setVisible(true);
        });
    }
}