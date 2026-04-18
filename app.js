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
const eyebrow = document.getElementById("kkc-eyebrow");
const subtitle = document.getElementById("kkc-subtitle");
const inputLabel = document.getElementById("kkc-input-label");
const langBtn = document.getElementById("kkc-lang-btn");
const suggestionsContainer = document.getElementById("kkc-suggestions");
const cameraTitle = document.getElementById("kkc-camera-title");
const cameraCopy = document.getElementById("kkc-camera-copy");
const cameraGuideLabel = document.getElementById("kkc-camera-guide-label");
const cameraModal = document.getElementById("kkc-camera-modal");
const cameraVideo = document.getElementById("kkc-camera-video");
const captureBtn = document.getElementById("kkc-capture-btn");
const closeCamBtn = document.getElementById("kkc-closecam-btn");
const switchCamBtn = document.getElementById("kkc-switchcam-btn");
const canvas = document.getElementById("kkc-canvas");
const ocrModal = document.getElementById("kkc-ocr-modal");
const ocrTitle = document.getElementById("kkc-ocr-title");
const ocrCopy = document.getElementById("kkc-ocr-copy");
const ocrText = document.getElementById("kkc-ocr-text");
const ocrUseBtn = document.getElementById("kkc-ocr-use-btn");
const ocrAskBtn = document.getElementById("kkc-ocr-ask-btn");
const ocrCancelBtn = document.getElementById("kkc-ocr-cancel-btn");
const ocrReadBtn = document.getElementById("kkc-ocr-read-btn");
const lensStage = document.getElementById("kkc-lens-stage");
const lensPreview = document.getElementById("kkc-lens-preview");
const lensSelection = document.getElementById("kkc-lens-selection");

const AI_ENDPOINT = "https://kkcalculator-backend.onrender.com/api/ask";
const AI_HEALTH_ENDPOINT = "https://kkcalculator-backend.onrender.com/api/health";
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
    resultEmpty: "Aqui veras resultados, explicaciones breves o texto detectado.",
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
    backendConfigured: (model, remaining) => `IA lista. Modelo: ${model}. Te quedan ${remaining} consultas hoy.`,
    backendAdmin: (model) => `IA lista. Modo admin activo. Modelo: ${model}.`,
    backendPublicLimit: (limit) => `Demo publica con limite diario de ${limit} consultas por usuario.`,
    backendAdminCopy: "Tu usuario no tiene limite diario activo.",
    backendAdminStored: "Token admin detectado en este navegador.",
    backendQuota: (model) => `Backend conectado, pero OpenAI devolvio cuota agotada. Modelo: ${model}.`,
    backendQuotaCopy: "La IA esta configurada, pero la cuenta no tiene cuota disponible.",
    backendInvalid: (model) => `Backend conectado, pero la API key fue rechazada por OpenAI. Modelo: ${model}.`,
    backendInvalidCopy: "La API key del backend necesita revision.",
    backendMissing: (model) => `El backend responde, pero falta OPENAI_API_KEY. Modelo configurado: ${model}.`,
    backendMissingCopy: "Backend activo, pero sin API key.",
    backendDegraded: (model) => `Backend conectado con incidencias recientes. Modelo: ${model}.`,
    backendDegradedCopy: "OpenAI respondio con error en una consulta reciente.",
    suggestionExplain: "Explicar mejor",
    suggestionShorter: "Mas corto",
    suggestionBullets: "En puntos",
    suggestionRewrite: "Reescribir",
    suggestionSteps: "Paso a paso",
    suggestionExample: "Dar ejemplo",
    ocrReviewTitle: "Revisar texto detectado",
    ocrReviewCopy: "Edita el texto, deja solo la pregunta o el parrafo que te interesa y luego decide que hacer.",
    ocrUse: "Usar texto",
    ocrAsk: "Preguntar",
    ocrCancel: "Cancelar",
    ocrRead: "Leer seleccion",
    ocrReviewReady: "Imagen capturada. Mueve el recuadro y lee solo la parte que te interesa.",
    ocrSelectionRead: "Seleccion leida. Ajusta el texto si hace falta."
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
    resultEmpty: "Results, short explanations, or detected text will appear here.",
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
    backendAdminStored: "Admin token detected in this browser.",
    backendQuota: (model) => `Backend is connected, but OpenAI reported exhausted quota. Model: ${model}.`,
    backendQuotaCopy: "AI is configured, but the account has no quota available.",
    backendInvalid: (model) => `Backend is connected, but the API key was rejected by OpenAI. Model: ${model}.`,
    backendInvalidCopy: "The backend API key needs review.",
    backendMissing: (model) => `The backend is responding, but OPENAI_API_KEY is missing. Configured model: ${model}.`,
    backendMissingCopy: "Backend is active, but it has no API key.",
    backendDegraded: (model) => `Backend is connected with recent issues. Model: ${model}.`,
    backendDegradedCopy: "OpenAI returned an error during a recent request.",
    suggestionExplain: "Explain more",
    suggestionShorter: "Shorter",
    suggestionBullets: "Bullet list",
    suggestionRewrite: "Rewrite",
    suggestionSteps: "Show steps",
    suggestionExample: "Give example",
    ocrReviewTitle: "Review detected text",
    ocrReviewCopy: "Edit the text, keep only the question or paragraph you want, and then choose what to do.",
    ocrUse: "Use text",
    ocrAsk: "Ask AI",
    ocrCancel: "Cancel",
    ocrRead: "Read selection",
    ocrReviewReady: "Image captured. Move the frame and read only the part you want.",
    ocrSelectionRead: "Selection read. Adjust the text if needed."
  }
};

