import { useState, useMemo, useRef, useEffect } from "react";

// ── KNOWLEDGE BASE ───────────────────────────────────────────
const CAPSULAS = {
  SARTORIAL: {
    color: "#92400e",
    keywords: ["hecho a mano", "minimalista", "atemporal", "puro"],
    descripcion: "Precisa, depurada y lujosa. Mezclas de lana y nuevos tejidos Winter Crepure. Paleta cromática fría, suave y terrosa con grises, azules oscuros y violetas.",
    nuevosAcabados: ["WINTER CREPURE — siluetas chic y estructuradas, peso cálido y envolvente para invierno", "TAILORED — mezclas de hilaturas mélange con acabado Milwash, listas para confección directa"],
    inspiracion: ["Armani FW26", "Dolce&Gabbana FW26", "Louis Vuitton FW26"],
    palette: ["#6b7280","#374151","#4c1d95","#78716c","#e7e5e4"]
  },
  PULSE: {
    color: "#be185d",
    keywords: ["versátil", "activo", "dinámico", "cotidiano"],
    descripcion: "Tejidos prácticos y de fácil mantenimiento con estética sofisticada. Mezclas exclusivas de Algodón y Tencel con Lycra. Paleta urbana, limpia y contemporánea.",
    nuevosAcabados: ["PREMIUM RICH — mezclas exclusivas de fibras con equilibrio perfecto entre algodón y Tencel, tacto de alta calidad"],
    inspiracion: ["Michael Kors FW26", "Soshi Otsuki FW26", "Tibi FW26"],
    palette: ["#1d4ed8","#60a5fa","#92400e","#374151","#9ca3af"]
  },
  LEGACY: {
    color: "#0369a1",
    keywords: ["herencia", "tradición", "elegancia", "prestigio"],
    descripcion: "Materiales nobles, paleta oscura, elegancia atemporal. Siluetas estructuradas que combinan lo contemporáneo con lo artesanal. Grises, berenjenas y marrones.",
    nuevosAcabados: ["DOUBLE WEAVE FABRICS — doble tela en algodones orgánicos, combina firmeza y suavidad", "WOOL DENIM — aspecto bull denim con lana, alta calidad y estética casual"],
    inspiracion: ["Gucci FW26", "Brioni FW26", "Phillip Lim FW26"],
    palette: ["#1e3a5f","#7c3aed","#5b21b6","#78350f","#6b7280"]
  },
  ARCADIA: {
    color: "#7c3aed",
    keywords: ["espiritual", "poética", "natural", "evocadora"],
    descripcion: "Inspirada en el realismo mágico y la mitología. El bosque como refugio. Colores naturales: madera, plantas, flores, tierra, verdes, rojos e intensos púrpuras.",
    nuevosAcabados: ["CORDUROY — nuevas series de corduroy, ampliando la gama con nuevos diseños", "MILANO — tacto cálido invernal, superficie suave con volumen para algodón de alto gramaje"],
    inspiracion: ["Ulla Johnson FW26", "Advisry FW26", "Calvin Klein FW26"],
    palette: ["#7c2d12","#b91c1c","#166534","#78350f","#14532d"]
  },
  RETREAT: {
    color: "#065f46",
    keywords: ["rústica", "suave", "reconfortante", "acogedora"],
    descripcion: "Enraizada en el bienestar y la conciencia plena. Reinterpreta lo rústico con tonos tostados, nude y beige. Algodón en texturas artesanales, suaves y envolventes.",
    nuevosAcabados: ["SOFT BULL DENIM — sargas marcadas en telares de nueva generación, carácter pesado y rústico", "FLANNEL — tejidos con aspecto franela por proceso innovador, superficie suave y uniforme"],
    inspiracion: ["Moschino FW26", "Eckhaus Latta FW26", "Emporio Armani FW26"],
    palette: ["#d97706","#92400e","#a16207","#78350f","#d6d3d1"]
  },
  MIDNIGHT: {
    color: "#1e1b4b",
    keywords: ["sofisticada", "compleja", "refinada", "seductora"],
    descripcion: "Tonos profundos bajo influencia art déco. Contraste brillo pulido vs mate extremo. Tencel Luxe, Naia, Glissen Luxe y Ecodesk Luxe: materiales ligeros y fluidos similares a la seda.",
    nuevosAcabados: ["GLISSEN — ampliación de gama Tencel Luxe y sus mezclas, acabado no-wash tipo Millwash"],
    inspiracion: ["The Attico SS25", "AWGE FW26", "Miu Miu FW26"],
    palette: ["#1e1b4b","#312e81","#78350f","#1f2937","#d6d3d1"]
  }
};

const ACABADOS_DB = {
  "BIODESK": { descripcion: "Pretratamiento biológico que optimiza la fibra de algodón: menos productos químicos, menos agua, mejor calidad. Reduce el pilling y mejora la durabilidad. Tecnología más limpia.", sostenible: true, noLavar: false },
  "BETTER PLUS": { descripcion: "Acabado limpio con tacto sutil y refinado. Tejido voluminoso con aspecto sofisticado. No requiere lavado posterior en lavandería.", sostenible: true, noLavar: true },
  "BETTERPLUS": { descripcion: "Acabado limpio con tacto sutil y refinado. Tejido voluminoso con aspecto sofisticado. No requiere lavado posterior en lavandería.", sostenible: true, noLavar: true },
  "BOLD": { descripcion: "Reactivo realizado en TS (antiguo Iris). Color intenso y brillante, aspecto elegante y limpio más duradero. Rendimiento e intensidad de color superiores.", sostenible: false, noLavar: false },
  "BIODC": { descripcion: "Proceso Bio con caustificado. Mejor limpieza del tejido sin mano tan dura como en el mercerizado.", sostenible: true, noLavar: false },
  "BIODM": { descripcion: "Proceso Bio (Ecodesk) más mercerizado para mejorar aspecto y brillo.", sostenible: true, noLavar: false },
  "BLOOM": { descripcion: "Reactivo realizado en ABSA. Puede incluir toque de pelo y elasticidad según variante.", sostenible: false, noLavar: false },
  "CREPURE": { descripcion: "Hilos con sobretorsión especial para tacto seco y sobrio. Movimiento particular que evoca el mundo de la lana clásica. Desde tejidos lisos a microestructuras que recuerdan al vestir clásico de los 50's.", sostenible: false, noLavar: false },
  "BIODESK CREPURE": { descripcion: "Biodesk + Crepure: hilos con sobretorsión especial. Tacto seco y sobrio, movimiento particular que evoca la lana clásica.", sostenible: true, noLavar: false },
  "BIODESK FANCY": { descripcion: "Biodesk + hilo tintado (Fancy implica hilo tintado).", sostenible: true, noLavar: false },
  "BIODESK MICRO": { descripcion: "Biodesk + toque de pelo característico de la lija de diamante.", sostenible: true, noLavar: false },
  "BIODESK NEW PELL": { descripcion: "Biodesk + toque de pelo característico de la lija a pelo y contrapelo.", sostenible: true, noLavar: false },
  "BIODESK PAPER VELVET TOUCH": { descripcion: "Biodesk + toque característico de pelo con cepillos. Superficie aterciopelada.", sostenible: true, noLavar: false },
  "BIODESK REGULAR SLIM": { descripcion: "Biodesk con elasticidad entre 25% y 40%.", sostenible: true, noLavar: false },
  "BIODESK SLIMFLEX": { descripcion: "Biodesk con elasticidad del 40% o más.", sostenible: true, noLavar: false },
  "BIODESK TOP": { descripcion: "Biodesk + paso por tumbler para relajación y mejora de estabilidad dimensional.", sostenible: true, noLavar: false },
  "BIODM NEW PELL": { descripcion: "BioDM + toque de pelo característico de la lija a pelo y contrapelo.", sostenible: true, noLavar: false },
  "ECODESK": { descripcion: "Optimización del proceso de preparación. Base del proceso Bio de Biodesk.", sostenible: true, noLavar: false },
  "ECO-LANDYE PLUSS": { descripcion: "Acabado sostenible ECO con proceso Landye Plus.", sostenible: true, noLavar: false },
  "FANCY": { descripcion: "Tejidos con hilos tintados. Puede estar sobretiñido si tiene código de color.", sostenible: false, noLavar: false },
  "FLANNEL": { descripcion: "Nueva generación de Tencel con aspecto de franela. Proceso de acabado mecánico que extrae la fibra para lograr tacto característico de franela, manteniendo 100% Tencel.", sostenible: true, noLavar: false },
  "GLISSEN": { descripcion: "Acabado no-wash tipo Millwash para artículos de Motif. Notable suavidad al tacto y caída fluida. Realza la elegancia del tejido.", sostenible: false, noLavar: true },
  "MILANO": { descripcion: "Tintura reactiva. Tacto cálido e invernal. Crea una superficie suave y con volumen, ideal para prendas de algodón de alto gramaje. Aplicable a artículos PFD y teñidos.", sostenible: false, noLavar: false },
  "MATTE": { descripcion: "Tacto seco y elegante acabado mate con efecto bicolor y doble textura. Acabado sostenible.", sostenible: true, noLavar: false },
  "ONLYDYE": { descripcion: "Cuando un tejido con varias fibras se deja una sin tintar. Efecto Mélange.", sostenible: false, noLavar: false },
  "PALEO": { descripcion: "Rasqueta: combinación de resinas en base poliuretano para efecto crackeado, pieles desgastadas y usadas. Imágenes con vida y experiencia.", sostenible: false, noLavar: false },
  "PREMIUM RICH": { descripcion: "Tejidos acogedores, tacto extrasuave, respetuosos con la piel. Ligeros y transpirables. Mayor resistencia al desgarro y abrasión. Mezclas exclusivas de algodón y Tencel. Proceso sostenible.", sostenible: true, noLavar: false },
  "RAWCEL": { descripcion: "Nueva generación de Tencel Lyocell (HV100 de Lenzing). Fibras de distinta longitud para tactos y aspectos similares al algodón. Propiedades sostenibles del Lyocell con estética más casual.", sostenible: true, noLavar: false },
  "REGULAR SLIM": { descripcion: "Elasticidad entre 25% y 40%.", sostenible: false, noLavar: false },
  "SLIMFLEX": { descripcion: "Elasticidad del 40% o más.", sostenible: false, noLavar: false },
  "TAILORED": { descripcion: "Mezclas de hilaturas y tejidos mélange con acabado Milwash. Listos para confección directa. Elegante y versátil, con aire sofisticado.", sostenible: false, noLavar: true },
  "TABACO": { descripcion: "Tejido desaprestado no blanqueado.", sostenible: false, noLavar: false },
  "THOFF": { descripcion: "Aspecto limpio y elegante. Alta fijación del color. Apariencia limpia por ambas caras con acabado de silicona. No requiere lavado industrial.", sostenible: false, noLavar: true },
  "WASHFREE": { descripcion: "Acabado Millwash. Tactos estructurados, apariencia más limpia y tonalidades de color más profundas. No requiere lavado.", sostenible: false, noLavar: true },
  "WOOL DENIM": { descripcion: "Denim auténtico con un giro cálido. Mezcla de algodón y lana para tacto más acogedor, manteniendo el espíritu del denim y bull denim con comodidad invernal.", sostenible: false, noLavar: false },
  "DUODYETEC": { descripcion: "Tejido con diferentes tipos de fibras tintadas en dos colores distintos. Se usa cuando se necesitan tinturas diferentes en Jigger.", sostenible: false, noLavar: false },
  "DYETEC": { descripcion: "Tejido con diferentes tipos de fibras tintadas en el mismo color buscando efecto plancha. Tinturas diferentes en Jigger.", sostenible: false, noLavar: false },
  "MELANGE SPONGE": { descripcion: "Siguiendo la línea del acabado Sponge, nueva gama con aspecto mélange que evoca la lana. Apariencia suave y mullida con tacto muy delicado.", sostenible: false, noLavar: false },
};

