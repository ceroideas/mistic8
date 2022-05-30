/**
 * TODO: All this information should be retrieved from the server inside a database.
 * It can be easily substituted with a call to the server on the OnInit call.
 */
export class Genders {
    public static male:string = "Hombre";
    public static female:string = "Mujer";
    public static non:string = "No binario";
    public static other:string = "Otro";
}

export class Countries {
    public static spain:string = "España";
}

export class SpainProvinces {
    public static andalucia:string = "Andalucía";
    public static aragon:string = "Aragón";
    public static asturias:string = "Asturias";
    public static baleares:string = "Islas baleares";
    public static canarias:string = "Canarias";
    public static castillayleon:string = "Castilla y León";
    public static castillaylamancha:string = "Castilla - La Mancha";
    public static catalunya:string = "Cataluña";
    public static valencia:string = "Comunidad Valenciana";
    public static extremadura:string = "Extremadura";
    public static galicia:string = "Galicia";
    public static madrid:string = "Madrid";
    public static murcia:string = "Murcia";
    public static navarra:string = "Navarra";
    public static paisvasco:string = "País Vasco";
    public static larioja:string = "La Rioja";
    public static ceuta:string = "Ceuta";
    public static melilla:string = "Melilla";
}

export class UserSettings {
    public static genders = [Genders.male, Genders.female, Genders.non, Genders.other];
    public static countries = [Countries.spain];
    public static states = [
        SpainProvinces.andalucia,
        SpainProvinces.asturias,
        SpainProvinces.baleares,
        SpainProvinces.canarias,
        SpainProvinces.castillayleon,
        SpainProvinces.castillaylamancha,
        SpainProvinces.catalunya,
        SpainProvinces.valencia,
        SpainProvinces.extremadura,
        SpainProvinces.galicia,
        SpainProvinces.madrid,
        SpainProvinces.murcia,
        SpainProvinces.navarra,
        SpainProvinces.paisvasco,
        SpainProvinces.larioja,
        SpainProvinces.ceuta,
        SpainProvinces.melilla];
}