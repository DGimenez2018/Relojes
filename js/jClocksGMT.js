/***************************************************************************************************************************************************************
 * Change Log:
 *      2.0.2: pantalla digital fija solamente
 *      2.0.1: parámetro de ruta de imagen agregado para imágenes que no están en el directorio de complementos
 *      2.0: revisión completa del código para mayor precisión y estabilidad
 *              - ¡NUEVO! 5 máscaras de reloj para elegir
 *              - ¡NUEVO! Opciones de formato de marca de tiempo
 *              - ¡NUEVO! Visualización de fecha con opciones de formato
 *              - ¡NUEVO! Parámetro DST para aquellas ubicaciones que no observan DST
 *              - Se abordaron problemas internacionales de horario de verano
 *              - Marcado inicial minimizado
 *              - Nombres de clase únicos para evitar declaraciones de clase comunes
 *      1.2: Se corrigió el cálculo del horario de verano muy defectuoso
 *      1.1: Cálculo automático del horario de verano agregado

 *
 *
 * Descripcion:
 *      Reloj analógico y digital basado en jQuery utilizando compensaciones GMT. Requiere el complemento jQuery Rotate.
 *
 * Documentacion:
 *      Opciones predeterminadas:
 *          title: 'Greenwich, England', String: Título de la ubicación (predeterminado a Greenwich, Inglaterra)
 *          offset: '0',                 String: Establezca el desplazamiento GMT estándar (+5.5, -4, 0, etc.) (no considere el horario de verano)
 *          dst: true,                   Boolean: La ubicación observa el horario de verano (establezca FALSE si la ubicación no necesita observar dst)
 *          digital: true,               Boolean: Mostrar reloj digital
 *          analog: true,                Boolean: Mostrar reloj analogico
 *          timeformat: 'hh:mm A',       String: Formato de hora (consulte a continuación las opciones de formato)
 *          date: false,                 Boolean: Mostrar fecha
 *          dateformat: 'MM/DD/YYYY',    String: Formato de fecha (consulte a continuación las opciones de formato)
 *          angleSec: 0,                 Integer: Ángulo inicial de segunda mano
 *          angleMin: 0,                 Integer: Ángulo de inicio de minutero
 *          angleHour: 0,                Integer: Ángulo de inicio de la manecilla de la hora
 *          skin: 1,                     Integer: Establecer 1 de 5 máscaras incluidas para el reloj analógico
 *          imgpath: ''                  String: Establecer ruta de imágenes
 *
 *     Desplazamientos comunes por zona horaria: (solo use el número después de GMT: GMT-2 = desplazamiento: '-2'
 *                                    Horario de verano convertido automáticamente)
 *          GMT-12	 Eniwetok
 *          GMT-11	 Samoa
 *          GMT-10	 Hawaii
 *          GMT-9	 Alaska
 *          GMT-8	 PST, Pacific US
 *          GMT-7	 MST, Mountain US
 *          GMT-6	 CST, Central US
 *          GMT-5	 EST, Eastern US
 *          GMT-4	 Atlantic, Canada
 *          GMT-3	 Brazilia, Buenos Aries
 *          GMT-2	 Mid-Atlantic
 *          GMT-1	 Cape Verdes
 *          GMT	0    Greenwich Mean Time
 *          GMT+1	 Berlin, Rome
 *          GMT+2	 Israel, Cairo
 *          GMT+3	 Moscow, Kuwait
 *          GMT+4	 Abu Dhabi, Muscat
 *          GMT+5	 Islamabad, Karachi
 *          GMT+6	 Almaty, Dhaka
 *          GMT+7	 Bangkok, Jakarta
 *          GMT+8	 Hong Kong, Beijing
 *          GMT+9	 Tokyo, Osaka
 *          GMT+10	 Sydney, Melbourne, Guam
 *          GMT+11	 Magadan, Soloman Is.
 *          GMT+12	 Fiji, Wellington, Auckland
 *
 *        Para encontrar compensaciones específicas de GMT,
 *                      ir a: http://www.timeanddate.com/time/zone/
 *                      búsqueda: ubicación
 *                      uso: compensación actual
 *                      si la ubicación está actualmente observando DST, agregue 1 para compensar
 *
 *      Time Formatting:
 *          HH      19      24-hour format of hour with leading zero (two digits long).
 *          hh      07      12-hour format of hour with leading zero (two digits long).
 *          H       19      24-hour format of hour without leading zeros.
 *          h       7       12-hour format of hour without leading zeros.
 *          mm      01      Minutes with the leading zero (two digits long).
 *          m       1       Minutes without the leading zero.
 *          ss      08      Seconds with the leading zero (two digits long).
 *          s       8       Seconds without the leading zero.
 *          a       pm      Lowercase am or pm.
 *          A       PM      Uppercase AM or PM.
 *          SSS     095     Milliseconds with leading zeros (three digits long).
 *          S       95      Milliseconds without leading zeros.
 *
 *      Date Formatting:
 *          YYYY    2016    Four-digit representation of the year.
 *          YY      16      Two-digit representation of the year.
 *          MMMM    April   Full textual representation of the month.
 *          MMM     Apr     Three letter representation of the month.
 *          MM      04      Month with the leading zero (two digits long).
 *          M       4       Month without the leading zero.
 *          DDDD    Friday  Full textual representation of the day of the week.
 *          DDD     Fri     Three letter representation of the day of the week.
 *          DD      01      Day of the month with leading zero (two digits long).
 *          D       1       Day of the month without leading zeros.
 *
 *      Initialization:
 *          Javascript:
 *              $('#clock_hou').jClocksGMT({ title: 'Houston, TX, USA', offset: '-6', skin: 2 });
 *          Markup:
 *               <div id="clock_hou"></div>
 *
 **************************************************************************************************************************************************************/

 (function($) {

    $.fn.extend({
        
        jClocksGMT: function( options ) 
        {
            // opciones predeterminadas del complemento
            var defaults = 
            {
                title: 'Greenwich, England',
                offset: '0',
                dst: true,
                digital: true,
                analog: true,
                timeformat: 'hh:mm A',
                date: false,
                dateformat: 'MM/DD/YYYY',
                angleSec: 0,
                angleMin: 0,
                angleHour: 0,
                skin: 1,
                imgpath: ''
            }
            
            // fusionar opciones de usuario con valores predeterminados
            var options = $.extend(defaults, options);
            
            return this.each(function()
            {
                // establecer variable de desplazamiento por instancia
                var offset = parseFloat(options.offset);
                // obtener el id del elemento
                var id = $(this).attr('id');

                // agregar clase al elemento principal
                $(this).addClass('jcgmt-container');

                // crear etiqueta
                $("<div />", { text: options.title, class: "jcgmt-lbl" }).appendTo("#" + id);

                if( options.analog )
                {
                    // create clock container
                    $("<div />", { class: "jcgmt-clockHolder" }).appendTo("#" + id);
                    // create hour hand
                    $("<div />", { class: "jcgmt-rotatingWrapper" }).append($("<img />", { class: "jcgmt-hour", src: options.imgpath + "images/jcgmt-" + options.skin + "-clock_hour.png" })).appendTo("#" + id + ' .jcgmt-clockHolder');
                    // create min hand
                    $("<div />", { class: "jcgmt-rotatingWrapper" }).append($("<img />", { class: "jcgmt-min", src: options.imgpath + "images/jcgmt-" + options.skin + "-clock_min.png" })).appendTo("#" + id + ' .jcgmt-clockHolder');
                    // create sec hand
                    $("<div />", { class: "jcgmt-rotatingWrapper" }).append($("<img />", { class: "jcgmt-sec", src: options.imgpath + "images/jcgmt-" + options.skin + "-clock_sec.png" })).appendTo("#" + id + ' .jcgmt-clockHolder');
                    // create clock face
                    $("<img />", { class: "jcgmt-clock", src: options.imgpath + 'images/jcgmt-' + options.skin + '-clock_face.png' }).appendTo("#" + id + ' .jcgmt-clockHolder');
                }

                // create digital clock container
                $("<div />", { class: "jcgmt-digital" }).appendTo("#" + id);

                //create date container
                $("<div />", { class: "jcgmt-date" }).appendTo("#" + id);
                
                // initial hand rotation
                $('#' + id + ' .jcgmt-sec').rotate( options.angleSec );
                $('#' + id + ' .jcgmt-min').rotate( options.angleMin );
                $('#' + id + ' .jcgmt-hour').rotate( options.angleHour );

                // get timezone by gmt offset
                Date.prototype.getTimezoneByOffset = function( offset, y, m, d ) 
                {
                    var date = new Date; // get date

                    if( y ) // if has date params
                    {
                        date = new Date( y, m, d ); // get date with params
                    }
                    
                    var utc = date.getTime() + ( date.getTimezoneOffset() * 60000 ); // get local offset /obtener compensación local

                    var dateGMT = new Date( utc + ( 3600000 * offset ) ); // get requested offset based on local // obtener un desplazamiento solicitado basado en local

                    return dateGMT;
                }

                // check if daylight saving time is in effect

                //verificar si el horario de verano está vigente
                Date.prototype.stdTimezoneOffset = function() 
                {
                    var jan = this.getTimezoneByOffset( offset, this.getFullYear(), 0, 1 );

                    var jul = this.getTimezoneByOffset( offset, this.getFullYear(), 6, 1 );

                    return Math.max( jan.getTimezoneOffset(), jul.getTimezoneOffset() );
                }

                // checkes if DST is in effect
                //comprueba si el horario de verano está vigente
                Date.prototype.isDST = function() 
                {
                    var date = this.getTimezoneByOffset(offset);

                    return date.getTimezoneOffset() < this.stdTimezoneOffset();
                }

                // date formatter
                Date.prototype.format = function( format )
                {
                    var  D = "Domingo,Lunes,Martes,Miercoles,Jueves,Viernes,Sabado".split(","), 
                    //D = "Sunday,Monday,Tuesday,Wednesday,Thursday,Friday,Saturday".split(","),
                        M = "Enero,Febrero,Marzo,Abril,Mayo,Junio,Julio,Agosto,Septiembre,Octubre,Noviembre,Diciembre".split(",");

                    var self = this;
                    return format.replace(/a|A|Z|S(SS)?|ss?|mm?|HH?|hh?|D{1,4}|M{1,4}|YY(YY)?|'([^']|'')*'/g, function(str) {
                      var c1 = str.charAt(0),
                          ret = str.charAt(0) == "'"
                          ? (c1=0) || str.slice(1, -1).replace(/''/g, "'")
                          : str == "a"
                            ? (self.getHours() < 12 ? "am" : "pm")
                            : str == "A"
                              ? (self.getHours() < 12 ? "AM" : "PM")
                              : str == "Z"
                                ? (("+" + -self.getTimezoneOffset() / 60).replace(/^\D?(\D)/, "$1").replace(/^(.)(.)$/, "$10$2") + "00")
                                : c1 == "S"
                                  ? self.getMilliseconds()
                                  : c1 == "s"
                                    ? self.getSeconds()
                                    : c1 == "H"
                                      ? self.getHours()
                                      : c1 == "h"
                                        ? (self.getHours() % 12) || 12
                                        : (c1 == "D" && str.length > 2)
                                          ? D[self.getDay()].slice(0, str.length > 3 ? 9 : 3)
                                          : c1 == "D"
                                            ? self.getDate()
                                            : (c1 == "M" && str.length > 2)
                                              ? M[self.getMonth()].slice(0, str.length > 3 ? 9 : 3)
                                              : c1 == "m"
                                                ? self.getMinutes()
                                                : c1 == "M"
                                                  ? self.getMonth() + 1
                                                  : ("" + self.getFullYear()).slice(-str.length);
                      return c1 && str.length < 4 && ("" + ret).length < str.length
                        ? ("00" + ret).slice(-str.length)
                        : ret;
                    });
                  }
                
                // create new date object
                var dateCheck = new Date().getTimezoneByOffset( offset );

                // check for DST
                if( options.dst && dateCheck.isDST() ) 
                {
                   offset = offset + 1;
                }

                // clock interval
                setInterval(function () 
                {
                    // create new date object
                    var nd = new Date().getTimezoneByOffset( offset ); 
                    
                    // time string variable
                    var timeStr = nd.format( options.timeformat );
                    
                    // update analog clock if enabled
                    if( options.analog ) 
                    {
                        // rotate second hand
                        $('#' + id + ' .jcgmt-sec').rotate( nd.getSeconds() * 6 );
                        // rotate minute hand
                        $('#' + id + ' .jcgmt-min').rotate( nd.getMinutes() * 6 ) ;
                        // rotate hour hand
                        $('#' + id + ' .jcgmt-hour').rotate( ( nd.getHours() * 5 + nd.getMinutes() / 12 ) * 6 );

                        // update title for tooltip
                        $('#' + id + ' .jcgmt-clockHolder').attr( 'title', timeStr );
                    }
                    
                    // update digital clock if enabled
                    if( options.digital ) 
                    {
                        $('#' + id + ' .jcgmt-digital').html( timeStr );
                        $('#' + id + ' .jcgmt-digital').attr( 'title', timeStr );
                    }

                    // update date if enabled
                    if( options.date ) 
                    {
                        var dateStamp = nd.format( options.dateformat );
                        $('#' + id + ' .jcgmt-date').html( dateStamp );
                        $('#' + id + ' .jcgmt-date').attr( 'title', dateStamp );
                    }

                }, 1000);

            });

        }

    });

})(jQuery);
