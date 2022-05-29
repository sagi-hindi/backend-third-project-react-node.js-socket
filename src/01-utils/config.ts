class Config{

}


class DevelopmentConfig extends Config{
    public isDevelopment = true;
    public mysql = {host: "localhost", user: "root", password: "", database: "vacationsDB"}
}

class ProductionConfig extends Config{
    public isDevelopment = false;
    public mysql = {host: "localhost", user: "root", password: "", database: "vacationsDB"}
}

const config = process.env.NODE_ENV === "production" ? new ProductionConfig() : new DevelopmentConfig();


export default config