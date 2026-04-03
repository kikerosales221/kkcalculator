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
const keyboardSection = document.getElementById("kkc-keyboard-section");
const historyContainer = document.getElementById("kkc-history");
const historyTitle = document.getElementById("kkc-history-title");
const toggleHistoryBtn = document.getElementById("kkc-toggle-history-btn");
const eyebrow = document.getElementById("kkc-eyebrow");
const subtitle = document.getElementById("kkc-subtitle");
const inputLabel = document.getElementById("kkc-input-label");
const langBtn = document.getElementById("kkc-lang-btn");
const cameraTitle = document.getElementById("kkc-camera-title");
const cameraCopy = document.getElementById("kkc-camera-copy");
const cameraGuideLabel = document.getElementById("kkc-camera-guide-label");

const cameraModal = document.getElementById("kkc-camera-modal");
const cameraVideo = document.getElementById("kkc-camera-video");
const captureBtn = document.getElementById("kkc-capture-btn");
const closeCamBtn = document.getElementById("kkc-closecam-btn");
const switchCamBtn = document.getElementById("kkc-switchcam-btn");
const canvas = document.getElementById("kkc-canvas");

const AI_ENDPOINT = "https://kkcalculator-backend.onrender.com/api/ask";
const AI_HEALTH_ENDPOINT = "https://kkcalculator-backend.onrender.com/api/health";
const MAX_HISTORY = 8;
const ADMIN_TOKEN_STORAGE_KEY = "kkc_admin_token";
const ADMIN_QUERY_PARAM = "kkc_admin";
const LANG_STORAGE_KEY = "kkc_lang";

