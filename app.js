const collectionCount = 5;
const collectionPrice = "$10.000";
const vipPrice = "$25.000 ARS";
const transferAlias = "v.g.lemon";
const usdtAddress = "TMzuyEC4pL5w3JjoHezJwCTXG3ZpbEGquP";
const collections = Array.from({ length: collectionCount }, (_, index) => {
  const number = index + 1;

  return {
    number,
    title: `Colección ${number}`,
    cover: `images/coleccion-${number}/portada.png`,
    previews: [
      `images/coleccion-${number}/vista-previa-1.png`,
      `images/coleccion-${number}/vista-previa-2.png`,
    ],
    photos: number === 5 ? 0 : 18 + ((number * 11) % 43),
    videos: number === 5 ? 3000 : 8 + ((number * 7) % 31),
  };
});

function getCollectionCountLabel(collection) {
  return collection.photos
    ? `${collection.videos} videos · ${collection.photos} fotos`
    : `${collection.videos.toLocaleString("es-AR")} videos`;
}

const collectionGrid = document.querySelector("#collections-grid");
const collectionModal = document.querySelector("#collection-modal");
const imageViewer = document.querySelector("#image-viewer");
const imageViewerImage = document.querySelector("#image-viewer-image");
const checkoutModal = document.querySelector("#checkout-modal");
let activeCollection = null;
let checkoutMode = "collection";

function renderCollections() {
  collectionGrid.innerHTML = collections.map((collection) => `
    <article class="collection-card">
      <button class="collection-image collection-image-button" type="button" data-collection="${collection.number}" aria-label="Ver ${collection.title} y sus vistas previas">
        <img src="${collection.cover}" alt="" loading="lazy" />
        <span class="collection-index">COLECCIÓN ${String(collection.number).padStart(2, "0")}</span>
        <span class="collection-lock" aria-hidden="true">⌑</span>
      </button>
      <button class="collection-info collection-info-button" type="button" data-collection="${collection.number}" aria-label="Ver ${collection.title} y opciones para desbloquear">
        <span class="collection-title">${collection.title}</span>
        <span class="collection-counts">${getCollectionCountLabel(collection)}</span>
        <span class="collection-price">${collectionPrice} <span>· Ver opciones</span></span>
      </button>
    </article>
  `).join("");
}

function openImageViewer(src, alt) {
  imageViewerImage.src = src;
  imageViewerImage.alt = alt;
  imageViewer.showModal();
}

function openModal(modal) {
  document.querySelectorAll("dialog[open]").forEach((openDialog) => openDialog.close());
  modal.showModal();
}

function renderCollectionDetail(collection) {
  document.querySelector("#collection-detail").innerHTML = `
    <button class="collection-detail-cover image-expand-button" type="button" data-view-image="${collection.cover}" data-image-alt="Portada de ${collection.title}" aria-label="Ampliar portada de ${collection.title}">
      <img src="${collection.cover}" alt="" />
    </button>
    <div class="collection-detail-copy">
      <div class="eyebrow"><span class="eyebrow-dot"></span> COLECCIÓN ${String(collection.number).padStart(2, "0")}</div>
      <h2 id="collection-title">${collection.title}</h2>
      <p>${getCollectionCountLabel(collection)}</p>
      <div class="preview-heading">
        <strong>Vista previa</strong>
      </div>
      <div class="preview-grid" aria-label="Dos imágenes de vista previa">
        ${collection.previews.map((image, index) => `
          <figure class="preview-image">
            <button class="preview-image-button image-expand-button" type="button" data-view-image="${image}" data-image-alt="${collection.title}, imagen de vista previa ${index + 1}" aria-label="Ampliar imagen de vista previa ${index + 1} de ${collection.title}">
              <img src="${image}" alt="" />
            </button>
            <figcaption>Vista previa ${index + 1}</figcaption>
          </figure>
        `).join("")}
      </div>
      <p class="unlock-message">Desbloqueá el contenido completo después de confirmar el pago.</p>
      <button class="button button-primary button-full" id="unlock-collection" type="button">
        Desbloquear por ${collectionPrice} <span aria-hidden="true">↗</span>
      </button>
    </div>
  `;
}

function showCollection(collection) {
  activeCollection = collection;
  renderCollectionDetail(collection);
  openModal(collectionModal);
}

