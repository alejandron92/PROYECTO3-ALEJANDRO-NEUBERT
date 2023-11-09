import { Link } from "react-router-dom";

export default function Header() {
  return (
    <>
    <h1 className="center separador">Seguros del hogar 🏡</h1>
    <div className="historial"><Link to="/Historial"><span title="Ver Historial">📋</span></Link></div>
    <h2 className="center separador">Completa los datos solicitados</h2>
    </>
  );
}
