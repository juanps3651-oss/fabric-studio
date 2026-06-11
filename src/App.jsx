import { useState, useMemo, useRef, useEffect } from "react";

const CAPSULAS = {
  SARTORIAL: { color:"#92400e", keywords:["hecho a mano","minimalista","atemporal","puro"], descripcion:"Precisa, depurada y lujosa. Mezclas de lana y nuevos tejidos Winter Crepure. Paleta cromática fría, suave y terrosa con grises, azules oscuros y violetas.", nuevosAcabados:["WINTER CREPURE — siluetas chic y estructuradas, peso cálido y envolvente para invierno","TAILORED — mezclas de hilaturas mélange con acabado Milwash, listas para confección directa"], inspiracion:["Armani FW26","Dolce&Gabbana FW26","Louis Vuitton FW26"], palette:["#6b7280","#374151","#4c1d95","#78716c","#e7e5e4"] },
  PULSE: { color:"#be185d", keywords:["versátil","activo","dinámico","cotidiano"], descripcion:"Tejidos prácticos y de fácil mantenimiento con estética sofisticada. Mezclas exclusivas de Algodón y Tencel con Lycra. Paleta urbana, limpia y contemporánea.", nuevosAcabados:["PREMIUM RICH — mezclas exclusivas de fibras con equilibrio perfecto entre algodón y Tencel, tacto de alta calidad"], inspiracion:["Michael Kors FW26","Soshi Otsuki FW26","Tibi FW26"], palette:["#1d4ed8","#60a5fa","#92400e","#374151","#9ca3af"] },
  LEGACY: { color:"#0369a1", keywords:["herencia","tradición","elegancia","prestigio"], descripcion:"Materiales nobles, paleta oscura, elegancia atemporal. Siluetas estructuradas que combinan lo contemporáneo con lo artesanal. Grises, berenjenas y marrones.", nuevosAcabados:["DOUBLE WEAVE FABRICS — doble tela en algodones orgánicos, combina firmeza y suavidad","WOOL DENIM — aspecto bull denim con lana, alta calidad y estética casual"], inspiracion:["Gucci FW26","Brioni FW26","Phillip Lim FW26"], palette:["#1e3a5f","#7c3aed","#5b21b6","#78350f","#6b7280"] },
  ARCADIA: { color:"#7c3aed", keywords:["espiritual","poética","natural","evocadora"], descripcion:"Inspirada en el realismo mágico y la mitología. El bosque como refugio. Colores naturales: madera, plantas, flores, tierra, verdes, rojos e intensos púrpuras.", nuevosAcabados:["CORDUROY — nuevas series de corduroy ampliando la gama","MILANO — tacto cálido invernal, superficie suave con volumen para algodón de alto gramaje"], inspiracion:["Ulla Johnson FW26","Advisry FW26","Calvin Klein FW26"], palette:["#7c2d12","#b91c1c","#166534","#78350f","#14532d"] },
  RETREAT: { color:"#065f46", keywords:["rústica","suave","reconfortante","acogedora"], descripcion:"Enraizada en el bienestar y la conciencia plena. Reinterpreta lo rústico con tonos tostados, nude y beige. Algodón en texturas artesanales, suaves y envolventes.", nuevosAcabados:["SOFT BULL DENIM — sargas marcadas en telares de nueva generación, carácter pesado y rústico","FLANNEL — tejidos con aspecto franela por proceso innovador, superficie suave y uniforme"], inspiracion:["Moschino FW26","Eckhaus Latta FW26","Emporio Armani FW26"], palette:["#d97706","#92400e","#a16207","#78350f","#d6d3d1"] },
  MIDNIGHT: { color:"#1e1b4b", keywords:["sofisticada","compleja","refinada","seductora"], descripcion:"Tonos profundos bajo influencia art déco. Contraste brillo pulido vs mate extremo. Tencel Luxe, Naia, Glissen Luxe y Ecodesk Luxe: materiales ligeros y fluidos similares a la seda.", nuevosAcabados:["GLISSEN — ampliación de gama Tencel Luxe y sus mezclas, acabado no-wash tipo Millwash"], inspiracion:["The Attico SS25","AWGE FW26","Miu Miu FW26"], palette:["#1e1b4b","#312e81","#78350f","#1f2937","#d6d3d1"] },
};

const ACABADOS_DB = {
  "BIODESK":{ descripcion:"Pretratamiento biológico que optimiza la fibra de algodón: menos productos químicos, menos agua, mejor calidad. Reduce el pilling y mejora la durabilidad.", sostenible:true, noLavar:false },
  "BETTER PLUS":{ descripcion:"Acabado limpio con tacto sutil y refinado. Tejido voluminoso con aspecto sofisticado. No requiere lavado posterior.", sostenible:true, noLavar:true },
  "BETTERPLUS":{ descripcion:"Acabado limpio con tacto sutil y refinado. Tejido voluminoso con aspecto sofisticado. No requiere lavado posterior.", sostenible:true, noLavar:true },
  "BOLD":{ descripcion:"Reactivo realizado en TS. Color intenso y brillante, aspecto elegante y limpio más duradero.", sostenible:false, noLavar:false },
  "BIODC":{ descripcion:"Proceso Bio con caustificado. Mejor limpieza del tejido sin mano tan dura como en el mercerizado.", sostenible:true, noLavar:false },
  "BIODM":{ descripcion:"Proceso Bio más mercerizado para mejorar aspecto y brillo.", sostenible:true, noLavar:false },
  "BLOOM":{ descripcion:"Reactivo realizado en ABSA. Puede incluir toque de pelo y elasticidad según variante.", sostenible:false, noLavar:false },
  "CREPURE":{ descripcion:"Hilos con sobretorsión especial para tacto seco y sobrio. Evoca el mundo de la lana clásica.", sostenible:false, noLavar:false },
  "BIODESK PAPER VELVET TOUCH":{ descripcion:"Biodesk + toque característico de pelo con cepillos. Superficie aterciopelada.", sostenible:true, noLavar:false },
  "BIODESK MICRO":{ descripcion:"Biodesk + toque de pelo característico de la lija de diamante.", sostenible:true, noLavar:false },
  "BIODESK TOP":{ descripcion:"Biodesk + paso por tumbler para relajación y mejora de estabilidad dimensional.", sostenible:true, noLavar:false },
  "BIODM NEW PELL":{ descripcion:"BioDM + toque de pelo característico de la lija a pelo y contrapelo.", sostenible:true, noLavar:false },
  "ECODESK":{ descripcion:"Optimización del proceso de preparación. Base del proceso Bio de Biodesk.", sostenible:true, noLavar:false },
  "FANCY":{ descripcion:"Tejidos con hilos tintados. Puede estar sobretiñido si tiene código de color.", sostenible:false, noLavar:false },
  "FLANNEL":{ descripcion:"Nueva generación de Tencel con aspecto de franela. Proceso mecánico, 100% Tencel.", sostenible:true, noLavar:false },
  "GLISSEN":{ descripcion:"Acabado no-wash tipo Millwash. Notable suavidad al tacto y caída fluida.", sostenible:false, noLavar:true },
  "MILANO":{ descripcion:"Tintura reactiva. Tacto cálido e invernal. Superficie suave y con volumen.", sostenible:false, noLavar:false },
  "MATTE":{ descripcion:"Tacto seco y elegante acabado mate con efecto bicolor y doble textura. Sostenible.", sostenible:true, noLavar:false },
  "ONLYDYE":{ descripcion:"Una fibra se deja sin tintar. Efecto Mélange.", sostenible:false, noLavar:false },
  "PALEO":{ descripcion:"Rasqueta: resinas poliuretano para efecto crackeado, pieles desgastadas y usadas.", sostenible:false, noLavar:false },
  "PREMIUM RICH":{ descripcion:"Tejidos acogedores, tacto extrasuave. Ligeros y transpirables. Mezclas exclusivas algodón y Tencel.", sostenible:true, noLavar:false },
  "RAWCEL":{ descripcion:"Tencel Lyocell HV100 de Lenzing. Fibras de distinta longitud para tactos similares al algodón.", sostenible:true, noLavar:false },
  "TAILORED":{ descripcion:"Tejidos mélange con acabado Milwash. Listos para confección directa. Elegante y versátil.", sostenible:false, noLavar:true },
  "THOFF":{ descripcion:"Aspecto limpio. Alta fijación del color. Acabado de silicona por ambas caras. No requiere lavado.", sostenible:false, noLavar:true },
  "WASHFREE":{ descripcion:"Acabado Millwash. Tactos estructurados, apariencia más limpia y colores más profundos.", sostenible:false, noLavar:true },
  "WOOL DENIM":{ descripcion:"Denim con mezcla de algodón y lana. Tacto más acogedor, espíritu denim para invierno.", sostenible:false, noLavar:false },
  "MELANGE SPONGE":{ descripcion:"Aspecto mélange que evoca la lana. Apariencia suave y mullida, tacto muy delicado.", sostenible:false, noLavar:false },
};

