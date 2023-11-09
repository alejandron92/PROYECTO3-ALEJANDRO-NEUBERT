import axios from "axios";
import Swal from "sweetalert2";
import React, { useState, useEffect } from "react";
import "react-toastify/dist/ReactToastify.css";

const Poliza = () => {
  const [propiedad, setPropiedad] = useState([]);
  const [propiedadElegida, setPropiedadElegida] = useState("");
  const [ubicacionElegida, setUbicacionElegida] = useState("");
  const [fechaCotizacion, setfechaCotizacion] = useState("");
  const [metro2Cantidad, setMetro2Cantidad] = useState(20);
  const [valorDolar, setValorDolar] = useState("");
  const costoM2 = 35.86;
  const [resultArray, setResultArray] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("src/components/datos.json");
        const propiedadData = response.data.map((item, index) => ({
          ...item,
          id: index,
        }));
        setPropiedad(propiedadData);
        console.log(response.data);
      } catch (error) {
        console.error("error fetch", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    axios
      .get("https://api.bluelytics.com.ar/v2/latest")
      .then((response) => {
        const blueDolarValue = response.data.blue.value_buy;
        setValorDolar(blueDolarValue);
      })
      .catch((error) => {
        console.error("error fetch", error);
      });
  }, []);

  const saveDataToLocalStorage = (data, key) => {
    localStorage.setItem(key, JSON.stringify(data));
  };

  function getCurrentDateTime() {
    const now = new Date();
    return now.toLocaleString();
  }

  const [polizaData, setPolizaData] = useState({
    dolar: valorDolar,
    tipoPropiedad: propiedad,
    factorPropiedad: propiedadElegida,
    factorUbicacion: ubicacionElegida,
    metros2: metro2Cantidad,
    costoM2: costoM2,
    polizaValor: "0.00",
    fecha: fechaCotizacion,
  });

  const cotizarPoliza = () => {
    if (metro2Cantidad === "" || !propiedadElegida || !ubicacionElegida) {
      return alerta(
        "¡Falta información!",
        "Por favor, complete todos los datos necesarios para realizar la cotización."
      );
    } else {
      const currentDateTime = getCurrentDateTime();
      setfechaCotizacion(currentDateTime);
      const selectedPropiedad = propiedad.find(
        (item) =>
          item.factor === parseFloat(propiedadElegida) &&
          item.categoria === "propiedad"
      );
      const selectedUbicacion = propiedad.find(
        (item) =>
          item.factor === parseFloat(ubicacionElegida) &&
          item.categoria === "ubicacion"
      );
      const polizaValor =
        costoM2 * propiedadElegida * ubicacionElegida * metro2Cantidad;
      const updatedPolizaData = {
        propiedad: selectedPropiedad ? selectedPropiedad.tipo : "",
        ubicacion: selectedUbicacion ? selectedUbicacion.tipo : "",
        fechaCotizacion: currentDateTime,
        costoM2,
        propiedadElegida,
        ubicacionElegida,
        metro2Cantidad,
        polizaValor: polizaValor.toFixed(2),
        dolar: valorDolar,
      };

      const copiedPolizaData = JSON.parse(JSON.stringify(updatedPolizaData));
      const updatedResultArray = [...resultArray, copiedPolizaData];

      setPolizaData(updatedPolizaData);
      setResultArray(updatedResultArray);
      saveDataToLocalStorage(updatedResultArray, "polizaData");
      console.log(updatedResultArray);
      alerta("", "Cotización realizada y guardada con éxito.", "success");
    }
  };

  const alerta = (titulo, mensaje, icono) => {
    Swal.fire({
      icon: icono || "",
      title: titulo || "",
      text: mensaje,
      showConfirmButton: false,
      timer: 3500,
      width: "240px",
    });
  };

  return (
    <div className=" center div-cotizador">
      <div>
        <label>Selecciona el tipo de propiedad</label>
        <select
          name="Propiedad"
          value={propiedadElegida}
          onChange={(e) => setPropiedadElegida(e.target.value)}
        >
          <option value="">...</option>
          {propiedad
            .filter((item) => item.categoria === "propiedad")
            .map((item) => (
              <option key={item.id} value={item.factor}>
                {" "}
                {item.tipo}
              </option>
            ))}
        </select>
        <div>
          <label>Selecciona la ubicacion</label>
          <select
            name="Ubicacion"
            value={ubicacionElegida}
            onChange={(e) => setUbicacionElegida(e.target.value)}
          >
            <option value="">...</option>
            {propiedad
              .filter((item) => item.categoria === "ubicacion")
              .map((item) => (
                <option key={item.id} id={item.tipo} value={item.factor}>
                  {item.tipo}
                </option>
              ))}
          </select>
        </div>
        <div>
          <label htmlFor="metros2">Ingresa los Metros cuadrados:</label>
          <input
            value={metro2Cantidad}
            onChange={(e) => setMetro2Cantidad(e.target.value)}
            type="number"
            id="metros2"
            min="20"
            max="500"
            required
          />
        </div>
        <div className="center separador">
          <button
            className="button button-outline"
            onClick={() => {
              cotizarPoliza();
            }}
          >
            Cotizar y Guardar en Historial
          </button>
          <div className="center separador">
            <p className="importe">
              Precio estimado: ${" "}
              <span id="valorPoliza">
                {polizaData.polizaValor} o USD{" "}
                {(polizaData.polizaValor / valorDolar).toFixed(2)}
              </span>{" "}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Poliza;
