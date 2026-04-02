"use strict";

const input = document.getElementById("kkc-input");
const result = document.getElementById("kkc-result");
const statusText = document.getElementById("kkc-status");
const modeLabel = document.getElementById("kkc-mode-label");
const cameraBtn = document.getElementById("kkc-camera-btn");
const sendBtn = document.getElementById("kkc-send-btn");
const clearBtn = document.getElementById("kkc-clear-btn");
const editAiBtn = document.getElementById("kkc-editai-btn");
const keyboard = document.getElementById("kkc-keyboard");
const historyContainer = document.getElementById("kkc-history");
const toggleHistoryBtn = document.getElementById("kkc-toggle-history-btn");

const cameraModal = document.getElementById("kkc-camera-modal");
const cameraVideo = document.getElementById("kkc-camera-video");
const captureBtn = document.getElementById("kkc-capture-btn");
const closeCamBtn = document.getElementById("kkc-closecam-btn");
const switchCamBtn = document.getElementById("kkc-switchcam-btn");
const canvas = document.getElementById("kkc-canvas");

const AI_ENDPOINT = "https://kkcalculator-backend.onrender.com/api/ask";
const AI_HEALTH_ENDPOINT = "https://kkcalculator-backend.onrender.com/api/health";
const MAX_HISTORY = 8;

let cameraStream = null;
let usingBackCamera = true;
let historyItems = [];

function setStatus(message) {
  statusText.textContent = message;
}

function setResult(message) {
  result.textContent = message;
}

function revealResult() {
  result.scrollIntoView({ behavior: "smooth", block: "center" });
}

function normalizeExpression(rawExpression) {
  return rawExpression
    .replace(/,/g, ".")
    .replace(/\u00F7/g, "/")
    .replace(/\u00D7/g, "*")
    .replace(/x/g, "*")
    .replace(/X/g, "*")
    .replace(/\^2/g, "**2")
    .replace(/(\d+)%/g, "($1/100)")
    .replace(/sqrt\s*\(/gi, "Math.sqrt(")
    .replace(/\u221A\s*\(/g, "Math.sqrt(")
    .replace(/\u221A/g, "Math.sqrt(");
}

function isMathExpression(value) {
  const trimmed = value.trim();
  if (!trimmed) {
    return false;
  }

  const compact = normalizeExpression(trimmed).replace(/\s+/g, "");
  return /^[0-9+\-*/().%\s]*$/.test(trimmed) || /^[0-9+\-*/().Mathsqrt]+$/.test(compact);
}

function safeEvaluate(expression) {
  const normalized = normalizeExpression(expression);
  const compact = normalized.replace(/\s+/g, "");

  if (!compact) {
    throw new Error("Expresion vacia");
  }

  if (/[^0-9+\-*/().%\sMathsqrt]/.test(normalized)) {
    throw new Error("Expresion no valida");
  }

  const evaluator = new Function(`return (${normalized});`);
  const value = evaluator();

  if (typeof value !== "number" || Number.isNaN(value) || !Number.isFinite(value)) {
    throw new Error("Resultado no valido");
  }

  return Number(value.toFixed(10)).toString();
}

function buildLocalExplanation(query) {
  const cleaned = query.trim();

  if (isMathExpression(cleaned)) {
    const answer = safeEvaluate(cleaned);
    return `Resultado: ${answer}`;
  }

  if (/ecuacion|despeja|resuelve/i.test(cleaned)) {
    return "Puedo intentar ayudarte, pero para ecuaciones escritas en lenguaje natural es mejor encender el backend de IA y escribir la pregunta completa.";
  }

  return "Puedo calcular operaciones, leer ejercicios con la camara y enviar preguntas matematicas al backend de IA si esta encendido.";
}

function explainAiError(data, fallbackMessage) {
  switch (data?.providerStatus) {
    case "quota_exceeded":
      return "La IA esta configurada, pero la cuenta de OpenAI no tiene cuota disponible en este momento.";
    case "invalid_api_key":
      return "La IA no pudo autenticarse con OpenAI. Revisa la API key del backend.";
    case "missing_api_key":
      return "El backend esta encendido, pero falta configurar OPENAI_API_KEY en kkc-backend/.env.";
    default:
      return fallbackMessage || "No pude completar la consulta con IA.";
  }
}

function updateModeLabel(value) {
  modeLabel.textContent = isMathExpression(value) ? "Modo calculo" : "Modo IA";
}

function optimizeMobileLayout() {
  if (window.innerWidth <= 640 && !historyContainer.hasAttribute("hidden")) {
    historyContainer.setAttribute("hidden", "");
    toggleHistoryBtn.textContent = "Mostrar";
  }
}
function addHistoryItem(query, answer, source) {
  historyItems.unshift({ query, answer, source });
  historyItems = historyItems.slice(0, MAX_HISTORY);

  historyContainer.innerHTML = "";

  historyItems.forEach((item) => {
    const article = document.createElement("article");
    article.className = "kkc-history-item";
    article.innerHTML = `
      <p class="kkc-history-query">${item.query}</p>
      <p class="kkc-history-answer">${item.answer}</p>
      <span class="kkc-history-source">${item.source}</span>
    `;
    historyContainer.appendChild(article);
  });
}

async function resolveInput() {
  const value = input.value.trim();

  if (!value) {
    setResult("Escribe una operacion o una pregunta matematica.");
    setStatus("Falta contenido para resolver.");
    return;
  }

  updateModeLabel(value);

  if (isMathExpression(value)) {
    try {
      const answer = safeEvaluate(value);
      setResult(`Resultado: ${answer}`);
      setStatus("Operacion resuelta localmente.");
      addHistoryItem(value, `Resultado: ${answer}`, "Calculo local");
      revealResult();
    } catch (error) {
      setResult("No pude evaluar esa expresion. Revisa parentesis y operadores.");
      setStatus("La expresion necesita correccion.");
    }
    return;
  }

  setResult("Consultando el motor inteligente...");
  setStatus("Intentando resolver con IA.");

  try {
    const response = await fetch(AI_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: value })
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw {
        status: response.status,
        providerStatus: data.providerStatus,
        details: data.details,
        message: data.error || `HTTP ${response.status}`
      };
    }

    const answer = data.answer || "El backend no devolvio respuesta.";
    setResult(answer);
    setStatus("Respuesta generada por el backend de IA.");
    addHistoryItem(value, answer, "Backend IA");
    revealResult();
  } catch (error) {
    const fallback = buildLocalExplanation(value);
    const explanation = explainAiError(error, error?.details);

    setResult(`${explanation} Ayuda local: ${fallback}`);
    setStatus("La IA no estuvo disponible y se mostro una ayuda local.");
    addHistoryItem(value, fallback, "Ayuda local");
    revealResult();
  }
}

