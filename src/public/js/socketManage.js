const socket = io();

//pendiente implementar alertas y verificación por estados antes de editar el dom

socket.on("prods-updated", ({prods,status,message,action}) => {
    const container = document.querySelector(".products-rt")
    container.innerHTML = ''
    prods.forEach(prod => {
        const card = document.createElement('div')
        card.className = 'product-preview'
        card.innerHTML = `
            <div>
                <strong>ID: ${prod.id}</strong>
                <div class="prod-status ${prod.status?'active':'inactive'}">${prod.status?'Disponible':'Agotado'}</div>
            </div>
            <img src="${prod.mainThumb}" alt="" class="main-thumb" alt="">
            <div>
                <h3>${prod.title}</h3>
                <p>$${prod.price}</p>
            </div>
            <button class="btn">Revisar producto</button>
        `
        container.appendChild(card)
    });
})



// socket.on("new-user-connected", (socketId) => {
//     Swal.fire({
//         text: `Nuevo participante: ${socketId}`,
//         toast: true,
//         position: 'top-right',
//         showConfirmButton: false,
//         timer: 3000,
//         timerProgressBar: true,
//         icon: 'info'
//     });
// });