const keyboardLabels = {
  es: { AC: "AC", DEL: "DEL" },
  en: { AC: "Clear", DEL: "Back" }
};

let cameraStream = null;
let usingBackCamera = true;
let lastInteraction = null;
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

function buildHealthUrl() {
  const url = new URL(AI_HEALTH_ENDPOINT);
  if (ADMIN_TOKEN) {
    url.searchParams.set(ADMIN_QUERY_PARAM, ADMIN_TOKEN);
  }
  return url.toString();
}

function buildAskPayload(prompt) {
  const payload = { prompt, locale: currentLang };
  if (ADMIN_TOKEN) {
    payload.adminToken = ADMIN_TOKEN;
  }
  return payload;
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
  keyboardSection.setAttribute("aria-label", t("keyboardLabel"));
  result.setAttribute("data-live-label", t("liveOutput"));
  cameraTitle.textContent = t("cameraTitle");
  cameraCopy.textContent = t("cameraCopy");
  cameraGuideLabel.textContent = t("cameraGuideLabel");
  langBtn.textContent = t("langButton");
  keyboard.querySelectorAll(".kkc-key").forEach((button) => {
    const key = button.dataset.key || button.textContent.trim();
    button.textContent = keyboardLabels[currentLang][key] || key;
  });
  if (!result.textContent.trim()) {
    result.textContent = t("resultEmpty");
  }
  if (!statusText.textContent.trim()) {
    setStatus(ADMIN_TOKEN ? t("backendAdminStored") : t("statusReady"));
  }
  updateModeLabel(input.value);
  renderSuggestions();
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

function clearSuggestions() {
  suggestionsContainer.innerHTML = "";
  suggestionsContainer.hidden = true;
}

function buildSuggestionDefinitions(source) {
  if (!source) {
    return [];
  }
  if (source === "local-calc") {
    return [
      { action: "steps", label: t("suggestionSteps") },
      { action: "explain", label: t("suggestionExplain") },
      { action: "example", label: t("suggestionExample") }
    ];
  }
  return [
    { action: "explain", label: t("suggestionExplain") },
    { action: "shorter", label: t("suggestionShorter") },
    { action: "bullets", label: t("suggestionBullets") },
    { action: "rewrite", label: t("suggestionRewrite") }
  ];
}

function renderSuggestions() {
  if (!lastInteraction) {
    clearSuggestions();
    return;
  }
  const defs = buildSuggestionDefinitions(lastInteraction.source);
  suggestionsContainer.innerHTML = "";
  defs.forEach((item) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "kkc-suggestion-chip";
    button.dataset.action = item.action;
    button.textContent = item.label;
    suggestionsContainer.appendChild(button);
  });
  suggestionsContainer.hidden = defs.length === 0;
}

