package utn.tienda_libros.vista;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import utn.tienda_libros.modelo.Libro;
import utn.tienda_libros.servicio.LibroServicio;

import javax.swing.*;
import javax.swing.table.DefaultTableModel;
import javax.swing.table.JTableHeader;
import java.awt.*;
import java.awt.event.MouseAdapter;
import java.awt.event.MouseEvent;

@Component
public class LibroForm extends JFrame {
    private final LibroServicio libroServicio;
    private JPanel panel;
    private JTable tablaLibros;
    private JTextField idTexto;
    private JTextField libroTexto;
    private JTextField autorTexto;
    private JTextField precioTexto;
    private JTextField existenciasTexto;
    private JButton agregarButton;
    private JButton modificarButton;
    private JButton eliminarButton;
    private JButton salirButton;
    private DefaultTableModel tablaModeloLibros;

    private static final Color COLOR_PRIMARY = new Color(21, 67, 96);
    private static final Color COLOR_SUCCESS = new Color(20, 90, 50);
    private static final Color COLOR_WARNING = new Color(183, 98, 0);
    private static final Color COLOR_DANGER = new Color(120, 40, 31);
    private static final Color COLOR_BACKGROUND =  new Color(236, 240, 241);
    private static final Color COLOR_PANEL = new Color(255, 255, 255);
    private static final Color COLOR_TEXT = new Color(0, 0, 0);

    private static final String MSG_ENTER_BOOK_NAME = "Ingrese el nombre del libro";
    private static final String MSG_ENTER_VALID_PRICE = "Ingrese un número válido para el precio";
    private static final String MSG_ENTER_VALID_STOCK = "Ingrese un número entero válido para existencias";
    private static final String MSG_BOOK_ADDED = "Libro agregado...";
    private static final String MSG_SELECT_BOOK_TO_DELETE = "Debe seleccionar un libro para eliminar";
    private static final String MSG_BOOK_DELETED = "Libro eliminado exitosamente";
    private static final String MSG_BOOK_MODIFIED = "Libro modificado exitosamente";
    private static final String MSG_SELECT_BOOK_FROM_TABLE = "Debe seleccionar un libro de la tabla";
    private static final String MSG_EXIT_CONFIRM = "¿Está seguro de salir?";
    private static final String MSG_EXIT_TITLE = "Confirmar salida";
    private static final String MSG_DELETE_CONFIRM = "¿Está seguro de eliminar el libro:\n\"%s\"?";
    private static final String MSG_DELETE_TITLE = "Confirmar Eliminación";

    @Autowired
    public LibroForm(final LibroServicio libroServicio){
        this.libroServicio = libroServicio;
        iniciarForma();

        agregarButton.addActionListener(event -> agregarLibro());
        modificarButton.addActionListener(event -> modificarLibro());
        eliminarButton.addActionListener(event -> eliminarLibro());
        salirButton.addActionListener(event -> {
            var respuesta = JOptionPane.showConfirmDialog(this,
                    MSG_EXIT_CONFIRM, MSG_EXIT_TITLE,
                    JOptionPane.YES_NO_OPTION);
            if(respuesta == JOptionPane.YES_OPTION){
                System.exit(0);
            }
        });

        tablaLibros.addMouseListener(new MouseAdapter() {
            @Override
            public void mouseClicked(MouseEvent e) {
                super.mouseClicked(e);
                cargarLibroSeleccionado();
                // When a book is selected, disable Add and enable Modify/Delete
                configurarBotonesParaEdicion();
            }
        });
        configurarBotonesParaAgregar();
    }

    private void iniciarForma(){
        setTitle("Tienda de Libros");
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        setSize(950, 700);
        setMinimumSize(new Dimension(850, 600)); // Minimum size to avoid cutting off

        crearComponentes();
        // Center the window on the screen
        Toolkit toolkit = Toolkit.getDefaultToolkit();
        Dimension tamanioPantalla = toolkit.getScreenSize();
        int x = (tamanioPantalla.width - getWidth()) / 2;
        int y = (tamanioPantalla.height - getHeight()) / 2;
        setLocation(x, y);

        setVisible(true);
    }

    private void crearComponentes(){
        panel = new JPanel();
        panel.setLayout(new BorderLayout(10, 10));
        panel.setBackground(COLOR_BACKGROUND);
        panel.setBorder(BorderFactory.createEmptyBorder(15, 15, 15, 15));

        // Add top panel (title)
        panel.add(createTopPanel(), BorderLayout.NORTH);
        // Add form panel (center)
        panel.add(createFormPanel(), BorderLayout.CENTER);
        // Add table panel (bottom)
        panel.add(createTablePanel(), BorderLayout.SOUTH);

        setContentPane(panel);
    }