async function startCamera() {
  stopCamera();

  try {
    cameraStream = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: { ideal: usingBackCamera ? "environment" : "user" }
      },
      audio: false
    });

    cameraVideo.srcObject = cameraStream;
    cameraModal.hidden = false;
    setStatus("Camara lista para capturar.");
  } catch (error) {
    setResult("No se pudo acceder a la camara. Usa HTTPS o permisos del navegador.");
    setStatus("Fallo el acceso a la camara.");
    cameraModal.hidden = true;
  }
}

function stopCamera() {
  if (cameraStream) {
    cameraStream.getTracks().forEach((track) => track.stop());
  }

  cameraStream = null;
  cameraVideo.srcObject = null;
}

function normalizeOcrText(rawText) {
  return rawText
    .replace(/[\r\n]+/g, " ")
    .replace(/[|]/g, "/")
    .replace(/[xX×]/g, "*")
    .replace(/[–—]/g, "-")
    .replace(/[÷]/g, "/")
    .replace(/\s*([+\-*/=()%^])\s*/g, " $1 ")
    .replace(/\s+/g, " ")
    .trim();
}

function createOcrVariants(sourceCanvas) {
  const variants = [sourceCanvas.toDataURL("image/png")];
  const width = sourceCanvas.width;
  const height = sourceCanvas.height;
  const processedCanvas = document.createElement("canvas");
  processedCanvas.width = width;
  processedCanvas.height = height;
  const processedContext = processedCanvas.getContext("2d", { willReadFrequently: true });

  processedContext.drawImage(sourceCanvas, 0, 0, width, height);
  const imageData = processedContext.getImageData(0, 0, width, height);
  const data = imageData.data;

  for (let i = 0; i < data.length; i += 4) {
    const gray = Math.round(data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114);
    const boosted = gray > 155 ? 255 : gray < 95 ? 0 : gray;
    data[i] = boosted;
    data[i + 1] = boosted;
    data[i + 2] = boosted;
  }

  processedContext.putImageData(imageData, 0, 0);
  variants.push(processedCanvas.toDataURL("image/png"));
  return variants;
}

async function readMathFromCanvas(sourceCanvas) {
  const variants = createOcrVariants(sourceCanvas);
  let bestText = "";

  for (const imageData of variants) {
    const ocr = await Tesseract.recognize(imageData, "spa+eng", {
      tessedit_pageseg_mode: "6",
      tessedit_char_whitelist: "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ+-*/=().,%^ xX÷×v"
    });

    const text = normalizeOcrText(ocr.data.text || "");
    if (text.length > bestText.length) {
      bestText = text;
    }

    if (/[0-9][0-9+\-*/=().,%^ ]+/.test(text)) {
      return text;
    }
  }

  return bestText;
}