const MODA_DATA = [
  { id: 1, art: "4243", acabado: "ECODESK SLIMFLEX", color: "0", composicion: "Algodon 98% Lycra 2%", ancho: 150, peso: 285, tipo: "Pana", tejedor: "GLOBAL", acabador: "GLOBAL", mundo: "ARCADIA (M)", mercado: "ALEMANIA", hombre: false, mujer: true, ambos: false, coleccion: "MODA" },
  { id: 2, art: "5253", acabado: "ET.WOOL DENIM BIODESK NAT WOOL DENIM", color: "0", composicion: "Algodon Organico 62% Algodon 30% Lana 8%", ancho: 160, peso: 320, tipo: "Denim", tejedor: "SUZER", acabador: "TS", mundo: "LEGACY (H-M)", mercado: "INDITEX+CELIA+VARIOS", hombre: true, mujer: true, ambos: true, coleccion: "MODA" },
  { id: 3, art: "5255", acabado: "AEROSOFT FANCY WOOL DENIM", color: "701046", composicion: "Algodon Organico 82% Lana 18%", ancho: 160, peso: 310, tipo: "Denim", tejedor: "GALICIA", acabador: "ABSA", mundo: "LEGACY (H-M)", mercado: "INDITEX+CELIA+VARIOS", hombre: true, mujer: true, ambos: true, coleccion: "MODA" },
  { id: 4, art: "5258", acabado: "ET.WOOTEN ONLYDYE WOOLTEN REGULAR SLIM", color: "10743", composicion: "Lenzing Lyocell 62% Lana 25% Poliamida 10% Lycra 3%", ancho: 150, peso: 260, tipo: "Sartorial", tejedor: "M.IBERIA", acabador: "ABSA", mundo: "SARTORIAL (H)", mercado: "INDITEX+CELIA+VARIOS", hombre: true, mujer: false, ambos: false, coleccion: "MODA" },
  { id: 5, art: "5261", acabado: "ET.DUODYET WOOLTEN REGULAR SLIM", color: "400253", composicion: "Lenzing Lyocell 45% Poliamida 35% Lana 17% Elastano 3%", ancho: 145, peso: 220, tipo: "Sartorial", tejedor: "M.IBERIA", acabador: "ABSA", mundo: "SARTORIAL (H)", mercado: "ALEMANIA+ITALIA", hombre: true, mujer: false, ambos: false, coleccion: "MODA" },
  { id: 6, art: "5268", acabado: "BIODESK COTTLAM", color: "0", composicion: "Algodon Organico 70% Algodon Reciclado POST 10% Algodon Reciclado PRE 10% Lana 10%", ancho: 155, peso: 305, tipo: "Basic", tejedor: "TS", acabador: "TS", mundo: "ARCADIA (H-M)", mercado: "INDITEX+CELIA+VARIOS", hombre: true, mujer: true, ambos: true, coleccion: "MODA" },
  { id: 7, art: "5269", acabado: "BIODESK NAT FANCY WOOL DENIM", color: "967", composicion: "Algodon Organico 62% Algodon 30% Lana 8%", ancho: 150, peso: 280, tipo: "Denim", tejedor: "TS", acabador: "TS", mundo: "SARTORIAL (H)", mercado: "INDITEX+CELIA+VARIOS", hombre: true, mujer: false, ambos: false, coleccion: "MODA" },
  { id: 8, art: "5270", acabado: "BLOOM WOOLTEN AEROSOFT", color: "701515", composicion: "Lenzing Lyocell 65% Lana 25% Poliamida 10%", ancho: 145, peso: 180, tipo: "Sartorial", tejedor: "M.IBERIA", acabador: "ABSA", mundo: "SARTORIAL (H)", mercado: "INDITEX+CELIA+VARIOS", hombre: true, mujer: false, ambos: false, coleccion: "MODA" },
  { id: 9, art: "5271", acabado: "ONLYDYE WOOLTEN AEROSOFT", color: "90644", composicion: "Poliamida 45% Lenzing Lyocell 40% Lana 15%", ancho: 145, peso: 180, tipo: "Sartorial", tejedor: "M.IBERIA", acabador: "ABSA", mundo: "SARTORIAL (H)", mercado: "INDITEX+CELIA+VARIOS", hombre: true, mujer: false, ambos: false, coleccion: "MODA" },
  { id: 10, art: "5272", acabado: "BLOOM WOOLTEN AEROSOFT", color: "701515", composicion: "Lenzing Lyocell 64% Lana 24% Poliamida 10% Lycra 2%", ancho: 145, peso: 125, tipo: "Sartorial", tejedor: "M.IBERIA", acabador: "ABSA", mundo: "SARTORIAL (H)", mercado: "ALEMANIA+ITALIA", hombre: true, mujer: false, ambos: false, coleccion: "MODA" },
  { id: 11, art: "6536", acabado: "ET.SPONGE SPONGE GOTS", color: "0", composicion: "Algodon Organico 100%", ancho: 160, peso: 350, tipo: "GOTS", tejedor: "TS", acabador: "TS", mundo: "ARCADIA (H)", mercado: "INDITEX+CELIA+TURQUÍA", hombre: true, mujer: false, ambos: false, coleccion: "MODA" },
  { id: 12, art: "6550", acabado: "BOLD WASHFREE", color: "701476", composicion: "Algodon Organico 100%", ancho: 145, peso: 265, tipo: "Basic", tejedor: "SUZER", acabador: "TS", mundo: "LEGACY (H)", mercado: "INDITEX+CELIA+TURQUÍA", hombre: true, mujer: false, ambos: false, coleccion: "MODA" },
  { id: 13, art: "6572", acabado: "BIODESK MILANO GOTS", color: "0", composicion: "Algodon Organico 100%", ancho: 165, peso: 345, tipo: "GOTS", tejedor: "SUZER", acabador: "TS", mundo: "RETREAT (H-M)", mercado: "INDITEX+TURQUÍA", hombre: true, mujer: true, ambos: true, coleccion: "MODA" },
  { id: 14, art: "6579", acabado: "EST.MATTE ACABADO", color: "90610", composicion: "Algodon Organico 100%", ancho: 160, peso: 410, tipo: "Fantasia", tejedor: "TS", acabador: "TS", mundo: "RETREAT (H-M)", mercado: "ITALIA", hombre: true, mujer: true, ambos: true, coleccion: "MODA" },
  { id: 15, art: "6667", acabado: "BOLD WASHFREE", color: "701476", composicion: "Algodon Organico 70% Algodon Reciclado PRE 30%", ancho: 160, peso: 265, tipo: "Basic", tejedor: "DENKATEKS", acabador: "TS", mundo: "LEGACY (H-M)", mercado: "INDITEX+CELIA", hombre: true, mujer: true, ambos: true, coleccion: "MODA" },
  { id: 16, art: "6668", acabado: "ET.WASHFREE BOLD WASHFREE", color: "701476", composicion: "Algodon Organico 100%", ancho: 145, peso: 215, tipo: "Basic", tejedor: "SUZER", acabador: "TS", mundo: "LEGACY (H-M)", mercado: "INDITEX+TURQUÍA", hombre: true, mujer: true, ambos: true, coleccion: "MODA" },
  { id: 17, art: "6669", acabado: "ET.PALEO PALEO", color: "701294", composicion: "Algodon Organico 100%", ancho: 150, peso: 130, tipo: "Basic", tejedor: "DENKATEKS", acabador: "ABSA", mundo: "RETREAT (H-M)", mercado: "INDITEX+CELIA", hombre: true, mujer: true, ambos: true, coleccion: "MODA" },
  { id: 18, art: "6676a", acabado: "ET.FLOW FLOW", color: "400103", composicion: "Algodon 50% Algodon Organico 50%", ancho: 150, peso: 340, tipo: "Basic", tejedor: "SUZER", acabador: "TS", mundo: "LEGACY (H)", mercado: "INDITEX+CELIA", hombre: true, mujer: false, ambos: false, coleccion: "MODA" },
  { id: 19, art: "6676b", acabado: "BOLD MILANO AIRTEC", color: "66939", composicion: "Algodon 50% Algodon Organico 50%", ancho: 145, peso: 340, tipo: "Milano", tejedor: "SUZER", acabador: "TS", mundo: "ARCADIA (H)", mercado: "INDITEX+CELIA", hombre: true, mujer: false, ambos: false, coleccion: "MODA" },
  { id: 20, art: "6682", acabado: "BIODESK ECODESK", color: "0", composicion: "Algodon Organico 60% Algodon 40%", ancho: 155, peso: 275, tipo: "Pana", tejedor: "GLOBAL", acabador: "GLOBAL", mundo: "RETREAT (H-M)", mercado: "INDITEX+CELIA", hombre: true, mujer: true, ambos: true, coleccion: "MODA" },
  { id: 21, art: "6699", acabado: "BIODESK PAPER VELVET TOUCH", color: "0", composicion: "Algodon 80% Algodon Organico 20%", ancho: 160, peso: 275, tipo: "Velvet", tejedor: "SUZER", acabador: "TS", mundo: "ARCADIA (H-M)", mercado: "INDITEX+CELIA", hombre: true, mujer: true, ambos: true, coleccion: "MODA" },
  { id: 22, art: "6707", acabado: "BIODM NEW PELL", color: "0", composicion: "Algodon 55% Algodon Organico 45%", ancho: 160, peso: 295, tipo: "Basic", tejedor: "DENKATEKS", acabador: "TS", mundo: "RETREAT (H-M)", mercado: "INDITEX+CELIA+ITALIA", hombre: true, mujer: true, ambos: true, coleccion: "MODA" },
  { id: 23, art: "6776", acabado: "ET.CREPURE BIODM CREPURE", color: "0", composicion: "Algodon Organico 100%", ancho: 145, peso: 250, tipo: "Crepure", tejedor: "DENKATEKS", acabador: "TS", mundo: "SARTORIAL (H-M)", mercado: "ALEMANIA+INDITEX+CELIA+ITALIA", hombre: true, mujer: true, ambos: true, coleccion: "MODA" },
  { id: 24, art: "6826", acabado: "ET.BIODESK BIODESK", color: "0", composicion: "Algodon Organico 100%", ancho: 155, peso: 345, tipo: "Basic", tejedor: "SUZER", acabador: "TS", mundo: "RETREAT (H-M)", mercado: "INDITEX+CELIA+TURQUÍA", hombre: true, mujer: true, ambos: true, coleccion: "MODA" },
  { id: 25, art: "6827", acabado: "pana ECODESK", color: "0", composicion: "Algodon 100%", ancho: 150, peso: 125, tipo: "Pana", tejedor: "GLOBAL", acabador: "GLOBAL", mundo: "ARCADIA (H-M)", mercado: "TODOS", hombre: true, mujer: true, ambos: true, coleccion: "MODA" },
  { id: 26, art: "7028", acabado: "BIODESK AIRMIST", color: "0", composicion: "Lenzing Lyocell 100%", ancho: 150, peso: 300, tipo: "Lyocell", tejedor: "TS", acabador: "TS", mundo: "ARCADIA (M)", mercado: "TODOS", hombre: false, mujer: true, ambos: false, coleccion: "MODA" },
  { id: 27, art: "18291", acabado: "BIODESK TOP FANCY REGULAR SLIM", color: "0", composicion: "Lenzing Lyocell 58% Elastomultiester T-400 27% Algodon 15%", ancho: 140, peso: 340, tipo: "Fancy", tejedor: "GALICIA", acabador: "ABSA", mundo: "PULSE (H-M)", mercado: "TURQUIA+ALEMANIA+ITALIA", hombre: true, mujer: true, ambos: true, coleccion: "MODA" },
  { id: 28, art: "40464", acabado: "MILANO", color: "90256", composicion: "Algodon PIMA 97% Lycra 3%", ancho: 155, peso: 250, tipo: "Milano", tejedor: "DIAMOND", acabador: "TS", mundo: "ARCADIA (H)", mercado: "ALEMANIA+ITALIA", hombre: true, mujer: false, ambos: false, coleccion: "MODA" },
  { id: 29, art: "40714", acabado: "BIODESK PAPER VELVET TOUCH TOP REGULAR SLIM", color: "0", composicion: "Algodon Organico 99% Lycra Ecomade 1%", ancho: 150, peso: 250, tipo: "Felpa", tejedor: "TS", acabador: "TS", mundo: "LEGACY (H)", mercado: "ALEMANIA+INDITEX+ITALIA+P.NORDICOS", hombre: true, mujer: false, ambos: false, coleccion: "MODA" },
  { id: 30, art: "70097", acabado: "pana BOLD SLIMFLEX", color: "9949", composicion: "Algodon 55% Viscosa 43% Elastano 2%", ancho: 140, peso: 280, tipo: "Pana", tejedor: "GLOBAL", acabador: "GLOBAL", mundo: "ARCADIA (M)", mercado: "TODOS", hombre: false, mujer: true, ambos: false, coleccion: "MODA" },
  { id: 31, art: "70142", acabado: "ET.FANCY DENIM FANCY DENIM", color: "4658", composicion: "Lenzing Lyocell 100%", ancho: 160, peso: 405, tipo: "Denim Fancy", tejedor: "TS", acabador: "TS", mundo: "RETREAT (M)", mercado: "CELIA", hombre: false, mujer: true, ambos: false, coleccion: "MODA" },
  { id: 32, art: "70203", acabado: "ET.PREMIUMBOLD FLOW PREMIUM RICH", color: "90403", composicion: "Algodon Organico 70% Lenzing Lyocell 30%", ancho: 150, peso: 215, tipo: "Premium", tejedor: "TS", acabador: "TS", mundo: "PULSE (H)", mercado: "TODOS", hombre: true, mujer: false, ambos: false, coleccion: "MODA" },
  { id: 33, art: "70245", acabado: "BIODESK MILANO", color: "0", composicion: "Lenzing Lyocell 74% Algodon Organico 24% Lycra 2%", ancho: 155, peso: 395, tipo: "Milano", tejedor: "DIAMOND", acabador: "TS", mundo: "PULSE (H)", mercado: "TURQUÍA", hombre: true, mujer: false, ambos: false, coleccion: "MODA" },
  { id: 34, art: "70323", acabado: "ET.BETTER PLUS BETTERPLUS", color: "400187", composicion: "Lenzing Lyocell 55% Algodon 34% Elastomultiester T-400 9% Lycra 2%", ancho: 130, peso: 260, tipo: "Premium", tejedor: "DENKATEKS", acabador: "TS", mundo: "PULSE (M)", mercado: "ALEMANIA", hombre: false, mujer: true, ambos: false, coleccion: "MODA" },
  { id: 35, art: "70419", acabado: "BIODESK FLUID FANCY REG.SLIM", color: "8240", composicion: "Algodon Organico 50% Lenzing Lyocell 23% Lenzing Viscose EV 15% Poliamida 10%", ancho: 145, peso: 300, tipo: "Sartorial Fluid", tejedor: "GALICIA", acabador: "ABSA", mundo: "SARTORIAL (H)", mercado: "ALEMANIA", hombre: true, mujer: false, ambos: false, coleccion: "MODA" },
  { id: 36, art: "70421", acabado: "TAILORED ACABADO 6043", color: "992", composicion: "Lenzing Viscose EV 100%", ancho: 145, peso: 315, tipo: "Tailored", tejedor: "M.IBERIA", acabador: "ABSA", mundo: "SARTORIAL (M)", mercado: "ALEMANIA", hombre: false, mujer: true, ambos: false, coleccion: "MODA" },
];

