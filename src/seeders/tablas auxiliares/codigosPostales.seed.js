const codigosPostales = [
  { codigo: "15001", distritoId: 1 }, // 01 Cercado de Lima
  { codigo: "15003", distritoId: 1 },
  { codigo: "15004", distritoId: 1 },
  { codigo: "15006", distritoId: 1 },
  { codigo: "15018", distritoId: 1 },
  { codigo: "15046", distritoId: 1 },
  { codigo: "15079", distritoId: 1 },
  { codigo: "15081", distritoId: 1 },
  { codigo: "15082", distritoId: 1 },
  { codigo: "15083", distritoId: 1 },
  { codigo: "15088", distritoId: 1 },
  { codigo: "15123", distritoId: 2 }, // 02 Ancón
  { codigo: "15022", distritoId: 3 }, // 03 Ate
  { codigo: "15026", distritoId: 3 },
  { codigo: "15483", distritoId: 3 },
  { codigo: "15063", distritoId: 4 }, // 04 Barranco
  { codigo: "15082", distritoId: 5 }, // 05 Breña
  { codigo: "15083", distritoId: 5 },
  { codigo: "15121", distritoId: 6 }, // 06 Carabayllo
  { codigo: "15324", distritoId: 7 }, // 07 Comas
  { codigo: "15472", distritoId: 8 }, // 08 Chaclacayo
  { codigo: "15056", distritoId: 9 }, // 09 Chorrillos
  { codigo: "15063", distritoId: 9 },
  { codigo: "15067", distritoId: 9 },
  { codigo: "15003", distritoId: 10 }, // 10 El Augustino
  { codigo: "15004", distritoId: 10 },
  { codigo: "15072", distritoId: 11 }, // 11 Jesús María
  { codigo: "15076", distritoId: 11 },
  { codigo: "15023", distritoId: 12 }, // 12 La Molina
  { codigo: "15026", distritoId: 12 },
  { codigo: "15018", distritoId: 13 }, //13 La Victoria
  { codigo: "15019", distritoId: 13 },
  { codigo: "15033", distritoId: 13 },
  { codigo: "15046", distritoId: 14 }, // 14 Lince
  { codigo: "15073", distritoId: 14 },
  { codigo: "15457", distritoId: 15 }, // 15 Lurigancho
  { codigo: "15461", distritoId: 15 },
  { codigo: "15468", distritoId: 15 },
  { codigo: "15472", distritoId: 15 },
  { codigo: "15841", distritoId: 16 }, // 16 Lurín
  { codigo: "15842", distritoId: 16 },
  { codigo: "15076", distritoId: 17 }, // 17 Magdalena del Mar
  { codigo: "15086", distritoId: 17 },
  { codigo: "15046", distritoId: 18 }, // 18 Miraflores
  { codigo: "15048", distritoId: 18 },
  { codigo: "15074", distritoId: 18 },
  { codigo: "15594", distritoId: 19 }, // 19 Pachacámac
  { codigo: "15823", distritoId: 19 },
  { codigo: "15865", distritoId: 20 }, // 20 Pucusana
  { codigo: "15866", distritoId: 20 },
  { codigo: "15084", distritoId: 21 }, // 21 Pueblo Libre
  { codigo: "15086", distritoId: 21 },
  { codigo: "15117", distritoId: 22 }, // 22 Puente Piedra
  { codigo: "15121", distritoId: 22 },
  { codigo: "15122", distritoId: 22 },
  { codigo: "15851", distritoId: 23 }, // 23 Punta Negra
  { codigo: "15845", distritoId: 24 }, // 24 Punta Hermosa
  { codigo: "15846", distritoId: 24 },
  { codigo: "15093", distritoId: 25 }, // 25 Rímac
  { codigo: "15094", distritoId: 25 },
  { codigo: "15096", distritoId: 25 },
  { codigo: "15333", distritoId: 25 },
  { codigo: "15855", distritoId: 26 }, // 26 San Bartolo
  { codigo: "15856", distritoId: 26 },
  { codigo: "15036", distritoId: 27 }, // 27 San Isidro
  { codigo: "15046", distritoId: 27 },
  { codigo: "15047", distritoId: 27 },
  { codigo: "15073", distritoId: 27 },
  { codigo: "15076", distritoId: 27 },
  { codigo: "15311", distritoId: 28 }, // 28 Independencia
  { codigo: "15332", distritoId: 28 },
  { codigo: "15333", distritoId: 28 },
  { codigo: "15801", distritoId: 29 }, // 29 San Juan de Miraflores
  { codigo: "15803", distritoId: 29 },
  { codigo: "15804", distritoId: 29 },
  { codigo: "15806", distritoId: 29 },
  { codigo: "15824", distritoId: 29 },
  { codigo: "15828", distritoId: 29 },
  { codigo: "15842", distritoId: 29 },
  { codigo: "15019", distritoId: 30 }, // 30 San Luis
  { codigo: "15021", distritoId: 30 },
  { codigo: "15022", distritoId: 30 },
  { codigo: "15102", distritoId: 31 }, // 31 San Martín de Porres
  { codigo: "15103", distritoId: 31 },
  { codigo: "15107", distritoId: 31 },
  { codigo: "15108", distritoId: 31 },
  { codigo: "15109", distritoId: 31 },
  { codigo: "15112", distritoId: 31 },
  { codigo: "15113", distritoId: 31 },
  { codigo: "15086", distritoId: 32 }, // 32 San Miguel
  { codigo: "15087", distritoId: 32 },
  { codigo: "15088", distritoId: 32 },
  { codigo: "15023", distritoId: 33 }, // 33 Santiago de Surco
  { codigo: "15038", distritoId: 33 },
  { codigo: "15039", distritoId: 33 },
  { codigo: "15048", distritoId: 33 },
  { codigo: "15049", distritoId: 33 },
  { codigo: "15054", distritoId: 33 },
  { codigo: "15056", distritoId: 33 },
  { codigo: "15063", distritoId: 33 },
  { codigo: "15036", distritoId: 34 }, // 34 Surquillo
  { codigo: "15038", distritoId: 34 },
  { codigo: "15047", distritoId: 34 },
  { codigo: "15048", distritoId: 34 },
  { codigo: "15809", distritoId: 35 }, // 35 Villa María del Triunfo
  { codigo: "15811", distritoId: 35 },
  { codigo: "15812", distritoId: 35 },
  { codigo: "15817", distritoId: 35 },
  { codigo: "15818", distritoId: 35 },
  { codigo: "15822", distritoId: 35 },
  { codigo: "15828", distritoId: 35 },
  { codigo: "15401", distritoId: 36 }, // 36 San Juan de Lurigancho
  { codigo: "15404", distritoId: 36 },
  { codigo: "15408", distritoId: 36 },
  { codigo: "15412", distritoId: 36 },
  { codigo: "15416", distritoId: 36 },
  { codigo: "15419", distritoId: 36 },
  { codigo: "15423", distritoId: 36 },
  { codigo: "15427", distritoId: 36 },
  { codigo: "15431", distritoId: 36 },
  { codigo: "15434", distritoId: 36 },
  { codigo: "15438", distritoId: 36 },
  { codigo: "15442", distritoId: 36 },
  { codigo: "15446", distritoId: 36 },
  { codigo: "15449", distritoId: 36 },
  { codigo: "15453", distritoId: 36 },
  { codigo: "15457", distritoId: 36 },
  { codigo: "15861", distritoId: 37 }, // 37 Santa María del Mar
  { codigo: "15123", distritoId: 38 }, // 38 Santa Rosa
  { codigo: "15304", distritoId: 39 }, // 39 Los Olivos
  { codigo: "15306", distritoId: 39 },
  { codigo: "15307", distritoId: 39 },
  { codigo: "15311", distritoId: 39 },
  { codigo: "15314", distritoId: 39 },
  { codigo: "15593", distritoId: 40 }, // 40 Cieneguilla
  { codigo: "15594", distritoId: 40 },
  { codigo: "15021", distritoId: 41 }, // 41 San Borja
  { codigo: "15034", distritoId: 41 },
  { codigo: "15036", distritoId: 41 },
  { codigo: "15037", distritoId: 41 },
  { codigo: "15816", distritoId: 42 }, // 42 Villa El Salvador
  { codigo: "15828", distritoId: 42 },
  { codigo: "15829", distritoId: 42 },
  { codigo: "15831", distritoId: 42 },
  { codigo: "15836", distritoId: 42 },
  { codigo: "15837", distritoId: 42 },
  { codigo: "15834", distritoId: 42 },
  { codigo: "15841", distritoId: 42 },
  { codigo: "15842", distritoId: 42 },
  { codigo: "15007", distritoId: 43 }, // 43 Santa Anita
  { codigo: "15008", distritoId: 43 },
  { codigo: "15009", distritoId: 43 },
  { codigo: "15011", distritoId: 43 },
  { codigo: "07001", distritoId: 44 }, // 01 Cercado del Callao
  { codigo: "07006", distritoId: 44 },
  { codigo: "07021", distritoId: 44 },
  { codigo: "07026", distritoId: 44 },
  { codigo: "07031", distritoId: 44 },
  { codigo: "07036", distritoId: 44 },
  { codigo: "07041", distritoId: 44 },
  { codigo: "07046", distritoId: 44 },
  { codigo: "07001", distritoId: 45 }, // 02 Bellavista
  { codigo: "07006", distritoId: 45 },
  { codigo: "07011", distritoId: 45 },
  { codigo: "07016", distritoId: 45 },
  { codigo: "07021", distritoId: 45 },
  { codigo: "07006", distritoId: 46 }, // 03 Carmen de La Legua Reynoso
  { codigo: "07011", distritoId: 47 }, // 04 La Perla
  { codigo: "07016", distritoId: 47 },
  { codigo: "07021", distritoId: 48 }, // 05 La Punta
  { codigo: "07046", distritoId: 49 }, // 06 Ventanilla
  { codigo: "07051", distritoId: 49 },
  { codigo: "07056", distritoId: 49 },
  { codigo: "07061", distritoId: 49 },
  { codigo: "07066", distritoId: 49 },
  { codigo: "07071", distritoId: 49 },
  { codigo: "07076", distritoId: 49 },
];

module.exports = codigosPostales;