const MODA_DATA = [
  { id:1, art:"4243", acabado:"ECODESK SLIMFLEX", color:"0", composicion:"Algodon 98% Lycra 2%", ancho:150, peso:285, tipo:"Pana", mundo:"ARCADIA (M)", mercado:"ALEMANIA", hombre:false, mujer:true, ambos:false, coleccion:"MODA" },
  { id:2, art:"5253", acabado:"ET.WOOL DENIM BIODESK NAT WOOL DENIM", color:"0", composicion:"Algodon Organico 62% Algodon 30% Lana 8%", ancho:160, peso:320, tipo:"Denim", mundo:"LEGACY (H-M)", mercado:"INDITEX+CELIA+VARIOS", hombre:true, mujer:true, ambos:true, coleccion:"MODA" },
  { id:3, art:"5255", acabado:"AEROSOFT FANCY WOOL DENIM", color:"701046", composicion:"Algodon Organico 82% Lana 18%", ancho:160, peso:310, tipo:"Denim", mundo:"LEGACY (H-M)", mercado:"INDITEX+CELIA+VARIOS", hombre:true, mujer:true, ambos:true, coleccion:"MODA" },
  { id:4, art:"5258", acabado:"ET.WOOTEN ONLYDYE WOOLTEN REGULAR SLIM", color:"10743", composicion:"Lenzing Lyocell 62% Lana 25% Poliamida 10% Lycra 3%", ancho:150, peso:260, tipo:"Sartorial", mundo:"SARTORIAL (H)", mercado:"INDITEX+CELIA+VARIOS", hombre:true, mujer:false, ambos:false, coleccion:"MODA" },
  { id:5, art:"5261", acabado:"ET.DUODYET WOOLTEN REGULAR SLIM", color:"400253", composicion:"Lenzing Lyocell 45% Poliamida 35% Lana 17% Elastano 3%", ancho:145, peso:220, tipo:"Sartorial", mundo:"SARTORIAL (H)", mercado:"ALEMANIA+ITALIA", hombre:true, mujer:false, ambos:false, coleccion:"MODA" },
  { id:6, art:"5268", acabado:"BIODESK COTTLAM", color:"0", composicion:"Algodon Organico 70% Algodon Reciclado POST 10% Algodon Reciclado PRE 10% Lana 10%", ancho:155, peso:305, tipo:"Basic", mundo:"ARCADIA (H-M)", mercado:"INDITEX+CELIA+VARIOS", hombre:true, mujer:true, ambos:true, coleccion:"MODA" },
  { id:7, art:"5269", acabado:"BIODESK NAT FANCY WOOL DENIM", color:"967", composicion:"Algodon Organico 62% Algodon 30% Lana 8%", ancho:150, peso:280, tipo:"Denim", mundo:"SARTORIAL (H)", mercado:"INDITEX+CELIA+VARIOS", hombre:true, mujer:false, ambos:false, coleccion:"MODA" },
  { id:8, art:"5270", acabado:"BLOOM WOOLTEN AEROSOFT", color:"701515", composicion:"Lenzing Lyocell 65% Lana 25% Poliamida 10%", ancho:145, peso:180, tipo:"Sartorial", mundo:"SARTORIAL (H)", mercado:"INDITEX+CELIA+VARIOS", hombre:true, mujer:false, ambos:false, coleccion:"MODA" },
  { id:9, art:"5271", acabado:"ONLYDYE WOOLTEN AEROSOFT", color:"90644", composicion:"Poliamida 45% Lenzing Lyocell 40% Lana 15%", ancho:145, peso:180, tipo:"Sartorial", mundo:"SARTORIAL (H)", mercado:"INDITEX+CELIA+VARIOS", hombre:true, mujer:false, ambos:false, coleccion:"MODA" },
  { id:10, art:"5272", acabado:"BLOOM WOOLTEN AEROSOFT", color:"701515", composicion:"Lenzing Lyocell 64% Lana 24% Poliamida 10% Lycra 2%", ancho:145, peso:125, tipo:"Sartorial", mundo:"SARTORIAL (H)", mercado:"ALEMANIA+ITALIA", hombre:true, mujer:false, ambos:false, coleccion:"MODA" },
  { id:11, art:"6536", acabado:"ET.SPONGE SPONGE GOTS", color:"0", composicion:"Algodon Organico 100%", ancho:160, peso:350, tipo:"GOTS", mundo:"ARCADIA (H)", mercado:"INDITEX+CELIA+TURQUÍA", hombre:true, mujer:false, ambos:false, coleccion:"MODA" },
  { id:12, art:"6550", acabado:"BOLD WASHFREE", color:"701476", composicion:"Algodon Organico 100%", ancho:145, peso:265, tipo:"Basic", mundo:"LEGACY (H)", mercado:"INDITEX+CELIA+TURQUÍA", hombre:true, mujer:false, ambos:false, coleccion:"MODA" },
  { id:13, art:"6572", acabado:"BIODESK MILANO GOTS", color:"0", composicion:"Algodon Organico 100%", ancho:165, peso:345, tipo:"GOTS", mundo:"RETREAT (H-M)", mercado:"INDITEX+TURQUÍA", hombre:true, mujer:true, ambos:true, coleccion:"MODA" },
  { id:14, art:"6579", acabado:"EST.MATTE ACABADO", color:"90610", composicion:"Algodon Organico 100%", ancho:160, peso:410, tipo:"Fantasia", mundo:"RETREAT (H-M)", mercado:"ITALIA", hombre:true, mujer:true, ambos:true, coleccion:"MODA" },
  { id:15, art:"6667", acabado:"BOLD WASHFREE", color:"701476", composicion:"Algodon Organico 70% Algodon Reciclado PRE 30%", ancho:160, peso:265, tipo:"Basic", mundo:"LEGACY (H-M)", mercado:"INDITEX+CELIA", hombre:true, mujer:true, ambos:true, coleccion:"MODA" },
  { id:16, art:"6668", acabado:"ET.WASHFREE BOLD WASHFREE", color:"701476", composicion:"Algodon Organico 100%", ancho:145, peso:215, tipo:"Basic", mundo:"LEGACY (H-M)", mercado:"INDITEX+TURQUÍA", hombre:true, mujer:true, ambos:true, coleccion:"MODA" },
  { id:17, art:"6669", acabado:"ET.PALEO PALEO", color:"701294", composicion:"Algodon Organico 100%", ancho:150, peso:130, tipo:"Basic", mundo:"RETREAT (H-M)", mercado:"INDITEX+CELIA", hombre:true, mujer:true, ambos:true, coleccion:"MODA" },
  { id:18, art:"6676a", acabado:"ET.FLOW FLOW", color:"400103", composicion:"Algodon 50% Algodon Organico 50%", ancho:150, peso:340, tipo:"Basic", mundo:"LEGACY (H)", mercado:"INDITEX+CELIA", hombre:true, mujer:false, ambos:false, coleccion:"MODA" },
  { id:19, art:"6676b", acabado:"BOLD MILANO AIRTEC", color:"66939", composicion:"Algodon 50% Algodon Organico 50%", ancho:145, peso:340, tipo:"Milano", mundo:"ARCADIA (H)", mercado:"INDITEX+CELIA", hombre:true, mujer:false, ambos:false, coleccion:"MODA" },
  { id:20, art:"6682", acabado:"BIODESK ECODESK", color:"0", composicion:"Algodon Organico 60% Algodon 40%", ancho:155, peso:275, tipo:"Pana", mundo:"RETREAT (H-M)", mercado:"INDITEX+CELIA", hombre:true, mujer:true, ambos:true, coleccion:"MODA" },
  { id:21, art:"6699", acabado:"BIODESK PAPER VELVET TOUCH", color:"0", composicion:"Algodon 80% Algodon Organico 20%", ancho:160, peso:275, tipo:"Velvet", mundo:"ARCADIA (H-M)", mercado:"INDITEX+CELIA", hombre:true, mujer:true, ambos:true, coleccion:"MODA" },
  { id:22, art:"6707", acabado:"BIODM NEW PELL", color:"0", composicion:"Algodon 55% Algodon Organico 45%", ancho:160, peso:295, tipo:"Basic", mundo:"RETREAT (H-M)", mercado:"INDITEX+CELIA+ITALIA", hombre:true, mujer:true, ambos:true, coleccion:"MODA" },
  { id:23, art:"6776", acabado:"ET.CREPURE BIODM CREPURE", color:"0", composicion:"Algodon Organico 100%", ancho:145, peso:250, tipo:"Crepure", mundo:"SARTORIAL (H-M)", mercado:"ALEMANIA+INDITEX+CELIA+ITALIA", hombre:true, mujer:true, ambos:true, coleccion:"MODA" },
  { id:24, art:"6826", acabado:"ET.BIODESK BIODESK", color:"0", composicion:"Algodon Organico 100%", ancho:155, peso:345, tipo:"Basic", mundo:"RETREAT (H-M)", mercado:"INDITEX+CELIA+TURQUÍA", hombre:true, mujer:true, ambos:true, coleccion:"MODA" },
  { id:25, art:"6827", acabado:"pana ECODESK", color:"0", composicion:"Algodon 100%", ancho:150, peso:125, tipo:"Pana", mundo:"ARCADIA (H-M)", mercado:"TODOS", hombre:true, mujer:true, ambos:true, coleccion:"MODA" },
  { id:26, art:"7028", acabado:"BIODESK AIRMIST", color:"0", composicion:"Lenzing Lyocell 100%", ancho:150, peso:300, tipo:"Lyocell", mundo:"ARCADIA (M)", mercado:"TODOS", hombre:false, mujer:true, ambos:false, coleccion:"MODA" },
  { id:27, art:"18291", acabado:"BIODESK TOP FANCY REGULAR SLIM", color:"0", composicion:"Lenzing Lyocell 58% Elastomultiester T-400 27% Algodon 15%", ancho:140, peso:340, tipo:"Fancy", mundo:"PULSE (H-M)", mercado:"TURQUIA+ALEMANIA+ITALIA", hombre:true, mujer:true, ambos:true, coleccion:"MODA" },
  { id:28, art:"40464", acabado:"MILANO", color:"90256", composicion:"Algodon PIMA 97% Lycra 3%", ancho:155, peso:250, tipo:"Milano", mundo:"ARCADIA (H)", mercado:"ALEMANIA+ITALIA", hombre:true, mujer:false, ambos:false, coleccion:"MODA" },
  { id:29, art:"40714", acabado:"BIODESK PAPER VELVET TOUCH TOP REGULAR SLIM", color:"0", composicion:"Algodon Organico 99% Lycra Ecomade 1%", ancho:150, peso:250, tipo:"Felpa", mundo:"LEGACY (H)", mercado:"ALEMANIA+INDITEX+ITALIA+P.NORDICOS", hombre:true, mujer:false, ambos:false, coleccion:"MODA" },
  { id:30, art:"70097", acabado:"pana BOLD SLIMFLEX", color:"9949", composicion:"Algodon 55% Viscosa 43% Elastano 2%", ancho:140, peso:280, tipo:"Pana", mundo:"ARCADIA (M)", mercado:"TODOS", hombre:false, mujer:true, ambos:false, coleccion:"MODA" },
  { id:31, art:"70142", acabado:"ET.FANCY DENIM FANCY DENIM", color:"4658", composicion:"Lenzing Lyocell 100%", ancho:160, peso:405, tipo:"Denim Fancy", mundo:"RETREAT (M)", mercado:"CELIA", hombre:false, mujer:true, ambos:false, coleccion:"MODA" },
  { id:32, art:"70203", acabado:"ET.PREMIUMBOLD FLOW PREMIUM RICH", color:"90403", composicion:"Algodon Organico 70% Lenzing Lyocell 30%", ancho:150, peso:215, tipo:"Premium", mundo:"PULSE (H)", mercado:"TODOS", hombre:true, mujer:false, ambos:false, coleccion:"MODA" },
  { id:33, art:"70245", acabado:"BIODESK MILANO", color:"0", composicion:"Lenzing Lyocell 74% Algodon Organico 24% Lycra 2%", ancho:155, peso:395, tipo:"Milano", mundo:"PULSE (H)", mercado:"TURQUÍA", hombre:true, mujer:false, ambos:false, coleccion:"MODA" },
  { id:34, art:"70323", acabado:"ET.BETTER PLUS BETTERPLUS", color:"400187", composicion:"Lenzing Lyocell 55% Algodon 34% Elastomultiester T-400 9% Lycra 2%", ancho:130, peso:260, tipo:"Premium", mundo:"PULSE (M)", mercado:"ALEMANIA", hombre:false, mujer:true, ambos:false, coleccion:"MODA" },
  { id:35, art:"70419", acabado:"BIODESK FLUID FANCY REG.SLIM", color:"8240", composicion:"Algodon Organico 50% Lenzing Lyocell 23% Lenzing Viscose EV 15% Poliamida 10%", ancho:145, peso:300, tipo:"Sartorial Fluid", mundo:"SARTORIAL (H)", mercado:"ALEMANIA", hombre:true, mujer:false, ambos:false, coleccion:"MODA" },
  { id:36, art:"70421", acabado:"TAILORED ACABADO 6043", color:"992", composicion:"Lenzing Viscose EV 100%", ancho:145, peso:315, tipo:"Tailored", mundo:"SARTORIAL (M)", mercado:"ALEMANIA", hombre:false, mujer:true, ambos:false, coleccion:"MODA" },
];