const translations = {
  es: {
    langButton: "EN",
    eyebrow: "Asistente inteligente",
    subtitle: "Calcula, captura texto y resuelve dudas rapidas para estudio, trabajo o uso diario.",
    inputLabel: "Pregunta, texto o expresion",
    inputPlaceholder: "Ej: 25*(8+2), resume este texto o explica una fraccion",
    cameraButton: "Cam",
    sendButton: "Resolver",
    clearButton: "Limpiar",
    aiStatusButton: "Estado IA",
    captureButton: "Capturar",
    switchCameraButton: "Cambiar",
    closeButton: "Cerrar",
    historyTitle: "Historial",
    hide: "Ocultar",
    show: "Mostrar",
    resultEmpty: "Aqui veras resultados, explicaciones breves o texto detectado.",
    historyEmpty: "Tus operaciones y respuestas recientes apareceran aqui.",
    liveOutput: "Live output",
    cameraTitle: "Capturar texto o operacion",
    cameraCopy: "Enfoca una nota, una operacion o una pregunta corta y captura la parte importante.",
    cameraGuideLabel: "Coloca aqui el texto o la operacion",
    keyboardLabel: "Teclado de calculadora",
    modeAuto: "Modo auto",
    modeCalc: "Modo calculo",
    modeAi: "Modo IA",
    kClear: "AC",
    kDelete: "DEL",
    statusReady: "Lista para calcular, leer texto o ayudarte con una duda.",
    statusMissing: "Falta contenido para resolver.",
    emptyInputResult: "Escribe una operacion, una pregunta o una instruccion corta.",
    calcResolved: "Operacion resuelta localmente.",
    calcError: "No pude evaluar esa expresion. Revisa parentesis y operadores.",
    calcNeedsFix: "La expresion necesita correccion.",
    askingAi: "Intentando resolver con IA.",
    consultingAi: "Consultando el motor inteligente...",
    aiResponse: "Respuesta generada por el backend de IA.",
    aiResponseWithLimit: (remaining) => `Respuesta generada por IA. Te quedan ${remaining} consultas hoy.`,
    aiAdminActive: "Respuesta generada por el backend de IA. Modo admin activo.",
    aiUnavailable: "La IA no estuvo disponible y se mostro una ayuda local.",
    publicLimitReached: "Limite diario alcanzado para publico.",
    aiQuotaExceeded: "La IA esta configurada, pero la cuenta de OpenAI no tiene cuota disponible en este momento.",
    aiInvalidKey: "La IA no pudo autenticarse con OpenAI. Revisa la API key del backend.",
    aiMissingKey: "El backend esta encendido, pero falta configurar OPENAI_API_KEY en Render.",
    aiDailyLimitReached: (limit) => `La demo publica ya alcanzo su limite diario de ${limit || 5} consultas de IA.`,
    aiGenericError: "No pude completar la consulta con IA.",
    localHelpDefault: "Puedo calcular, leer texto con la camara y ayudarte con preguntas breves si la IA esta disponible.",
    localHelpLanguage: "Puedo intentarlo, pero para preguntas escritas en lenguaje natural es mejor usar la IA y escribir la idea completa.",
    cameraReady: "Camara lista para capturar.",
    cameraAccessError: "No se pudo acceder a la camara. Usa HTTPS o permisos del navegador.",
    cameraAccessFail: "Fallo el acceso a la camara.",
    cameraNotActive: "La camara aun no esta activa.",
    cameraWait: "Espera un momento a que cargue la imagen de la camara.",
    processingImage: "Procesando texto de la imagen...",
    processingOcr: "Mejorando la imagen y ejecutando OCR.",
    textDetected: "Texto detectado desde la camara.",
    ocrError: "No pude leer bien la imagen. Intenta acercarte mas, usar buena luz y enfocar solo el ejercicio.",
    ocrFail: "El OCR no encontro un texto legible.",
    cameraClosed: "Camara cerrada.",
    fieldsReset: "Campos reiniciados.",
    fieldsCleared: "Campos limpiados.",
    backendChecking: "Comprobando el estado del backend de IA...",
    backendConsulting: "Consultando disponibilidad del backend.",
    backendUnavailable: "Backend IA no disponible.",
    backendPublicUnavailable: "No pude conectar con el backend publico de IA.",
    backendConfigured: (model, remaining) => `IA lista. Modelo: ${model}. Quedan ${remaining} consultas hoy.`,
    backendAdmin: (model) => `IA lista. Modo admin activo. Modelo: ${model}.`,
    backendPublicLimit: (limit) => `Demo publica con limite diario de ${limit} consultas por usuario.`,
    backendAdminCopy: "Tu usuario no tiene limite diario activo.",
    backendQuota: (model) => `Backend conectado, pero OpenAI devolvio cuota agotada. Modelo: ${model}.`,
    backendQuotaCopy: "La IA esta configurada, pero la cuenta no tiene cuota disponible.",
    backendInvalid: (model) => `Backend conectado, pero la API key fue rechazada por OpenAI. Modelo: ${model}.`,
    backendInvalidCopy: "La API key del backend necesita revision.",
    backendMissing: (model) => `El backend responde, pero falta OPENAI_API_KEY. Modelo configurado: ${model}.`,
    backendMissingCopy: "Backend activo, pero sin API key.",
    backendDegraded: (model) => `Backend conectado con incidencias recientes. Modelo: ${model}.`,
    backendDegradedCopy: "OpenAI respondio con error en una consulta reciente."
  },
  en: {
    langButton: "ES",
    eyebrow: "Smart assistant",
    subtitle: "Calculate, capture text, and solve quick questions for study, work, or everyday use.",
    inputLabel: "Question, text, or expression",
    inputPlaceholder: "Ex: 25*(8+2), summarize this text, or explain an equivalent fraction",
    cameraButton: "Scan",
    sendButton: "Solve",
    clearButton: "Clear",
    aiStatusButton: "AI status",
    captureButton: "Capture",
    switchCameraButton: "Switch",
    closeButton: "Close",
    historyTitle: "History",
    hide: "Hide",
    show: "Show",
    resultEmpty: "Results, short explanations, or detected text will appear here.",
    historyEmpty: "Your recent results and responses will appear here.",
    liveOutput: "Live output",
    cameraTitle: "Capture text or problem",
    cameraCopy: "Point at a note, short text, or math problem and capture the important area.",
    cameraGuideLabel: "Place text or problem here",
    keyboardLabel: "Calculator keyboard",
    modeAuto: "Auto mode",
    modeCalc: "Calc mode",
    modeAi: "AI mode",
    kClear: "Clear",
    kDelete: "Back",
    statusReady: "Ready to calculate, read text, or help with a quick question.",
    statusMissing: "There is nothing to solve yet.",
    emptyInputResult: "Type an expression, question, or short instruction.",
    calcResolved: "Expression solved locally.",
    calcError: "I could not evaluate that expression. Check parentheses and operators.",
    calcNeedsFix: "That expression needs correction.",
    askingAi: "Trying to answer with AI.",
    consultingAi: "Consulting the AI engine...",
    aiResponse: "Answer generated by the AI backend.",
    aiResponseWithLimit: (remaining) => `AI answer generated. You have ${remaining} AI requests left today.`,
    aiAdminActive: "AI answer generated. Admin mode is active.",
    aiUnavailable: "AI was unavailable, so local help was shown.",
    publicLimitReached: "Daily public limit reached.",
    aiQuotaExceeded: "AI is configured, but the OpenAI account has no quota available right now.",
    aiInvalidKey: "AI could not authenticate with OpenAI. Check the backend API key.",
    aiMissingKey: "The backend is running, but OPENAI_API_KEY is missing in Render.",
    aiDailyLimitReached: (limit) => `This public demo already reached its daily limit of ${limit || 5} AI requests.`,
    aiGenericError: "I could not complete the AI request.",
    localHelpDefault: "I can calculate, read text with the camera, and help with short questions if AI is available.",
    localHelpLanguage: "I can try, but for natural-language questions it is better to use AI and write the full idea.",
    cameraReady: "Camera ready to capture.",
    cameraAccessError: "Camera access failed. Use HTTPS or browser permissions.",
    cameraAccessFail: "Camera access failed.",
    cameraNotActive: "The camera is not active yet.",
    cameraWait: "Wait a moment for the camera image to load.",
    processingImage: "Processing image text...",
    processingOcr: "Enhancing image and running OCR.",
    textDetected: "Text detected from the camera.",
    ocrError: "I could not read the image well. Try moving closer, using better light, and focusing only on the text.",
    ocrFail: "OCR could not find readable text.",
    cameraClosed: "Camera closed.",
    fieldsReset: "Fields reset.",
    fieldsCleared: "Fields cleared.",
    backendChecking: "Checking AI backend status...",
    backendConsulting: "Checking backend availability.",
    backendUnavailable: "AI backend unavailable.",
    backendPublicUnavailable: "I could not connect to the public AI backend.",
    backendConfigured: (model, remaining) => `AI ready. Model: ${model}. ${remaining} requests left today.`,
    backendAdmin: (model) => `AI ready. Admin mode active. Model: ${model}.`,
    backendPublicLimit: (limit) => `Public demo limit: ${limit} AI requests per user each day.`,
    backendAdminCopy: "Your user has no daily limit active.",
    backendQuota: (model) => `Backend is connected, but OpenAI reported exhausted quota. Model: ${model}.`,
    backendQuotaCopy: "AI is configured, but the account has no quota available.",
    backendInvalid: (model) => `Backend is connected, but the API key was rejected by OpenAI. Model: ${model}.`,
    backendInvalidCopy: "The backend API key needs review.",
    backendMissing: (model) => `The backend is responding, but OPENAI_API_KEY is missing. Configured model: ${model}.`,
    backendMissingCopy: "Backend is active, but it has no API key.",
    backendDegraded: (model) => `Backend is connected with recent issues. Model: ${model}.`,
    backendDegradedCopy: "OpenAI returned an error during a recent request."
  }
};