const DENIM_DATA = [
  { id: 101, art: "12463", acabado: "FREE", color: "15", composicion: "Lenzing Lyocell 100%", ancho: 160, peso: 290, tipo: "Lyocell", tejedor: "TS", acabador: "TS", mundo: "—", mercado: "—", hombre: false, mujer: false, ambos: true, coleccion: "DENIM", stock: 3700, stockAcabado: 11000 },
  { id: 102, art: "12547", acabado: "FREE", color: "256", composicion: "Lenzing Lyocell 77% Algodon 23%", ancho: 165, peso: 415, tipo: "Lyocell Mix", tejedor: "TS", acabador: "TS", mundo: "—", mercado: "—", hombre: false, mujer: false, ambos: true, coleccion: "DENIM", stock: 6300, stockAcabado: 400 },
  { id: 103, art: "12547b", acabado: "BLACK-BLACK", color: "901", composicion: "Lenzing Lyocell 77% Algodon 23%", ancho: 165, peso: 405, tipo: "Lyocell Mix", tejedor: "TS", acabador: "TS", mundo: "—", mercado: "—", hombre: false, mujer: false, ambos: true, coleccion: "DENIM", stock: 380, stockAcabado: 81 },
  { id: 104, art: "12834", acabado: "FREE", color: "256", composicion: "Lenzing Lyocell 100%", ancho: 160, peso: 400, tipo: "Lyocell", tejedor: "TS", acabador: "TS", mundo: "—", mercado: "—", hombre: false, mujer: false, ambos: true, coleccion: "DENIM", stock: 6700, stockAcabado: 2800 },
  { id: 105, art: "12834b", acabado: "DENIM SPONGE", color: "256", composicion: "Lenzing Lyocell 100%", ancho: 160, peso: 395, tipo: "Sponge", tejedor: "TS", acabador: "TS", mundo: "—", mercado: "—", hombre: false, mujer: false, ambos: true, coleccion: "DENIM", stock: 6700, stockAcabado: 140 },
  { id: 106, art: "13047", acabado: "FREE", color: "256", composicion: "Algodon Organico 100%", ancho: 150, peso: 510, tipo: "Algodon Organico", tejedor: "TS", acabador: "TS", mundo: "—", mercado: "—", hombre: false, mujer: false, ambos: true, coleccion: "DENIM", stock: 2200, stockAcabado: 685 },
  { id: 107, art: "13049", acabado: "FREE", color: "256", composicion: "Algodon Organico 100%", ancho: 140, peso: 500, tipo: "Algodon Organico", tejedor: "TS", acabador: "TS", mundo: "—", mercado: "—", hombre: false, mujer: false, ambos: true, coleccion: "DENIM", stock: 1200, stockAcabado: 1850 },
  { id: 108, art: "13058", acabado: "FREE", color: "15", composicion: "Algodon Organico 100%", ancho: 160, peso: 400, tipo: "Algodon Organico", tejedor: "TS", acabador: "TS", mundo: "—", mercado: "—", hombre: false, mujer: false, ambos: true, coleccion: "DENIM", stock: 1300, stockAcabado: 2700 },
  { id: 109, art: "13129", acabado: "FREE", color: "256", composicion: "Lenzing Lyocell 100%", ancho: 155, peso: 345, tipo: "Lyocell", tejedor: "TS", acabador: "TS", mundo: "—", mercado: "—", hombre: false, mujer: false, ambos: true, coleccion: "DENIM", stock: 0, stockAcabado: 3190 },
  { id: 110, art: "13181", acabado: "BLACK-BLACK TWIN MED", color: "901", composicion: "Algodon Organico 75% Algodon Reciclado PRE 25%", ancho: 170, peso: 390, tipo: "Reciclado", tejedor: "BOSSA", acabador: "BOSSA", mundo: "—", mercado: "—", hombre: false, mujer: false, ambos: true, coleccion: "DENIM", stock: 0, stockAcabado: 38 },
  { id: 111, art: "13215", acabado: "FREE PURE TWIN MED", color: "205", composicion: "Algodon 100%", ancho: 165, peso: 355, tipo: "Algodon", tejedor: "BOSSA", acabador: "BOSSA", mundo: "—", mercado: "—", hombre: false, mujer: false, ambos: true, coleccion: "DENIM", stock: 0, stockAcabado: 240 },
  { id: 112, art: "13221", acabado: "FREE GOTS TWIN RAY", color: "84", composicion: "Algodon Organico 100%", ancho: 165, peso: 295, tipo: "GOTS", tejedor: "INDIA", acabador: "INDIA", mundo: "—", mercado: "—", hombre: false, mujer: false, ambos: true, coleccion: "DENIM", stock: 0, stockAcabado: 34900 },
  { id: 113, art: "13233", acabado: "FREE", color: "15", composicion: "Algodon Organico 55% Lino 35% Poliamida 10%", ancho: 135, peso: 230, tipo: "Lino Mix", tejedor: "TS", acabador: "TS", mundo: "—", mercado: "—", hombre: false, mujer: false, ambos: true, coleccion: "DENIM", stock: 50, stockAcabado: 0 },
  { id: 114, art: "13263", acabado: "FREE", color: "256", composicion: "Lenzing Lyocell 65% Algodon Organico 35%", ancho: 150, peso: 350, tipo: "Lyocell Mix", tejedor: "TS", acabador: "TS", mundo: "—", mercado: "—", hombre: false, mujer: false, ambos: true, coleccion: "DENIM", stock: 0, stockAcabado: 140 },
  { id: 115, art: "13265", acabado: "FREE", color: "256", composicion: "Lenzing Lyocell 100%", ancho: 150, peso: 340, tipo: "Lyocell", tejedor: "TS", acabador: "TS", mundo: "—", mercado: "—", hombre: false, mujer: false, ambos: true, coleccion: "DENIM", stock: 0, stockAcabado: 194 },
  { id: 116, art: "13275", acabado: "FREE TWIN MED", color: "234", composicion: "EcoCell Lyocell 100%", ancho: 165, peso: 360, tipo: "EcoCell", tejedor: "BOSSA", acabador: "BOSSA", mundo: "—", mercado: "—", hombre: false, mujer: false, ambos: true, coleccion: "DENIM", stock: 0, stockAcabado: 3000 },
  { id: 117, art: "13292", acabado: "FREE TWIN RAY", color: "84", composicion: "Algodon 75% Lenzing Lyocell 25%", ancho: 160, peso: 205, tipo: "Mix Lyocell", tejedor: "BHASKAR", acabador: "BHASKAR", mundo: "—", mercado: "—", hombre: false, mujer: false, ambos: true, coleccion: "DENIM", stock: 0, stockAcabado: 0 },
  { id: 118, art: "13293", acabado: "FREE GOTS TWIN RAY", color: "84", composicion: "Algodon Organico 100%", ancho: 165, peso: 240, tipo: "GOTS", tejedor: "BHASKAR", acabador: "BHASKAR", mundo: "—", mercado: "—", hombre: false, mujer: false, ambos: true, coleccion: "DENIM", stock: 0, stockAcabado: 0 },
  { id: 119, art: "13299", acabado: "FREE TWIN MED", color: "901", composicion: "EcoCell Lyocell 100%", ancho: 160, peso: 385, tipo: "EcoCell", tejedor: "BOSSA", acabador: "BOSSA", mundo: "—", mercado: "—", hombre: false, mujer: false, ambos: true, coleccion: "DENIM", stock: 0, stockAcabado: 0 },
  { id: 120, art: "13294", acabado: "FREE", color: "15", composicion: "Algodon Organico 50% Lenzing Modal 50%", ancho: 160, peso: 260, tipo: "Modal Mix", tejedor: "TS", acabador: "TS", mundo: "—", mercado: "—", hombre: false, mujer: false, ambos: true, coleccion: "DENIM", stock: 0, stockAcabado: 0 },
];