const DENIM_DATA = [
  { id:101, art:"12463", acabado:"FREE", color:"15", composicion:"Lenzing Lyocell 100%", ancho:160, peso:290, tipo:"Lyocell", mundo:"—", mercado:"—", hombre:false, mujer:false, ambos:true, coleccion:"DENIM", stock:3700, stockAcabado:11000 },
  { id:102, art:"12547", acabado:"FREE", color:"256", composicion:"Lenzing Lyocell 77% Algodon 23%", ancho:165, peso:415, tipo:"Lyocell Mix", mundo:"—", mercado:"—", hombre:false, mujer:false, ambos:true, coleccion:"DENIM", stock:6300, stockAcabado:400 },
  { id:103, art:"12547b", acabado:"BLACK-BLACK", color:"901", composicion:"Lenzing Lyocell 77% Algodon 23%", ancho:165, peso:405, tipo:"Lyocell Mix", mundo:"—", mercado:"—", hombre:false, mujer:false, ambos:true, coleccion:"DENIM", stock:380, stockAcabado:81 },
  { id:104, art:"12834", acabado:"FREE", color:"256", composicion:"Lenzing Lyocell 100%", ancho:160, peso:400, tipo:"Lyocell", mundo:"—", mercado:"—", hombre:false, mujer:false, ambos:true, coleccion:"DENIM", stock:6700, stockAcabado:2800 },
  { id:105, art:"12834b", acabado:"DENIM SPONGE", color:"256", composicion:"Lenzing Lyocell 100%", ancho:160, peso:395, tipo:"Sponge", mundo:"—", mercado:"—", hombre:false, mujer:false, ambos:true, coleccion:"DENIM", stock:6700, stockAcabado:140 },
  { id:106, art:"13047", acabado:"FREE", color:"256", composicion:"Algodon Organico 100%", ancho:150, peso:510, tipo:"Algodon Organico", mundo:"—", mercado:"—", hombre:false, mujer:false, ambos:true, coleccion:"DENIM", stock:2200, stockAcabado:685 },
  { id:107, art:"13049", acabado:"FREE", color:"256", composicion:"Algodon Organico 100%", ancho:140, peso:500, tipo:"Algodon Organico", mundo:"—", mercado:"—", hombre:false, mujer:false, ambos:true, coleccion:"DENIM", stock:1200, stockAcabado:1850 },
  { id:108, art:"13058", acabado:"FREE", color:"15", composicion:"Algodon Organico 100%", ancho:160, peso:400, tipo:"Algodon Organico", mundo:"—", mercado:"—", hombre:false, mujer:false, ambos:true, coleccion:"DENIM", stock:1300, stockAcabado:2700 },
  { id:109, art:"13129", acabado:"FREE", color:"256", composicion:"Lenzing Lyocell 100%", ancho:155, peso:345, tipo:"Lyocell", mundo:"—", mercado:"—", hombre:false, mujer:false, ambos:true, coleccion:"DENIM", stock:0, stockAcabado:3190 },
  { id:110, art:"13181", acabado:"BLACK-BLACK TWIN MED", color:"901", composicion:"Algodon Organico 75% Algodon Reciclado PRE 25%", ancho:170, peso:390, tipo:"Reciclado", mundo:"—", mercado:"—", hombre:false, mujer:false, ambos:true, coleccion:"DENIM", stock:0, stockAcabado:38 },
  { id:111, art:"13215", acabado:"FREE PURE TWIN MED", color:"205", composicion:"Algodon 100%", ancho:165, peso:355, tipo:"Algodon", mundo:"—", mercado:"—", hombre:false, mujer:false, ambos:true, coleccion:"DENIM", stock:0, stockAcabado:240 },
  { id:112, art:"13221", acabado:"FREE GOTS TWIN RAY", color:"84", composicion:"Algodon Organico 100%", ancho:165, peso:295, tipo:"GOTS", mundo:"—", mercado:"—", hombre:false, mujer:false, ambos:true, coleccion:"DENIM", stock:0, stockAcabado:34900 },
  { id:113, art:"13233", acabado:"FREE", color:"15", composicion:"Algodon Organico 55% Lino 35% Poliamida 10%", ancho:135, peso:230, tipo:"Lino Mix", mundo:"—", mercado:"—", hombre:false, mujer:false, ambos:true, coleccion:"DENIM", stock:50, stockAcabado:0 },
  { id:114, art:"13263", acabado:"FREE", color:"256", composicion:"Lenzing Lyocell 65% Algodon Organico 35%", ancho:150, peso:350, tipo:"Lyocell Mix", mundo:"—", mercado:"—", hombre:false, mujer:false, ambos:true, coleccion:"DENIM", stock:0, stockAcabado:140 },
  { id:115, art:"13265", acabado:"FREE", color:"256", composicion:"Lenzing Lyocell 100%", ancho:150, peso:340, tipo:"Lyocell", mundo:"—", mercado:"—", hombre:false, mujer:false, ambos:true, coleccion:"DENIM", stock:0, stockAcabado:194 },
  { id:116, art:"13275", acabado:"FREE TWIN MED", color:"234", composicion:"EcoCell Lyocell 100%", ancho:165, peso:360, tipo:"EcoCell", mundo:"—", mercado:"—", hombre:false, mujer:false, ambos:true, coleccion:"DENIM", stock:0, stockAcabado:3000 },
  { id:117, art:"13292", acabado:"FREE TWIN RAY", color:"84", composicion:"Algodon 75% Lenzing Lyocell 25%", ancho:160, peso:205, tipo:"Mix Lyocell", mundo:"—", mercado:"—", hombre:false, mujer:false, ambos:true, coleccion:"DENIM", stock:0, stockAcabado:0 },
  { id:118, art:"13293", acabado:"FREE GOTS TWIN RAY", color:"84", composicion:"Algodon Organico 100%", ancho:165, peso:240, tipo:"GOTS", mundo:"—", mercado:"—", hombre:false, mujer:false, ambos:true, coleccion:"DENIM", stock:0, stockAcabado:0 },
  { id:119, art:"13299", acabado:"FREE TWIN MED", color:"901", composicion:"EcoCell Lyocell 100%", ancho:160, peso:385, tipo:"EcoCell", mundo:"—", mercado:"—", hombre:false, mujer:false, ambos:true, coleccion:"DENIM", stock:0, stockAcabado:0 },
  { id:120, art:"13294", acabado:"FREE", color:"15", composicion:"Algodon Organico 50% Lenzing Modal 50%", ancho:160, peso:260, tipo:"Modal Mix", mundo:"—", mercado:"—", hombre:false, mujer:false, ambos:true, coleccion:"DENIM", stock:0, stockAcabado:0 },
];