function rememberInteraction(query, answer, source) {
  lastInteraction = { query, answer, source };
  renderSuggestions();
}

function buildSuggestionPrompt(action) {
  if (!lastInteraction) {
    return "";
  }
  const { query, answer } = lastInteraction;
  switch (action) {
    case "explain":
      return currentLang === "en" ? `Explain this more clearly in simple words: ${answer}` : `Explica esto con palabras mas simples y claras: ${answer}`;
    case "shorter":
      return currentLang === "en" ? `Make this answer shorter and clearer: ${answer}` : `Haz esta respuesta mas corta y clara: ${answer}`;
    case "bullets":
      return currentLang === "en" ? `Turn this answer into 3 short bullet points: ${answer}` : `Convierte esta respuesta en 3 puntos cortos: ${answer}`;
    case "rewrite":
      return currentLang === "en" ? `Rewrite this clearly and naturally: ${answer}` : `Reescribe esto de forma clara y natural: ${answer}`;
    case "steps":
      return currentLang === "en" ? `Show the steps for this result: ${query}` : `Muestra los pasos de este resultado: ${query}`;
    case "example":
      return currentLang === "en" ? `Give one simple real-life example for this: ${answer}` : `Da un ejemplo simple de la vida real para esto: ${answer}`;
    default:
      return "";
  }
}

function splitTextIntoBulletParts(text) {
  const cleaned = String(text || "").replace(/\s+/g, " ").trim();
  if (!cleaned) {
    return [];
  }

  let parts = cleaned
    .split(/[.!?;]|,|\s+y\s+|\s+and\s+/i)
    .map((part) => part.trim())
    .filter(Boolean)
    .slice(0, 3);

  if (parts.length < 2) {
    parts = cleaned
      .replace(/\bEjemplo:\s*/i, ". Ejemplo: ")
      .split(/[.!?;]|,|\s+y\s+/i)
      .map((part) => part.trim())
      .filter(Boolean)
      .slice(0, 3);
  }

  return parts.length ? parts : [cleaned];
}

function applyLocalSuggestion(action, prompt) {
  if (!lastInteraction || action !== "bullets") {
    return false;
  }

  const parts = splitTextIntoBulletParts(lastInteraction.answer);
  const transformed = parts.map((part) => `- ${part}`).join("\n");

  setResult(transformed);
  setStatus(currentLang === "en" ? "Answer converted into bullet points." : "Respuesta convertida en puntos.");
  rememberInteraction(lastInteraction.query, transformed, "ai");
  revealResult();
  return true;
}

function revealResult() {
  result.scrollIntoView({ behavior: "smooth", block: "center" });
}

