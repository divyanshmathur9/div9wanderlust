(() => {
    'use strict'
  
    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    const forms = document.querySelectorAll('.needs-validation')
  
    // Loop over them and prevent submission
    Array.from(forms).forEach(form => {
      form.addEventListener('submit', event => {
        if (!form.checkValidity()) {
          event.preventDefault()
          event.stopPropagation()
        }
  
        form.classList.add('was-validated')
      }, false)
    })
  })()

const csrfToken = document.querySelector('meta[name="csrf-token"]')?.content;
if (csrfToken) {
  document.querySelectorAll('form[method="POST"], form[method="post"]').forEach((form) => {
    if (form.querySelector('input[name="_csrf"]')) return;
    const input = document.createElement("input");
    input.type = "hidden";
    input.name = "_csrf";
    input.value = csrfToken;
    form.prepend(input);
  });
}

document.querySelectorAll("form[data-confirm]").forEach((form) => {
  form.addEventListener("submit", (event) => {
    if (!window.confirm(form.dataset.confirm)) event.preventDefault();
  });
});

const bookingForm = document.querySelector(".booking-form");
if (bookingForm) {
  const checkIn = bookingForm.querySelector("#checkIn");
  const checkOut = bookingForm.querySelector("#checkOut");
  const total = bookingForm.querySelector(".booking-total strong");
  const nightlyPrice = Number(bookingForm.querySelector(".booking-total").dataset.nightlyPrice);
  const updateTotal = () => {
    if (!checkIn.value || !checkOut.value) { total.textContent = "Choose dates"; return; }
    const nights = Math.round((new Date(`${checkOut.value}T00:00:00Z`) - new Date(`${checkIn.value}T00:00:00Z`)) / 86400000);
    checkOut.min = checkIn.value;
    total.textContent = nights > 0 ? `₹${(nights * nightlyPrice).toLocaleString("en-IN")} · ${nights} nights` : "Choose valid dates";
  };
  checkIn.addEventListener("change", updateTotal);
  checkOut.addEventListener("change", updateTotal);
}