const ALL_PRODUCTS = [...MODA_DATA, ...DENIM_DATA];
const TIPOS = [...new Set(ALL_PRODUCTS.map(p=>p.tipo))].sort();
const MC = { "ARCADIA":"#7c3aed","LEGACY":"#0369a1","RETREAT":"#065f46","SARTORIAL":"#92400e","PULSE":"#be185d","MIDNIGHT":"#1e1b4b","—":"#6b7280" };

const gc = m => { for(const[k,v] of Object.entries(MC)) if(m&&m.includes(k)) return v; return "#6b7280"; };
const getAI = a => { if(!a) return null; const u=a.toUpperCase(); for(const[k,v] of Object.entries(ACABADOS_DB)) if(u.includes(k.toUpperCase())) return{key:k,...v}; return null; };
const simScore = (a,b) => { let s=0; if(a.tipo===b.tipo)s+=30; if(a.coleccion===b.coleccion)s+=10; if(a.mundo&&b.mundo&&a.mundo.split(" ")[0]===b.mundo.split(" ")[0])s+=20; const pd=Math.abs(a.peso-b.peso); s+=pd<30?20:pd<80?10:pd<150?5:0; if(Math.abs(a.ancho-b.ancho)<10)s+=10; ["lyocell","algodon","lana","lino","viscosa","poliamida","elastano","lycra","modal"].forEach(f=>{if(a.composicion.toLowerCase().includes(f)&&b.composicion.toLowerCase().includes(f))s+=5;}); return s; };

// ── BOTTOM SHEET ─────────────────────────────────────────────
function Sheet({ open, onClose, title, children, tall }) {
  if (!open) return null;
  return (
    <div style={{ position:"fixed", inset:0, zIndex:900, display:"flex", flexDirection:"column", justifyContent:"flex-end" }} onClick={onClose}>
      <div style={{ background:"#0006", position:"absolute", inset:0 }} />
      <div style={{ background:"#fff", borderRadius:"20px 20px 0 0", maxHeight: tall ? "92vh" : "80vh", overflow:"hidden", display:"flex", flexDirection:"column", position:"relative", zIndex:1 }} onClick={e=>e.stopPropagation()}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"16px 20px 12px", borderBottom:"1px solid #f0f0f0", flexShrink:0 }}>
          <div style={{ fontWeight:800, fontSize:16, color:"#111" }}>{title}</div>
          <button onClick={onClose} style={{ background:"#f3f4f6", border:"none", borderRadius:"50%", width:32, height:32, cursor:"pointer", fontSize:16, display:"flex", alignItems:"center", justifyContent:"center" }}>✕</button>
        </div>
        <div style={{ overflowY:"auto", flex:1 }}>{children}</div>
      </div>
    </div>
  );
}

// ── PRODUCT DETAIL SHEET ─────────────────────────────────────
function ProductSheet({ product, onClose, onCompare, onSimilar, onMundo, compareList }) {
  if (!product) return null;
  const mc = gc(product.mundo);
  const inC = compareList.some(p=>p.id===product.id);
  const ai = getAI(product.acabado);
  const ck = Object.keys(CAPSULAS).find(k=>product.mundo&&product.mundo.includes(k));
  const cap = ck ? CAPSULAS[ck] : null;
  const gs = [];
  if(product.hombre)gs.push("Hombre");
  if(product.mujer)gs.push("Mujer");
  if(!product.hombre&&!product.mujer&&product.ambos)gs.push("H/M");

  return (
    <Sheet open={!!product} onClose={onClose} title={`Art. ${product.art}`} tall>
      <div style={{ height:4, background:mc, margin:"0 0 0" }} />
      <div style={{ padding:"16px 20px" }}>
        {/* Header chips */}
        <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginBottom:16 }}>
          <span style={{ background:product.coleccion==="MODA"?"#7c3aed":"#0369a1", color:"#fff", borderRadius:20, padding:"4px 12px", fontSize:12, fontWeight:700 }}>{product.coleccion}</span>
          <span style={{ background:mc, color:"#fff", borderRadius:20, padding:"4px 12px", fontSize:12, fontWeight:700 }}>{product.tipo}</span>
          {gs.map(g=><span key={g} style={{ background:"#f3f4f6", color:"#555", borderRadius:20, padding:"4px 12px", fontSize:12, fontWeight:600 }}>{g}</span>)}
        </div>

        {/* Acabado */}
        <div style={{ background:"#f8f9ff", borderRadius:12, padding:"12px 14px", marginBottom:12 }}>
          <div style={{ fontSize:11, color:"#888", fontWeight:700, textTransform:"uppercase", letterSpacing:1, marginBottom:4 }}>Acabado</div>
          <div style={{ fontSize:14, color:"#111", fontWeight:600 }}>{product.acabado}</div>
        </div>

        {/* Composición */}
        <div style={{ background:"#f8f9ff", borderRadius:12, padding:"12px 14px", marginBottom:12 }}>
          <div style={{ fontSize:11, color:"#888", fontWeight:700, textTransform:"uppercase", letterSpacing:1, marginBottom:4 }}>Composición</div>
          <div style={{ fontSize:14, color:"#111" }}>{product.composicion}</div>
        </div>

        {/* Stats */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:12 }}>
          {[["Ancho",`${product.ancho} cm`],["Peso",`${product.peso} g/m²`],product.mundo!=="—"?["Mundo",product.mundo]:null,product.mercado!=="—"?["Mercado",product.mercado]:null].filter(Boolean).map(([k,v])=>(
            <div key={k} style={{ background:"#f8f9ff", borderRadius:12, padding:"10px 14px" }}>
              <div style={{ fontSize:11, color:"#888", fontWeight:700, textTransform:"uppercase", letterSpacing:1, marginBottom:2 }}>{k}</div>
              <div style={{ fontSize:14, color:"#111", fontWeight:600 }}>{v}</div>
            </div>
          ))}
          {product.stockAcabado!==undefined && (
            <div style={{ background:product.stockAcabado>0?"#f0fdf4":"#fef2f2", borderRadius:12, padding:"10px 14px" }}>
              <div style={{ fontSize:11, color:"#888", fontWeight:700, textTransform:"uppercase", letterSpacing:1, marginBottom:2 }}>Stock acabado</div>
              <div style={{ fontSize:14, fontWeight:700, color:product.stockAcabado>0?"#16a34a":"#dc2626" }}>{product.stockAcabado} m</div>
            </div>
          )}
        </div>

        {/* Acabado info */}
        {ai && (
          <div style={{ background:ai.sostenible?"#f0fdf4":"#eff6ff", borderRadius:12, padding:"12px 14px", marginBottom:12 }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:6 }}>
              <div style={{ fontSize:12, fontWeight:800, color:"#111" }}>Sobre {ai.key}</div>
              <div style={{ display:"flex", gap:5 }}>
                {ai.sostenible&&<span style={{ background:"#16a34a", color:"#fff", borderRadius:20, padding:"2px 8px", fontSize:10, fontWeight:700 }}>🌱 ECO</span>}
                {ai.noLavar&&<span style={{ background:"#0369a1", color:"#fff", borderRadius:20, padding:"2px 8px", fontSize:10, fontWeight:700 }}>💧 NO LAVAR</span>}
              </div>
            </div>
            <div style={{ fontSize:13, color:"#555", lineHeight:1.6 }}>{ai.descripcion}</div>
          </div>
        )}

        {/* Cápsula */}
        {cap && (
          <div style={{ background:`${mc}12`, borderRadius:12, padding:"12px 14px", marginBottom:20, cursor:"pointer", border:`1px solid ${mc}33` }} onClick={()=>{onMundo(product.mundo);onClose();}}>
            <div style={{ fontSize:12, fontWeight:800, color:mc, marginBottom:3 }}>Cápsula {ck} →</div>
            <div style={{ fontSize:12, color:"#666", lineHeight:1.5 }}>{cap.descripcion.substring(0,100)}...</div>
          </div>
        )}

        {/* Actions */}
        <div style={{ display:"flex", gap:10, paddingBottom:8 }}>
          <button onClick={()=>{onCompare(product);onClose();}} style={{ flex:1, background:inC?mc:"#111", color:"#fff", border:"none", borderRadius:14, padding:"14px 0", fontWeight:700, fontSize:14, cursor:"pointer" }}>
            {inC?"✓ En comparador":"⊕ Comparar"}
          </button>
          <button onClick={()=>{onSimilar(product);onClose();}} style={{ flex:1, background:"#f3f4f6", color:"#333", border:"none", borderRadius:14, padding:"14px 0", fontWeight:700, fontSize:14, cursor:"pointer" }}>
            ~ Similares
          </button>
        </div>
      </div>
    </Sheet>
  );
}

