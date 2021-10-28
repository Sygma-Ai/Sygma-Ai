var SERVER_URL = 'https://sosai.ml:5000/';
var MAX_SIDE_LEN = 1280;

upload = document.querySelector('#file-input');
examples_text = document.querySelector('#examples_text');
example_1 = document.querySelector('#example_1');
example_2 = document.querySelector('#example_2');
example_3 = document.querySelector('#example_3');
example_4 = document.querySelector('#example_4');
preview = document.querySelector('.preview');
rld = document.querySelector('.reload');
canvas = document.createElement('canvas');
context = canvas.getContext('2d');
img = new Image();
resized_img = new Image();
var orientation;

function onload_func() {
  
  EXIF.getData(img, function () {
    orientation = EXIF.getTag(this, 'Orientation');
  });
  [canvas.width, canvas.height] = reduceSize(img.width, img.height, MAX_SIDE_LEN);
  context.drawImage(img, 0, 0, canvas.width, canvas.height);
  resized_img.src = canvas.toDataURL('image/jpeg');
  preview.innerHTML = '';
  
  preview.appendChild(resized_img);
  
  examples_text.classList.remove('examples_text');
  examples_text.classList.add('hide');
  
  send_detect_show();
}


example_1.addEventListener('click', function () {
  event.preventDefault();
  
  preview.innerHTML = '';
  
  img.onload = onload_func;
  img.src = "images/car/1.jpg";
});
example_2.addEventListener('click', function () {
  event.preventDefault();
  
  preview.innerHTML = '';
  
  img.onload = onload_func;
  img.src = "images/car/2.jpg";
});
example_3.addEventListener('click', function () {
  event.preventDefault();
  
  preview.innerHTML = '';
  
  img.onload = onload_func;
  img.src = "images/car/3.jpg";
});
example_4.addEventListener('click', function () {
  event.preventDefault();
  
  preview.innerHTML = '';
  
  img.onload = onload_func;
  img.src = "images/car/4.jpg";
});


upload.addEventListener('change', function() {
  event.preventDefault();
  
  preview.innerHTML = '';

  
  var reader = new FileReader();

  reader.onload = function(event) {
    if(event.target.result) {
      
      img.onload = onload_func;
      
      img.src = event.target.result;
    };
  };
  reader.readAsDataURL(event.target.files[0]);
});


function send_detect_show() {
  
  var element = document.getElementById('upload');
  element.parentNode.removeChild(element);
  
  detect.classList.remove('hide');
  
  detect.classList.add('progress');
  
  detect.innerHTML = 'Processing...';
  
  var blob = dataURItoBlob(preview.firstElementChild.src);
  
  var form_data = new FormData();
  form_data.append('file', blob);
  form_data.append('orientation', orientation);
  $.ajax({
    type: 'POST',
    url: SERVER_URL,
    data: form_data,
    timeout: 1000 * 25, 
    contentType: false,
    processData: false,
    dataType: 'json',
  }).done(function (data, textStatus, jqXHR) {
    
    preview.firstElementChild.src = data['image'];
    
    detect.parentNode.removeChild(detect);
    
    rld.classList.remove('hide');
  }).fail(function (data) {
    alert("It seems it didn't work for you, but it had to. Please let me know about this odd situation on  or in Issues on GitHub. Or reload the page and try again.");
    
    detect.parentNode.removeChild(detect);
    
    rld.classList.remove('hide');
  });
}


function reload() {
  location.reload();
}


function dataURItoBlob(dataURI) {
  
  var byteString;
  if (dataURI.split(',')[0].indexOf('base64') >= 0)
    byteString = atob(dataURI.split(',')[1]);
  else
    byteString = unescape(dataURI.split(',')[1]);

  
  var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

  
  var ia = new Uint8Array(byteString.length);
  for (var i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }

  return new Blob([ia], {type:mimeString});
}


function reduceSize(width, height, max_side_len) {
  if (Math.max(width, height) <= max_side_len) {
    return [width, height];
  }
  else if (width >= height) {
    height *= max_side_len / width;
    width = max_side_len;
    return [width, height];
  }
  else if (width < height) {
    width *= max_side_len / height;
    height = max_side_len;
    return [width, height];
  }
}
