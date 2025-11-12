(function initLocalStorage() {
    function lsLoad(key) {
        try {
            return JSON.parse(localStorage.getItem(key)) || [];
        } catch (e) {
            console.error("Error parsing localStorage key", key, e);
            return [];
        }
    }

    function lsSave(key, value) {
        localStorage.setItem(key, JSON.stringify(value));
    }

    function lsInitIfEmpty(key, initialArray = []) {
        if (!localStorage.getItem(key)) {
            lsSave(key, initialArray);
            console.log(`"${key}" inicializado con datos por defecto.`);
        }
    }

    lsInitIfEmpty("admins", [
        {
            id: "0001",
            aName: "Allied Mastercomputer",
            email: "AM@example.com",
            phone: "555-1234",
            password: "ergosum",
            role: "admin"
        }
    ]);

    lsInitIfEmpty("teachers", [
        {
            code: "T001",
            id: "123",
            tName: "Ted",
            tLastName: "Anderson",
            tStatus: "active",
            img_url: "#",
            academic_area: []
        }
    ]);

lsInitIfEmpty("courses", [
    {
        code: "C001",
        cName: "Introducción a la Programación",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        teacher: "T001",
        modules: [
            {
                code: "M001",
                mName: "Módulo 1",
                description: "Introducción",
                lessons: [
                    {
                        lName: "Lección 1",
                        hours: 2,
                        content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
                        resources: []
                    }
                ]
            }
        ]
    },
    {
        code: "C002",
        cName: "Inglés I",
        description: "Curso introductorio de inglés enfocado en vocabulario básico, comprensión auditiva y estructuras gramaticales simples.",
        teacher: "T001",
        modules: [
            {
                code: "M001",
                mName: "Módulo 1: Fundamentos del Inglés",
                description: "Saludos, presentaciones y estructuras básicas del presente simple.",
                lessons: [
                    {
                        lName: "Lección 1: Presentaciones personales",
                        hours: 1,
                        content: "Aprende a presentarte, saludar y formular preguntas básicas en inglés.",
                        resources: []
                    },
                    {
                        lName: "Lección 2: Verbo To Be",
                        hours: 2,
                        content: "Uso del verbo 'to be' en afirmaciones, negaciones y preguntas.",
                        resources: []
                    }
                ]
            },
            {
                code: "M002",
                mName: "Módulo 2: Vocabulario y pronunciación",
                description: "Ampliación de vocabulario y práctica de pronunciación con diálogos simples.",
                lessons: [
                    {
                        lName: "Lección 1: Números, días y meses",
                        hours: 1,
                        content: "Aprende vocabulario básico sobre tiempo y fechas.",
                        resources: []
                    }
                ]
            }
        ]
    },
    {
        code: "C003",
        cName: "Física I",
        description: "Fundamentos de la física clásica: cinemática, dinámica y leyes del movimiento.",
        teacher: "T001",
        modules: [
            {
                code: "M001",
                mName: "Módulo 1: Cinemática",
                description: "Descripción del movimiento de los cuerpos sin considerar sus causas.",
                lessons: [
                    {
                        lName: "Lección 1: Movimiento rectilíneo uniforme",
                        hours: 2,
                        content: "Análisis del movimiento a velocidad constante y su representación gráfica.",
                        resources: []
                    },
                    {
                        lName: "Lección 2: Movimiento uniformemente acelerado",
                        hours: 2,
                        content: "Ecuaciones del movimiento con aceleración constante.",
                        resources: []
                    }
                ]
            },
            {
                code: "M002",
                mName: "Módulo 2: Dinámica",
                description: "Estudio de las fuerzas y su relación con el movimiento.",
                lessons: [
                    {
                        lName: "Lección 1: Las leyes de Newton",
                        hours: 2,
                        content: "Introducción a las tres leyes fundamentales del movimiento.",
                        resources: []
                    }
                ]
            }
        ]
    },
    {
        code: "C004",
        cName: "Introducción a la Mecánica Clásica",
        description: "Análisis detallado de los principios de la mecánica newtoniana y su aplicación a sistemas físicos.",
        teacher: "T001",
        modules: [
            {
                code: "M001",
                mName: "Módulo 1: Fundamentos de la Mecánica",
                description: "Definición de magnitudes físicas, vectores y sistemas de referencia.",
                lessons: [
                    {
                        lName: "Lección 1: Magnitudes escalares y vectoriales",
                        hours: 1,
                        content: "Diferencias, propiedades y ejemplos prácticos del uso de vectores en la física.",
                        resources: []
                    }
                ]
            },
            {
                code: "M002",
                mName: "Módulo 2: Conservación del movimiento",
                description: "Principios de conservación del momento lineal y la energía mecánica.",
                lessons: [
                    {
                        lName: "Lección 1: Energía y trabajo",
                        hours: 2,
                        content: "Concepto de trabajo, energía cinética y potencial; teorema del trabajo y la energía.",
                        resources: []
                    }
                ]
            }
        ]
    }
]);

})();