// ── PRODUCT CARD ─────────────────────────────────────────────
function Card({ p, onClick, onCompare, compareList }) {
  const mc = gc(p.mundo);
  const inC = compareList.some(x=>x.id===p.id);
  const ai = getAI(p.acabado);
  const gs = [p.hombre&&"H",p.mujer&&"M",!p.hombre&&!p.mujer&&p.ambos&&"H/M"].filter(Boolean).join("/");

  return (
    <div onClick={()=>onClick(p)} style={{ background:"#fff", borderRadius:16, overflow:"hidden", boxShadow:"0 2px 12px #0001", border:`2px solid ${inC?mc:"transparent"}`, position:"relative", cursor:"pointer", transition:"all 0.15s", WebkitTapHighlightColor:"transparent" }}>
      <div style={{ height:4, background:mc }} />
      <div style={{ padding:"14px 14px 10px" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:8 }}>
          <div>
            <div style={{ fontSize:18, fontWeight:900, color:"#111", letterSpacing:-0.5 }}>Art. {p.art}</div>
            <div style={{ fontSize:12, fontWeight:700, color:mc, marginTop:1 }}>{p.tipo}</div>
          </div>
          <div style={{ display:"flex", flexDirection:"column", gap:3, alignItems:"flex-end" }}>
            <span style={{ background:p.coleccion==="MODA"?"#7c3aed":"#0369a1", color:"#fff", borderRadius:6, padding:"2px 8px", fontSize:10, fontWeight:700 }}>{p.coleccion}</span>
            {gs && <span style={{ background:`${mc}22`, color:mc, borderRadius:6, padding:"2px 8px", fontSize:10, fontWeight:700 }}>{gs}</span>}
          </div>
        </div>
        <div style={{ fontSize:12, color:"#666", lineHeight:1.4, marginBottom:8 }}>{p.composicion}</div>
        <div style={{ display:"flex", gap:8, marginBottom:10 }}>
          <span style={{ background:"#f3f4f6", borderRadius:8, padding:"4px 10px", fontSize:11, fontWeight:600, color:"#555" }}>↔ {p.ancho} cm</span>
          <span style={{ background:"#f3f4f6", borderRadius:8, padding:"4px 10px", fontSize:11, fontWeight:600, color:"#555" }}>⚖ {p.peso} g/m²</span>
          {ai?.sostenible && <span style={{ background:"#f0fdf4", borderRadius:8, padding:"4px 10px", fontSize:11, fontWeight:700, color:"#16a34a" }}>🌱</span>}
          {ai?.noLavar && <span style={{ background:"#eff6ff", borderRadius:8, padding:"4px 10px", fontSize:11, fontWeight:700, color:"#0369a1" }}>💧</span>}
        </div>
        {p.mundo!=="—" && <span style={{ background:mc, color:"#fff", borderRadius:8, padding:"3px 10px", fontSize:11, fontWeight:700 }}>{p.mundo}</span>}
        {p.stockAcabado!==undefined && <div style={{ marginTop:8, fontSize:11, color:p.stockAcabado>0?"#16a34a":"#dc2626", fontWeight:700 }}>Stock: {p.stockAcabado} m</div>}
      </div>
      <div style={{ borderTop:"1px solid #f3f4f6", padding:"8px 14px", display:"flex", justifyContent:"space-between", alignItems:"center", background:"#fafafa" }}>
        <span style={{ fontSize:12, color:"#888" }}>Toca para ver detalle</span>
        <button onClick={e=>{e.stopPropagation();onCompare(p);}} style={{ background:inC?mc:"#111", color:"#fff", border:"none", borderRadius:8, padding:"6px 14px", fontSize:11, fontWeight:700, cursor:"pointer" }}>
          {inC?"✓":"⊕ Comparar"}
        </button>
      </div>
    </div>
  );
}

// ── FILTERS SHEET ─────────────────────────────────────────────
function FiltersSheet({ open, onClose, filters, setFilters }) {
  const Btn = ({label,field,val})=>(
    <button onClick={()=>setFilters(f=>({...f,[field]:f[field]===val?"":val}))}
      style={{ background:filters[field]===val?"#111":"#f3f4f6", color:filters[field]===val?"#fff":"#555", border:"none", borderRadius:10, padding:"8px 14px", fontSize:13, fontWeight:600, cursor:"pointer", whiteSpace:"nowrap" }}>
      {label}
    </button>
  );
  const reset = ()=>setFilters({coleccion:"",mundo:"",tipo:"",genero:"",pesMin:"",pesMax:"",soloEco:false,soloNoLavar:false});

  return (
    <Sheet open={open} onClose={onClose} title="Filtros" tall>
      <div style={{ padding:"16px 20px", display:"flex", flexDirection:"column", gap:20 }}>
        <div>
          <div style={{ fontSize:12, fontWeight:800, color:"#888", textTransform:"uppercase", letterSpacing:1, marginBottom:10 }}>Colección</div>
          <div style={{ display:"flex", gap:8 }}><Btn label="MODA" field="coleccion" val="MODA"/><Btn label="DENIM" field="coleccion" val="DENIM"/></div>
        </div>
        <div>
          <div style={{ fontSize:12, fontWeight:800, color:"#888", textTransform:"uppercase", letterSpacing:1, marginBottom:10 }}>Mundo / Cápsula</div>
          <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
            {Object.entries(MC).filter(([k])=>k!=="—").map(([k,c])=>(
              <button key={k} onClick={()=>setFilters(f=>({...f,mundo:f.mundo===k?"":k}))}
                style={{ background:filters.mundo===k?c:`${c}15`, color:filters.mundo===k?"#fff":c, border:`1.5px solid ${c}`, borderRadius:10, padding:"8px 14px", fontSize:12, fontWeight:700, cursor:"pointer" }}>{k}</button>
            ))}
          </div>
        </div>
        <div>
          <div style={{ fontSize:12, fontWeight:800, color:"#888", textTransform:"uppercase", letterSpacing:1, marginBottom:10 }}>Género</div>
          <div style={{ display:"flex", gap:8 }}><Btn label="Hombre" field="genero" val="H"/><Btn label="Mujer" field="genero" val="M"/></div>
        </div>
        <div>
          <div style={{ fontSize:12, fontWeight:800, color:"#888", textTransform:"uppercase", letterSpacing:1, marginBottom:10 }}>Sostenibilidad</div>
          <div style={{ display:"flex", gap:8 }}>
            <button onClick={()=>setFilters(f=>({...f,soloEco:!f.soloEco}))} style={{ background:filters.soloEco?"#16a34a":"#f0fdf4", color:filters.soloEco?"#fff":"#16a34a", border:"1.5px solid #16a34a", borderRadius:10, padding:"8px 14px", fontSize:12, fontWeight:700, cursor:"pointer" }}>🌱 Solo Eco</button>
            <button onClick={()=>setFilters(f=>({...f,soloNoLavar:!f.soloNoLavar}))} style={{ background:filters.soloNoLavar?"#0369a1":"#eff6ff", color:filters.soloNoLavar?"#fff":"#0369a1", border:"1.5px solid #0369a1", borderRadius:10, padding:"8px 14px", fontSize:12, fontWeight:700, cursor:"pointer" }}>💧 No lavar</button>
          </div>
        </div>
        <div>
          <div style={{ fontSize:12, fontWeight:800, color:"#888", textTransform:"uppercase", letterSpacing:1, marginBottom:10 }}>Peso (g/m²)</div>
          <div style={{ display:"flex", gap:10, alignItems:"center" }}>
            <input value={filters.pesMin} onChange={e=>setFilters(f=>({...f,pesMin:e.target.value}))} placeholder="Mín" style={{ flex:1, border:"1.5px solid #e5e7eb", borderRadius:10, padding:"10px 14px", fontSize:14, outline:"none" }} />
            <span style={{ color:"#aaa", fontWeight:700 }}>—</span>
            <input value={filters.pesMax} onChange={e=>setFilters(f=>({...f,pesMax:e.target.value}))} placeholder="Máx" style={{ flex:1, border:"1.5px solid #e5e7eb", borderRadius:10, padding:"10px 14px", fontSize:14, outline:"none" }} />
          </div>
        </div>
        <button onClick={()=>{reset();onClose();}} style={{ background:"#fef2f2", color:"#dc2626", border:"none", borderRadius:12, padding:"14px 0", fontSize:14, fontWeight:700, cursor:"pointer" }}>Limpiar todos los filtros</button>
        <button onClick={onClose} style={{ background:"#111", color:"#fff", border:"none", borderRadius:12, padding:"14px 0", fontSize:14, fontWeight:700, cursor:"pointer" }}>Ver resultados ({ALL_PRODUCTS.filter(p=>{
          if(filters.coleccion&&p.coleccion!==filters.coleccion)return false;
          if(filters.mundo&&!p.mundo.includes(filters.mundo))return false;
          if(filters.genero==="H"&&!p.hombre)return false;
          if(filters.genero==="M"&&!p.mujer)return false;
          if(filters.soloEco){const ai=getAI(p.acabado);if(!ai||!ai.sostenible)return false;}
          if(filters.soloNoLavar){const ai=getAI(p.acabado);if(!ai||!ai.noLavar)return false;}
          return true;
        }).length})</button>
      </div>
    </Sheet>
  );
}

