type Environment = {
    production: boolean;
    firebase: {
        apiKey: string;
        authDomain: string;
        databaseURL: string,
        projectId: string,
        storageBucket: string,
        messagingSenderId: string,
        appId: string,
        measurementId: string
    }
    protocolHTTP: string;
    protocolWebSocket: string;
    portWebSocket?: string;
    serverAPI: string;
}

export {
    Environment
};