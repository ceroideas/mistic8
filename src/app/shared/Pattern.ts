// Regex patterns begin with a / and end with /. They are their own regex literal class.
export class Pattern {
    public static password = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    public static nameAndSurname = /^[\p{L} *-]+$/u;
}