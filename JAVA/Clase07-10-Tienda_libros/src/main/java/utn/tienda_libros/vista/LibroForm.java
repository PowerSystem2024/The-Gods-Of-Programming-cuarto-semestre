package utn.tienda_libros.vista;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import utn.tienda_libros.modelo.Libro;
import utn.tienda_libros.servicio.LibroServicio;

import javax.swing.*;
import javax.swing.table.DefaultTableModel;
import java.awt.event.MouseAdapter;
import java.awt.event.MouseEvent;

@Component
public class LibroForm extends JFrame {
    private final LibroServicio libroServicio;
    private JPanel panel;
    private JTable tablaLibros;
    private JTextField libroTexto;
    private JTextField autorTexto;
    private JTextField precioTexto;
    private JTextField existenciasTexto;
    private JButton agregarButton;
    private JButton modificarButton;
    private JButton eliminarButton;
    private DefaultTableModel tablaModeloLibros;

    private static final String MSG_ENTER_BOOK_NAME = "Ingrese el nombre del libro";
    private static final String MSG_ENTER_VALID_PRICE = "Ingrese un número válido para el precio";
    private static final String MSG_ENTER_VALID_STOCK = "Ingrese un número entero válido para existencias";
    private static final String MSG_BOOK_ADDED = "Libro agregado...";
    private static final String MSG_SELECT_BOOK_TO_DELETE = "Debe seleccionar un libro para eliminar";
    private static final String MSG_BOOK_DELETED = "Libro eliminado exitosamente";
    private static final String MSG_BOOK_MODIFIED = "Libro modificado exitosamente";
    private static final String MSG_SELECT_BOOK_FROM_TABLE = "Debe seleccionar un libro de la tabla";
    private static final String MSG_DELETE_CONFIRM = "¿Está seguro de eliminar el libro:\n\"%s\"?";
    private static final String MSG_DELETE_TITLE = "Confirmar Eliminación";

    @Autowired
    public LibroForm(final LibroServicio libroServicio){
        this.libroServicio = libroServicio;
        $$$setupUI$$$(); // Construye la UI desde el .form
        setContentPane(panel);
        setTitle("Tienda de Libros");
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        setSize(950, 700);
        setLocationRelativeTo(null);
        setVisible(true);

        // Personalizar el botón 'Agregar' (fondo verde y borde redondeado)
        agregarButton.setBackground(new java.awt.Color(39, 174, 96)); // Verde
        agregarButton.setForeground(java.awt.Color.WHITE);
        agregarButton.setFocusPainted(false);
        agregarButton.setBorder(new javax.swing.border.LineBorder(new java.awt.Color(30, 132, 73), 2, true));

        // Personalizar el botón 'Modificar' (fondo naranja oscuro y borde redondeado)
        modificarButton.setBackground(new java.awt.Color(211, 84, 0)); // Naranja oscuro
        modificarButton.setForeground(java.awt.Color.WHITE);
        modificarButton.setFocusPainted(false);
        modificarButton.setBorder(new javax.swing.border.LineBorder(new java.awt.Color(120, 66, 18), 2, true));

        // Personalizar el botón 'Eliminar' (fondo rojo y borde redondeado)
        eliminarButton.setBackground(new java.awt.Color(192, 57, 43)); // Rojo
        eliminarButton.setForeground(java.awt.Color.WHITE);
        eliminarButton.setFocusPainted(false);
        eliminarButton.setBorder(new javax.swing.border.LineBorder(new java.awt.Color(123, 36, 28), 2, true));

        // Inicializar modelo de tabla y eventos
        inicializarTabla();
        agregarButton.addActionListener(event -> agregarLibro());
        modificarButton.addActionListener(event -> modificarLibro());
        eliminarButton.addActionListener(event -> eliminarLibro());
        tablaLibros.addMouseListener(new MouseAdapter() {
            @Override
            public void mouseClicked(MouseEvent e) {
                super.mouseClicked(e);
                cargarLibroSeleccionado();
                configurarBotonesParaEdicion();
            }
        });
        configurarBotonesParaAgregar();
    }

    private void inicializarTabla() {
        this.tablaModeloLibros = new DefaultTableModel(0, 5){
            @Override
            public boolean isCellEditable(int row, int column){
                return false;
            }
        };
        String[] cabecera = {"Id", "Libro", "Autor", "Precio", "Existencias"};
        this.tablaModeloLibros.setColumnIdentifiers(cabecera);
        this.tablaLibros.setModel(tablaModeloLibros);
        tablaLibros.setSelectionMode(ListSelectionModel.SINGLE_SELECTION);
        listarLibros();
    }

    private void listarLibros() {
        // Clear the table
        tablaModeloLibros.setRowCount(0);
        // Get the books from the service
        var libros = libroServicio.listarLibros();
        // Add each book to the table
        for (var libro : libros) {
            Object[] row = {
                libro.getIdLibro(),
                libro.getNombreLibro(),
                libro.getAutor(),
                libro.getPrecio(),
                libro.getExistencias()
            };
            tablaModeloLibros.addRow(row);
        }
    }

    private void agregarLibro(){
        if(libroTexto.getText().isEmpty()){
            mostrarMensaje(MSG_ENTER_BOOK_NAME);
            libroTexto.requestFocusInWindow();
            return;
        }
        final String nombreLibro = libroTexto.getText();
        final String autor = autorTexto.getText();
        final double precio;
        try {
            precio = Double.parseDouble(precioTexto.getText());
        } catch (NumberFormatException e) {
            mostrarMensaje(MSG_ENTER_VALID_PRICE);
            precioTexto.requestFocusInWindow();
            return;
        }
        final int existencias;
        try {
            existencias = Integer.parseInt(existenciasTexto.getText());
        } catch (NumberFormatException e) {
            mostrarMensaje(MSG_ENTER_VALID_STOCK);
            existenciasTexto.requestFocusInWindow();
            return;
        }
        final Libro libro = new Libro(null, nombreLibro, autor, precio, existencias);
        this.libroServicio.guardarLibro(libro);
        mostrarMensaje(MSG_BOOK_ADDED);
        limpiarFormulario();
        listarLibros();
    }

    private void cargarLibroSeleccionado(){
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
        if(libroTexto.getText().isEmpty()){
            mostrarMensaje(MSG_ENTER_BOOK_NAME);
            libroTexto.requestFocusInWindow();
            return;
        }
        int renglon = tablaLibros.getSelectedRow();
        int idLibro = Integer.parseInt(tablaLibros.getValueAt(renglon, 0).toString());
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
        tablaLibros.clearSelection();
        configurarBotonesParaAgregar();
    }

    private void configurarBotonesParaAgregar() {
        agregarButton.setEnabled(true);
        modificarButton.setEnabled(false);
        eliminarButton.setEnabled(false);
    }

    private void configurarBotonesParaEdicion() {
        agregarButton.setEnabled(false);
        modificarButton.setEnabled(true);
        eliminarButton.setEnabled(true);
    }

    private void mostrarMensaje(String mensaje){
        JOptionPane.showMessageDialog(this, mensaje);
    }

    // Método generado por IntelliJ IDEA GUI Designer
    private void $$$setupUI$$$() {
        // ...este método es generado automáticamente por el IDE...
    }

    // Método requerido por IntelliJ GUI Designer para componentes con 'Custom Create'
    private void createUIComponents() {
        // Inicializa la tabla de libros para el binding 'tablaLibros' con Custom Create
        tablaLibros = new JTable();
        // Si hay otros componentes con Custom Create, inicializarlos aquí
    }
}
