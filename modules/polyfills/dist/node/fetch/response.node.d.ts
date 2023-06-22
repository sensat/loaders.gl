import { Headers } from './headers.node';
export declare class Response {
    readonly ok: boolean;
    readonly status: number;
    readonly statusText: string;
    readonly headers: Headers;
    readonly url: string;
    bodyUsed: boolean;
    private readonly _body;
    constructor(body: any, options: {
        headers?: any;
        status?: number;
        statusText?: string;
        url: string;
    });
    get body(): any;
    arrayBuffer(): Promise<any>;
    text(): Promise<string>;
    json(): Promise<any>;
    blob(): Promise<Blob>;
}
//# sourceMappingURL=response.node.d.ts.map