async function captureAndRead() {
  if (!cameraStream) {
    setStatus("La camara aun no esta activa.");
    return;
  }

  const width = cameraVideo.videoWidth;
  const height = cameraVideo.videoHeight;

  if (!width || !height) {
    setStatus("Espera un momento a que cargue la imagen de la camara.");
    return;
  }

  const cropWidth = Math.floor(width * 0.82);
  const cropHeight = Math.floor(height * 0.34);
  const cropX = Math.floor((width - cropWidth) / 2);
  const cropY = Math.floor((height - cropHeight) / 2.5);

  canvas.width = cropWidth;
  canvas.height = cropHeight;
  const context = canvas.getContext("2d", { willReadFrequently: true });
  context.drawImage(cameraVideo, cropX, cropY, cropWidth, cropHeight, 0, 0, cropWidth, cropHeight);

  setResult("Procesando texto de la imagen...");
  setStatus("Mejorando la imagen y ejecutando OCR.");

  try {
    const text = await readMathFromCanvas(canvas);

    if (!text) {
      throw new Error("No se detecto texto");
    }

    input.value = text;
    updateModeLabel(text);
    setStatus("Texto detectado desde la camara.");
    revealResult();
    addHistoryItem("Escaneo", text, "OCR");
    cameraModal.hidden = true;
    stopCamera();
    await resolveInput();
  } catch (error) {
    setResult("No pude leer bien la imagen. Intenta acercarte mas, usar buena luz y enfocar solo el ejercicio.");
    setStatus("El OCR no encontro un ejercicio legible.");
  }
}

function handleKeyboardInput(key) {
  switch (key) {
    case "AC":
      input.value = "";
      setResult("El resultado o la explicacion apareceran aqui.");
      setStatus("Campos reiniciados.");
      break;
    case "DEL":
      input.value = input.value.slice(0, -1);
      break;
    case "+/-":
      input.value = input.value.startsWith("-") ? input.value.slice(1) : `-${input.value}`;
      break;
    case "sqrt":
      input.value += "sqrt(";
      break;
    case "^2":
      input.value += "^2";
      break;
    case "=":
      resolveInput();
      return;
    default:
      input.value += key;
      break;
  }

  updateModeLabel(input.value);
}

cameraBtn.addEventListener("click", startCamera);
switchCamBtn.addEventListener("click", async () => {
  usingBackCamera = !usingBackCamera;
  await startCamera();
});
closeCamBtn.addEventListener("click", () => {
  cameraModal.hidden = true;
  stopCamera();
  setStatus("Camara cerrada.");
});
captureBtn.addEventListener("click", captureAndRead);

sendBtn.addEventListener("click", resolveInput);
clearBtn.addEventListener("click", () => {
  input.value = "";
  setResult("El resultado o la explicacion apareceran aqui.");
  setStatus("Campos limpiados.");
  updateModeLabel("");
});

editAiBtn.addEventListener("click", () => {
  setResult("Comprobando el estado del backend de IA...");
  setStatus("Consultando disponibilidad del backend.");

  fetch(AI_HEALTH_ENDPOINT)
    .then(async (response) => {
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      let statusLine = "Backend IA no disponible.";
      let statusCopy = "Backend IA no disponible.";

      switch (data.providerStatus) {
        case "configured":
          statusLine = `Backend listo para consultas. Modelo: ${data.model}. API: ${data.mode}.`;
          statusCopy = "Backend IA configurado y sin errores recientes.";
          break;
        case "quota_exceeded":
          statusLine = `Backend conectado, pero OpenAI devolvio cuota agotada. Modelo: ${data.model}.`;
          statusCopy = "La IA esta configurada, pero la cuenta no tiene cuota disponible.";
          break;
        case "invalid_api_key":
          statusLine = `Backend conectado, pero la API key fue rechazada por OpenAI. Modelo: ${data.model}.`;
          statusCopy = "La API key del backend necesita revision.";
          break;
        case "missing_api_key":
          statusLine = `El backend responde, pero falta OPENAI_API_KEY. Modelo configurado: ${data.model}.`;
          statusCopy = "Backend activo, pero sin API key.";
          break;
        case "degraded":
          statusLine = `Backend conectado con incidencias recientes. Modelo: ${data.model}.`;
          statusCopy = "OpenAI respondio con error en una consulta reciente.";
          break;
      }

      setResult(statusLine);
      setStatus(statusCopy);
    })
    .catch(() => {
      setResult("No pude conectar con el backend. Inicia kkc-backend en http://localhost:3001 y configura tu archivo .env.");
      setStatus("Backend IA no disponible.");
    });
});

toggleHistoryBtn.addEventListener("click", () => {
  const isHidden = historyContainer.hasAttribute("hidden");
  if (isHidden) {
    historyContainer.removeAttribute("hidden");
    toggleHistoryBtn.textContent = "Ocultar";
  } else {
    historyContainer.setAttribute("hidden", "");
    toggleHistoryBtn.textContent = "Mostrar";
  }
});

keyboard.addEventListener("click", (event) => {
  const keyButton = event.target.closest(".kkc-key");
  if (!keyButton) {
    return;
  }

  handleKeyboardInput(keyButton.textContent.trim());
});

input.addEventListener("input", (event) => {
  updateModeLabel(event.target.value);
});

input.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    resolveInput();
  }
});

window.addEventListener("beforeunload", stopCamera);
updateModeLabel("");






