// Example starter JavaScript for disabling form submissions if there are invalid fields
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

// //character counter for otp page
document.getElementById('otpInput').addEventListener('input', (e) => {
document.getElementById('charCount').textContent = e.target.value.length;
});

//at otp page only numbers are allowed
document.getElementById('otpInput').addEventListener('keypress', (e) => {
  if (!/[0-9]/.test(e.key)) {
    e.preventDefault();
  }
});