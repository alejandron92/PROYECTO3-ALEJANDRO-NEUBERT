import React from "react";
import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Historial() {
  const navigate = useNavigate();
  const [historyData, setHistoryData] = useState([]);
  

  useEffect(() => {
    const storedData = localStorage.getItem("polizaData");
    console.log(storedData);
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      setHistoryData(parsedData);
    }
  }, []);

  
  return (
    <div>
      <h1 className="center separador">Ver Historial 📋</h1>
      <div className=" center div-cotizador">
        <table>
          <thead>
            <tr>
              <th>Fecha de cotización</th>
              <th>Propiedad</th>
              <th>Ubicación</th>
              <th>Metros cuadrados</th>
              <th>Póliza mensual</th>
            </tr>
          </thead>
          <tbody>
            {historyData.map((item, index) => (
              <tr key={index}>
                <td>{item.fechaCotizacion}</td>
                <td>{item.propiedad}</td>
                <td>{item.ubicacion}</td>
                <td>{item.metro2Cantidad}</td>
                <td>${item.polizaValor} o USD {(item.polizaValor/item.dolar).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="center separador">
          <button
            onClick={() => navigate(-1)}
            className="button button-outline"
          >
            VOLVER
          </button>
        </div>
      </div>
    </div>
  );
}