// ── COMPARATOR SHEET ─────────────────────────────────────────
function ComparatorSheet({ open, products, onRemove, onClose }) {
  if (!products.length) return null;
  const fields = [["Tipo",p=>p.tipo],["Acabado",p=>p.acabado],["Composición",p=>p.composicion],["Ancho",p=>`${p.ancho} cm`],["Peso",p=>`${p.peso} g/m²`],["Mundo",p=>p.mundo],["Mercado",p=>p.mercado]];
  return (
    <Sheet open={open} onClose={onClose} title={`Comparando ${products.length} artículos`} tall>
      <div style={{ padding:"0 0 24px" }}>
        {/* Headers */}
        <div style={{ display:"flex", gap:0, borderBottom:"2px solid #f0f0f0", overflowX:"auto" }}>
          <div style={{ minWidth:90, padding:"12px 14px", fontSize:12, fontWeight:700, color:"#888", flexShrink:0 }}></div>
          {products.map(p=>{const mc=gc(p.mundo);return(
            <div key={p.id} style={{ flex:1, minWidth:140, padding:"12px 10px", borderLeft:"1px solid #f0f0f0", textAlign:"center", borderTop:`3px solid ${mc}` }}>
              <div style={{ fontWeight:900, fontSize:16, color:"#111" }}>Art. {p.art}</div>
              <div style={{ fontSize:11, color:mc, fontWeight:700, marginBottom:6 }}>{p.tipo}</div>
              <button onClick={()=>onRemove(p)} style={{ background:"#fef2f2", color:"#dc2626", border:"none", borderRadius:6, padding:"3px 10px", fontSize:11, cursor:"pointer", fontWeight:600 }}>✕</button>
            </div>
          );})}
        </div>
        {/* Rows */}
        {fields.map(([label,fn],ri)=>{
          const vals=products.map(fn);
          const allSame=vals.every(v=>v===vals[0]);
          return(
            <div key={label} style={{ display:"flex", gap:0, borderBottom:"1px solid #f5f5f5", background:ri%2===0?"#fff":"#fafafa", overflowX:"auto" }}>
              <div style={{ minWidth:90, padding:"10px 14px", fontSize:11, fontWeight:700, color:"#888", display:"flex", alignItems:"center", flexShrink:0 }}>{label}</div>
              {vals.map((v,i)=>(
                <div key={i} style={{ flex:1, minWidth:140, padding:"10px 10px", fontSize:12, textAlign:"center", fontWeight:allSame?400:700, color:allSame?"#555":"#111", borderLeft:"1px solid #f0f0f0", display:"flex", alignItems:"center", justifyContent:"center" }}>{v||"—"}</div>
              ))}
            </div>
          );
        })}
        {/* Peso bar */}
        <div style={{ display:"flex", gap:0, borderBottom:"1px solid #f5f5f5", background:"#f0f7ff", overflowX:"auto" }}>
          <div style={{ minWidth:90, padding:"10px 14px", fontSize:11, fontWeight:700, color:"#888", display:"flex", alignItems:"center", flexShrink:0 }}>Peso</div>
          {products.map(p=>{const max=Math.max(...products.map(x=>x.peso));const pct=(p.peso/max)*100;const mc=gc(p.mundo);return(
            <div key={p.id} style={{ flex:1, minWidth:140, padding:"10px 10px", textAlign:"center", borderLeft:"1px solid #f0f0f0" }}>
              <div style={{ background:"#e5e7eb", borderRadius:4, height:8, overflow:"hidden", margin:"0 auto 4px", maxWidth:100 }}>
                <div style={{ width:`${pct}%`, height:"100%", background:mc, borderRadius:4 }} />
              </div>
              <div style={{ fontSize:11, fontWeight:700, color:"#555" }}>{p.peso} g</div>
            </div>
          );})}
        </div>
      </div>
    </Sheet>
  );
}

// ── SIMILAR SHEET ─────────────────────────────────────────────
function SimilarSheet({ open, product, allProducts, onClose, onSelect, onCompare, compareList }) {
  if (!product) return null;
  const similars = allProducts.filter(p=>p.id!==product.id).map(p=>({...p,score:simScore(product,p)})).sort((a,b)=>b.score-a.score).slice(0,6);
  return (
    <Sheet open={open} onClose={onClose} title={`Similares a Art. ${product.art}`} tall>
      <div style={{ padding:"12px 16px", display:"flex", flexDirection:"column", gap:12 }}>
        {similars.map(p=>(
          <div key={p.id} style={{ position:"relative" }}>
            <div style={{ position:"absolute", top:12, right:12, zIndex:2, background:gc(p.mundo), color:"#fff", borderRadius:20, padding:"2px 8px", fontSize:10, fontWeight:800 }}>{p.score}%</div>
            <Card p={p} onClick={s=>{onSelect(s);onClose();}} onCompare={onCompare} compareList={compareList} />
          </div>
        ))}
      </div>
    </Sheet>
  );
}

