document.addEventListener('DOMContentLoaded', function() {
    var loadingModal = document.querySelector('#loadingModal');
    var resultDiv = document.querySelector('#result');
    var dropzone = document.querySelector('.dropzones');
    var fileInput = document.querySelector('#fileInput');
    var dragCounter = 0;

    dropzone.addEventListener('dragover', function(e) {
        e.preventDefault();
    });

    dropzone.addEventListener('dragenter', function(e) {
        e.preventDefault();
        if (e.target === this) {
            dragCounter++;
            this.classList.add('dragging');
        }
    })
    
    dropzone.addEventListener('dragleave', function() {
        if (e.target === this) {
            dragCounter--;
            if (dragCounter === 0) {
                this.classList.remove('dragging');
            }
        }
    });
    
    dropzone.addEventListener('drop', function(e) {
        e.preventDefault();
        dragCounter = 0;
        this.classList.remove('dragging');
        fileInput.files = e.dataTransfer.files;
        fileInput.dispatchEvent(new Event('change'));
    });

    dropzone.addEventListener('click', function() {
        fileInput.click();
    });

    fileInput.addEventListener('change', function() {
        var file = this.files[0];
        var formData = new FormData();
        formData.append('image', file);
        var clientId = 'da8378f7ca289d2';
        loadingModal.classList.add('show');
        fetch('https://api.imgur.com/3/image', {
            method: 'POST',
            headers: {
                Authorization: 'Client-ID ' + clientId,
            },
            body: formData
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok. Exited with status ' + response.status);
            }
            return response.json();
        })
        .then(data => {
            if (data.success) {
                console.log('Image uploaded successfully. Image Link: ' + data.data.link);
                resultDiv.innerHTML = `
                    <button onclick="navigator.clipboard.writeText('${data.data.link}')">Copy Link</button>
                    <button onclick="window.open('${data.data.link}', '_blank')">View Image</button>
                `;
            } else {
                console.error('Image upload failed. Error: ' + data.data.error);
                resultDiv.innerHTML = '<p>Image upload failed. Error: ' + data.data.error + '</p>';
            }
        })
        .catch(error => {
            console.error('Error:', error);
            resultDiv.innerHTML = '<p>Image upload failed. Error: ' + error + '</p>';
        })
        .finally(() => {
            loadingModal.classList.remove('show');
        })
    })
});