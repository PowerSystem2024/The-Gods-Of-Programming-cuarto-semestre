import { Link } from 'react-router-dom';
import '../styles/about.css';

const About = () => {
  return (
    <div className="about-page">
      <div className="container">
        {/* Hero Section */}
        <section className="about-hero">
          <h1>Nuestra Historia 🧁</h1>
          <p className="subtitle">Donde cada dulce cuenta una historia de pasión y emprendimiento</p>
        </section>

        {/* Story Section */}
        <section className="story-section">
          <div className="story-content">
            <h2>¿Cómo nació Rincón de Pasteleros?</h2>
            <p>
              Todo comenzó en 2023, cuando María, una pastelera apasionada, se dio cuenta de que muchas talentosas 
              emprendedoras como ella luchaban por darse a conocer. Hacían los mejores pasteles, las tortas más 
              deliciosas y los postres más creativos, pero no tenían un espacio donde mostrar su arte al mundo.
            </p>
            <p>
              María soñaba con un lugar donde las pasteleras independientes pudieran compartir sus creaciones, 
              donde los clientes pudieran descubrir nuevos sabores y donde cada compra significara apoyar el 
              sueño de una emprendedora. Así nació <strong>Rincón de Pasteleros</strong>.
            </p>
            <p>
              Hoy, somos más que un marketplace. Somos una comunidad que celebra el talento, la dedicación y 
              el amor que se hornea en cada producto. Cada pastelera que se une a nuestra plataforma trae consigo 
              una historia única, una receta especial y un sueño de crecer.
            </p>
          </div>
        </section>

        {/* Mission Section */}
        <section className="mission-section">
          <div className="mission-grid">
            <div className="mission-card">
              <div className="mission-icon">🎯</div>
              <h3>Nuestra Misión</h3>
              <p>
                Impulsar el crecimiento de pasteleras independientes brindándoles una plataforma accesible 
                para mostrar sus productos, conectar con clientes y construir su marca.
              </p>
            </div>
            <div className="mission-card">
              <div className="mission-icon">👁️</div>
              <h3>Nuestra Visión</h3>
              <p>
                Ser el marketplace líder donde cada amante de los postres pueda descubrir tesoros artesanales 
                y donde cada pastelera tenga las herramientas para alcanzar sus metas.
              </p>
            </div>
            <div className="mission-card">
              <div className="mission-icon">💚</div>
              <h3>Nuestros Valores</h3>
              <p>
                Apoyo comunitario, calidad artesanal, comercio justo, empoderamiento femenino y pasión por 
                los postres hechos con amor.
              </p>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="stats-section">
          <h2>Nuestro Impacto</h2>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-number">150+</div>
              <div className="stat-label">Pasteleras Registradas</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">5,000+</div>
              <div className="stat-label">Productos Vendidos</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">2,500+</div>
              <div className="stat-label">Clientes Satisfechos</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">98%</div>
              <div className="stat-label">Recomendación</div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="cta-section">
          <div className="cta-content">
            <h2>¿Eres Pastelera?</h2>
            <p>
              Únete a nuestra comunidad de emprendedoras y lleva tu negocio al siguiente nivel. 
              Es gratis comenzar y solo toma unos minutos.
            </p>
            <div className="cta-buttons">
              <Link to="/register" className="btn btn-primary">
                Registrarme como Vendedora
              </Link>
              <Link to="/products" className="btn btn-secondary">
                Explorar Productos
              </Link>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="team-section">
          <h2>Conoce a Algunas de Nuestras Pasteleras</h2>
          <div className="team-grid">
            <div className="team-card">
              <div className="team-avatar">👩‍🍳</div>
              <h3>María Dulzura</h3>
              <p className="team-role">Especialista en Tortas de Celebración</p>
              <p className="team-bio">
                "Rincón de Pasteleros me ayudó a crecer de hacer 2 tortas por semana a tener 
                pedidos todos los días. ¡Es un sueño hecho realidad!"
              </p>
            </div>
            <div className="team-card">
              <div className="team-avatar">👩‍🍳</div>
              <h3>Ana Repostería</h3>
              <p className="team-role">Maestra de Cupcakes Gourmet</p>
              <p className="team-bio">
                "La plataforma es súper fácil de usar y el apoyo de la comunidad es increíble. 
                Aquí encontré clientes que se volvieron amigos."
              </p>
            </div>
            <div className="team-card">
              <div className="team-avatar">👩‍🍳</div>
              <h3>Laura Deliciosa</h3>
              <p className="team-role">Experta en Postres Veganos</p>
              <p className="team-bio">
                "Gracias a Rincón de Pasteleros, pude dar a conocer mis postres veganos a 
                personas que realmente los aprecian y valoran."
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default About;