const keyboardLabels = {
  es: { AC: "AC", DEL: "DEL" },
  en: { AC: "Clear", DEL: "Back" }
};

let cameraStream = null;
let usingBackCamera = true;
let historyItems = [];
let currentLang = getInitialLanguage();

function getInitialLanguage() {
  const savedLang = localStorage.getItem(LANG_STORAGE_KEY);
  if (savedLang === "es" || savedLang === "en") {
    return savedLang;
  }

  return navigator.language && navigator.language.toLowerCase().startsWith("es") ? "es" : "en";
}

function t(key, ...args) {
  const value = translations[currentLang][key];
  return typeof value === "function" ? value(...args) : value;
}

function getAdminToken() {
  try {
    const url = new URL(window.location.href);
    const queryToken = url.searchParams.get(ADMIN_QUERY_PARAM);

    if (queryToken) {
      localStorage.setItem(ADMIN_TOKEN_STORAGE_KEY, queryToken.trim());
      url.searchParams.delete(ADMIN_QUERY_PARAM);
      window.history.replaceState({}, "", url.toString());
      return queryToken.trim();
    }

    return localStorage.getItem(ADMIN_TOKEN_STORAGE_KEY) || "";
  } catch {
    return "";
  }
}

const ADMIN_TOKEN = getAdminToken();

