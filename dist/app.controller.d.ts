export declare class AppController {
    root(): {
        name: string;
        status: string;
        docs: string;
    };
    health(): {
        status: string;
        uptime: number;
        timestamp: string;
    };
}
