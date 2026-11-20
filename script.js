const menuToggle = document.getElementById('menuToggle');
const nav = document.getElementById('nav');
menuToggle.addEventListener('click', () => {
  const isOpen = nav.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(isOpen));
});
nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  nav.classList.remove('open');
  menuToggle.setAttribute('aria-expanded', 'false');
}));

const today = new Date();
const iso = d => {
  const local = new Date(d.getTime() - d.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 10);
};
const checkIn = document.getElementById('checkIn');
const checkOut = document.getElementById('checkOut');
checkIn.min = iso(today);
checkOut.min = iso(new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1));
checkIn.addEventListener('change', () => {
  if (!checkIn.value) return;
  const next = new Date(`${checkIn.value}T12:00:00`);
  next.setDate(next.getDate() + 1);
  checkOut.min = iso(next);
  if (checkOut.value && checkOut.value <= checkIn.value) checkOut.value = '';
});
document.getElementById('bookingForm').addEventListener('submit', event => {
  event.preventDefault();
  const message = document.getElementById('bookingMessage');
  if (!checkIn.value || !checkOut.value || checkOut.value <= checkIn.value) {
    message.textContent = 'Please choose a check-out date after your check-in date.';
    return;
  }
  const nights = Math.round((new Date(`${checkOut.value}T12:00:00`) - new Date(`${checkIn.value}T12:00:00`)) / 86400000);
  message.textContent = `Your ${nights}-night stay for ${document.getElementById('guests').value} is ready to inquire about. Please use the contact form below.`;
  document.getElementById('contact').scrollIntoView({behavior:'smooth'});
});
document.getElementById('contactForm').addEventListener('submit', event => {
  event.preventDefault();
  const name = document.getElementById('guestName').value.trim();
  const email = document.getElementById('guestEmail').value.trim();
  const type = document.getElementById('inquiryType').value;
  const message = document.getElementById('guestMessage').value.trim();
  const subject = encodeURIComponent(`Azure Cove inquiry: ${type}`);
  const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\nInquiry: ${type}\n\n${message}`);
  document.getElementById('contactMessage').textContent = 'Opening your email app with the inquiry draft. This demo does not send or store messages.';
  window.location.href = `mailto:hello@azurecove.example?subject=${subject}&body=${body}`;
});
document.getElementById('year').textContent = new Date().getFullYear();