function normalizeExpression(rawExpression) {
  return rawExpression.replace(/,/g, ".").replace(/\u00F7/g, "/").replace(/\u00D7/g, "*").replace(/x/g, "*").replace(/X/g, "*").replace(/\^2/g, "**2").replace(/(\d+)%/g, "($1/100)").replace(/sqrt\s*\(/gi, "Math.sqrt(").replace(/\u221A\s*\(/g, "Math.sqrt(").replace(/\u221A/g, "Math.sqrt(");
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
    case "quota_exceeded": return t("aiQuotaExceeded");
    case "invalid_api_key": return t("aiInvalidKey");
    case "missing_api_key": return t("aiMissingKey");
    case "daily_limit_reached": return t("aiDailyLimitReached", data.dailyLimit);
    default: return fallbackMessage || t("aiGenericError");
  }
}

function updateModeLabel(value) {
  modeLabel.textContent = isMathExpression(value) ? t("modeCalc") : t("modeAi");
  if (!value.trim()) {
    modeLabel.textContent = t("modeAuto");
  }
}

function optimizeMobileLayout() {
  return;
}

async function resolveInput() {
  const value = input.value.trim();
  if (!value) {
    setResult(t("emptyInputResult"));
    setStatus(t("statusMissing"));
    clearSuggestions();
    return;
  }

  updateModeLabel(value);

  if (isMathExpression(value)) {
    try {
      const answer = safeEvaluate(value);
      const answerLabel = currentLang === "en" ? `Result: ${answer}` : `Resultado: ${answer}`;
      setResult(answerLabel);
      setStatus(t("calcResolved"));
      rememberInteraction(value, answerLabel, "local-calc");
      revealResult();
    } catch {
      setResult(t("calcError"));
      setStatus(t("calcNeedsFix"));
      clearSuggestions();
    }
    return;
  }

  clearSuggestions();
  setResult(t("consultingAi"));
  setStatus(t("askingAi"));

  try {
    const response = await fetch(AI_ENDPOINT, { method: "POST", headers: buildAiHeaders(), body: JSON.stringify(buildAskPayload(value)) });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw { status: response.status, providerStatus: data.providerStatus, details: data.details, dailyLimit: data.dailyLimit, remainingToday: data.remainingToday, message: data.error || `HTTP ${response.status}` };
    }
    const answer = data.answer || (currentLang === "en" ? "The backend returned no answer." : "El backend no devolvio respuesta.");
    setResult(answer);
    setStatus(data.adminBypassActive ? t("aiAdminActive") : typeof data.remainingToday === "number" ? t("aiResponseWithLimit", data.remainingToday) : t("aiResponse"));
    rememberInteraction(value, answer, "ai");
    revealResult();
  } catch (error) {
    const fallback = buildLocalExplanation(value);
    const explanation = explainAiError(error, error?.details);
    const localHelpPrefix = currentLang === "en" ? "Local help:" : "Ayuda local:";
    setResult(`${explanation} ${localHelpPrefix} ${fallback}`);
    setStatus(error?.providerStatus === "daily_limit_reached" ? t("publicLimitReached") : t("aiUnavailable"));
    rememberInteraction(value, fallback, "fallback");
    revealResult();
  }
}

async function startCamera() {
  stopCamera();
  try {
    cameraStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: { ideal: usingBackCamera ? "environment" : "user" } }, audio: false });
    cameraVideo.srcObject = cameraStream;
    cameraModal.hidden = false;
    setStatus(t("cameraReady"));
  } catch {
    setResult(t("cameraAccessError"));
    setStatus(t("cameraAccessFail"));
    clearSuggestions();
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
  return rawText.replace(/[\r\n]+/g, " ").replace(/[|]/g, "/").replace(/[xX×]/g, "*").replace(/[–—]/g, "-").replace(/[÷]/g, "/").replace(/\s*([+\-*/=()%^])\s*/g, " $1 ").replace(/\s+/g, " ").trim();
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
    const ocr = await Tesseract.recognize(imageData, "spa+eng", { tessedit_pageseg_mode: "6", tessedit_char_whitelist: "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ+-*/=().,%^ xX÷×v" });
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

  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d", { willReadFrequently: true });
  context.drawImage(cameraVideo, 0, 0, width, height);

  const sourceCanvas = document.createElement("canvas");
  sourceCanvas.width = width;
  sourceCanvas.height = height;
  sourceCanvas.getContext("2d", { willReadFrequently: true }).drawImage(canvas, 0, 0);

  clearSuggestions();
  cameraModal.hidden = true;
  stopCamera();
  openOcrReviewFrame(sourceCanvas);
}

