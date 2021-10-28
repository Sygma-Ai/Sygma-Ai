var STATUS_CHECK_URL = 'https://sosai.ml:5000/status_check';

document.getElementById('status').innerHTML = "<span id='status_connecting' alt='down'>connecting...</span>";

$.ajax({
  url: STATUS_CHECK_URL,
 type: 'GET',
 success: function() {
   document.getElementById('status').innerHTML = "<span id='status_ok'>online</span>";
 },
 error: function() {
   document.getElementById('status').innerHTML = "<span id='status_down' alt='down'>offline</span>";
 }
});
