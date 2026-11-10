console.log("");
console.log("====    Formas de crear la fecha    ====");
console.log("");

const fechaUTC = new Date("2026-03-15");
const fechaLocal = new Date(2026, 2, 15);

console.log("Fecha creada como cadena:", fechaUTC);
console.log("Fecha creada con números:", fechaLocal);

console.log("Diferencia en minutos:",((fechaLocal.getTime() - fechaUTC.getTime()) / 1000 / 60));

console.log("");
console.log("====    Simulación usuarios en distinta zona    ====");
console.log("");

const instante = new Date("2026-03-15T00:30:00Z");

console.log("Fecha en Madrid:", instante.toLocaleDateString("es-ES", {
    timeZone: "Europe/Madrid"
}));

console.log("Fecha en Los Ángeles:", instante.toLocaleDateString("es-ES", {
    timeZone: "America/Los_Angeles"
}));

console.log("");