const ALL_PRODUCTS = [...MODA_DATA, ...DENIM_DATA];
const TIPOS = [...new Set(ALL_PRODUCTS.map(p => p.tipo))].sort();
const TEJEDORES = [...new Set(ALL_PRODUCTS.map(p => p.tejedor).filter(Boolean))].sort();
const MUNDO_COLORS = { "ARCADIA":"#7c3aed","LEGACY":"#0369a1","RETREAT":"#065f46","SARTORIAL":"#92400e","PULSE":"#be185d","MIDNIGHT":"#1e1b4b","—":"#6b7280" };

function getMundoColor(m) { for(const[k,v] of Object.entries(MUNDO_COLORS)) if(m&&m.includes(k)) return v; return "#6b7280"; }

function getAcabadoInfo(acabado) {
  if (!acabado) return null;
  const upper = acabado.toUpperCase();
  for (const [key, val] of Object.entries(ACABADOS_DB)) {
    if (upper.includes(key.toUpperCase())) return { key, ...val };
  }
  return null;
}

function similarityScore(a, b) {
  let s = 0;
  if (a.tipo === b.tipo) s += 30;
  if (a.coleccion === b.coleccion) s += 10;
  if (a.mundo && b.mundo && a.mundo.split(" ")[0] === b.mundo.split(" ")[0]) s += 20;
  const pd = Math.abs(a.peso - b.peso);
  s += pd < 30 ? 20 : pd < 80 ? 10 : pd < 150 ? 5 : 0;
  if (Math.abs(a.ancho - b.ancho) < 10) s += 10;
  ["lyocell","algodon","lana","lino","viscosa","poliamida","elastano","lycra","modal"].forEach(f => {
    if (a.composicion.toLowerCase().includes(f) && b.composicion.toLowerCase().includes(f)) s += 5;
  });
  return s;
}

function Badge({ label, color }) {
  return <span style={{ background: color, color:"#fff", borderRadius:6, padding:"2px 8px", fontSize:11, fontWeight:700, letterSpacing:0.5, whiteSpace:"nowrap" }}>{label}</span>;
}

// ── MUNDO DETAIL PANEL ──────────────────────────────────────
function MundoPanel({ mundo, onClose }) {
  const key = Object.keys(CAPSULAS).find(k => mundo && mundo.includes(k));
  if (!key) return null;
  const c = CAPSULAS[key];
  return (
    <div style={{ position:"fixed", inset:0, background:"#0009", zIndex:1200, display:"flex", alignItems:"center", justifyContent:"center", padding:16 }} onClick={onClose}>
      <div style={{ background:"#fff", borderRadius:20, maxWidth:560, width:"100%", overflow:"hidden", boxShadow:"0 20px 60px #0005" }} onClick={e=>e.stopPropagation()}>
        <div style={{ background:`linear-gradient(135deg,${c.color},${c.color}99)`, padding:"24px 28px", color:"#fff" }}>
          <div style={{ fontSize:28, fontWeight:900, letterSpacing:-1 }}>CÁPSULA {key}</div>
          <div style={{ display:"flex", gap:8, marginTop:10, flexWrap:"wrap" }}>
            {c.keywords.map(k => <span key={k} style={{ background:"#ffffff33", borderRadius:20, padding:"3px 12px", fontSize:12, fontWeight:700 }}>{k.toUpperCase()}</span>)}
          </div>
        </div>
        <div style={{ padding:"24px 28px" }}>
          <p style={{ fontSize:14, color:"#444", lineHeight:1.65, marginTop:0 }}>{c.descripcion}</p>
          {c.nuevosAcabados.length > 0 && (
            <>
              <div style={{ fontWeight:800, fontSize:13, color:"#111", marginTop:16, marginBottom:8, textTransform:"uppercase", letterSpacing:1 }}>Nuevos acabados</div>
              {c.nuevosAcabados.map((a,i) => <div key={i} style={{ background:"#f8f7ff", borderLeft:`3px solid ${c.color}`, borderRadius:"0 8px 8px 0", padding:"8px 12px", marginBottom:8, fontSize:13, color:"#333", lineHeight:1.5 }}>{a}</div>)}
            </>
          )}
          <div style={{ fontWeight:800, fontSize:13, color:"#111", marginTop:16, marginBottom:8, textTransform:"uppercase", letterSpacing:1 }}>Paleta cromática</div>
          <div style={{ display:"flex", gap:6 }}>
            {c.palette.map((col,i) => <div key={i} style={{ width:36, height:36, borderRadius:8, background:col, border:"2px solid #fff", boxShadow:"0 2px 6px #0002" }} />)}
          </div>
          <div style={{ fontWeight:800, fontSize:13, color:"#111", marginTop:16, marginBottom:6, textTransform:"uppercase", letterSpacing:1 }}>Inspiración</div>
          <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
            {c.inspiracion.map(i => <span key={i} style={{ background:"#f3f4f6", borderRadius:20, padding:"4px 12px", fontSize:12, color:"#555", fontWeight:600 }}>{i}</span>)}
          </div>
        </div>
        <div style={{ padding:"0 28px 24px" }}>
          <button onClick={onClose} style={{ width:"100%", background:`linear-gradient(135deg,${c.color},${c.color}99)`, color:"#fff", border:"none", borderRadius:10, padding:"11px 0", fontWeight:700, fontSize:14, cursor:"pointer" }}>Cerrar</button>
        </div>
      </div>
    </div>
  );
}