    // Creates the top panel with the title
    private JPanel createTopPanel() {
        final JPanel panelSuperior = new JPanel();
        panelSuperior.setBackground(COLOR_PRIMARY);
        panelSuperior.setBorder(BorderFactory.createEmptyBorder(20, 10, 20, 10));
        final JLabel titulo = new JLabel("Tienda de Libros");
        titulo.setFont(new Font("Segoe UI", Font.BOLD, 32));
        titulo.setForeground(Color.WHITE);
        panelSuperior.add(titulo);
        return panelSuperior;
    }

    // Creates the form panel (center)
    private JPanel createFormPanel() {
        final JPanel panelFormulario = new JPanel();
        panelFormulario.setLayout(new GridBagLayout());
        panelFormulario.setBackground(COLOR_PANEL);
        panelFormulario.setBorder(BorderFactory.createCompoundBorder(
                BorderFactory.createLineBorder(new Color(189, 195, 199), 1),
                BorderFactory.createEmptyBorder(20, 20, 20, 20)
        ));
        panelFormulario.addMouseListener(new MouseAdapter() {
            @Override
            public void mouseClicked(MouseEvent e) {
                if (tablaLibros.getSelectedRow() != -1) {
                    limpiarFormulario();
                }
            }
        });
        final GridBagConstraints gbc = new GridBagConstraints();
        gbc.insets = new Insets(10, 10, 10, 10);
        gbc.fill = GridBagConstraints.HORIZONTAL;
        gbc.weightx = 1.0;
        // Book
        gbc.gridx = 0;
        gbc.gridy = 0;
        gbc.weightx = 0.0;
        final JLabel labelLibro = new JLabel("Libro:");
        labelLibro.setFont(new Font("Segoe UI", Font.BOLD, 14));
        labelLibro.setForeground(COLOR_TEXT);
        panelFormulario.add(labelLibro, gbc);
        gbc.gridx = 1;
        gbc.weightx = 1.0;
        libroTexto = new JTextField(30);
        estilizarCampoTexto(libroTexto);
        panelFormulario.add(libroTexto, gbc);
        // Author
        gbc.gridx = 0;
        gbc.gridy = 1;
        gbc.weightx = 0.0;
        final JLabel labelAutor = new JLabel("Autor:");
        labelAutor.setFont(new Font("Segoe UI", Font.BOLD, 14));
        labelAutor.setForeground(COLOR_TEXT);
        panelFormulario.add(labelAutor, gbc);
        gbc.gridx = 1;
        gbc.weightx = 1.0;
        autorTexto = new JTextField(30);
        estilizarCampoTexto(autorTexto);
        panelFormulario.add(autorTexto, gbc);
        // Price
        gbc.gridx = 0;
        gbc.gridy = 2;
        gbc.weightx = 0.0;
        final JLabel labelPrecio = new JLabel("Precio:");
        labelPrecio.setFont(new Font("Segoe UI", Font.BOLD, 14));
        labelPrecio.setForeground(COLOR_TEXT);
        panelFormulario.add(labelPrecio, gbc);
        gbc.gridx = 1;
        gbc.weightx = 1.0;
        precioTexto = new JTextField(30);
        estilizarCampoTexto(precioTexto);
        panelFormulario.add(precioTexto, gbc);
        // Stock
        gbc.gridx = 0;
        gbc.gridy = 3;
        gbc.weightx = 0.0;
        final JLabel labelExistencias = new JLabel("Existencias:");
        labelExistencias.setFont(new Font("Segoe UI", Font.BOLD, 14));
        labelExistencias.setForeground(COLOR_TEXT);
        panelFormulario.add(labelExistencias, gbc);
        gbc.gridx = 1;
        gbc.weightx = 1.0;
        existenciasTexto = new JTextField(30);
        estilizarCampoTexto(existenciasTexto);
        panelFormulario.add(existenciasTexto, gbc);
        // Buttons
        gbc.gridx = 0;
        gbc.gridy = 4;
        gbc.gridwidth = 2;
        gbc.weightx = 0.0;
        gbc.anchor = GridBagConstraints.CENTER;
        panelFormulario.add(createButtonPanel(), gbc);
        return panelFormulario;
    }