function buildAiHeaders() {
  const headers = { "Content-Type": "application/json" };

  if (ADMIN_TOKEN) {
    headers["x-kkc-admin-token"] = ADMIN_TOKEN;
  }

  return headers;
}

function applyLanguage() {
  document.documentElement.lang = currentLang;
  eyebrow.textContent = t("eyebrow");
  subtitle.textContent = t("subtitle");
  inputLabel.textContent = t("inputLabel");
  input.placeholder = t("inputPlaceholder");
  cameraBtn.textContent = t("cameraButton");
  cameraBtn.title = t("cameraButton");
  sendBtn.textContent = t("sendButton");
  clearBtn.textContent = t("clearButton");
  editAiBtn.textContent = t("aiStatusButton");
  captureBtn.textContent = t("captureButton");
  switchCamBtn.textContent = t("switchCameraButton");
  closeCamBtn.textContent = t("closeButton");
  historyTitle.textContent = t("historyTitle");
  keyboardSection.setAttribute("aria-label", t("keyboardLabel"));
  result.setAttribute("data-live-label", t("liveOutput"));
  historyContainer.setAttribute("data-empty", t("historyEmpty"));
  cameraTitle.textContent = t("cameraTitle");
  cameraCopy.textContent = t("cameraCopy");
  cameraGuideLabel.textContent = t("cameraGuideLabel");
  langBtn.textContent = t("langButton");
  toggleHistoryBtn.textContent = historyContainer.hasAttribute("hidden") ? t("show") : t("hide");

  keyboard.querySelectorAll(".kkc-key").forEach((button) => {
    const key = button.dataset.key || button.textContent.trim();
    button.textContent = keyboardLabels[currentLang][key] || key;
  });

  if (!result.textContent.trim()) {
    result.textContent = t("resultEmpty");
  }

  if (!statusText.textContent.trim()) {
    setStatus(t("statusReady"));
  }

  updateModeLabel(input.value);
}

function setLanguage(lang) {
  currentLang = lang === "en" ? "en" : "es";
  localStorage.setItem(LANG_STORAGE_KEY, currentLang);
  applyLanguage();
}

function toggleLanguage() {
  setLanguage(currentLang === "es" ? "en" : "es");
}

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
    throw new Error("empty-expression");
  }

  if (/[^0-9+\-*/().%\sMathsqrt]/.test(normalized)) {
    throw new Error("invalid-expression");
  }

  const evaluator = new Function(`return (${normalized});`);
  const value = evaluator();

  if (typeof value !== "number" || Number.isNaN(value) || !Number.isFinite(value)) {
    throw new Error("invalid-result");
  }

  return Number(value.toFixed(10)).toString();
}