// ── CAPSULAS SHEET ────────────────────────────────────────────
function CapsulasSheet({ open, onClose, onSelect }) {
  return (
    <Sheet open={open} onClose={onClose} title="Cápsulas RAW TENDERNESS" tall>
      <div style={{ padding:"12px 16px", display:"flex", flexDirection:"column", gap:12 }}>
        {Object.entries(CAPSULAS).map(([key,c])=>{
          const count=ALL_PRODUCTS.filter(p=>p.mundo.includes(key)).length;
          return(
            <div key={key} onClick={()=>{onSelect(key);onClose();}} style={{ background:"#fff", borderRadius:16, overflow:"hidden", border:`1.5px solid ${c.color}22`, cursor:"pointer", WebkitTapHighlightColor:"transparent" }}>
              <div style={{ background:`linear-gradient(135deg,${c.color},${c.color}bb)`, padding:"16px 18px", color:"#fff" }}>
                <div style={{ fontSize:22, fontWeight:900, letterSpacing:-0.5 }}>{key}</div>
                <div style={{ display:"flex", gap:6, marginTop:6, flexWrap:"wrap" }}>
                  {c.keywords.map(k=><span key={k} style={{ background:"#ffffff33", borderRadius:20, padding:"2px 8px", fontSize:11, fontWeight:600 }}>{k}</span>)}
                </div>
              </div>
              <div style={{ padding:"12px 18px" }}>
                <div style={{ fontSize:13, color:"#555", lineHeight:1.5, marginBottom:10 }}>{c.descripcion.substring(0,110)}...</div>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                  <div style={{ display:"flex", gap:4 }}>{c.palette.map((col,i)=><div key={i} style={{ width:20,height:20,borderRadius:5,background:col }} />)}</div>
                  <span style={{ fontSize:12, color:c.color, fontWeight:700 }}>{count} artículos →</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Sheet>
  );
}

// ── GLOSARIO SHEET ────────────────────────────────────────────
function GlosarioSheet({ open, onClose }) {
  const [search, setSearch] = useState("");
  return (
    <Sheet open={open} onClose={onClose} title="Glosario de Acabados" tall>
      <div style={{ padding:"12px 16px 4px" }}>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Buscar acabado..." style={{ width:"100%", border:"1.5px solid #e5e7eb", borderRadius:12, padding:"12px 16px", fontSize:14, boxSizing:"border-box", outline:"none" }} />
      </div>
      <div style={{ padding:"8px 16px 24px", display:"flex", flexDirection:"column", gap:10 }}>
        {Object.entries(ACABADOS_DB).filter(([k])=>k.toLowerCase().includes(search.toLowerCase())).map(([key,val])=>(
          <div key={key} style={{ background:"#fafafa", borderRadius:12, padding:"12px 14px", borderLeft:`4px solid ${val.sostenible?"#16a34a":val.noLavar?"#0369a1":"#e5e7eb"}` }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:5 }}>
              <div style={{ fontWeight:800, fontSize:14, color:"#111" }}>{key}</div>
              <div style={{ display:"flex", gap:4 }}>
                {val.sostenible&&<span style={{ background:"#16a34a",color:"#fff",borderRadius:20,padding:"2px 8px",fontSize:10,fontWeight:700 }}>🌱 ECO</span>}
                {val.noLavar&&<span style={{ background:"#0369a1",color:"#fff",borderRadius:20,padding:"2px 8px",fontSize:10,fontWeight:700 }}>💧</span>}
              </div>
            </div>
            <div style={{ fontSize:13, color:"#555", lineHeight:1.55 }}>{val.descripcion}</div>
          </div>
        ))}
      </div>
    </Sheet>
  );
}

// ── BOT SHEET ─────────────────────────────────────────────────
function BotSheet({ open, onClose }) {
  const [msgs, setMsgs] = useState([{ role:"assistant", text:"👋 Hola, soy tu asistente de la colección RAW TENDERNESS O/I 27/28. ¿Qué tejido necesitas?" }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);
  useEffect(()=>{ if(open) bottomRef.current?.scrollIntoView({behavior:"smooth"}); },[msgs,open]);

  const send = async () => {
    if(!input.trim()||loading) return;
    const msg=input.trim(); setInput(""); setMsgs(p=>[...p,{role:"user",text:msg}]); setLoading(true);
    const cat=ALL_PRODUCTS.map(p=>`Art:${p.art}|Tipo:${p.tipo}|Acabado:${p.acabado}|Composición:${p.composicion}|${p.ancho}cm|${p.peso}g|${p.mundo}|${p.mercado}|${p.coleccion}${p.stockAcabado!==undefined?"|Stock:"+p.stockAcabado+"m":""}`).join("\n");
    const caps=Object.entries(CAPSULAS).map(([k,c])=>`${k}: ${c.descripcion}`).join("\n");
    const acabs=Object.entries(ACABADOS_DB).map(([k,v])=>`${k}: ${v.descripcion}`).join("\n");
    try {
      const res=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:800,system:`Eres experto comercial Textil Santanderina RAW TENDERNESS O/I 27/28. Responde en español, conciso. Máx 3 recomendaciones con artículo, tipo, composición y motivo.\nCÁPSULAS:\n${caps}\nACABADOS:\n${acabs}\nCATÁLOGO:\n${cat}`,messages:[{role:"user",content:msg}]})});
      const d=await res.json();
      setMsgs(p=>[...p,{role:"assistant",text:d.content?.find(c=>c.type==="text")?.text||"Error."}]);
    } catch { setMsgs(p=>[...p,{role:"assistant",text:"Error de conexión."}]); }
    setLoading(false);
  };

  if (!open) return null;
  return (
    <div style={{ position:"fixed", inset:0, zIndex:900, display:"flex", flexDirection:"column", background:"#f8f9ff" }}>
      {/* Header */}
      <div style={{ background:"linear-gradient(135deg,#7c3aed,#be185d)", padding:"16px 20px", display:"flex", alignItems:"center", gap:12, flexShrink:0 }}>
        <button onClick={onClose} style={{ background:"#ffffff22", border:"none", color:"#fff", borderRadius:10, padding:"8px 12px", cursor:"pointer", fontSize:16 }}>←</button>
        <div>
          <div style={{ fontWeight:800, fontSize:16, color:"#fff" }}>🤖 Asistente</div>
          <div style={{ fontSize:11, color:"#ffffffaa" }}>RAW TENDERNESS O/I 27/28</div>
        </div>
      </div>
      {/* Messages */}
      <div style={{ flex:1, overflowY:"auto", padding:"16px", display:"flex", flexDirection:"column", gap:12 }}>
        {msgs.map((m,i)=>(
          <div key={i} style={{ alignSelf:m.role==="user"?"flex-end":"flex-start", background:m.role==="user"?"linear-gradient(135deg,#7c3aed,#be185d)":"#fff", color:m.role==="user"?"#fff":"#111", borderRadius:m.role==="user"?"18px 18px 4px 18px":"18px 18px 18px 4px", padding:"12px 16px", maxWidth:"85%", fontSize:14, lineHeight:1.6, boxShadow:"0 2px 8px #0001", whiteSpace:"pre-wrap" }}>
            {m.text}
          </div>
        ))}
        {loading && <div style={{ alignSelf:"flex-start", background:"#fff", borderRadius:"18px 18px 18px 4px", padding:"12px 16px", fontSize:14, color:"#888", boxShadow:"0 2px 8px #0001" }}>✦ Buscando...</div>}
        <div ref={bottomRef} />
      </div>
      {/* Quick */}
      <div style={{ padding:"8px 16px", display:"flex", gap:8, overflowX:"auto", flexShrink:0 }}>
        {["Orgánicos GOTS","Sartorial lana","Lyocell ligero","No lavar","Cápsula Arcadia"].map(q=>(
          <button key={q} onClick={()=>setInput(q)} style={{ background:"#f3f0ff",color:"#7c3aed",border:"none",borderRadius:20,padding:"6px 12px",fontSize:12,cursor:"pointer",fontWeight:600,whiteSpace:"nowrap",flexShrink:0 }}>{q}</button>
        ))}
      </div>
      {/* Input */}
      <div style={{ padding:"12px 16px 24px", display:"flex", gap:10, background:"#fff", borderTop:"1px solid #f0f0f0", flexShrink:0 }}>
        <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()} placeholder="Escribe tu consulta..." style={{ flex:1, border:"1.5px solid #e5e7eb", borderRadius:14, padding:"12px 16px", fontSize:14, outline:"none" }} />
        <button onClick={send} disabled={loading} style={{ background:"linear-gradient(135deg,#7c3aed,#be185d)", color:"#fff", border:"none", borderRadius:14, padding:"12px 18px", cursor:"pointer", fontWeight:700, fontSize:16 }}>↑</button>
      </div>
    </div>
  );
}

// ── CAPSULE DETAIL SHEET ──────────────────────────────────────
function CapsuleDetailSheet({ capsuleKey, onClose }) {
  if (!capsuleKey) return null;
  const c = CAPSULAS[capsuleKey];
  if (!c) return null;
  return (
    <Sheet open={!!capsuleKey} onClose={onClose} title="" tall>
      <div style={{ background:`linear-gradient(135deg,${c.color},${c.color}bb)`, padding:"20px 20px 16px", color:"#fff" }}>
        <div style={{ fontSize:28, fontWeight:900, letterSpacing:-1, marginBottom:8 }}>{capsuleKey}</div>
        <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
          {c.keywords.map(k=><span key={k} style={{ background:"#ffffff33", borderRadius:20, padding:"3px 10px", fontSize:12, fontWeight:700 }}>{k}</span>)}
        </div>
      </div>
      <div style={{ padding:"16px 20px", display:"flex", flexDirection:"column", gap:14 }}>
        <p style={{ fontSize:14, color:"#444", lineHeight:1.7, margin:0 }}>{c.descripcion}</p>
        <div>
          <div style={{ fontSize:12, fontWeight:800, color:"#888", textTransform:"uppercase", letterSpacing:1, marginBottom:10 }}>Nuevos acabados</div>
          {c.nuevosAcabados.map((a,i)=><div key={i} style={{ background:"#f8f7ff", borderLeft:`3px solid ${c.color}`, borderRadius:"0 10px 10px 0", padding:"10px 14px", marginBottom:8, fontSize:13, color:"#333", lineHeight:1.5 }}>{a}</div>)}
        </div>
        <div>
          <div style={{ fontSize:12, fontWeight:800, color:"#888", textTransform:"uppercase", letterSpacing:1, marginBottom:10 }}>Paleta cromática</div>
          <div style={{ display:"flex", gap:8 }}>
            {c.palette.map((col,i)=><div key={i} style={{ width:44,height:44,borderRadius:10,background:col,boxShadow:"0 2px 6px #0002" }} />)}
          </div>
        </div>
        <div>
          <div style={{ fontSize:12, fontWeight:800, color:"#888", textTransform:"uppercase", letterSpacing:1, marginBottom:8 }}>Inspiración</div>
          <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
            {c.inspiracion.map(i=><span key={i} style={{ background:"#f3f4f6",borderRadius:20,padding:"6px 14px",fontSize:13,color:"#555",fontWeight:600 }}>{i}</span>)}
          </div>
        </div>
      </div>
    </Sheet>
  );
}