    // Creates the button panel
    private JPanel createButtonPanel() {
        final JPanel panelBotones = new JPanel();
        panelBotones.setBackground(COLOR_PANEL);
        panelBotones.setBorder(BorderFactory.createEmptyBorder(10, 0, 10, 0));
        agregarButton = new JButton("Agregar");
        estilizarBoton(agregarButton, COLOR_SUCCESS);
        modificarButton = new JButton("Modificar");
        estilizarBoton(modificarButton, COLOR_WARNING);
        eliminarButton = new JButton("Eliminar");
        estilizarBoton(eliminarButton, COLOR_DANGER);
        salirButton = new JButton("Salir");
        estilizarBoton(salirButton, new Color(52, 73, 94));
        panelBotones.add(agregarButton);
        panelBotones.add(Box.createHorizontalStrut(10));
        panelBotones.add(modificarButton);
        panelBotones.add(Box.createHorizontalStrut(10));
        panelBotones.add(eliminarButton);
        panelBotones.add(Box.createHorizontalStrut(40));
        panelBotones.add(salirButton);
        return panelBotones;
    }

    // Creates the table panel (bottom)
    private JScrollPane createTablePanel() {
        createUIComponents();
        estilizarTabla();
        final JScrollPane scrollPane = new JScrollPane(tablaLibros);
        scrollPane.setPreferredSize(new Dimension(850, 280));
        scrollPane.setBorder(BorderFactory.createCompoundBorder(
                BorderFactory.createEmptyBorder(10, 0, 0, 0),
                BorderFactory.createLineBorder(new Color(189, 195, 199), 1)
        ));
        scrollPane.getViewport().setBackground(Color.WHITE);
        return scrollPane;
    }

    private void estilizarBoton(JButton boton, Color colorFondo) {
        boton.setFont(new Font("Segoe UI", Font.BOLD, 13));
        boton.setBackground(colorFondo);
        boton.setForeground(Color.WHITE);
        boton.setFocusPainted(false);
        boton.setBorderPainted(false);
        boton.setCursor(new Cursor(Cursor.HAND_CURSOR));
        boton.setPreferredSize(new Dimension(130, 35));

        // Hover effect
        boton.addMouseListener(new MouseAdapter() {
            public void mouseEntered(MouseEvent evt) {
                boton.setBackground(colorFondo.darker());
            }
            public void mouseExited(MouseEvent evt) {
                boton.setBackground(colorFondo);
            }
        });
    }

    private void estilizarCampoTexto(JTextField campo) {
        campo.setFont(new Font("Segoe UI", Font.PLAIN, 13));
        campo.setBorder(BorderFactory.createCompoundBorder(
                BorderFactory.createLineBorder(new Color(189, 195, 199), 1),
                BorderFactory.createEmptyBorder(5, 10, 5, 10)
        ));
    }

    private void estilizarTabla() {
        // Table header style
        JTableHeader header = tablaLibros.getTableHeader();
        header.setBackground(COLOR_PRIMARY);
        header.setForeground(Color.WHITE);
        header.setFont(new Font("Segoe UI", Font.BOLD, 13));
        header.setPreferredSize(new Dimension(header.getWidth(), 35));

        // Table style
        tablaLibros.setFont(new Font("Segoe UI", Font.PLAIN, 12));
        tablaLibros.setRowHeight(28);
        tablaLibros.setGridColor(new Color(189, 195, 199));
        tablaLibros.setSelectionBackground(new Color(52, 152, 219));
        tablaLibros.setSelectionForeground(Color.WHITE);
        tablaLibros.setShowGrid(true);
        tablaLibros.setIntercellSpacing(new Dimension(1, 1));
    }

    private void agregarLibro(){
        // Read the values from the form
        if(libroTexto.getText().equals("")){
            mostrarMensaje(MSG_ENTER_BOOK_NAME);
            libroTexto.requestFocusInWindow();
            return;
        }
        final String nombreLibro = libroTexto.getText();
        final String autor = autorTexto.getText();
        // Validate that price is a valid number
        final double precio;
        try {
            precio = Double.parseDouble(precioTexto.getText());
        } catch (NumberFormatException e) {
            mostrarMensaje(MSG_ENTER_VALID_PRICE);
            precioTexto.requestFocusInWindow();
            return;
        }
        // Validate that stock is a valid integer
        final int existencias;
        try {
            existencias = Integer.parseInt(existenciasTexto.getText());
        } catch (NumberFormatException e) {
            mostrarMensaje(MSG_ENTER_VALID_STOCK);
            existenciasTexto.requestFocusInWindow();
            return;
        }
        // Create the book object
        final Libro libro = new Libro(null, nombreLibro, autor, precio, existencias);
        this.libroServicio.guardarLibro(libro);
        mostrarMensaje(MSG_BOOK_ADDED);
        limpiarFormulario();
        listarLibros();
    }