function openCheckout() {
  if (checkoutMode === "collection" && !activeCollection) return;
  const isVip = checkoutMode === "vip";
  document.querySelector("#checkout-eyebrow").textContent = isVip ? "ACCESO VIP" : "DESBLOQUEO";
  document.querySelector("#checkout-title").textContent = isVip ? "Desbloqueá todo." : "Desbloqueá tu colección.";
  document.querySelector("#checkout-intro").textContent = isVip
    ? "Solicitá el acceso VIP a las 25 colecciones ocultas con un pago único."
    : "Revisá los datos de la colección seleccionada antes de continuar.";
  document.querySelector("#checkout-summary").innerHTML = isVip
    ? `<div class="checkout-summary-copy"><strong>Acceso VIP completo</strong><span>25 colecciones ocultas · desbloqueo por pago único</span></div><span class="checkout-amount">${vipPrice}</span>`
    : `<img src="${activeCollection.cover}" alt="" /><div class="checkout-summary-copy"><strong>${activeCollection.title}</strong><span>Desbloqueo de colección · pago único</span></div><span class="checkout-amount">${collectionPrice}</span>`;
  document.querySelector("#payment-method").value = "transfer";
  document.querySelector("#transfer-amount").textContent = `${isVip ? "$25.000" : collectionPrice} ARS`;
  updatePaymentMethod();
  document.querySelector("#submit-payment").innerHTML =
    isVip ? 'Solicitar acceso VIP <span aria-hidden="true">↗</span>' : 'Enviar solicitud de pago <span aria-hidden="true">↗</span>';
  document.querySelector("#checkout-footnote").textContent = isVip
    ? ""
    : "La solicitud queda pendiente. El contenido no se desbloquea hasta confirmar el pago.";
  document.querySelector("#receipt-upload").required = isVip;
  document.querySelector("#receipt-name").textContent = "Elegí una imagen PNG/JPG o PDF";
  document.querySelector("#receipt-upload").value = "";
  document.querySelector("#payment-feedback").textContent = "";
  openModal(checkoutModal);
}

function updatePaymentMethod() {
  const usdtSelected = document.querySelector("#payment-method").value === "usdt";
  document.querySelector("#transfer-instructions").hidden = usdtSelected;
  document.querySelector("#usdt-instructions").hidden = !usdtSelected;
}

collectionGrid.addEventListener("click", (event) => {
  const detailButton = event.target.closest("[data-collection]");
  if (!detailButton) return;
  const collection = collections.find((item) => item.number === Number(detailButton.dataset.collection));
  if (collection) showCollection(collection);
});

document.querySelector("#collection-detail").addEventListener("click", (event) => {
  const imageButton = event.target.closest("[data-view-image]");
  if (imageButton) {
    openImageViewer(imageButton.dataset.viewImage, imageButton.dataset.imageAlt);
    return;
  }
  if (event.target.closest("#unlock-collection")) {
    checkoutMode = "collection";
    openCheckout();
  }
});

document.querySelector("#unlock-vip").addEventListener("click", () => {
  checkoutMode = "vip";
  openCheckout();
});

document.querySelectorAll("[data-close-modal]").forEach((button) => {
  button.addEventListener("click", () => button.closest("dialog").close());
});

document.querySelector(".image-viewer-close").addEventListener("click", () => imageViewer.close());
imageViewer.addEventListener("click", (event) => {
  if (event.target === imageViewer) imageViewer.close();
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && imageViewer.open) {
    event.preventDefault();
    imageViewer.close();
  }
});

document.querySelectorAll("dialog").forEach((dialog) => {
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) dialog.close();
  });
});

document.querySelector("#receipt-upload").addEventListener("change", (event) => {
  const [file] = event.target.files;
  if (!file) return;

  const allowedTypes = ["image/png", "image/jpeg", "application/pdf"];
  if (!allowedTypes.includes(file.type)) {
    event.target.value = "";
    document.querySelector("#receipt-name").textContent = "Formato no válido. Elegí una imagen PNG/JPG o PDF.";
    return;
  }
  if (file.size > 5 * 1024 * 1024) {
    event.target.value = "";
    document.querySelector("#receipt-name").textContent = "El comprobante debe pesar menos de 5 MB.";
    return;
  }

  document.querySelector("#receipt-name").textContent = file.name;
});

document.querySelector("#payment-method").addEventListener("change", updatePaymentMethod);

document.querySelector("#copy-transfer-alias").addEventListener("click", async (event) => {
  const button = event.currentTarget;
  try {
    await navigator.clipboard.writeText(transferAlias);
    button.textContent = "Alias copiado";
  } catch {
    button.textContent = "No se pudo copiar";
  }
  window.setTimeout(() => { button.textContent = "Copiar alias"; }, 1800);
});

document.querySelector("#copy-usdt-address").addEventListener("click", async (event) => {
  const button = event.currentTarget;
  try {
    await navigator.clipboard.writeText(usdtAddress);
    button.textContent = "Dirección copiada";
  } catch {
    button.textContent = "No se pudo copiar";
  }
  window.setTimeout(() => { button.textContent = "Copiar dirección"; }, 1800);
});

document.querySelector("#submit-payment").addEventListener("click", () => {
  if (checkoutMode === "vip") {
    if (!document.querySelector("#receipt-upload").files.length) {
      document.querySelector("#payment-feedback").textContent = "Adjuntá el comprobante para solicitar la revisión del acceso VIP.";
      document.querySelector("#receipt-upload").focus();
      return;
    }
    document.querySelector("#payment-feedback").textContent =
      "El comprobante está seleccionado, pero no se envió: falta configurar los datos de cobro y conectar el servidor. El acceso VIP sigue bloqueado.";
    return;
  }
  document.querySelector("#payment-feedback").textContent =
    "Solicitud de demostración enviada. El pago sigue pendiente y la colección continúa bloqueada.";
});

renderCollections();