function buildLocalExplanation(query) {
  const cleaned = query.trim();

  if (isMathExpression(cleaned)) {
    const answer = safeEvaluate(cleaned);
    return currentLang === "en" ? `Result: ${answer}` : `Resultado: ${answer}`;
  }

  if (/ecuacion|despeja|resuelve|equation|solve/i.test(cleaned)) {
    return t("localHelpLanguage");
  }

  return t("localHelpDefault");
}

function explainAiError(data, fallbackMessage) {
  switch (data?.providerStatus) {
    case "quota_exceeded":
      return t("aiQuotaExceeded");
    case "invalid_api_key":
      return t("aiInvalidKey");
    case "missing_api_key":
      return t("aiMissingKey");
    case "daily_limit_reached":
      return t("aiDailyLimitReached", data.dailyLimit);
    default:
      return fallbackMessage || t("aiGenericError");
  }
}

function updateModeLabel(value) {
  modeLabel.textContent = isMathExpression(value) ? t("modeCalc") : t("modeAi");
  if (!value.trim()) {
    modeLabel.textContent = t("modeAuto");
  }
}

function optimizeMobileLayout() {
  if (window.innerWidth <= 640 && !historyContainer.hasAttribute("hidden")) {
    historyContainer.setAttribute("hidden", "");
    toggleHistoryBtn.textContent = t("show");
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
    setResult(t("emptyInputResult"));
    setStatus(t("statusMissing"));
    return;
  }

  updateModeLabel(value);

  if (isMathExpression(value)) {
    try {
      const answer = safeEvaluate(value);
      const answerLabel = currentLang === "en" ? `Result: ${answer}` : `Resultado: ${answer}`;
      setResult(answerLabel);
      setStatus(t("calcResolved"));
      addHistoryItem(value, answerLabel, currentLang === "en" ? "Local calc" : "Calculo local");
      revealResult();
    } catch {
      setResult(t("calcError"));
      setStatus(t("calcNeedsFix"));
    }
    return;
  }

  setResult(t("consultingAi"));
  setStatus(t("askingAi"));

  try {
    const response = await fetch(AI_ENDPOINT, {
      method: "POST",
      headers: buildAiHeaders(),
      body: JSON.stringify({ prompt: value, locale: currentLang })
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw {
        status: response.status,
        providerStatus: data.providerStatus,
        details: data.details,
        dailyLimit: data.dailyLimit,
        remainingToday: data.remainingToday,
        message: data.error || `HTTP ${response.status}`
      };
    }

    const answer = data.answer || (currentLang === "en" ? "The backend returned no answer." : "El backend no devolvio respuesta.");
    setResult(answer);
    setStatus(
      data.adminBypassActive
        ? t("aiAdminActive")
        : typeof data.remainingToday === "number"
          ? t("aiResponseWithLimit", data.remainingToday)
          : t("aiResponse")
    );
    addHistoryItem(value, answer, currentLang === "en" ? "AI backend" : "Backend IA");
    revealResult();
  } catch (error) {
    const fallback = buildLocalExplanation(value);
    const explanation = explainAiError(error, error?.details);
    const localHelpPrefix = currentLang === "en" ? "Local help:" : "Ayuda local:";

    setResult(`${explanation} ${localHelpPrefix} ${fallback}`);
    setStatus(
      error?.providerStatus === "daily_limit_reached"
        ? t("publicLimitReached")
        : t("aiUnavailable")
    );
    addHistoryItem(value, fallback, currentLang === "en" ? "Local help" : "Ayuda local");
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
    setStatus(t("cameraReady"));
  } catch {
    setResult(t("cameraAccessError"));
    setStatus(t("cameraAccessFail"));
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
    setStatus(t("cameraNotActive"));
    return;
  }

  const width = cameraVideo.videoWidth;
  const height = cameraVideo.videoHeight;

  if (!width || !height) {
    setStatus(t("cameraWait"));
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

  setResult(t("processingImage"));
  setStatus(t("processingOcr"));

  try {
    const text = await readMathFromCanvas(canvas);

    if (!text) {
      throw new Error("No text detected");
    }

    input.value = text;
    updateModeLabel(text);
    setStatus(t("textDetected"));
    revealResult();
    addHistoryItem(currentLang === "en" ? "Scan" : "Escaneo", text, "OCR");
    cameraModal.hidden = true;
    stopCamera();
    await resolveInput();
  } catch {
    setResult(t("ocrError"));
    setStatus(t("ocrFail"));
  }
}

function handleKeyboardInput(key) {
  switch (key) {
    case "AC":
      input.value = "";
      setResult(t("resultEmpty"));
      setStatus(t("fieldsReset"));
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
langBtn.addEventListener("click", toggleLanguage);
switchCamBtn.addEventListener("click", async () => {
  usingBackCamera = !usingBackCamera;
  await startCamera();
});
closeCamBtn.addEventListener("click", () => {
  cameraModal.hidden = true;
  stopCamera();
  setStatus(t("cameraClosed"));
});
captureBtn.addEventListener("click", captureAndRead);

sendBtn.addEventListener("click", resolveInput);
clearBtn.addEventListener("click", () => {
  input.value = "";
  setResult(t("resultEmpty"));
  setStatus(t("fieldsCleared"));
  updateModeLabel("");
});

editAiBtn.addEventListener("click", () => {
  setResult(t("backendChecking"));
  setStatus(t("backendConsulting"));

  fetch(AI_HEALTH_ENDPOINT, { headers: ADMIN_TOKEN ? { "x-kkc-admin-token": ADMIN_TOKEN } : {} })
    .then(async (response) => {
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      let statusLine = t("backendUnavailable");
      let statusCopy = t("backendUnavailable");

      switch (data.providerStatus) {
        case "configured":
          statusLine = data.adminBypassActive
            ? t("backendAdmin", data.model)
            : t("backendConfigured", data.model, data.remainingToday ?? data.dailyLimit);
          statusCopy = data.adminBypassActive
            ? t("backendAdminCopy")
            : t("backendPublicLimit", data.dailyLimit);
          break;
        case "quota_exceeded":
          statusLine = t("backendQuota", data.model);
          statusCopy = t("backendQuotaCopy");
          break;
        case "invalid_api_key":
          statusLine = t("backendInvalid", data.model);
          statusCopy = t("backendInvalidCopy");
          break;
        case "missing_api_key":
          statusLine = t("backendMissing", data.model);
          statusCopy = t("backendMissingCopy");
          break;
        case "degraded":
          statusLine = t("backendDegraded", data.model);
          statusCopy = t("backendDegradedCopy");
          break;
      }

      setResult(statusLine);
      setStatus(statusCopy);
      revealResult();
    })
    .catch(() => {
      setResult(t("backendPublicUnavailable"));
      setStatus(t("backendUnavailable"));
      revealResult();
    });
});

toggleHistoryBtn.addEventListener("click", () => {
  const isHidden = historyContainer.hasAttribute("hidden");
  if (isHidden) {
    historyContainer.removeAttribute("hidden");
    toggleHistoryBtn.textContent = t("hide");
  } else {
    historyContainer.setAttribute("hidden", "");
    toggleHistoryBtn.textContent = t("show");
  }
});

keyboard.addEventListener("click", (event) => {
  const keyButton = event.target.closest(".kkc-key");
  if (!keyButton) {
    return;
  }

  handleKeyboardInput(keyButton.dataset.key || keyButton.textContent.trim());
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
optimizeMobileLayout();
applyLanguage();
setResult(t("resultEmpty"));
setStatus(t("statusReady"));
updateModeLabel("");