    private void cargarLibroSeleccionado(){
        // Column indices start at 0
        var renglon = tablaLibros.getSelectedRow();
        if(renglon != -1){
            libroTexto.setText(tablaLibros.getValueAt(renglon, 1).toString());
            autorTexto.setText(tablaLibros.getValueAt(renglon, 2).toString());
            precioTexto.setText(tablaLibros.getValueAt(renglon, 3).toString());
            existenciasTexto.setText(tablaLibros.getValueAt(renglon, 4).toString());
        }
    }

    private void modificarLibro(){
        if(this.tablaLibros.getSelectedRow() == -1){
            mostrarMensaje(MSG_SELECT_BOOK_FROM_TABLE);
            return;
        }
        if(libroTexto.getText().equals("")){
            mostrarMensaje(MSG_ENTER_BOOK_NAME);
            libroTexto.requestFocusInWindow();
            return;
        }
        // Get the ID of the selected book
        int renglon = tablaLibros.getSelectedRow();
        int idLibro = Integer.parseInt(tablaLibros.getValueAt(renglon, 0).toString());

        // Create the book object with new values
        var nombreLibro = libroTexto.getText();
        var autor = autorTexto.getText();
        var precio = Double.parseDouble(precioTexto.getText());
        var existencias = Integer.parseInt(existenciasTexto.getText());

        var libro = new Libro(idLibro, nombreLibro, autor, precio, existencias);
        libroServicio.guardarLibro(libro);
        mostrarMensaje(MSG_BOOK_MODIFIED);
        limpiarFormulario();
        listarLibros();
    }

    private void eliminarLibro(){
        var renglon = tablaLibros.getSelectedRow();
        if(renglon != -1){
            int idLibro = Integer.parseInt(tablaLibros.getValueAt(renglon, 0).toString());
            String nombreLibro = tablaLibros.getValueAt(renglon, 1).toString();

            // Ask for confirmation before deleting
            var respuesta = JOptionPane.showConfirmDialog(
                    this,
                    String.format(MSG_DELETE_CONFIRM, nombreLibro),
                    MSG_DELETE_TITLE,
                    JOptionPane.YES_NO_OPTION,
                    JOptionPane.WARNING_MESSAGE
            );

            if(respuesta == JOptionPane.YES_OPTION) {
                var libro = new Libro();
                libro.setIdLibro(idLibro);
                libroServicio.eliminarLibro(libro);
                mostrarMensaje(MSG_BOOK_DELETED);
                limpiarFormulario();
                listarLibros();
            }
        } else {
            mostrarMensaje(MSG_SELECT_BOOK_TO_DELETE);
        }
    }

    private void limpiarFormulario(){
        libroTexto.setText("");
        autorTexto.setText("");
        precioTexto.setText("");
        existenciasTexto.setText("");

        // Deselect the table
        tablaLibros.clearSelection();

        // Return to add mode
        configurarBotonesParaAgregar();
    }

    private void configurarBotonesParaAgregar() {
        // Only allow adding new books
        agregarButton.setEnabled(true);
        modificarButton.setEnabled(false);
        eliminarButton.setEnabled(false);
    }

    private void configurarBotonesParaEdicion() {
        // Only allow modifying or deleting the selected book
        agregarButton.setEnabled(false);
        modificarButton.setEnabled(true);
        eliminarButton.setEnabled(true);
    }

    private void mostrarMensaje(String mensaje){
        JOptionPane.showMessageDialog(this, mensaje);
    }

    private void createUIComponents() {
        idTexto = new JTextField("");
        idTexto.setVisible(false);
        this.tablaModeloLibros = new DefaultTableModel(0, 5){
            @Override
            public boolean isCellEditable(int row, int column){
                return false;
            }
        };
        String[] cabecera = {"Id", "Libro", "Autor", "Precio", "Existencias"};
        this.tablaModeloLibros.setColumnIdentifiers(cabecera);
        //Instantiate the JTable object
        this.tablaLibros = new JTable(tablaModeloLibros);
        // Prevent selecting multiple records
        tablaLibros.setSelectionMode(ListSelectionModel.SINGLE_SELECTION);
        listarLibros();
    }

    private void listarLibros(){
        // Clear the table
        tablaModeloLibros.setRowCount(0);
        // Get the books from the DB
        var libros = libroServicio.listarLibros();
        // Iterate each book
        libros.forEach((libro) -> { // lambda function
            // Create each record to add to the table
            Object [] renglonLibro = {
                    libro.getIdLibro(),
                    libro.getNombreLibro(),
                    libro.getAutor(),
                    libro.getPrecio(),
                    libro.getExistencias()
            };
            this.tablaModeloLibros.addRow(renglonLibro);
        });
    }

}