import {
  apiAuthTutorado,
  apiPostActivity,
  getDataSP,
  removeDataSP,
  saveDataSP,
} from "../../../services/activity.service";
import { CREATED } from "../../../utils/constants";
import { convertSlugToText, responseVoice } from "../../../utils/functions";

let processActivity = false;
let processCategorie = false;
let actividad = {};

export const dataVoice = [
  {
    input: [
      "registrar_una_actividad",
      "realizar_una_actividad",
      "agregar_una_actividad",
      "crear_una_actividad",
      "registrar_actividad",
      "realizar_actividad",
      "agregar_actividad",
      "nueva_actividad",
      "nuevo_registro",
      "crear_actividad",
    ],
    output: () => postActivity(),
  },
  {
    input: [
      "cancelar",
      "cancelar_registro",
      "olvidalo",
      "no_registrar",
      "borrar",
      "eliminar",
    ],
    output: () => cancelActivity(),
  },
  {
    input: ["cerrar_sesion"],
    output: (setRefresh, refresh) => cerrarSesion(setRefresh, refresh),
  },
];

const postActivity = async () => {
  const sp = await getDataSP("tutorado");
  const tutorado = JSON.parse(sp);
  if (!tutorado) {
    responseVoice(
      `Aun no ha iniciado sesión con su código, por favor solicítelo a su tutor`
    );
    return;
  }
  responseVoice("Claro, que actividad vas a realizar?");
  processActivity = true;
};

export const registerCode = async (codigo, setRefresh, refresh) => {
  const response = await apiAuthTutorado(codigo);
  if (response.status === 200) {
    responseVoice(response.data.message);
    console.log(response.data.tutorado);
    await saveDataSP("tutorado", JSON.stringify(response.data.tutorado));

    setRefresh(!refresh);
  } else {
    responseVoice(response);
  }
};
export const cerrarSesion = async (setRefresh, refresh) => {
  removeDataSP();
  responseVoice("Sesion cerrada");
  processActivity = false;
  processCategorie = false;
  actividad = {};
  setRefresh(!refresh);
};

const cancelActivity = () => {
  if (processActivity || processCategorie) {
    processActivity = false;
    processCategorie = false;
    actividad = {};
    responseVoice("Proceso cancelado");
  } else {
    responseVoice("No se esta ejecuntando ningun proceso");
  }
};

export const registerActivity = async (value) => {
  const sp = await getDataSP("tutorado");
  const tutorado = JSON.parse(sp);
  console.log(tutorado);
  if (!tutorado) {
    responseVoice(
      `Aun no ha iniciado sesión con su código, por favor solicítelo a su tutor`
    );
    return;
  }
  const valueConvert = convertSlugToText(value);
  if (processActivity && !processCategorie) {
    actividad.activity = valueConvert;
    responseVoice(
      `A que categoría pertenece la actividad, ${actividad.activity}`
    );
    processCategorie = true;
  } else if (processActivity && processCategorie) {
    actividad.categorie = valueConvert;
    const fechaFin = new Date();
    const actividadFinal = {
      nombre: actividad.activity,
      categoria: actividad.categorie,
      fechaInicio: new Date(),
      fechaFin: fechaFin.setHours(fechaFin.getHours() + 1),
      tutorado: tutorado._id,
    };
    const { status } = await apiPostActivity(actividadFinal);
    if (status === CREATED) {
      responseVoice(
        `Se ha registrado su actividad ${actividad.activity}, en la categoría ${actividad.categorie}`
      );
    } else {
      responseVoice(
        `No se podido registrar su actividad, por favor intente nuevamente`
      );
    }

    processActivity = false;
    processCategorie = false;
    actividad = {};
  } else {
    responseVoice();
  }
};
