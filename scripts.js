document.addEventListener('DOMContentLoaded', function() {
    var loadingModal = document.querySelector('#loadingModal');
    var resultDiv = document.querySelector('#result');
    try {
        document.querySelector('#fileInput').addEventListener('change', function() {
            var file = this.files[0];
            var formData = new FormData();
            formData.append('image', file);
            var clientId = 'da8378f7ca289d2';
            // Show the loading animation
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
                    throw new Error('Server error: ' + response.status);
                }
                return response.json();
            })
            .then(data => {
                if (data.success) {
                    console.log('Image uploaded successfully. Image link: ' + data.data.link);
                    resultDiv.innerHTML = '<a href="' + data.data.link + '" target="_blank">View Image</a>';
                } else {
                    console.error('Upload failed: ' + data.data.error);
                    resultDiv.innerHTML = 'Upload failed: ' + data.data.error;
                }
            })
            .catch(error => {
                console.error('An error occurred:', error);
                resultDiv.innerHTML = 'An error occurred: ' + error.message;
            })
            .finally(() => {
                // Hide the loading animation
                loadingModal.classList.remove('show');
            });
        });

        document.querySelector('.dropzones').addEventListener('click', function() {
            document.querySelector('#fileInput').click();
        });
    } catch (error) {
        console.error('An error occurred:', error);
        alert(error.message);
    }
});