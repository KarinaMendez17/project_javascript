    const form =
document.getElementById("formulario");

    const tabla =
document.querySelector("#tablaEstudiantestbody");

form.addEventListener("submit", function (e) {
    e.preventDefault();

    const nombre =
document.getElementById("nombre").value;
    const p1 =
parseFloat(document.getElementById("p1").value);
    const p2 =
parseFloat(document.getElementById("p2").value);
    const p3 =
parseFloat(document.getElementById("p3").value);

    const notaFinal = ((p1 + p2 + p3)/3).toFixed(2);

    const fila =
document.createElement("tr");

    fila.innerHTML =`
        <td>${nombre}</td>
        <td>${p1}</td>
        <td>${p2}</td>
        <td>${p3}</td>
        <td>${notaFinal}</td>
        `;
    tabla.appendChild(fila);

    form.reset();
})