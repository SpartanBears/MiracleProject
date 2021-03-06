# MiracleProject
Administration/JRPG game
02/04/2020 -> Retake

Idea general
	El jugador toma el rol de un dios, el cual debe conseguir aventureros para buscar la gloria derrotando a los monstruos del calabozo.

Idea expandida
	El objetivo del juego es conseguir por diferentes medios aventureros (NPCs), los cuales lucharan de manera autónoma en el calabozo consiguiendo oro, materiales e items.
	Los dioses todos tendrán un arquetipo de bendición/rubro: dios menor de la herrería, vendimia, lucha, sabiduria, justicia, naturaleza, etc.
	Cada uno de esos arquetipos tiene un dios mayor/antiguo asignado. Los dioses utilizados serán los griegos.
	El rol del dios será el de gestionar recursos obtenidos en el calabozo, ordenar la construcción de items y supervisar la venta de los mismos, definir
	que pisos del calabozo a visitar y cuales serán los grupos de aventureros que lo hagan.

	Los aventureros serán NPCs creados por el sistema de manera pseudo-aleatoria.
	Tendrán razas, clases y nombres, además de nivel, habilidades, stats, etc.
	Los stats disponibles serán los mismos de Ragnarok Online:

		- STR (Strength - Fuerza)
			Tamaño inventario
			Daño fisico
			Defensa fisica

		- AGI (Agility - Agilidad)
			Velocidad de ataque
			Velocidad exploración
			Daño fisico
			% esquivar

		- DEX (Dexterity - Destreza)
			Velocidad de ataque
			Velocidad de encantamiento
			Precisión ataque
			Daño físico
			% esquivar

		- INT (Inteligence - Inteligencia)
			Daño mágico
			Defensa mágica
			Obtención de materiales

		- VIT (Vitality - Vitalidad)
			HP
			Defensa Fisica/Magica
			Tamaño inventario

		- LUK (Luck - Suerte)
			Afecta todas las probabilidades del juego: esquivar, golpe critico, item raros, etc.
			Cada ciertos "escalones" (cada 7 pts por ejemplo) va a entregar puntos a los otros stats.

	Cada aventurero tendrá acceso a todos los stats, pero dependiendo de su clase, tendrá un stat principal que es el que le otorgará el daño.
	Existirá al menos una clase por cada stat. Ej: Soldier (STR), Assassin (AGI), Acolyte (INT), Gambler (LUK)
	Cada clase tendrá 2 evoluciones. Ej: Soldier -> Knight -> Warlord.
	Existirán algunas clases que podrán tener ramas de evolución (igual que Ragnarok).
	Acolyte -> Priest (INT) -> Bishop (INT)
	        -> Paladin (VIT) -> Inquisitor (VIT)

	El calabozo será una torre circular+espiral. Los bordes del circulo serán las escaleras para subir y bajar al calabozo.
	Cada piso tendrá 3 niveles de dificultad. Low, Mid y High.
	Más cerca de las escaleras es Low y al centro es High.
	El nivel de dificultad determinará los drop rates y exp ganada.
	La progresión de dificultad, drop rates y experiencia será logaritmica.

	El comercio será 100% "adventurer based".
	Todos los items, productos y materiales en circulación serán producidos, vendidos y transportados por aventureros.
	Los precios serán regulados por una sola familia/clan.
	En un comienzo será el clan Spartan Bears, bajo el alero de Hephaistos. Es un clan de herreros y comerciantes que regularán el comercio en un comienzo,
	hasta que otro clan pueda tomar su lugar (Evento de Olimpiadas).

	Cada dios tendrá su propia casa "física", donde vivirán y trabajarán sus aventureros.
	La capacidad de la casa podrá ser mejorada, las habitaciones, herramientas, etc.
	Se podrán comprar tiendas en las cuales los aventureros podrán realizar sus labores.
	La casa determinará la cantidad de aventureros que puede tener una familia/clan.

Arquitectura (SW)

	BD = externalizada (Firebase)
	Backend = NodeJS 12.16.1 (npm 6.13.4) + Socket.IO 2.3.0 + Express 4.17.1
	Frontend = PixiJS v5.2.1 https://pixijs.io
	Git
	JS ECMA2019
	HTML5
	CSS3

Estilo gráfico
	Mapa/Ciudad: Pixelart 2.5D
	Personajes: Pixelart 2D

---------------------------------

Systems/GUIs:
	- Login
		Auth -> Firebase (?)
	- Main View
		Nav Menu
	- NPCs (Adventurers)
		JSON Adventurer
		JSON Adventurer on combat (?)
		Adventurer generation system
	- Items
		JSON Item
		Item library (creative)
		Item generation system
		Item creation system + GUI
	- Gods
		God system
		God creation GUI
	- Familia
		Familia system
	- Combat
		Combat engine
	- Recruitment
		Adventurers guild
	- Comerce
		Familia stores
	- Crafting
		Item crafting system
	- Adventurer management
		Equipment system
		Stat system
		Class system

---------------------------------
Programming rules

	- Software autodocumentado
		Todos los comentarios serán de líneas multiples, aunque sea solo una línea de texto. /*comment*/
 	- Todos los verbos utilizados en funciones deben ser en ingles
 	- Todos los nombres de variables deben ser en ingles, a menos que no aplique.
 		Ej: Un array donde hay objetos de personaje
 			var personajesArray, no var charactersArray
 	- CRUD donde aplique
 		createSomething
 		getSomething (readSomething)
 		setSomething / updateSomething
 		deleteSomething
 	- camelCase
 	- toda llamada a servicios DEBE ser async (uso de promises)
 	- cualquier llamada a un servicio DEBE ser un promise
 	- las llamadas a servicios externos, listeners, funciones de lógica de negocio, todo, debe estar en su propio segmento de codigo
 	  debidamente comentado y delimitado
 		Ej: /*--- LISTENERS START ---*/
 			function listener_objectOnClick
 			/*--- LISTENERS END ---*/
 	- los listener deben tener como prefijo su funcionalidad y mencionar para que evento y objeto fueron creados
 		Ej: Listener onclick de objeto = listener_objetoOnClick
 	- los verbos mas comunes que debemos utilizar son los siguientes
 		get, set, create, delete, update, calculate, show
 	- si una funcion requiere comentario para que se entienda SE DEBE COMENTAR
 	- evitar los ciclos dentro de ciclos
 	- si se usa recursividad, calcular el O(n) para ver cual es el worst case scenario y comparar contra ciclico
 	- si hay más de un promise dentro de una funcion, y una depende de otra, usar await (async function) y evitar usar el .then()
 	- si hay más de un promise dentro de una funcion y no dependen entre ellas, sino que todas deben resolverse antes de seguir, usar Promise.all y el .then() correspondiente

