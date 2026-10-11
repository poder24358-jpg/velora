const prizes = [
  "30 min",
  "1 hora",
  "4 horas",
  "24 horas",
  "Permanente",
  "2 horas",
  "30 min",
  "3 min",
  "8 horas",
  "12 horas",
];
const wheelSlots = document.querySelector("#wheel-slots");
const paymentModal = document.querySelector("#payment-modal");
const paymentMethod = document.querySelector("#payment-method");
const receiptUpload = document.querySelector("#receipt-upload");
const colors = ["#f9dce8", "#f4c6da", "#fce8f0", "#edb8cf", "#fff0f5"];
const center = 180;
const radius = 174;

function polarPoint(angle, distance) {
  const radians = (angle * Math.PI) / 180;
  return {
    x: center + Math.cos(radians) * distance,
    y: center + Math.sin(radians) * distance,
  };
}

function createWheel() {
  prizes.forEach((prize, index) => {
    const startAngle = -90 + index * 36;
    const endAngle = startAngle + 36;
    const start = polarPoint(startAngle, radius);
    const end = polarPoint(endAngle, radius);
    const midpoint = startAngle + 18;
    const group = document.createElementNS("http://www.w3.org/2000/svg", "g");
    const slice = document.createElementNS("http://www.w3.org/2000/svg", "path");
    const labelGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
    const labelBackground = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    const label = document.createElementNS("http://www.w3.org/2000/svg", "text");
    const labelPoint = polarPoint(midpoint, prize === "Permanente" ? 128 : 115);

    slice.setAttribute("d", `M ${center} ${center} L ${start.x} ${start.y} A ${radius} ${radius} 0 0 1 ${end.x} ${end.y} Z`);
    slice.setAttribute("fill", colors[index % colors.length]);
    slice.setAttribute("class", "wheel-slice");
    group.append(slice);

    labelGroup.setAttribute("transform", `translate(${labelPoint.x} ${labelPoint.y})`);
    labelBackground.setAttribute("x", prize === "Permanente" ? "-40" : "-34");
    labelBackground.setAttribute("y", "-12");
    labelBackground.setAttribute("width", prize === "Permanente" ? "80" : "68");
    labelBackground.setAttribute("height", "24");
    labelBackground.setAttribute("rx", "12");
    labelBackground.setAttribute("class", "wheel-label-background");
    label.textContent = prize;
    label.setAttribute("text-anchor", "middle");
    label.setAttribute("dominant-baseline", "central");
    label.setAttribute("class", "wheel-label-text");
    labelGroup.append(labelBackground, label);
    group.append(labelGroup);
    wheelSlots.append(group);
  });
}

function openPayment() {
  document.querySelector("#payment-feedback").textContent = "";
  receiptUpload.value = "";
  document.querySelector("#receipt-name").textContent = "Elegí una imagen PNG/JPG o PDF";
  paymentModal.showModal();
}

function updatePaymentMethod() {
  const usdtSelected = paymentMethod.value === "usdt";
  document.querySelector("#transfer-instructions").hidden = usdtSelected;
  document.querySelector("#usdt-instructions").hidden = !usdtSelected;
}

function copyAddress(button) {
  copyPaymentText(document.querySelector("#usdt-address").textContent, button, "Dirección copiada", "Copiar dirección");
}

function copyPaymentText(text, button, successLabel, defaultLabel) {
  navigator.clipboard.writeText(text)
    .then(() => { button.textContent = successLabel; })
    .catch(() => { button.textContent = "No se pudo copiar"; });
  window.setTimeout(() => { button.textContent = defaultLabel; }, 1800);
}

document.querySelector("#open-payment").addEventListener("click", openPayment);
document.querySelector("#wheel-payment").addEventListener("click", () => {
  document.querySelector("#payment-result").textContent =
    "Primero aboná $3.000 ARS o 2 USDT. Adjuntar un comprobante no confirma el pago ni habilita el giro.";
  openPayment();
});
paymentMethod.addEventListener("change", updatePaymentMethod);
document.querySelectorAll("[data-close-modal]").forEach((button) => {
  button.addEventListener("click", () => button.closest("dialog").close());
});
paymentModal.addEventListener("click", (event) => {
  if (event.target === paymentModal) paymentModal.close();
});

receiptUpload.addEventListener("change", () => {
  const [file] = receiptUpload.files;
  if (!file) return;

  if (!["image/png", "image/jpeg", "application/pdf"].includes(file.type)) {
    receiptUpload.value = "";
    document.querySelector("#receipt-name").textContent = "Formato no válido. Elegí PNG, JPG o PDF.";
    return;
  }
  if (file.size > 5 * 1024 * 1024) {
    receiptUpload.value = "";
    document.querySelector("#receipt-name").textContent = "El comprobante debe pesar menos de 5 MB.";
    return;
  }
  document.querySelector("#receipt-name").textContent = `${file.name} · seleccionado localmente, no enviado`;
});

document.querySelector("#copy-usdt-address").addEventListener("click", (event) => {
  copyAddress(event.currentTarget);
});

document.querySelector("#copy-transfer-alias").addEventListener("click", (event) => {
  copyPaymentText(
    document.querySelector("#transfer-alias").textContent,
    event.currentTarget,
    "Alias copiado",
    "Copiar alias",
  );
});

document.querySelector("#submit-payment").addEventListener("click", () => {
  const feedback = document.querySelector("#payment-feedback");
  if (!receiptUpload.files.length) {
    feedback.textContent = "No hay un comprobante seleccionado. Adjuntar un archivo no envía ni confirma el pago.";
    receiptUpload.focus();
    return;
  }
  feedback.textContent =
    "El comprobante está solo en este dispositivo; no se envió ni se aprobó. Esta página no acredita pagos automáticamente y el giro permanece bloqueado.";
});

createWheel();