// ── ACABADOS GLOSSARY ───────────────────────────────────────
function GlosarioPanel({ onClose }) {
  const [search, setSearch] = useState("");
  const items = Object.entries(ACABADOS_DB).filter(([k]) => k.toLowerCase().includes(search.toLowerCase()));
  return (
    <div style={{ position:"fixed", inset:0, background:"#0009", zIndex:1200, display:"flex", alignItems:"center", justifyContent:"center", padding:16 }} onClick={onClose}>
      <div style={{ background:"#fff", borderRadius:20, maxWidth:640, width:"100%", maxHeight:"88vh", overflow:"hidden", display:"flex", flexDirection:"column", boxShadow:"0 20px 60px #0005" }} onClick={e=>e.stopPropagation()}>
        <div style={{ background:"linear-gradient(135deg,#0f0f1a,#1a1040)", padding:"20px 24px", color:"#fff" }}>
          <div style={{ fontWeight:900, fontSize:18 }}>📖 Glosario de Acabados</div>
          <div style={{ fontSize:12, opacity:0.7, marginTop:2 }}>{Object.keys(ACABADOS_DB).length} acabados documentados</div>
        </div>
        <div style={{ padding:"12px 20px", borderBottom:"1px solid #f0f0f0" }}>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Buscar acabado..." style={{ width:"100%", border:"1.5px solid #e5e7eb", borderRadius:10, padding:"9px 14px", fontSize:13, boxSizing:"border-box", outline:"none" }} />
        </div>
        <div style={{ overflowY:"auto", padding:"12px 20px", display:"flex", flexDirection:"column", gap:10 }}>
          {items.map(([key, val]) => (
            <div key={key} style={{ background:"#fafafa", borderRadius:12, padding:"12px 16px", borderLeft:`4px solid ${val.sostenible ? "#16a34a" : val.noLavar ? "#0369a1" : "#9ca3af"}` }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:6 }}>
                <div style={{ fontWeight:800, fontSize:14, color:"#111" }}>{key}</div>
                <div style={{ display:"flex", gap:5 }}>
                  {val.sostenible && <Badge label="ECO" color="#16a34a" />}
                  {val.noLavar && <Badge label="NO LAVAR" color="#0369a1" />}
                </div>
              </div>
              <div style={{ fontSize:13, color:"#555", lineHeight:1.55 }}>{val.descripcion}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── PRODUCT CARD ──────────────────────────────────────────────
function ProductCard({ product, onClick, onCompare, onSimilar, onMundo, compareList }) {
  const mc = getMundoColor(product.mundo);
  const inCompare = compareList.some(p => p.id === product.id);
  const acabadoInfo = getAcabadoInfo(product.acabado);
  const generos = [];
  if (product.hombre) generos.push("H");
  if (product.mujer) generos.push("M");
  if (!product.hombre && !product.mujer && product.ambos) generos.push("H/M");
  return (
    <div style={{ background:"#fff", border:`2px solid ${inCompare?mc:mc+"22"}`, borderRadius:14, padding:"16px", cursor:"pointer", transition:"all 0.18s", boxShadow:inCompare?`0 0 0 3px ${mc}44`:"0 2px 8px #0001", position:"relative", overflow:"hidden" }}
      onMouseEnter={e=>{ if(!inCompare){e.currentTarget.style.boxShadow=`0 6px 24px ${mc}44`;e.currentTarget.style.transform="translateY(-2px)";}}}
      onMouseLeave={e=>{ if(!inCompare){e.currentTarget.style.boxShadow="0 2px 8px #0001";e.currentTarget.style.transform="none";}}}
    >
      <div style={{ position:"absolute", top:0, left:0, right:0, height:4, background:mc, borderRadius:"14px 14px 0 0" }} />
      {inCompare && <div style={{ position:"absolute", top:8, right:8, background:mc, color:"#fff", borderRadius:"50%", width:20, height:20, display:"flex", alignItems:"center", justifyContent:"center", fontSize:12 }}>✓</div>}
      <div onClick={()=>onClick(product)} style={{ marginTop:4 }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
          <div>
            <div style={{ fontSize:17, fontWeight:800, color:"#111" }}>Art. {product.art}</div>
          </div>
          <div style={{ display:"flex", flexDirection:"column", gap:3, alignItems:"flex-end" }}>
            <Badge label={product.coleccion} color={product.coleccion==="MODA"?"#7c3aed":"#0369a1"} />
            {generos.length>0 && <Badge label={generos.join("/")} color={mc} />}
          </div>
        </div>
        <div style={{ marginTop:7, fontSize:12, fontWeight:700, color:mc }}>{product.tipo}</div>
        <div style={{ marginTop:3, fontSize:12, color:"#555", lineHeight:1.35 }}>{product.acabado}</div>
        {acabadoInfo && (
          <div style={{ marginTop:5, fontSize:11, color:"#777", background:`${acabadoInfo.sostenible?"#f0fdf4":"#eff6ff"}`, borderRadius:6, padding:"4px 8px", lineHeight:1.4, display:"flex", gap:6, alignItems:"flex-start" }}>
            <span>{acabadoInfo.sostenible?"🌱":acabadoInfo.noLavar?"💧":"✦"}</span>
            <span style={{ flex:1 }}>{acabadoInfo.descripcion.substring(0,80)}...</span>
          </div>
        )}
        <div style={{ marginTop:7, fontSize:11, color:"#888", lineHeight:1.45 }}>{product.composicion}</div>
        <div style={{ marginTop:8, display:"flex", gap:14, fontSize:12 }}>
          <span><b style={{ color:"#333" }}>Ancho:</b> {product.ancho} cm</span>
          <span><b style={{ color:"#333" }}>Peso:</b> {product.peso} g/m²</span>
        </div>
        {product.mundo !== "—" && (
          <div style={{ marginTop:8, display:"flex", gap:6, alignItems:"center" }}>
            <span onClick={e=>{ e.stopPropagation(); onMundo(product.mundo); }} style={{ cursor:"pointer" }}>
              <Badge label={product.mundo} color={mc} />
            </span>
            <span style={{ fontSize:10, color:"#aaa" }}>ⓘ</span>
          </div>
        )}
        {product.stockAcabado !== undefined && (
          <div style={{ marginTop:5, fontSize:11 }}>Stock: <b style={{ color:product.stockAcabado>0?"#16a34a":"#dc2626" }}>{product.stockAcabado} m</b></div>
        )}
      </div>
      <div style={{ marginTop:12, display:"flex", gap:6, borderTop:"1px solid #f3f4f6", paddingTop:10 }}>
        <button onClick={e=>{e.stopPropagation();onCompare(product);}} style={{ flex:1, background:inCompare?mc:"#f3f4f6", color:inCompare?"#fff":"#555", border:"none", borderRadius:8, padding:"6px 0", fontSize:11, fontWeight:700, cursor:"pointer" }}>
          {inCompare?"✓ Comparando":"⊕ Comparar"}
        </button>
        <button onClick={e=>{e.stopPropagation();onSimilar(product);}} style={{ flex:1, background:"#f3f4f6", color:"#555", border:"none", borderRadius:8, padding:"6px 0", fontSize:11, fontWeight:700, cursor:"pointer" }}>
          ~ Similares
        </button>
      </div>
    </div>
  );
}

// ── PRODUCT DETAIL MODAL ─────────────────────────────────────
function ProductModal({ product, onClose, onCompare, onSimilar, onMundo, compareList }) {
  if (!product) return null;
  const mc = getMundoColor(product.mundo);
  const inCompare = compareList.some(p=>p.id===product.id);
  const acabadoInfo = getAcabadoInfo(product.acabado);
  const capsulaKey = Object.keys(CAPSULAS).find(k => product.mundo && product.mundo.includes(k));
  const capsula = capsulaKey ? CAPSULAS[capsulaKey] : null;
  return (
    <div style={{ position:"fixed", inset:0, background:"#0008", zIndex:1000, display:"flex", alignItems:"center", justifyContent:"center", padding:16 }} onClick={onClose}>
      <div style={{ background:"#fff", borderRadius:20, padding:28, maxWidth:540, width:"100%", maxHeight:"88vh", overflowY:"auto", boxShadow:"0 20px 60px #0004" }} onClick={e=>e.stopPropagation()}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
          <div style={{ fontSize:24, fontWeight:900, color:"#111" }}>Art. {product.art}</div>
          <button onClick={onClose} style={{ background:"#f3f4f6", border:"none", borderRadius:8, padding:"6px 12px", cursor:"pointer", fontSize:16 }}>✕</button>
        </div>
        <div style={{ height:5, background:mc, borderRadius:4, marginBottom:18 }} />
        {[
          ["Colección",product.coleccion],["Tipo",product.tipo],["Acabado",product.acabado],
          ["Color Ref.",product.color],["Composición",product.composicion],
          ["Ancho",`${product.ancho} cm`],["Peso",`${product.peso} g/m²`],
          product.mundo!=="—"?["Mundo",product.mundo]:null,
          product.mercado!=="—"?["Mercado",product.mercado]:null,
          ["Tejedor",product.tejedor],["Acabador",product.acabador],

          product.stock!==undefined?["Stock crudo",`${product.stock} m`]:null,
          product.stockAcabado!==undefined?["Stock acabado",`${product.stockAcabado} m`]:null,
        ].filter(Boolean).map(([k,v])=>(
          <div key={k} style={{ display:"flex", justifyContent:"space-between", padding:"7px 0", borderBottom:"1px solid #f0f0f0", fontSize:13 }}>
            <span style={{ color:"#888", fontWeight:600 }}>{k}</span>
            <span style={{ color:"#111", textAlign:"right", maxWidth:"62%" }}>{v}</span>
          </div>
        ))}
        {acabadoInfo && (
          <div style={{ marginTop:16, background:`${acabadoInfo.sostenible?"#f0fdf4":"#eff6ff"}`, borderRadius:12, padding:"12px 16px" }}>
            <div style={{ fontWeight:800, fontSize:13, color:"#111", marginBottom:5, display:"flex", justifyContent:"space-between" }}>
              <span>Sobre el acabado: {acabadoInfo.key}</span>
              <div style={{ display:"flex", gap:4 }}>{acabadoInfo.sostenible&&<Badge label="ECO" color="#16a34a"/>}{acabadoInfo.noLavar&&<Badge label="NO LAVAR" color="#0369a1"/>}</div>
            </div>
            <p style={{ fontSize:13, color:"#555", margin:0, lineHeight:1.6 }}>{acabadoInfo.descripcion}</p>
          </div>
        )}
        {capsula && (
          <div style={{ marginTop:12, background:`${mc}11`, borderRadius:12, padding:"12px 16px", cursor:"pointer" }} onClick={()=>onMundo(product.mundo)}>
            <div style={{ fontWeight:800, fontSize:13, color:mc, marginBottom:4 }}>Cápsula {capsulaKey} →</div>
            <p style={{ fontSize:12, color:"#666", margin:0, lineHeight:1.5 }}>{capsula.descripcion.substring(0,120)}...</p>
          </div>
        )}
        <div style={{ marginTop:16, display:"flex", gap:10 }}>
          <button onClick={()=>{onCompare(product);onClose();}} style={{ flex:1, background:inCompare?mc:"#f3f4f6", color:inCompare?"#fff":"#555", border:"none", borderRadius:10, padding:"10px 0", fontWeight:700, fontSize:13, cursor:"pointer" }}>
            {inCompare?"✓ En comparador":"⊕ Añadir al comparador"}
          </button>
          <button onClick={()=>{onSimilar(product);onClose();}} style={{ flex:1, background:"#f3f4f6", color:"#555", border:"none", borderRadius:10, padding:"10px 0", fontWeight:700, fontSize:13, cursor:"pointer" }}>
            ~ Ver similares
          </button>
        </div>
      </div>
    </div>
  );
}

// ── COMPARATOR ───────────────────────────────────────────────
function ComparatorPanel({ products, onRemove, onClose }) {
  if (!products.length) return null;
  const fields = [
    ["Colección",p=>p.coleccion],["Tipo",p=>p.tipo],["Acabado",p=>p.acabado],
    ["Composición",p=>p.composicion],["Ancho",p=>`${p.ancho} cm`],["Peso",p=>`${p.peso} g/m²`],
    ["Mundo",p=>p.mundo],["Mercado",p=>p.mercado],["Tejedor",p=>p.tejedor],["Acabador",p=>p.acabador],
    ["Género",p=>[p.hombre&&"H",p.mujer&&"M",!p.hombre&&!p.mujer&&p.ambos&&"H/M"].filter(Boolean).join("/")||"—"],
  ];
  return (
    <div style={{ position:"fixed", inset:0, background:"#000a", zIndex:1100, display:"flex", alignItems:"flex-end", justifyContent:"center" }} onClick={onClose}>
      <div style={{ background:"#fff", borderRadius:"20px 20px 0 0", width:"100%", maxWidth:1100, maxHeight:"85vh", overflow:"auto", boxShadow:"0 -10px 60px #0004" }} onClick={e=>e.stopPropagation()}>
        <div style={{ position:"sticky", top:0, background:"linear-gradient(135deg,#0f0f1a,#1a1040)", color:"#fff", padding:"16px 24px", display:"flex", alignItems:"center", justifyContent:"space-between", zIndex:10 }}>
          <div style={{ fontWeight:800, fontSize:16 }}>⊞ Comparador — {products.length} artículo{products.length>1?"s":""}</div>
          <button onClick={onClose} style={{ background:"#ffffff22", border:"none", color:"#fff", borderRadius:8, padding:"6px 14px", cursor:"pointer", fontSize:14 }}>✕ Cerrar</button>
        </div>
        <div style={{ overflowX:"auto", padding:"0 0 24px" }}>
          <table style={{ width:"100%", borderCollapse:"collapse", minWidth:600 }}>
            <thead>
              <tr style={{ background:"#f8f9ff" }}>
                <th style={{ padding:"12px 16px", textAlign:"left", fontSize:12, color:"#888", fontWeight:700, width:130, borderBottom:"2px solid #e5e7eb" }}>Campo</th>
                {products.map(p=>{const mc=getMundoColor(p.mundo);return(
                  <th key={p.id} style={{ padding:"12px 16px", borderBottom:`3px solid ${mc}`, minWidth:180, textAlign:"center" }}>
                    <div style={{ fontWeight:800, fontSize:16, color:"#111" }}>Art. {p.art}</div>
                    <div style={{ fontSize:11, color:mc, fontWeight:700 }}>{p.tipo}</div>
                    <button onClick={()=>onRemove(p)} style={{ marginTop:6, background:"#fef2f2", color:"#dc2626", border:"none", borderRadius:6, padding:"3px 10px", fontSize:11, cursor:"pointer", fontWeight:600 }}>✕ Quitar</button>
                  </th>
                );})}
              </tr>
            </thead>
            <tbody>
              {fields.map(([label,fn],ri)=>{
                const vals=products.map(fn);
                const allSame=vals.every(v=>v===vals[0]);
                return(
                  <tr key={label} style={{ background:ri%2===0?"#fff":"#fafafa" }}>
                    <td style={{ padding:"10px 16px", fontSize:12, fontWeight:700, color:"#888", borderRight:"1px solid #f0f0f0" }}>{label}</td>
                    {vals.map((v,i)=>(
                      <td key={i} style={{ padding:"10px 16px", fontSize:12, color:allSame?"#555":"#111", fontWeight:allSame?400:700, textAlign:"center", background:!allSame&&i===0?"#fffbf0":undefined, borderRight:"1px solid #f0f0f0" }}>{v||"—"}</td>
                    ))}
                  </tr>
                );
              })}
              <tr style={{ background:"#f0f7ff" }}>
                <td style={{ padding:"10px 16px", fontSize:12, fontWeight:700, color:"#888", borderRight:"1px solid #f0f0f0" }}>Peso visual</td>
                {products.map(p=>{const max=Math.max(...products.map(x=>x.peso));const pct=(p.peso/max)*100;const mc=getMundoColor(p.mundo);return(
                  <td key={p.id} style={{ padding:"10px 16px", textAlign:"center", borderRight:"1px solid #f0f0f0" }}>
                    <div style={{ background:"#e5e7eb", borderRadius:4, height:10, overflow:"hidden", margin:"0 auto", maxWidth:120 }}>
                      <div style={{ width:`${pct}%`, height:"100%", background:mc, borderRadius:4 }} />
                    </div>
                    <div style={{ fontSize:11, color:"#555", marginTop:3, fontWeight:700 }}>{p.peso} g/m²</div>
                  </td>
                );})}
              </tr>
              <tr style={{ background:"#f9f9f9" }}>
                <td style={{ padding:"10px 16px", fontSize:12, fontWeight:700, color:"#888", borderRight:"1px solid #f0f0f0" }}>Info acabado</td>
                {products.map(p=>{const ai=getAcabadoInfo(p.acabado);return(
                  <td key={p.id} style={{ padding:"10px 16px", fontSize:11, color:"#555", textAlign:"center", borderRight:"1px solid #f0f0f0", lineHeight:1.4 }}>
                    {ai?<div style={{ background:ai.sostenible?"#f0fdf4":"#eff6ff", borderRadius:8, padding:"6px 8px" }}>{ai.descripcion.substring(0,80)}...</div>:"—"}
                  </td>
                );})}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ── SIMILAR MODAL ────────────────────────────────────────────
function SimilarModal({ product, allProducts, onClose, onCardClick, onCompare, onMundo, compareList }) {
  if (!product) return null;
  const similars = allProducts.filter(p=>p.id!==product.id).map(p=>({...p,score:similarityScore(product,p)})).sort((a,b)=>b.score-a.score).slice(0,6);
  const mc = getMundoColor(product.mundo);
  return (
    <div style={{ position:"fixed", inset:0, background:"#000a", zIndex:1050, display:"flex", alignItems:"center", justifyContent:"center", padding:16 }} onClick={onClose}>
      <div style={{ background:"#f8f9ff", borderRadius:20, width:"100%", maxWidth:900, maxHeight:"88vh", overflow:"auto", boxShadow:"0 20px 60px #0005" }} onClick={e=>e.stopPropagation()}>
        <div style={{ position:"sticky", top:0, background:`linear-gradient(135deg,${mc},${mc}cc)`, color:"#fff", padding:"18px 24px", display:"flex", alignItems:"center", justifyContent:"space-between", borderRadius:"20px 20px 0 0", zIndex:10 }}>
          <div>
            <div style={{ fontWeight:800, fontSize:16 }}>~ Similares a Art. {product.art}</div>
            <div style={{ fontSize:12, opacity:0.85 }}>{product.tipo} · {product.composicion.substring(0,50)}...</div>
          </div>
          <button onClick={onClose} style={{ background:"#ffffff33", border:"none", color:"#fff", borderRadius:8, padding:"6px 14px", cursor:"pointer" }}>✕</button>
        </div>
        <div style={{ padding:20 }}>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(250px,1fr))", gap:12 }}>
            {similars.map(p=>(
              <div key={p.id} style={{ position:"relative" }}>
                <div style={{ position:"absolute", top:10, right:10, zIndex:2, background:getMundoColor(p.mundo), color:"#fff", borderRadius:20, padding:"2px 8px", fontSize:10, fontWeight:800 }}>{p.score}% similar</div>
                <ProductCard product={p} onClick={onCardClick} onCompare={onCompare} onSimilar={()=>{}} onMundo={onMundo} compareList={compareList} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── BOT PANEL ────────────────────────────────────────────────
function BotPanel({ allProducts }) {
  const [messages, setMessages] = useState([
    { role:"assistant", text:"👋 ¡Hola! Soy tu asistente experto en la colección **RAW TENDERNESS O/I 27/28** de Textil Santanderina. Conozco todos los artículos, acabados y el espíritu de cada cápsula.\n\n¿Buscas un tejido para una cápsula concreta? ¿Un cliente con necesidades específicas? ¿Quieres que te explique un acabado? Cuéntame." }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);
  useEffect(()=>{ bottomRef.current?.scrollIntoView({behavior:"smooth"}); },[messages]);

  const send = async () => {
    if (!input.trim()||loading) return;
    const userMsg = input.trim();
    setInput("");
    setMessages(prev=>[...prev,{role:"user",text:userMsg}]);
    setLoading(true);

    const catalogStr = allProducts.map(p=>`Art:${p.art}|Tipo:${p.tipo}|Acabado:${p.acabado}|Composición:${p.composicion}|Ancho:${p.ancho}cm|Peso:${p.peso}g|Mundo:${p.mundo}|Mercado:${p.mercado}|Colección:${p.coleccion}|Tejedor:${p.tejedor}${p.stockAcabado!==undefined?"|Stock:"+p.stockAcabado+"m":""}`).join("\n");

    const capsulaStr = Object.entries(CAPSULAS).map(([k,c])=>`CÁPSULA ${k}: ${c.descripcion} Keywords: ${c.keywords.join(", ")}. Nuevos acabados: ${c.nuevosAcabados.join(" | ")}`).join("\n\n");

    const acabadosStr = Object.entries(ACABADOS_DB).map(([k,v])=>`${k}: ${v.descripcion}${v.sostenible?" [SOSTENIBLE]":""}${v.noLavar?" [NO REQUIERE LAVADO]":""}`).join("\n");

    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({
          model:"claude-sonnet-4-20250514", max_tokens:1000,
          system:`Eres el experto comercial de Textil Santanderina para la colección RAW TENDERNESS O/I 27/28. Tu misión es recomendar y asesorar con profundo conocimiento del producto.

COLECCIÓN: "RAW TENDERNESS — Return to Nature's Embrace". Inspirada en la naturaleza salvaje y protectora. 6 cápsulas.

CÁPSULAS Y SU ESPÍRITU:
${capsulaStr}

ACABADOS Y SU SIGNIFICADO TÉCNICO:
${acabadosStr}

CATÁLOGO COMPLETO:
${catalogStr}

INSTRUCCIONES:
- Responde siempre en español, de forma concisa y comercialmente efectiva
- Cuando recomiendas, menciona artículo, tipo, composición y POR QUÉ es adecuado, incluyendo el acabado si es relevante
- Si preguntan por una cápsula, explica su espíritu y recomienda artículos de ella
- Si preguntan por un acabado, explícalo con lenguaje de ventas
- Si preguntan por sostenibilidad, destaca los procesos Bio, GOTS y fibras recicladas
- Máximo 4 recomendaciones con información concisa y convincente`,
          messages:[{role:"user",content:userMsg}]
        })
      });
      const data = await res.json();
      const reply = data.content?.find(c=>c.type==="text")?.text||"No pude procesar la consulta.";
      setMessages(prev=>[...prev,{role:"assistant",text:reply}]);
    } catch {
      setMessages(prev=>[...prev,{role:"assistant",text:"Error de conexión. Inténtalo de nuevo."}]);
    }
    setLoading(false);
  };

  const quickQ = ["Explícame la cápsula ARCADIA","Tejidos sostenibles GOTS","¿Qué es el acabado BIODESK?","Sartorial ligero para Italia","No wash para Alemania","Diferencia BOLD vs BIODESK"];

  return (
    <div style={{ display:"flex", flexDirection:"column", height:"100%", background:"#f8f9ff", borderRadius:16, overflow:"hidden", border:"1px solid #e5e7eb" }}>
      <div style={{ background:"linear-gradient(135deg,#7c3aed,#be185d)", padding:"16px 20px", color:"#fff" }}>
        <div style={{ fontWeight:800, fontSize:16 }}>🤖 Asistente RAW TENDERNESS</div>
        <div style={{ fontSize:11, opacity:0.85, marginTop:2 }}>Colección · Acabados · Cápsulas · {allProducts.length} artículos</div>
      </div>
      <div style={{ flex:1, overflowY:"auto", padding:16, display:"flex", flexDirection:"column", gap:12 }}>
        {messages.map((m,i)=>(
          <div key={i} style={{ alignSelf:m.role==="user"?"flex-end":"flex-start", background:m.role==="user"?"linear-gradient(135deg,#7c3aed,#be185d)":"#fff", color:m.role==="user"?"#fff":"#111", borderRadius:m.role==="user"?"16px 16px 4px 16px":"16px 16px 16px 4px", padding:"10px 14px", maxWidth:"85%", fontSize:13, lineHeight:1.6, boxShadow:"0 2px 8px #0001", whiteSpace:"pre-wrap" }}>
            {m.text}
          </div>
        ))}
        {loading && <div style={{ alignSelf:"flex-start", background:"#fff", borderRadius:"16px 16px 16px 4px", padding:"10px 14px", fontSize:13, color:"#888", boxShadow:"0 2px 8px #0001" }}>✦ Consultando catálogo y acabados...</div>}
        <div ref={bottomRef} />
      </div>
      <div style={{ display:"flex", gap:8, padding:12, borderTop:"1px solid #e5e7eb", background:"#fff" }}>
        <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()} placeholder="Pregunta por producto, cápsula o acabado..." style={{ flex:1, border:"1.5px solid #e5e7eb", borderRadius:10, padding:"10px 14px", fontSize:13, outline:"none" }} />
        <button onClick={send} disabled={loading} style={{ background:"linear-gradient(135deg,#7c3aed,#be185d)", color:"#fff", border:"none", borderRadius:10, padding:"10px 18px", cursor:"pointer", fontWeight:700, fontSize:14 }}>↑</button>
      </div>
      <div style={{ padding:"8px 12px 12px", display:"flex", gap:6, flexWrap:"wrap", background:"#fff" }}>
        {quickQ.map(q=><button key={q} onClick={()=>setInput(q)} style={{ background:"#f3f0ff", color:"#7c3aed", border:"none", borderRadius:20, padding:"4px 10px", fontSize:11, cursor:"pointer", fontWeight:600 }}>{q}</button>)}
      </div>
    </div>
  );
}

// ── MAIN APP ─────────────────────────────────────────────────
export default function App() {
  const [tab, setTab] = useState("browse");
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({ coleccion:"",mundo:"",tipo:"",genero:"",tejedor:"",pesMin:"",pesMax:"",soloEco:false,soloNoLavar:false });
  const [selected, setSelected] = useState(null);
  const [similarOf, setSimilarOf] = useState(null);
  const [compareList, setCompareList] = useState([]);
  const [showComparator, setShowComparator] = useState(false);
  const [mundoDetail, setMundoDetail] = useState(null);
  const [showGlosario, setShowGlosario] = useState(false);
  const [view, setView] = useState("grid");

  const filtered = useMemo(()=>ALL_PRODUCTS.filter(p=>{
    if (search){const q=search.toLowerCase();if(![p.art,p.acabado,p.composicion,p.tipo,p.tejedor,p.mundo,p.mercado].some(f=>f&&f.toLowerCase().includes(q)))return false;}
    if (filters.coleccion&&p.coleccion!==filters.coleccion) return false;
    if (filters.mundo&&!p.mundo.includes(filters.mundo)) return false;
    if (filters.tipo&&p.tipo!==filters.tipo) return false;
    if (filters.tejedor&&p.tejedor!==filters.tejedor) return false;
    if (filters.genero==="H"&&!p.hombre) return false;
    if (filters.genero==="M"&&!p.mujer) return false;
    if (filters.pesMin&&p.peso<parseInt(filters.pesMin)) return false;
    if (filters.pesMax&&p.peso>parseInt(filters.pesMax)) return false;
    if (filters.soloEco){const ai=getAcabadoInfo(p.acabado);if(!ai||!ai.sostenible)return false;}
    if (filters.soloNoLavar){const ai=getAcabadoInfo(p.acabado);if(!ai||!ai.noLavar)return false;}
    return true;
  }),[search,filters]);

  const toggleCompare = (product) => {
    setCompareList(prev=>prev.some(p=>p.id===product.id)?prev.filter(p=>p.id!==product.id):prev.length>=4?[...prev.slice(1),product]:[...prev,product]);
  };
  const resetFilters = ()=>setFilters({coleccion:"",mundo:"",tipo:"",genero:"",tejedor:"",pesMin:"",pesMax:"",soloEco:false,soloNoLavar:false});
  const activeFilters = Object.values(filters).filter(v=>v===true||v!=="").length;

  const Sel = ({label,field,opts})=>(
    <select value={filters[field]} onChange={e=>setFilters(f=>({...f,[field]:e.target.value}))}
      style={{ border:`1.5px solid ${filters[field]?"#7c3aed":"#e5e7eb"}`, borderRadius:8, padding:"7px 10px", fontSize:12, background:"#fff", cursor:"pointer" }}>
      <option value="">{label}</option>
      {opts.map(o=><option key={o} value={o}>{o}</option>)}
    </select>
  );

  return (
    <div style={{ fontFamily:"'Inter', system-ui, sans-serif", minHeight:"100vh", background:"#f1f5f9" }}>
      <div style={{ background:"linear-gradient(135deg,#0f0f1a 0%,#1a1040 50%,#0f0f1a 100%)", color:"#fff", padding:"20px 24px 0" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:16, flexWrap:"wrap", gap:12 }}>
          <div>
            <div style={{ fontSize:20, fontWeight:900, letterSpacing:-0.5 }}>✦ FABRIC STUDIO</div>
            <div style={{ fontSize:10, opacity:0.5, letterSpacing:2, textTransform:"uppercase" }}>Textil Santanderina · RAW TENDERNESS O/I 27/28</div>
          </div>
          <div style={{ display:"flex", gap:10, alignItems:"center", flexWrap:"wrap" }}>
            <button onClick={()=>setShowGlosario(true)} style={{ background:"#ffffff15", color:"#ffffffcc", border:"1px solid #ffffff33", borderRadius:8, padding:"6px 14px", fontSize:12, cursor:"pointer", fontWeight:600 }}>
              📖 Acabados
            </button>
            {compareList.length>0 && (
              <button onClick={()=>setShowComparator(true)} style={{ background:"linear-gradient(135deg,#be185d,#7c3aed)", color:"#fff", border:"none", borderRadius:10, padding:"8px 16px", cursor:"pointer", fontWeight:700, fontSize:13 }}>
                ⊞ Comparar ({compareList.length})
              </button>
            )}
            <div style={{ textAlign:"right", fontSize:12, opacity:0.7 }}>
              <div style={{ fontWeight:700, fontSize:20, color:"#a78bfa" }}>{ALL_PRODUCTS.length}</div>
              <div>artículos</div>
            </div>
          </div>
        </div>
        <div style={{ display:"flex", gap:0 }}>
          {[["browse","🗂 Catálogo"],["capsulas","💫 Cápsulas"],["bot","🤖 Asistente"]].map(([t,l])=>(
            <button key={t} onClick={()=>setTab(t)} style={{ background:tab===t?"#fff":"transparent", color:tab===t?"#111":"#ffffffaa", border:"none", padding:"10px 20px", fontWeight:tab===t?700:500, fontSize:13, cursor:"pointer", borderRadius:"10px 10px 0 0", transition:"all 0.15s" }}>{l}</button>
          ))}
        </div>
      </div>

      <div style={{ padding:"20px 24px", maxWidth:1400, margin:"0 auto" }}>
        {tab==="bot" ? (
          <div style={{ height:"calc(100vh - 200px)" }}>
            <BotPanel allProducts={ALL_PRODUCTS} />
          </div>
        ) : tab==="capsulas" ? (
          <div>
            <div style={{ marginBottom:20, fontSize:14, color:"#555" }}>
              La colección <b>RAW TENDERNESS</b> se articula en 6 cápsulas. Haz clic para explorar cada una.
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))", gap:16 }}>
              {Object.entries(CAPSULAS).map(([key,c])=>{
                const count = ALL_PRODUCTS.filter(p=>p.mundo.includes(key)).length;
                return (
                  <div key={key} onClick={()=>setMundoDetail(key)} style={{ background:"#fff", borderRadius:16, overflow:"hidden", cursor:"pointer", boxShadow:"0 2px 12px #0001", transition:"all 0.2s" }}
                    onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-4px)";e.currentTarget.style.boxShadow=`0 12px 30px ${c.color}33`;}}
                    onMouseLeave={e=>{e.currentTarget.style.transform="none";e.currentTarget.style.boxShadow="0 2px 12px #0001";}}>
                    <div style={{ background:`linear-gradient(135deg,${c.color},${c.color}99)`, padding:"24px 20px", color:"#fff" }}>
                      <div style={{ fontSize:26, fontWeight:900, letterSpacing:-1 }}>{key}</div>
                      <div style={{ display:"flex", gap:6, marginTop:8, flexWrap:"wrap" }}>
                        {c.keywords.map(k=><span key={k} style={{ background:"#ffffff33", borderRadius:20, padding:"2px 10px", fontSize:11, fontWeight:700 }}>{k}</span>)}
                      </div>
                    </div>
                    <div style={{ padding:"16px 20px" }}>
                      <p style={{ fontSize:13, color:"#555", lineHeight:1.55, margin:"0 0 12px" }}>{c.descripcion.substring(0,140)}...</p>
                      <div style={{ display:"flex", gap:5, marginBottom:12 }}>
                        {c.palette.map((col,i)=><div key={i} style={{ width:28,height:28,borderRadius:6,background:col,border:"2px solid #fff",boxShadow:"0 1px 4px #0002" }} />)}
                      </div>
                      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                        <span style={{ fontSize:12, color:"#888" }}>{count} artículos en catálogo</span>
                        <span style={{ fontSize:12, color:c.color, fontWeight:700 }}>Ver cápsula →</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <>
            {compareList.length>0 && (
              <div style={{ background:"linear-gradient(135deg,#1a1040,#2d1060)", borderRadius:12, padding:"12px 16px", marginBottom:16, display:"flex", alignItems:"center", gap:12, flexWrap:"wrap" }}>
                <span style={{ color:"#a78bfa", fontWeight:700, fontSize:13 }}>⊞ Comparando:</span>
                {compareList.map(p=>{const mc=getMundoColor(p.mundo);return(
                  <span key={p.id} style={{ background:`${mc}33`, border:`1px solid ${mc}`, color:"#fff", borderRadius:20, padding:"4px 12px", fontSize:12, fontWeight:700, display:"flex", alignItems:"center", gap:6 }}>
                    Art. {p.art}
                    <button onClick={()=>toggleCompare(p)} style={{ background:"none", border:"none", color:"#fff9", cursor:"pointer", fontSize:12, padding:0, lineHeight:1 }}>✕</button>
                  </span>
                );})}
                <button onClick={()=>setShowComparator(true)} style={{ marginLeft:"auto", background:"linear-gradient(135deg,#be185d,#7c3aed)", color:"#fff", border:"none", borderRadius:8, padding:"7px 16px", fontWeight:700, fontSize:13, cursor:"pointer" }}>Ver comparativa →</button>
                <button onClick={()=>setCompareList([])} style={{ background:"#ffffff11", color:"#aaa", border:"none", borderRadius:8, padding:"7px 12px", fontSize:12, cursor:"pointer" }}>Limpiar</button>
              </div>
            )}

            <div style={{ background:"#fff", borderRadius:14, padding:16, marginBottom:14, boxShadow:"0 2px 8px #0001", display:"flex", gap:10, flexWrap:"wrap", alignItems:"center" }}>
              <div style={{ flex:1, minWidth:200, position:"relative" }}>
                <span style={{ position:"absolute", left:12, top:"50%", transform:"translateY(-50%)", fontSize:16, color:"#888" }}>🔍</span>
                <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Buscar artículo, tipo, composición, tejedor..." style={{ width:"100%", border:"1.5px solid #e5e7eb", borderRadius:10, padding:"10px 14px 10px 38px", fontSize:13, boxSizing:"border-box", outline:"none" }} />
              </div>
              <Sel label="Colección" field="coleccion" opts={["MODA","DENIM"]} />
              <Sel label="Mundo" field="mundo" opts={["ARCADIA","LEGACY","RETREAT","SARTORIAL","PULSE","MIDNIGHT"]} />
              <Sel label="Tipo" field="tipo" opts={TIPOS} />
              <Sel label="Género" field="genero" opts={["H","M"]} />
              <Sel label="Tejedor" field="tejedor" opts={TEJEDORES} />
              <div style={{ display:"flex", gap:6, alignItems:"center" }}>
                <input value={filters.pesMin} onChange={e=>setFilters(f=>({...f,pesMin:e.target.value}))} placeholder="Peso min" style={{ width:72, border:"1.5px solid #e5e7eb", borderRadius:8, padding:"7px 8px", fontSize:12 }} />
                <span style={{ color:"#aaa" }}>–</span>
                <input value={filters.pesMax} onChange={e=>setFilters(f=>({...f,pesMax:e.target.value}))} placeholder="Peso max" style={{ width:72, border:"1.5px solid #e5e7eb", borderRadius:8, padding:"7px 8px", fontSize:12 }} />
              </div>
              <label style={{ display:"flex", alignItems:"center", gap:5, fontSize:12, cursor:"pointer", fontWeight:600, color: filters.soloEco?"#16a34a":"#666" }}>
                <input type="checkbox" checked={filters.soloEco} onChange={e=>setFilters(f=>({...f,soloEco:e.target.checked}))} />🌱 Eco
              </label>
              <label style={{ display:"flex", alignItems:"center", gap:5, fontSize:12, cursor:"pointer", fontWeight:600, color: filters.soloNoLavar?"#0369a1":"#666" }}>
                <input type="checkbox" checked={filters.soloNoLavar} onChange={e=>setFilters(f=>({...f,soloNoLavar:e.target.checked}))} />💧 No lavar
              </label>
              {activeFilters>0 && <button onClick={resetFilters} style={{ background:"#fef2f2", color:"#dc2626", border:"none", borderRadius:8, padding:"7px 14px", fontSize:12, cursor:"pointer", fontWeight:600 }}>✕ Limpiar</button>}
              <div style={{ display:"flex", gap:4 }}>
                {["grid","list"].map(v=>(
                  <button key={v} onClick={()=>setView(v)} style={{ background:view===v?"#7c3aed":"#f3f4f6", color:view===v?"#fff":"#666", border:"none", borderRadius:8, padding:"7px 12px", cursor:"pointer", fontSize:14 }}>{v==="grid"?"⊞":"☰"}</button>
                ))}
              </div>
            </div>

            <div style={{ display:"flex", gap:8, marginBottom:14, flexWrap:"wrap" }}>
              {Object.entries(MUNDO_COLORS).filter(([k])=>k!=="—").map(([mundo,color])=>{
                const count=ALL_PRODUCTS.filter(p=>p.mundo.includes(mundo)).length;
                const active=filters.mundo===mundo;
                return(
                  <button key={mundo} onClick={()=>setFilters(f=>({...f,mundo:active?"":mundo}))}
                    style={{ background:active?color:`${color}18`, color:active?"#fff":color, border:`2px solid ${color}`, borderRadius:20, padding:"5px 14px", fontSize:12, fontWeight:700, cursor:"pointer", transition:"all 0.15s" }}>
                    {mundo} <span style={{ opacity:0.8 }}>({count})</span>
                  </button>
                );
              })}
            </div>

            <div style={{ marginBottom:12, fontSize:13, color:"#666" }}>
              <b style={{ color:"#111" }}>{filtered.length}</b> artículos
              {(search||activeFilters>0) && <span style={{ color:"#7c3aed", marginLeft:8 }}>· filtros activos</span>}
              {compareList.length>0 && <span style={{ color:"#be185d", marginLeft:8 }}>· {compareList.length} en comparador</span>}
            </div>

            {filtered.length===0 ? (
              <div style={{ textAlign:"center", padding:60, color:"#888" }}>
                <div style={{ fontSize:48 }}>🔍</div>
                <div style={{ fontSize:18, fontWeight:600, marginTop:12 }}>Sin resultados</div>
              </div>
            ) : view==="grid" ? (
              <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))", gap:14 }}>
                {filtered.map(p=><ProductCard key={p.id} product={p} onClick={setSelected} onCompare={toggleCompare} onSimilar={setSimilarOf} onMundo={setMundoDetail} compareList={compareList} />)}
              </div>
            ) : (
              <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                {filtered.map(p=>{
                  const mc=getMundoColor(p.mundo);
                  const ai=getAcabadoInfo(p.acabado);
                  const inC=compareList.some(c=>c.id===p.id);
                  return(
                    <div key={p.id} style={{ background:"#fff", borderRadius:10, padding:"12px 16px", display:"flex", gap:12, alignItems:"center", boxShadow:"0 1px 4px #0001", borderLeft:`4px solid ${mc}`, cursor:"pointer" }}
                      onMouseEnter={e=>e.currentTarget.style.background="#f8f7ff"}
                      onMouseLeave={e=>e.currentTarget.style.background="#fff"}
                    >
                      <div onClick={()=>setSelected(p)} style={{ display:"flex", gap:12, flex:1, alignItems:"center" }}>
                        <div style={{ minWidth:80, fontWeight:800, fontSize:14, color:"#111" }}>Art. {p.art}</div>
                        <div style={{ flex:1, fontSize:12 }}><span style={{ fontWeight:600, color:mc }}>{p.tipo}</span> <span style={{ color:"#888" }}>{p.acabado.substring(0,30)}...</span></div>
                        <div style={{ fontSize:11, color:"#888", minWidth:80 }}>{p.ancho}cm / {p.peso}g</div>
                        {ai&&<span style={{ fontSize:10, background:ai.sostenible?"#dcfce7":"#dbeafe", color:ai.sostenible?"#16a34a":"#0369a1", borderRadius:6, padding:"2px 6px", fontWeight:700, whiteSpace:"nowrap" }}>{ai.sostenible?"🌱 ECO":ai.noLavar?"💧 NO LAVAR":""}</span>}
                        <Badge label={p.coleccion} color={p.coleccion==="MODA"?"#7c3aed":"#0369a1"} />
                        {p.mundo!=="—" && <Badge label={p.mundo.split(" ")[0]} color={mc} />}
                      </div>
                      <div style={{ display:"flex", gap:6 }}>
                        <button onClick={()=>toggleCompare(p)} style={{ background:inC?mc:"#f3f4f6", color:inC?"#fff":"#555", border:"none", borderRadius:6, padding:"5px 10px", fontSize:11, fontWeight:700, cursor:"pointer" }}>{inC?"✓":"⊕"}</button>
                        <button onClick={()=>setSimilarOf(p)} style={{ background:"#f3f4f6", color:"#555", border:"none", borderRadius:6, padding:"5px 10px", fontSize:11, fontWeight:700, cursor:"pointer" }}>~</button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>

      <ProductModal product={selected} onClose={()=>setSelected(null)} onCompare={toggleCompare} onSimilar={setSimilarOf} onMundo={setMundoDetail} compareList={compareList} />
      <SimilarModal product={similarOf} allProducts={ALL_PRODUCTS} onClose={()=>setSimilarOf(null)} onCardClick={setSelected} onCompare={toggleCompare} onMundo={setMundoDetail} compareList={compareList} />
      {showComparator && <ComparatorPanel products={compareList} onRemove={toggleCompare} onClose={()=>setShowComparator(false)} />}
      {mundoDetail && <MundoPanel mundo={mundoDetail} onClose={()=>setMundoDetail(null)} />}
      {showGlosario && <GlosarioPanel onClose={()=>setShowGlosario(false)} />}
    </div>
  );
}
