

function toggleAgregar() {
    document.querySelector(".mayor").setAttribute("style", "display: none;");
    document.querySelector(".menor").setAttribute("style", "display: none;");
    document.querySelector(".agregar").removeAttribute("style");
}

document.querySelector(".cancel").addEventListener("click", (event) => {
    event.preventDefault();
    document.querySelector(".mayor").removeAttribute("style");
    document.querySelector(".menor").removeAttribute("style");
    document.querySelector(".agregar").setAttribute("style", "display: none");
    
    window.location.href = "/dashboard/inventory";
});




function toggleSave() { 
    fetch('/product', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nombre })
    })
    .then(response => response.json()) 
    .then(data => {

        // Comparar elementos y ver cuales han cambiado
        let name = document.getElementById("name").value;
        // Si se modifica se conserva el nuevo
        data.nombre = name === 0 || name === "" ? data.nombre : name !== data.nombre ? name: data.nombre; 
        
        // Repetimos lo mismo para cada valor relevante
        let provedor = document.getElementById("prv").value;
        data.provedor = provedor === 0 || provedor === "" ? data.provedor : provedor !== data.provedor ? provedor: data.provedor; 

        let precio = document.getElementById("price").value;
        data.precio = precio === 0 || precio === "" ? data.precio : precio !== data.precio ? precio: data.precio; 

        let cantidad = document.getElementById("quantity").value;
        data.cantidad = cantidad === 0 || cantidad === "" ? data.cantidad : cantidad !== data.cantidad ? cantidad: data.cantidad; 

        
        fetch("/update_product", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(data => {
            location.reload(true);
        })

    })
    .catch(error => {
        console.error('Error:', error);
    })
    
    //window.location.reload();
}








    const changePictureButton = document.getElementById('change_picture_button');
    const profilePictureInput = document.getElementById('imagen');

    profilePictureInput.addEventListener("click", (event) => {
        event.preventDefault();
    });

    changePictureButton.addEventListener('click', (event) => {
        event.preventDefault();
        profilePictureInput.click();
    });

    profilePictureInput.addEventListener('change', async () => {
        showLoading();
        const file = profilePictureInput.files[0];
        if (file) {
            try {
                const response = await fetch('/s3url/image');
                const data = await response.json();
                const s3Url = data.url;

                const uploadResponse = await fetch(s3Url, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'image/jpeg'
                    },
                    body: file
                });

                if (uploadResponse.ok) {
                    const updateUserImageResponse = await fetch('/update_product_image', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            email: document.getElementById("name").value, // Obtener el correo del usuario desde sessionStorage
                            imageUrl: s3Url.split('?')[0] // URL sin la firma
                        })
                    });

                    if (updateUserImageResponse.ok) {
                        document.getElementById('produc_img').src = s3Url.split('?')[0]; // Mostrar la imagen actualizada en el frontend
                        
                    } else {
                        
                    }
                } else {
    
                }
            } catch (error) {
                console.error('Error:', error);

            }
        } else {
    
        }
    });


//

document.getElementById("saveI").addEventListener("click", (event) => {
    event.preventDefault();
    toggleSave();
});