function handleKeyboardInput(key) {
  switch (key) {
    case "AC":
      input.value = "";
      setResult(t("resultEmpty"));
      setStatus(t("fieldsReset"));
      clearSuggestions();
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
if (ocrUseBtn) ocrUseBtn.addEventListener("click", () => useReviewedText(false));
if (ocrAskBtn) ocrAskBtn.addEventListener("click", () => useReviewedText(true));
if (ocrCancelBtn) ocrCancelBtn.addEventListener("click", () => {
  closeOcrReview();
  setStatus(t("cameraClosed"));
});
if (ocrReadBtn) ocrReadBtn.addEventListener("click", async () => {
  try {
    await readCurrentSelection();
  } catch {
    setResult(t("ocrError"));
    setStatus(t("ocrFail"));
  }
});
if (lensStage) {
  lensStage.addEventListener("pointerdown", (event) => {
    if (!lensSelectionRect || !lensPreview) return;
    const bounds = lensStage.getBoundingClientRect();
    lensPointerState = {
      startX: event.clientX - bounds.left,
      startY: event.clientY - bounds.top,
      initialRect: { ...lensSelectionRect },
      action: getLensHandleAction(event.target)
    };
    lensStage.setPointerCapture(event.pointerId);
  });
  lensStage.addEventListener("pointermove", (event) => {
    if (!lensPointerState) return;
    const bounds = lensStage.getBoundingClientRect();
    updateLensSelection(event.clientX - bounds.left, event.clientY - bounds.top);
  });
  const endLensPointer = () => {
    lensPointerState = null;
  };
  lensStage.addEventListener("pointerup", endLensPointer);
  lensStage.addEventListener("pointercancel", endLensPointer);
}
sendBtn.addEventListener("click", resolveInput);
clearBtn.addEventListener("click", () => {
  input.value = "";
  setResult(t("resultEmpty"));
  setStatus(t("fieldsCleared"));
  clearSuggestions();
  updateModeLabel("");
});

editAiBtn.addEventListener("click", () => {
  clearSuggestions();
  setResult(t("backendChecking"));
  setStatus(ADMIN_TOKEN ? t("backendAdminStored") : t("backendConsulting"));
  fetch(buildHealthUrl(), { headers: ADMIN_TOKEN ? { "x-kkc-admin-token": ADMIN_TOKEN } : {} })
    .then(async (response) => {
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      const data = await response.json();
      let statusLine = t("backendUnavailable");
      let statusCopy = t("backendUnavailable");
      switch (data.providerStatus) {
        case "configured":
          statusLine = data.adminBypassActive ? t("backendAdmin", data.model) : t("backendConfigured", data.model, data.remainingToday ?? data.dailyLimit);
          statusCopy = data.adminBypassActive ? t("backendAdminCopy") : t("backendPublicLimit", data.dailyLimit);
          break;
        case "quota_exceeded":
          statusLine = t("backendQuota", data.model);
          statusCopy = data.adminBypassActive ? t("backendAdminCopy") : t("backendQuotaCopy");
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
      if (ADMIN_TOKEN && data.adminTokenProvided && !data.adminBypassActive) {
        statusCopy = currentLang === "en" ? "An admin token was sent, but it did not match the backend token." : "Se envio un token admin, pero no coincide con el token del backend.";
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

suggestionsContainer.addEventListener("click", (event) => {
  const button = event.target.closest(".kkc-suggestion-chip");
  if (!button) {
    return;
  }
  const nextPrompt = buildSuggestionPrompt(button.dataset.action);
  if (!nextPrompt) {
    return;
  }
  if (applyLocalSuggestion(button.dataset.action, nextPrompt)) {
    return;
  }
  input.value = nextPrompt;
  updateModeLabel(nextPrompt);
  resolveInput();
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
setStatus(ADMIN_TOKEN ? t("backendAdminStored") : t("statusReady"));
updateModeLabel("");
clearSuggestions();






