// ── MAIN APP ──────────────────────────────────────────────────
export default function App() {
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({coleccion:"",mundo:"",tipo:"",genero:"",pesMin:"",pesMax:"",soloEco:false,soloNoLavar:false});
  const [selected, setSelected] = useState(null);
  const [similarOf, setSimilarOf] = useState(null);
  const [compareList, setCompareList] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [showComparator, setShowComparator] = useState(false);
  const [showBot, setShowBot] = useState(false);
  const [showCapsulas, setShowCapsulas] = useState(false);
  const [showGlosario, setShowGlosario] = useState(false);
  const [capsuleDetail, setCapsuleDetail] = useState(null);
  const [tab, setTab] = useState("catalogo");

  const filtered = useMemo(()=>ALL_PRODUCTS.filter(p=>{
    if(search){const q=search.toLowerCase();if(![p.art,p.acabado,p.composicion,p.tipo,p.mundo,p.mercado].some(f=>f&&f.toLowerCase().includes(q)))return false;}
    if(filters.coleccion&&p.coleccion!==filters.coleccion)return false;
    if(filters.mundo&&!p.mundo.includes(filters.mundo))return false;
    if(filters.tipo&&p.tipo!==filters.tipo)return false;
    if(filters.genero==="H"&&!p.hombre)return false;
    if(filters.genero==="M"&&!p.mujer)return false;
    if(filters.pesMin&&p.peso<parseInt(filters.pesMin))return false;
    if(filters.pesMax&&p.peso>parseInt(filters.pesMax))return false;
    if(filters.soloEco){const ai=getAI(p.acabado);if(!ai||!ai.sostenible)return false;}
    if(filters.soloNoLavar){const ai=getAI(p.acabado);if(!ai||!ai.noLavar)return false;}
    return true;
  }),[search,filters]);

  const toggleCompare = p => setCompareList(prev=>prev.some(x=>x.id===p.id)?prev.filter(x=>x.id!==p.id):prev.length>=4?[...prev.slice(1),p]:[...p,p]??[...prev,p]);
  const activeF = Object.values(filters).filter(v=>v===true||v!=="").length;

  return (
    <div style={{ fontFamily:"'Inter',system-ui,sans-serif", background:"#f1f5f9", minHeight:"100vh", paddingBottom:80 }}>
      {/* Header */}
      <div style={{ background:"linear-gradient(135deg,#0f0f1a,#1a1040)", color:"#fff", padding:"16px 16px 0", position:"sticky", top:0, zIndex:100 }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
          <div>
            <div style={{ fontSize:18, fontWeight:900, letterSpacing:-0.5 }}>✦ FABRIC STUDIO</div>
            <div style={{ fontSize:10, opacity:0.5, letterSpacing:2, textTransform:"uppercase" }}>RAW TENDERNESS O/I 27/28</div>
          </div>
          <div style={{ display:"flex", gap:8 }}>
            {compareList.length>0 && (
              <button onClick={()=>setShowComparator(true)} style={{ background:"linear-gradient(135deg,#be185d,#7c3aed)", color:"#fff", border:"none", borderRadius:10, padding:"8px 14px", cursor:"pointer", fontWeight:700, fontSize:13 }}>
                ⊞ {compareList.length}
              </button>
            )}
            <div style={{ background:"#ffffff15", borderRadius:10, padding:"8px 12px", fontSize:14, color:"#ffffffaa", fontWeight:700 }}>{ALL_PRODUCTS.length}</div>
          </div>
        </div>
        {/* Search */}
        {tab==="catalogo" && (
          <div style={{ display:"flex", gap:8, marginBottom:14 }}>
            <div style={{ flex:1, position:"relative" }}>
              <span style={{ position:"absolute", left:12, top:"50%", transform:"translateY(-50%)", fontSize:16, color:"#666" }}>🔍</span>
              <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Buscar artículo, tipo, composición..." style={{ width:"100%", background:"#fff", border:"none", borderRadius:12, padding:"11px 14px 11px 38px", fontSize:14, boxSizing:"border-box", outline:"none" }} />
            </div>
            <button onClick={()=>setShowFilters(true)} style={{ background:activeF>0?"#7c3aed":"#fff", color:activeF>0?"#fff":"#555", border:"none", borderRadius:12, padding:"11px 16px", cursor:"pointer", fontWeight:700, fontSize:13, flexShrink:0 }}>
              ⚙ {activeF>0?activeF:""}
            </button>
          </div>
        )}
        {/* Tabs */}
        <div style={{ display:"flex", gap:0 }}>
          {[["catalogo","🗂"],["capsulas","💫"],["glosario","📖"],["bot","🤖"]].map(([t,icon])=>(
            <button key={t} onClick={()=>{ if(t==="bot"){setShowBot(true);}else setTab(t); }}
              style={{ flex:1, background:tab===t&&t!=="bot"?"#fff":"transparent", color:tab===t&&t!=="bot"?"#111":"#ffffffaa", border:"none", padding:"10px 0", fontWeight:tab===t?700:500, fontSize:20, cursor:"pointer", borderRadius:"10px 10px 0 0", transition:"all 0.15s" }}>
              {icon}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div style={{ padding:"16px" }}>
        {tab==="catalogo" && (
          <>
            {/* Mundo pills */}
            <div style={{ display:"flex", gap:8, overflowX:"auto", marginBottom:14, paddingBottom:4 }}>
              {Object.entries(MC).filter(([k])=>k!=="—").map(([mundo,color])=>{
                const active=filters.mundo===mundo;
                const count=ALL_PRODUCTS.filter(p=>p.mundo.includes(mundo)).length;
                return(
                  <button key={mundo} onClick={()=>setFilters(f=>({...f,mundo:active?"":mundo}))}
                    style={{ background:active?color:`${color}18`, color:active?"#fff":color, border:`2px solid ${color}`, borderRadius:20, padding:"6px 14px", fontSize:12, fontWeight:700, cursor:"pointer", flexShrink:0, whiteSpace:"nowrap" }}>
                    {mundo} ({count})
                  </button>
                );
              })}
            </div>
            <div style={{ fontSize:13, color:"#888", marginBottom:12 }}>
              <b style={{ color:"#111" }}>{filtered.length}</b> artículos
              {activeF>0&&<span style={{ color:"#7c3aed" }}> · {activeF} filtros activos</span>}
            </div>
            {filtered.length===0 ? (
              <div style={{ textAlign:"center", padding:60, color:"#888" }}>
                <div style={{ fontSize:48 }}>🔍</div>
                <div style={{ fontWeight:600, marginTop:12 }}>Sin resultados</div>
              </div>
            ) : (
              <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
                {filtered.map(p=><Card key={p.id} p={p} onClick={setSelected} onCompare={toggleCompare} compareList={compareList} />)}
              </div>
            )}
          </>
        )}

        {tab==="capsulas" && (
          <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
            <div style={{ fontSize:14, color:"#666", marginBottom:4 }}>La colección <b>RAW TENDERNESS</b> en 6 cápsulas.</div>
            {Object.entries(CAPSULAS).map(([key,c])=>{
              const count=ALL_PRODUCTS.filter(p=>p.mundo.includes(key)).length;
              return(
                <div key={key} onClick={()=>setCapsuleDetail(key)} style={{ background:"#fff", borderRadius:16, overflow:"hidden", cursor:"pointer", WebkitTapHighlightColor:"transparent" }}>
                  <div style={{ background:`linear-gradient(135deg,${c.color},${c.color}bb)`, padding:"18px 18px", color:"#fff" }}>
                    <div style={{ fontSize:24, fontWeight:900 }}>{key}</div>
                    <div style={{ display:"flex", gap:6, marginTop:6, flexWrap:"wrap" }}>
                      {c.keywords.map(k=><span key={k} style={{ background:"#ffffff33",borderRadius:20,padding:"2px 8px",fontSize:11,fontWeight:600 }}>{k}</span>)}
                    </div>
                  </div>
                  <div style={{ padding:"12px 18px", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                    <div style={{ display:"flex", gap:4 }}>{c.palette.map((col,i)=><div key={i} style={{ width:22,height:22,borderRadius:6,background:col }} />)}</div>
                    <span style={{ fontSize:13, color:c.color, fontWeight:700 }}>{count} artículos →</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {tab==="glosario" && (
          <div>
            <input placeholder="Buscar acabado..." style={{ width:"100%", border:"1.5px solid #e5e7eb", borderRadius:12, padding:"12px 16px", fontSize:14, boxSizing:"border-box", outline:"none", marginBottom:14, background:"#fff" }}
              onChange={e=>{const v=e.target.value.toLowerCase(); document.querySelectorAll("[data-acabado]").forEach(el=>{el.style.display=el.dataset.acabado.includes(v)?"block":"none";});}} />
            <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
              {Object.entries(ACABADOS_DB).map(([key,val])=>(
                <div key={key} data-acabado={key.toLowerCase()} style={{ background:"#fff", borderRadius:12, padding:"12px 14px", borderLeft:`4px solid ${val.sostenible?"#16a34a":val.noLavar?"#0369a1":"#e5e7eb"}` }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:5 }}>
                    <div style={{ fontWeight:800, fontSize:14, color:"#111" }}>{key}</div>
                    <div style={{ display:"flex", gap:4 }}>
                      {val.sostenible&&<span style={{ background:"#16a34a",color:"#fff",borderRadius:20,padding:"2px 8px",fontSize:10,fontWeight:700 }}>🌱</span>}
                      {val.noLavar&&<span style={{ background:"#0369a1",color:"#fff",borderRadius:20,padding:"2px 8px",fontSize:10,fontWeight:700 }}>💧</span>}
                    </div>
                  </div>
                  <div style={{ fontSize:13, color:"#555", lineHeight:1.55 }}>{val.descripcion}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Bottom nav */}
      <div style={{ position:"fixed", bottom:0, left:0, right:0, background:"#fff", borderTop:"1px solid #f0f0f0", display:"flex", zIndex:200, paddingBottom:"env(safe-area-inset-bottom)" }}>
        {[["catalogo","🗂","Catálogo"],["capsulas","💫","Cápsulas"],["glosario","📖","Acabados"],["bot","🤖","Asistente"]].map(([t,icon,label])=>(
          <button key={t} onClick={()=>t==="bot"?setShowBot(true):setTab(t)}
            style={{ flex:1, background:"transparent", border:"none", padding:"10px 0 8px", cursor:"pointer", display:"flex", flexDirection:"column", alignItems:"center", gap:2 }}>
            <span style={{ fontSize:20 }}>{icon}</span>
            <span style={{ fontSize:10, fontWeight:tab===t&&t!=="bot"?700:500, color:tab===t&&t!=="bot"?"#7c3aed":"#999" }}>{label}</span>
          </button>
        ))}
      </div>

      {/* Sheets */}
      <ProductSheet product={selected} onClose={()=>setSelected(null)} onCompare={toggleCompare} onSimilar={p=>{setSimilarOf(p);setSelected(null);}} onMundo={k=>{setCapsuleDetail(k);setSelected(null);}} compareList={compareList} />
      <SimilarSheet open={!!similarOf} product={similarOf} allProducts={ALL_PRODUCTS} onClose={()=>setSimilarOf(null)} onSelect={setSelected} onCompare={toggleCompare} compareList={compareList} />
      <ComparatorSheet open={showComparator} products={compareList} onRemove={toggleCompare} onClose={()=>setShowComparator(false)} />
      <FiltersSheet open={showFilters} onClose={()=>setShowFilters(false)} filters={filters} setFilters={setFilters} />
      <CapsuleDetailSheet capsuleKey={capsuleDetail} onClose={()=>setCapsuleDetail(null)} />
      {showBot && <BotSheet open={showBot} onClose={()=>setShowBot(false)} />}
    </div>
  );
}
